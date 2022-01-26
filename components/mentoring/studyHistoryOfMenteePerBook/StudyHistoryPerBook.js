import produce from "immer";
import { useLazyQuery, useQuery } from "@apollo/client";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import {
  QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID,
  QUERY_MY_CARD_CONTENTS,
  QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
} from "../../../graphql/query/allQuery";

import prettyMilliseconds from "pretty-ms";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import TableRowRanked from "./tableCompoent/TableRowRanked";
import { useRouter } from "next/router";

const StudyHistoryPerBook = ({ mybook_id }) => {
  const [drawerVisibleForStudyHourCards, setDrawerVisibleForStudyHourCards] =
    useState(false);
  const [drawerVisibleForStudyTimesCards, setDrawerVisibleForStudyTimesCards] =
    useState(false);

  const { data, variables } = useQuery(QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID, {
    onCompleted: (received_data) => {
      if (received_data.session_getSessionByMybookid.status === "200") {
        console.log("멘토링용 책 섹션 데이터 받음", received_data);
      } else if (received_data.session_getSessionByMybookid.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
    variables: {
      mybook_id,
      mybook_ids: [mybook_id],
    },
  });

  return (
    <div className="">
      {data && (
        <>
          <div className="px-2 mb-3 bg-white">
            최근 일주일 학습 실적
            <TableForMentorSessionHistory data={data} />
          </div>{" "}
          <div className="px-2 mb-3 bg-white">
            총 학습 카드 개수
            <ChartForStudiedCardsPerDay data={data} />
          </div>
          <div className="px-2 mb-3 bg-white">
            총 획득 레벨
            <ChartForGainedLevelPerDay data={data} />
          </div>
          <div className="px-2 mb-3 bg-white">
            학습 시간 많은 카드{" "}
            <a
              onClick={() => {
                setDrawerVisibleForStudyHourCards(true);
              }}
            >
              자세히 보기
            </a>
            <TableForRankedCards data={data} contentType="hours" />
            <DrawerWrapper
              title="학습 시간 많은 카드"
              placement="right"
              width={"100%"}
              visible={drawerVisibleForStudyHourCards}
              onClose={() => {
                setDrawerVisibleForStudyHourCards(false);
              }}
              headerStyle={{ padding: "12px 12px 8px 12px" }}
              bodyStyle={{ backgroundColor: "#e9e9e9" }}
            >
              <div className="p-2 mb-3 bg-white">
                {drawerVisibleForStudyHourCards && (
                  <TableForAllCards
                    cards={data.cardset_getByMybookIDs.cardsets[0].cards}
                    contentType="hours"
                  />
                )}
              </div>
            </DrawerWrapper>
          </div>
          <div className="px-2 mb-3 bg-white">
            학습 횟수 많은 카드
            <a
              onClick={() => {
                setDrawerVisibleForStudyTimesCards(true);
              }}
            >
              자세히 보기
            </a>
            <TableForRankedCards data={data} contentType="times" />
            <DrawerWrapper
              title="학습 횟수 많은 카드"
              placement="right"
              width={"100%"}
              visible={drawerVisibleForStudyTimesCards}
              onClose={() => {
                setDrawerVisibleForStudyTimesCards(false);
              }}
              headerStyle={{ padding: "12px 12px 8px 12px" }}
              bodyStyle={{ backgroundColor: "#e9e9e9" }}
            >
              <div className="p-2 mb-3 bg-white">
                {drawerVisibleForStudyTimesCards && (
                  <TableForAllCards
                    cards={data.cardset_getByMybookIDs.cardsets[0].cards}
                    contentType="times"
                  />
                )}
              </div>
            </DrawerWrapper>
          </div>
        </>
      )}
    </div>
  );
};

export default StudyHistoryPerBook;

const TableForRankedCards = ({ data, contentType }) => {
  const [cardIdForMore, setCardIdForMore] = useState();
  const [cardContent, setCardContent] = useState(null);

  const fiveSortedCards = [...data.cardset_getByMybookIDs.cardsets[0].cards]
    .sort((a, b) =>
      contentType === "times"
        ? b.studyStatus.totalStudyTimes - a.studyStatus.totalStudyTimes
        : b.studyStatus.totalStudyHour - a.studyStatus.totalStudyHour
    )
    .filter((card, i) => i < 5);

  const fiveContentIdsForMybook = fiveSortedCards
    .filter((card) => card.content.location === "my")
    .map((card) => card.content.mycontent_id);
  const fiveContentIdsForBuybook = fiveSortedCards
    .filter((card) => card.content.location === "buy")
    .map((card) => card.content.buycontent_id);

  const {
    data: myContentsDataForFiveCards,
    loading,
    error,
  } = useQuery(QUERY_MY_CARD_CONTENTS, {
    onCompleted: (data) => {
      console.log(data);
    },
    variables: {
      mycontent_ids: fiveContentIdsForMybook,
      buycontent_ids: fiveContentIdsForBuybook,
    },
  });

  const fiveContents = myContentsDataForFiveCards && [
    ...myContentsDataForFiveCards.buycontent_getBuycontentByBuycontentIDs
      .buycontents,
    ...myContentsDataForFiveCards.mycontent_getMycontentByMycontentIDs
      .mycontents,
  ];

  const getThirdCol =
    contentType === "times"
      ? function (card) {
          return card.studyStatus.totalStudyTimes;
        }
      : function (card) {
          const time = prettyMilliseconds(card.studyStatus.totalStudyHour, {
            colonNotation: true,
            secondsDecimalDigits: 0,
          });
          const displayTime = (time) => {
            switch (time.length) {
              case 4:
                return "00:0" + time;
              case 5:
                return "00:" + time;
              case 6:
                return "00" + time;
              case 7:
                return "0" + time;
              case 8:
                return time;
              default:
                throw new Error(`${time}은 지정된 형식의 시간이 아닙니다.`);
            }
          };

          return displayTime(time);
        };
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] bg-slate-100 w-[10%]">순위</th>
          <th className="text-[1rem] bg-slate-100">앞면</th>
          <th className="text-[1rem] bg-slate-100 w-[20%]">
            {contentType === "hours" ? "학습시간" : "학습횟수"}
          </th>
          <th className="text-[1rem] bg-slate-100 w-[13%]"></th>
        </tr>
      </thead>
      <tbody>
        {data &&
          data.cardset_getByMybookIDs?.cardsets[0]?.cards?.length > 0 &&
          fiveSortedCards.map((card, index) => {
            return (
              <Fragment key={card._id}>
                <tr className="border-b border-collapse border-b-gray-200">
                  <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                    {index + 1}
                  </td>
                  <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
                    {fiveContents &&
                      new String(
                        fiveContents.find(
                          (content) =>
                            content._id === card.content.mycontent_id ||
                            content._id === card.content.buycontent_id
                        ).face1[0]
                      ).replace(/(<([^>]+)>)/gi, "")}
                  </td>
                  <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                    {getThirdCol(card)}
                  </td>
                  <td
                    className="text-[1rem] py-[4px] text-center"
                    onClick={() => {
                      if (cardIdForMore !== card._id + index) {
                        setCardIdForMore(card._id + index);
                        setCardContent({
                          contents: fiveContents.find(
                            (content) =>
                              content._id === card.content.mycontent_id ||
                              content._id === card.content.buycontent_id
                          ),
                          makerFlag: card.content.makerFlag,
                          userFlag: card.content.userFlag,
                          memo: card.content.memo,
                        });
                      } else {
                        setCardContent(null);
                        setCardIdForMore("");
                      }
                    }}
                  >
                    →
                  </td>
                </tr>
                {cardContent && cardIdForMore === card._id + index && (
                  <tr className="border-b border-collapse border-b-gray-200">
                    <td
                      colSpan={
                        contentType === "clickedCard" ||
                        contentType === "changedLevel"
                          ? 5
                          : contentType !== "newCards"
                          ? 4
                          : 3
                      }
                      className="p-2 text-[1rem]"
                    >
                      {!!cardContent.userFlag && (
                        <div className="w-full p-2 bg-gray-100">
                          <span className="font-[500]">유저 플래그 :</span>
                          <span className="ml-2">{cardContent.userFlag}</span>
                        </div>
                      )}

                      <div className="w-full p-2 bg-gray-100">
                        <div className="font-[500]">카드 내용 :</div>
                        {!!cardContent.makerFlag.value && (
                          <div className="w-full pl-2">
                            <span>{cardContent.makerFlag.value}</span>
                            <span className="ml-1">
                              {cardContent.makerFlag.comment}
                            </span>
                          </div>
                        )}

                        <div className="w-full pl-2">
                          {cardContent.contents.face1.map((p, i) => (
                            <div
                              key={i}
                              dangerouslySetInnerHTML={{ __html: p }}
                            ></div>
                          ))}
                        </div>
                        {cardContent.contents.face2.length > 0 &&
                          cardContent.contents.face2.map((p, i) => (
                            <div
                              className="w-full pl-2"
                              key={i}
                              dangerouslySetInnerHTML={{ __html: p }}
                            ></div>
                          ))}
                        {cardContent.contents.annotation.length > 0 &&
                          cardContent.contents.annotation.map((p, i) => (
                            <div
                              className="w-full pl-2"
                              key={i}
                              dangerouslySetInnerHTML={{ __html: p }}
                            ></div>
                          ))}
                      </div>

                      {!!cardContent.memo && (
                        <div className="w-full p-2 mt-2 bg-gray-100">
                          <div className="font-[500]">메모 :</div>
                          <div className="w-full pl-2">{cardContent.memo}</div>
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
      </tbody>
    </table>
  );
};

const TableForAllCards = ({ cards, contentType }) => {
  const [contents, setContents] = useState([]);
  const [counter, setCounter] = useState(0);

  const lengthForShow = 20;

  const allCards = [...cards].sort((a, b) =>
    contentType === "times"
      ? b.studyStatus.totalStudyTimes - a.studyStatus.totalStudyTimes
      : b.studyStatus.totalStudyHour - a.studyStatus.totalStudyHour
  );

  const moreList = allCards.filter(
    (card, i) => lengthForShow - 1 < i && i < (counter + 1) * lengthForShow
  );

  const [getMoreContentsData, { data: moreContentsData }] = useLazyQuery(
    QUERY_MY_CARD_CONTENTS,
    {
      onCompleted: (data) => {
        console.log(data);
        setContents([
          ...contents,
          ...data.buycontent_getBuycontentByBuycontentIDs.buycontents,
          ...data.mycontent_getMycontentByMycontentIDs.mycontents,
        ]);
      },
      fetchPolicy: "network-only",
    }
  );

  useEffect(() => {
    if (counter > 0) {
      const moreCards = allCards.filter((card, i) => lengthForShow - 1 < i);
      if (moreCards.length > (counter - 1) * lengthForShow) {
        const listToRequest = moreCards.filter(
          (card, i) =>
            (counter - 1) * lengthForShow - 1 < i && i < counter * lengthForShow
        );

        console.log({ listToRequest });
        const moreMyContentsIds = listToRequest
          .filter((card) => card.content.location === "my")
          .map((card) => card.content.mycontent_id);
        const moreBuyContetnsIds = listToRequest
          .filter((card) => card.content.location === "buy")
          .map((card) => card.content.buycontent_id);

        getMoreContentsData({
          variables: {
            mycontent_ids: moreMyContentsIds,
            buycontent_ids: moreBuyContetnsIds,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter]);

  const initialList = allCards.filter((card, i) => i < lengthForShow);

  const initialMyContentsIds = initialList
    .filter((card) => card.content.location === "my")
    .map((card) => card.content.mycontent_id);
  const initialBuyContetnsIds = initialList
    .filter((card) => card.content.location === "buy")
    .map((card) => card.content.buycontent_id);

  const {
    data: initialContentsData,
    loading,
    error,
  } = useQuery(QUERY_MY_CARD_CONTENTS, {
    onCompleted: (data) => {
      console.log(data);
    },
    variables: {
      mycontent_ids: initialMyContentsIds,
      buycontent_ids: initialBuyContetnsIds,
    },
  });

  const getThirdCol = useMemo(() => {
    if (contentType === "times") {
      return function getStudyTimes(card) {
        return card.studyStatus.totalStudyTimes;
      };
    }
    if (contentType === "hours") {
      return function (card) {
        const time = prettyMilliseconds(card.studyStatus.totalStudyHour, {
          colonNotation: true,
          secondsDecimalDigits: 0,
        });
        const displayTime = (time) => {
          switch (time.length) {
            case 4:
              return "00:0" + time;
            case 5:
              return "00:" + time;
            case 6:
              return "00" + time;
            case 7:
              return "0" + time;
            case 8:
              return time;
            default:
              throw new Error(`${time}은 지정된 형식의 시간이 아닙니다.`);
          }
        };

        return displayTime(time);
      };
    }
  }, [contentType]);

  return (
    <div>
      <table className="w-full table-fixed">
        <thead>
          <tr className="border-collapse border-y border-y-gray-200">
            <th className="text-[1rem] bg-slate-100 w-[10%]">순위</th>
            <th className="text-[1rem] bg-slate-100">앞면</th>
            <th className="text-[1rem] bg-slate-100 w-[20%]">
              {contentType === "hours" ? "학습시간" : "학습횟수"}
            </th>
            <th className="text-[1rem] bg-slate-100 w-[13%]"></th>
          </tr>
        </thead>
        <tbody>
          {initialContentsData &&
            [
              ...initialContentsData.buycontent_getBuycontentByBuycontentIDs
                .buycontents,
              ...initialContentsData.mycontent_getMycontentByMycontentIDs
                .mycontents,
            ].length > 0 &&
            initialList.map((card, index) => {
              return (
                <TableRowRanked
                  key={card._id}
                  contentsData={[
                    ...initialContentsData
                      .buycontent_getBuycontentByBuycontentIDs.buycontents,
                    ...initialContentsData.mycontent_getMycontentByMycontentIDs
                      .mycontents,
                  ]}
                  card={card}
                  index={index}
                  getThirdCol={getThirdCol}
                />
              );
            })}
          {moreList.length === contents.length &&
            moreList.map((card, index) => {
              return (
                <TableRowRanked
                  key={card._id}
                  contentsData={contents}
                  card={card}
                  index={index + lengthForShow}
                  getThirdCol={getThirdCol}
                />
              );
            })}
        </tbody>
      </table>
      <div
        className="mt-2 w-full mx-auto text-[12px] text-blue-500 text-center"
        onClick={() => {
          if (((counter + 1) * lengthForShow) / cards.length < 1) {
            setCounter(counter + 1);
          }
        }}
      >
        {((counter + 1) * lengthForShow) / cards.length < 1
          ? "더보기"
          : "더 없습니다"}
      </div>
    </div>
  );
};

const ChartForStudiedCardsPerDay = ({ data }) => {
  const maxStudiedTimes = _.max(
    data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory.map(
      ({ numCardsByStatus: { ing, hold, yet, completed } }) =>
        completed + ing + hold + yet
    )
  );

  return (
    <div>
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-yellow-500"></div>
          <div className="text-[12px]">미완료카드</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-blue-500"></div>
          <div className="text-[12px]">완료카드</div>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <ul className="table h-[140px] py-5">
          {data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory
            .map(
              ({ numCardsByStatus: { ing, hold, yet, completed }, date }) => {
                const totalStudiedTimes = completed + ing + hold + yet;
                const barHeightPercentage =
                  Math.round((totalStudiedTimes / maxStudiedTimes) * 100) + "%";
                const incompletedTimes = ing + hold + yet;
                const percentageOfIncompleted =
                  Math.round((incompletedTimes / totalStudiedTimes) * 100) +
                  "%";
                const completedTimes = completed;
                const percentageOfCompleted =
                  Math.round((completedTimes / totalStudiedTimes) * 100) + "%";
                return {
                  date: moment(date).format("M월D일"),
                  totalStudiedTimes,
                  barHeightPercentage,
                  incompletedTimes,
                  percentageOfIncompleted,
                  completedTimes,
                  percentageOfCompleted,
                };
              }
            )
            .map(
              ({
                date,
                totalStudiedTimes,
                barHeightPercentage,
                incompletedTimes,
                percentageOfIncompleted,
                completedTimes,
                percentageOfCompleted,
              }) => (
                <li
                  key={date}
                  className="relative table-cell align-bottom min-w-[48px] max-w-[48px] px-1"
                >
                  <StyledBar
                    total={totalStudiedTimes}
                    barHeightPercentage={barHeightPercentage}
                    date={date}
                    percentageOfIncompleted={percentageOfIncompleted}
                    percentageOfCompleted={percentageOfCompleted}
                  >
                    <div className="incompleted bg-yellow-500 text-[10px] text-gray-50 flex items-center justify-center">
                      {incompletedTimes}
                    </div>
                    <div className="completed bg-blue-500 h-[30%] text-[10px] text-gray-50 flex items-center justify-center">
                      {completedTimes}
                    </div>
                  </StyledBar>
                </li>
              )
            )}
        </ul>
      </div>
    </div>
  );
};
const ChartForGainedLevelPerDay = ({ data }) => {
  const maxLevel = _.max(
    data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory.map(
      ({ level: { completed, nonCompleted } }) =>
        Math.floor(completed * 1000 + nonCompleted * 1000) / 1000
    )
  );

  return (
    <div>
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-yellow-500"></div>
          <div className="text-[12px]">미완료카드</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-blue-500"></div>
          <div className="text-[12px]">완료카드</div>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <ul className="table h-[140px] py-5">
          {data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory
            .map(({ level: { completed, nonCompleted }, date }, index, arr) => {
              const totalLevel =
                Math.floor(completed * 1000 + nonCompleted * 1000) / 1000;
              const barHeightPercentage =
                Math.round((totalLevel / maxLevel) * 100) + "%";
              const incompletedLevel = Math.round(nonCompleted * 1000) / 1000;
              const percentageOfIncompleted =
                Math.round((incompletedLevel / totalLevel) * 100) + "%";
              const completedLevel = Math.round(completed * 1000) / 1000;
              const percentageOfCompleted =
                Math.round((completedLevel / totalLevel) * 100) + "%";
              return {
                date: moment(date).format("M월D일"),
                totalLevel,
                barHeightPercentage,
                incompletedLevel,
                percentageOfIncompleted,
                completedLevel,
                percentageOfCompleted,
              };
            })
            .map(
              ({
                date,
                totalLevel,
                barHeightPercentage,
                incompletedLevel,
                percentageOfIncompleted,
                completedLevel,
                percentageOfCompleted,
              }) => (
                <li
                  key={date}
                  className="relative table-cell align-bottom min-w-[48px] max-w-[48px] px-1"
                >
                  <StyledBar
                    total={totalLevel}
                    barHeightPercentage={barHeightPercentage}
                    date={date}
                    percentageOfIncompleted={percentageOfIncompleted}
                    percentageOfCompleted={percentageOfCompleted}
                  >
                    <div className="incompleted bg-yellow-500 text-[10px] text-gray-50 flex items-center justify-center">
                      {incompletedLevel}
                    </div>
                    <div className="completed bg-blue-500 h-[30%] text-[10px] text-gray-50 flex items-center justify-center">
                      {completedLevel}
                    </div>
                  </StyledBar>
                </li>
              )
            )}
        </ul>
      </div>
    </div>
  );
};

const StyledBar = styled.div`
  height: ${(props) => props.barHeightPercentage};
  &:before {
    content: "${(props) => props.date}";
    display: block;
    position: absolute;
    font-size: 10px;
    text-align: center;
    word-wrap: break-word;
    top: 100%;
    left: 0;
    right: 0;
  }
  &:after {
    content: "${(props) => props.total}";
    display: block;
    position: absolute;
    font-size: 10px;
    text-align: center;
    word-wrap: break-word;
    bottom: ${(props) => props.barHeightPercentage};
    left: 0;
    right: 0;
  }

  .incompleted {
    height: ${(props) => props.percentageOfIncompleted};
  }
  .completed {
    height: ${(props) => props.percentageOfCompleted};
  }
`;

const TableForMentorSessionHistory = ({ data }) => {
  const router = useRouter();

  const [getSessionDataForResult, { variables }] = useLazyQuery(
    QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
    {
      onCompleted: (received_data) => {
        if (received_data.session_getSession.status === "200") {
          console.log("세션 결과 데이터 받음", received_data);

          sessionStorage.setItem(
            "startTimeForSessionHistory",
            received_data.session_getSession.sessions[0].session_info
              .timeStarted
          );
          sessionStorage.setItem(
            "endTimeForSessionHistory",
            received_data.session_getSession.sessions[0].session_info
              .timeFinished
          );
          sessionStorage.setItem(
            "cardListStudyingForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].cardlistUpdated
            )
          );
          sessionStorage.setItem(
            "createdCardsForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].createdCards
            )
          );
          sessionStorage.setItem(
            "cardlist_to_send_ForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].clickHistory
            )
          );
          sessionStorage.setItem(
            "resultOfSessionForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].resultOfSession
            )
          );
          sessionStorage.setItem(
            "resultByBookForSessionHistory",
            JSON.stringify(
              produce(
                received_data.session_getSession.sessions[0].resultByBook,
                (draft) => {
                  draft.forEach((book) => {
                    book.bookTitle =
                      received_data.session_getSession.sessions[0].sessionScope.find(
                        (scope) => scope.mybook_id === book.mybook_id
                      ).title;
                  });
                }
              )
            )
          );

          router.push(`/m/mentoring/resultOfMentee/${variables.session_id}`);
        } else if (received_data.session_getSession.status === "401") {
          router.push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  const getSessionResult = useCallback(async ({ session_id }) => {
    try {
      getSessionDataForResult({
        variables: {
          session_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] bg-slate-100 w-[15%]">시작일</th>
          <th className="text-[1rem] bg-slate-100 w-[30%]">학습모드</th>
          <th className="text-[1rem] bg-slate-100 w-[31%]">시간</th>
          <th className="text-[1rem] bg-slate-100 w-[24%]"></th>
        </tr>
      </thead>
      <tbody>
        {data.session_getSessionByMybookid?.sessions?.map((session) => {
          const startedDate = moment(session.session_info.timeStarted).format(
            "M/D"
          );

          const studyMode =
            session.sessionConfig.studyMode === "flip"
              ? "뒤집기"
              : session.sessionConfig.studyMode === "read"
              ? "읽기"
              : session.sessionConfig.studyMode === "exam"
              ? "시험"
              : new Error(
                  `${session.sessionConfig.studyMode}는 알 수 없는 학습 모드입니다`
                );

          const timeOnSessionStage = `${moment(
            session.session_info.timeStarted
          ).format("HH:mm")} ~ ${moment(
            session.session_info.timeFinished
          ).format("HH:mm")}`;

          const isWithBook = session.sessionScope.length > 1 ? "(혼합)" : null;
          return (
            <tr
              key={session._id}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] border-r border-collapse border-r-gray-200  text-center">
                {startedDate}
              </td>
              <td className="text-[1rem] border-r border-collapse border-r-gray-200 text-center">
                {studyMode}
                {isWithBook}
              </td>
              <td className="text-[1rem] border-r border-collapse border-r-gray-200 text-center">
                {timeOnSessionStage}
              </td>
              <td
                className="text-[1rem] text-center"
                onClick={() => {
                  console.log("자세히보기");
                  getSessionResult({ session_id: session._id });
                }}
              >
                <a>자세히보기</a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const DrawerWrapper = styled(Drawer)`
  top: 40px;

  height: calc(100vh - 40px);
  & .ant-drawer-body * {
    font-size: 1rem;
  }
  & .ant-drawer-wrapper-body {
    height: ${({ setheight }) => setheight || "auto"}px;
  }
  & .ant-card-actions {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    & > li {
      margin: 0;
      height: 3.5rem;
      & > span {
        width: 100%;
        height: 100%;
        & > div {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
`;
