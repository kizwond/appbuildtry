import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  QUERY_MY_CARD_CONTENTS,
  QUERY_BUY_CARD_CONTENTS,
} from "../../../../graphql/query/allQuery";

import M_Layout from "../../../../components/layout/M_Layout";
import { Select, Space, Table } from "antd";
import moment from "moment";
import styled from "styled-components";
import { divide } from "lodash";
import { useMemo } from "react";
import { ArrowRightOutlined } from "@ant-design/icons";
import prettyMilliseconds from "pretty-ms";

const ResultForStudy = ({ title, content }) => (
  <div className="w-full">
    <div className="ForMobilePageMainTitle">{title}</div>
    <div className="px-[4px]">{content}</div>
  </div>
);

const CardNumberTable = ({ numberOfCards }) => {
  const getTotalNumber = (keyName) =>
    numberOfCards.completed[keyName] +
    numberOfCards.yet[keyName] +
    numberOfCards.hold[keyName] +
    numberOfCards.ing[keyName];

  const totalOfSelected = getTotalNumber("selected");
  const totalOfInserted = getTotalNumber("inserted");
  const totalOfStarted = getTotalNumber("started");
  const totalOfFinished = getTotalNumber("finished");

  return (
    <table className="w-full border border-collapse border-gray-200 table-fixed">
      <thead>
        <tr>
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100 w-[50px]">
            순위
          </th>
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100">
            선택
          </th>
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100">
            투입
          </th>
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100">
            시작
          </th>
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100">
            종료
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-center">
            Total
          </td>
          <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-center">
            {totalOfSelected}
          </td>
          <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-center">
            {totalOfInserted}
          </td>
          <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-center">
            {totalOfStarted}
          </td>
          <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-center">
            {totalOfFinished}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const SelectDetailOption = () => {
  const [selectedValue, setSelectedValue] = useState("Session");

  const resultOfSession =
    selectedValue === "Session"
      ? JSON.parse(sessionStorage.getItem("resultOfSession"))
      : JSON.parse(sessionStorage.getItem("resultByBook")).find(
          (book) => book.mybook_id === selectedValue
        );

  return (
    <div className="w-full">
      <div className="flex">
        <div className="w-[60px] flex-none ForMobilePageMainTitle">선택</div>
        <Select
          className="flex-auto text-[1rem]"
          value={selectedValue}
          size="small"
          onChange={(v) => setSelectedValue(v)}
        >
          <Select.Option value="Session">세션전체</Select.Option>
          {JSON.parse(sessionStorage.getItem("resultByBook")).map((book) => (
            <Select.Option value={book.mybook_id} key={book.mybook_id}>
              {book.bookTitle}
            </Select.Option>
          ))}
        </Select>
      </div>
      <ResultForStudy
        title="카드 수"
        content={<CardNumberTable numberOfCards={resultOfSession.numCards} />}
      />
    </div>
  );
};

const SummaryTag = ({ title, content }) => (
  <div className="flex flex-col gap-2 ">
    <div className="text-base text-center bg-slate-900 text-slate-50">
      {title}
    </div>
    <div className="text-base text-center bg-slate-900 text-slate-50">
      {content}
    </div>
  </div>
);

const SummaryTags = () => {
  const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));

  const { completed, hold, ing, yet } = resultOfSession.numCards;

  const totalGap = resultOfSession.levelChange.total.gap;
  return (
    <div className="grid w-full grid-cols-3 grid-rows-2 gap-4">
      <SummaryTag
        title={"학습 시작"}
        content={moment(sessionStorage.getItem("started")).format("M.D hh:mm")}
      />
      <SummaryTag title={"학습 종료"} content={moment().format("M.D hh:mm")} />
      <SummaryTag
        title={"실제 학습 시간"}
        content={prettyMilliseconds(
          JSON.parse(sessionStorage.getItem("resultOfSession")).studyHour,
          { colonNotation: true, secondsDecimalDigits: 1 }
        )}
      />
      <SummaryTag
        title={"학습 시작 카드"}
        content={
          completed.started + hold.started + ing.started + yet.started + "장"
        }
      />
      <SummaryTag
        title={"학습 완료 카드"}
        content={
          completed.finished +
          hold.finished +
          ing.finished +
          yet.finished +
          "장"
        }
      />
      <SummaryTag
        title={"레벨 획득"}
        content={
          ((totalGap) => {
            if (totalGap > 0) {
              return "+" + totalGap;
            }
            if (totalGap < 0) {
              return "-" + totalGap;
            }
            return "-";
          })(totalGap)
          // totalGap > 0 ? "+" + totalGap : totalGap < 0 ? "-" + totalGap : "-"
        }
      />
    </div>
  );
};

const TableForTop5ClickedResult = ({
  cards,
  myContents,
  buyContents,
  contentType,
}) => {
  const contents = [...myContents, ...buyContents];

  const getThirdCol =
    contentType === "clickedTimes"
      ? function (card) {
          return card.studyStatus.clickTimesInSession;
        }
      : function (card) {
          return prettyMilliseconds(card.studyStatus.studyHourInSession, {
            colonNotation: true,
            secondsDecimalDigits: 1,
          });
        };
  return (
    <table className="w-full border border-collapse border-gray-200 table-fixed">
      <thead>
        <tr>
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100 w-[30px]">
            순위
          </th>
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100">
            앞면
          </th>
          {contentType !== "newCards" && (
            <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100 w-[70px]">
              {contentType === "clickedTimes" ? "총 학습횟수" : "총 학습시간"}
            </th>
          )}
          <th className="text-[1rem] font-normal border border-collapse border-gray-200 bg-slate-100 w-[60px]">
            카드보기
          </th>
        </tr>
      </thead>
      <tbody>
        {cards.length > 0 &&
          cards.map((card, index) => (
            <tr key={card._id}>
              <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-center">
                {index + 1}
              </td>
              <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-left px-[8px] truncate">
                {new String(
                  contents.find(
                    (content) =>
                      content._id === card.content.mycontent_id ||
                      content._id === card.content.buycontent_id
                  ).face1
                ).replace(/(<([^>]+)>)/gi, "")}
              </td>
              {contentType !== "newCards" && (
                <td className="text-[1rem] font-normal border border-collapse border-gray-200 text-center">
                  {getThirdCol(card)}
                </td>
              )}
              <td
                className="text-[1rem] font-normal border border-collapse border-gray-200 text-center"
                onClick={() => console.log("카드보기 클릭함")}
              >
                <ArrowRightOutlined />
              </td>
            </tr>
          ))}
        {cards.length === 0 && contentType === "newCards" && (
          <tr>
            <td
              className="text-[1rem] font-normal border border-collapse border-gray-200 text-center"
              colSpan={3}
            >
              학습 중 새로 만든 카드가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const StudyResult = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [cardList, setCardList] = useState(null);

  const [getMyCardsContent, { data, loading, error }] = useLazyQuery(
    QUERY_MY_CARD_CONTENTS,
    {
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );
  const [getBuyCardsContent, { data: buyContentsData }] = useLazyQuery(
    QUERY_BUY_CARD_CONTENTS,
    {
      onCompleted: (data) => {
        console.log(data);
      },
    }
  );

  useEffect(() => setIsMounted(true), []);
  const ISSERVER = typeof window === "undefined";
  const topFiveCardsBySubject = useMemo(() => {
    if (!ISSERVER) {
      const cardlist_to_send_tmp = JSON.parse(
        sessionStorage.getItem("cardListStudying")
      );
      const createdCards = JSON.parse(sessionStorage.getItem("createdCards"));
      const topFiveClicked = [...cardlist_to_send_tmp]
        .sort(
          (a, b) =>
            b.studyStatus.clickTimesInSession -
            a.studyStatus.clickTimesInSession
        )
        .splice(0, 5);
      // .filter((_, i) => i < 5);
      const topFiveStudyHour = [...cardlist_to_send_tmp]
        .sort(
          (a, b) =>
            b.studyStatus.studyHourInSession - a.studyStatus.studyHourInSession
        )
        .splice(0, 5);
      // .filter((_, i) => i < 5);
      const fiveCreatedCards = createdCards.filter((_, i) => i < 5);

      return {
        topFiveClicked,
        topFiveStudyHour,
        fiveCreatedCards,
      };
    }
  }, [ISSERVER]);

  useEffect(() => {
    if (!ISSERVER) {
      // const cardlist_to_send_tmp = JSON.parse(
      //   sessionStorage.getItem("cardListStudying")
      // );
      // const createdCards = JSON.parse(sessionStorage.getItem("createdCards"));
      // setCardList(cardlist_to_send_tmp);
      // const topFiveClicked = [...cardlist_to_send_tmp]
      //   .sort(
      //     (a, b) =>
      //       b.studyStatus.clickTimesInSession -
      //       a.studyStatus.clickTimesInSession
      //   )
      //   .filter((_, i) => i < 5);
      // const topFiveStudyHour = [...cardlist_to_send_tmp]
      //   .sort(
      //     (a, b) =>
      //       b.studyStatus.studyHourInSession - a.studyStatus.studyHourInSession
      //   )
      //   .filter((_, i) => i < 5);
      // const fiveCreatedCards = createdCards.filter((_, i) => i < 5);
      const cardsToRequest = [
        ...topFiveCardsBySubject.topFiveClicked,
        ...topFiveCardsBySubject.topFiveStudyHour,
        ...topFiveCardsBySubject.fiveCreatedCards,
      ];
      if (
        cardsToRequest.filter((card) => card.content.location === "my").length >
        0
      ) {
        getMyCardsContent({
          variables: {
            mycontent_ids: cardsToRequest
              .filter((card) => card.content.location === "my")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
      if (
        cardsToRequest.filter((card) => card.content.location === "buy")
          .length > 0
      ) {
        getBuyCardsContent({
          variables: {
            buycontent_ids: cardsToRequest
              .filter((card) => card.content.location === "buy")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) <div>로딩중..</div>;
  if (error) <div>에러 발생: {error}</div>;

  const getContentsSortByIds = (contents) => {
    let contentObj = {};
    contents.forEach(
      (content) =>
        (contentObj[content._id] = new String(content.face1).replace(
          /(<([^>]+)>)/gi,
          ""
        ))
    );
    return contentObj;
  };

  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_76px)] overflow-y-auto px-[8px] min-w-[360px]">
          {isMounted &&
            data &&
            data.mycontent_getMycontentByMycontentIDs &&
            data.mycontent_getMycontentByMycontentIDs.mycontents && (
              <div className="w-full flex flex-col gap-[8px]">
                <ResultForStudy title="요약" content={<SummaryTags />} />
                <ResultForStudy
                  title="학습횟수 많은 카드"
                  content={
                    <TableForTop5ClickedResult
                      cards={topFiveCardsBySubject.topFiveClicked}
                      myContents={
                        data.mycontent_getMycontentByMycontentIDs.mycontents
                      }
                      contentType={"clickedTimes"}
                      buyContents={
                        !buyContentsData
                          ? []
                          : buyContentsData
                              .buycontent_getBuycontentByBuycontentIDs
                              .buycontents
                      }
                    />
                  }
                />
                <ResultForStudy
                  title="학습시간 많은 카드"
                  content={
                    <TableForTop5ClickedResult
                      cards={topFiveCardsBySubject.topFiveStudyHour}
                      myContents={
                        data.mycontent_getMycontentByMycontentIDs.mycontents
                      }
                      contentType={"studyHours"}
                      buyContents={
                        !buyContentsData
                          ? []
                          : buyContentsData
                              .buycontent_getBuycontentByBuycontentIDs
                              .buycontents
                      }
                    />
                  }
                />
                <ResultForStudy
                  title="새로 만든 카드"
                  content={
                    <TableForTop5ClickedResult
                      cards={topFiveCardsBySubject.fiveCreatedCards}
                      myContents={
                        data.mycontent_getMycontentByMycontentIDs.mycontents
                      }
                      contentType={"newCards"}
                      buyContents={
                        !buyContentsData
                          ? []
                          : buyContentsData
                              .buycontent_getBuycontentByBuycontentIDs
                              .buycontents
                      }
                    />
                  }
                />
                <SelectDetailOption />
              </div>
            )}
        </div>
      </M_Layout>
    </>
  );
};

export default StudyResult;
