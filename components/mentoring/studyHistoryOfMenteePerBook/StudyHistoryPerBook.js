import { useLazyQuery, useQuery } from "@apollo/client";
import _ from "lodash";
import moment from "moment";
import styled from "styled-components";
import {
  QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID,
  QUERY_MY_CARD_CONTENTS,
} from "../../../graphql/query/allQuery";

import prettyMilliseconds from "pretty-ms";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Drawer } from "antd";
import TableRowRanked from "./tableCompoent/TableRowRanked";
import SectionWrapper from "../../common/commonComponent/SectionWrapper";
import StudyHistoryOfLastWeek from "./StudyHistoryOfLaskWeek";

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

  const numberOfCards = useMemo(
    () => ({
      hold:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.hold ?? 0,
      ing:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.ing ?? 0,
      completed:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.completed ?? 0,
      yet:
        data?.mybook_getMybookByMybookIDs?.mybooks[0]?.stats?.studyHistory[0]
          ?.numCardsByStatus?.yet ?? 0,
    }),
    [data]
  );

  return (
    <div className="">
      {data && (
        <div className="w-full flex flex-col gap-[8px]">
          <SectionWrapper
            title="최근 일주일 학습 실적"
            content={
              <StudyHistoryOfLastWeek data={data} />
              // <TableForMentorSessionHistory data={data} />
            }
          />
          <SectionWrapper
            title="총 학습 카드 개수"
            content={<ChartForStudiedCardsPerDay data={data} />}
          />
          <SectionWrapper
            title="총 획득 레벨"
            content={<ChartForGainedLevelPerDay data={data} />}
          />

          <SectionWrapper
            title={
              <div className="flex items-end space-x-3">
                <div>학습 시간 많은 카드</div>
                <a
                  className="text-[1rem] text-blue-700"
                  onClick={() => {
                    setDrawerVisibleForStudyHourCards(true);
                  }}
                >
                  자세히 보기
                </a>
              </div>
            }
            content={<TableForRankedCards data={data} contentType="hours" />}
          />
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

          <SectionWrapper
            title={
              <div className="flex items-end space-x-3">
                <div>학습 횟수 많은 카드</div>
                <a
                  className="text-[1rem] text-blue-700"
                  onClick={() => {
                    setDrawerVisibleForStudyTimesCards(true);
                  }}
                >
                  자세히 보기
                </a>
              </div>
            }
            content={<TableForRankedCards data={data} contentType="times" />}
          />
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

          <SectionWrapper
            title="카드 상태"
            content={
              <TableForStatusOfCard
                hold={numberOfCards.hold}
                yet={numberOfCards.yet}
                completed={numberOfCards.completed}
                ing={numberOfCards.ing}
              />
            }
          />
        </div>
      )}
    </div>
  );
};

export default StudyHistoryPerBook;

const TableForStatusOfCard = ({ hold, yet, completed, ing }) => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] bg-slate-100">Total</th>
        <th className="text-[1rem] bg-slate-100">학습전</th>
        <th className="text-[1rem] bg-slate-100">학습중</th>
        <th className="text-[1rem] bg-slate-100">보류</th>
        <th className="text-[1rem] bg-slate-100">완료</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {hold + yet + ing + completed}
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {yet}
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {ing}
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {hold}
        </td>
        <td className="text-[1rem] py-[4px] text-center">{completed}</td>
      </tr>
    </tbody>
  </table>
);

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
