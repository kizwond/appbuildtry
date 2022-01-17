import React, { useState, useEffect, useCallback, Fragment } from "react";
import { useLazyQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";

import {
  QUERY_MY_CARD_CONTENTS,
  QUERY_BUY_CARD_CONTENTS,
} from "../../../../graphql/query/allQuery";

import M_Layout from "../../../../components/layout/M_Layout";
import { Drawer, Modal, Select } from "antd";
import moment from "moment";
import { useMemo } from "react";
import prettyMilliseconds from "pretty-ms";
import styled from "styled-components";

const ResultForStudy = ({ title, content }) => (
  <div className="w-full">
    <div className="ForMobilePageMainTitle">{title}</div>
    <div className="px-[4px]">{content}</div>
  </div>
);

const CardNumberTable = ({ numberOfCards, more }) => {
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
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
            기존 상태
          </th>
          <th className="text-[1rem] font-normal bg-slate-100">선택</th>
          <th className="text-[1rem] font-normal bg-slate-100">투입</th>
          <th className="text-[1rem] font-normal bg-slate-100">시작</th>
          <th className="text-[1rem] font-normal bg-slate-100">종료</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-collapse border-b-gray-200">
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            Total
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfSelected}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfInserted}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfStarted}
          </td>
          <td className="text-[1rem] py-[4px] font-normal text-center">
            {totalOfFinished}
          </td>
        </tr>
        {more &&
          ["yet", "ing", "hold", "completed"].map((status) => (
            <tr
              key={status}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {status === "yet"
                  ? "학습전"
                  : status === "ing"
                  ? "학습중"
                  : status === "hold"
                  ? "보류"
                  : status === "completed"
                  ? "완료"
                  : "오류"}
              </td>
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[status].selected}
              </td>
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[status].inserted}
              </td>
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[status].started}
              </td>
              <td className="text-[1rem] py-[4px] font-normal text-center">
                {numberOfCards[status].finished}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};
const ClickedTimesByDifficultyChart = ({ clickedTimesByDifficulty }) => {
  const removedTotalInclicked = { ...clickedTimesByDifficulty };
  delete removedTotalInclicked.total;
  const maxNumber = Math.max(...Object.values(removedTotalInclicked));
  const difficulties = [
    { title: "diffi1", color: "bg-orange-400" },
    { title: "diffi2", color: "bg-emerald-400" },
    { title: "diffi3", color: "bg-yellow-400" },
    { title: "diffi4", color: "bg-rose-400" },
    { title: "diffi5", color: "bg-cyan-400" },
    { title: "diffi6", color: "bg-indigo-400" },
    { title: "hold", color: "bg-gray-400" },
    { title: "completed", color: "bg-green-400" },
    { title: "etc", color: "bg-lime-400" },
  ];
  return (
    <div className="w-full pr-[25px]">
      <table className="w-full h-full">
        <tbody>
          {difficulties.map(({ title, color }) => {
            const percentage =
              maxNumber === 0
                ? 0
                : Math.round(
                    (clickedTimesByDifficulty[title] / maxNumber) * 100
                  );
            return (
              <tr key={title}>
                <td className="w-[80px] text-[1rem] border-r border-r-slate-400">
                  <div className="flex justify-end pr-[8px]">{title}</div>
                </td>
                <td>
                  <StyledChartBar
                    className={`h-[70%] ${color} relative`}
                    percentage={percentage}
                  >
                    {percentage === 0 ? null : (
                      <div className="text-[10px] absolute w-[9px] right-[-10px]">
                        <div>{clickedTimesByDifficulty[title]}</div>
                      </div>
                    )}
                  </StyledChartBar>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const StyledChartBar = styled.div`
  width: ${({ percentage }) => percentage}%;
`;

const ChangedCardStatusTable = ({ changedCardStatus, numberOfCards, more }) => {
  const getTotalNumber = (keyName) =>
    changedCardStatus.completed[keyName] +
    changedCardStatus.yet[keyName] +
    changedCardStatus.hold[keyName] +
    changedCardStatus.ing[keyName];

  const totalOfYet = getTotalNumber("yet");
  const totalOfIng = getTotalNumber("ing");
  const totalOfHold = getTotalNumber("hold");
  const totalOfCompleted = getTotalNumber("completed");

  const totalNumberOfInserted =
    numberOfCards.completed.inserted +
    numberOfCards.yet.inserted +
    numberOfCards.hold.inserted +
    numberOfCards.ing.inserted;

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
            기존 상태
          </th>
          <th className="text-[1rem] font-normal bg-slate-100">투입카드</th>
          <th className="text-[1rem] font-normal bg-slate-100">학습전</th>
          <th className="text-[1rem] font-normal bg-slate-100">학습중</th>
          <th className="text-[1rem] font-normal bg-slate-100">보류</th>
          <th className="text-[1rem] font-normal bg-slate-100">완료</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-collapse border-b-gray-200">
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200  text-center">
            Total
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalNumberOfInserted}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfYet}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfIng}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfHold}
          </td>
          <td className="text-[1rem] py-[4px] font-normal text-center">
            {totalOfCompleted}
          </td>
        </tr>
        {more &&
          ["yet", "ing", "hold", "completed"].map((preStatus) => (
            <tr
              key={preStatus}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {preStatus === "yet"
                  ? "학습전"
                  : preStatus === "ing"
                  ? "학습중"
                  : preStatus === "hold"
                  ? "보류"
                  : preStatus === "completed"
                  ? "완료"
                  : "오류"}
              </td>
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[preStatus].inserted}
              </td>
              {["yet", "ing", "hold", "completed"].map((afterStatus) => (
                <React.Fragment key={`afterStatus:${afterStatus}`}>
                  {afterStatus === preStatus ? (
                    <td className="text-[1rem] font-normal text-stone-500 bg-zinc-300 border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                      {numberOfCards[preStatus].inserted -
                        Object.values(changedCardStatus[preStatus]).reduce(
                          (a, b) => a + b,
                          0
                        )}
                    </td>
                  ) : (
                    <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                      {changedCardStatus[preStatus][afterStatus]}
                    </td>
                  )}
                </React.Fragment>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};
const ChangedFlagTable = ({ changedFlag }) => {
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
            플래그
          </th>
          <th className="text-[1rem] font-normal bg-slate-100">flag0</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag1</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag2</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag3</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag4</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag5</th>
        </tr>
      </thead>
      <tbody>
        {["flag0", "flag1", "flag2", "flag3", "flag4", "flag5"].map(
          (preFlag) => (
            <tr
              key={preFlag}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {preFlag}
              </td>
              {["flag0", "flag1", "flag2", "flag3", "flag4", "flag5"].map(
                (afterFlag) => (
                  <React.Fragment key={`afterFlag:${afterFlag}`}>
                    {afterFlag === preFlag ? (
                      <td className="text-[1rem] font-normal text-stone-500 bg-zinc-300 border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                        {Boolean(Number(changedFlag[preFlag][afterFlag])) &&
                          changedFlag[preFlag][afterFlag]}
                      </td>
                    ) : (
                      <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                        {Boolean(Number(changedFlag[preFlag][afterFlag])) &&
                          changedFlag[preFlag][afterFlag]}
                      </td>
                    )}
                  </React.Fragment>
                )
              )}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

const ChangedLevelTable = ({ changedLevel, more }) => {
  const averageOfGap =
    Math.round((changedLevel.total.gap / changedLevel.total.count) * 100) / 100;
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">종류</th>
          <th className="text-[1rem] font-normal bg-slate-100">
            {"'알겠음' 카드수"}
          </th>
          <th className="text-[1rem] font-normal bg-slate-100">
            레벨 변동값 평균
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-collapse border-b-gray-200">
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            Total
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {changedLevel.total.count}
          </td>
          <td className="text-[1rem] py-[4px] font-normal text-center">
            {averageOfGap > 0
              ? "+" + averageOfGap
              : averageOfGap < 0
              ? "" + averageOfGap
              : "-"}
          </td>
        </tr>
        {more &&
          ["up", "down"].map((clickedButton) => (
            <tr
              key={clickedButton}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {clickedButton === "up"
                  ? "Up"
                  : clickedButton === "down"
                  ? "Down"
                  : "오류"}
              </td>
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {changedLevel[clickedButton].count}
              </td>
              <td className="text-[1rem] py-[4px] font-normal text-center">
                {Math.round(
                  (changedLevel[clickedButton].gap /
                    changedLevel[clickedButton].count) *
                    100
                ) /
                  100 >
                0
                  ? "+" +
                    Math.round(
                      (changedLevel[clickedButton].gap /
                        changedLevel[clickedButton].count) *
                        100
                    ) /
                      100
                  : Math.round(
                      (changedLevel[clickedButton].gap /
                        changedLevel[clickedButton].count) *
                        100
                    ) /
                      100 <
                    0
                  ? "" +
                    Math.round(
                      (changedLevel[clickedButton].gap /
                        changedLevel[clickedButton].count) *
                        100
                    ) /
                      100
                  : "-"}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

const SelectDetailOption = () => {
  const [selectedValue, setSelectedValue] = useState("Session");
  const [moreCardNumber, setMoreCardNumber] = useState(false);
  const [moreChangedLevel, setMoreChangedLevel] = useState(false);
  const [moreChangedCardStatus, setMoreChangedCardStatus] = useState(false);

  const resultOfSession =
    selectedValue === "Session"
      ? JSON.parse(sessionStorage.getItem("resultOfSession"))
      : JSON.parse(sessionStorage.getItem("resultByBook")).find(
          (book) => book.mybook_id === selectedValue
        );

  return (
    <div className="w-full flex flex-col gap-[8px] pt-[8px]">
      <StyledAntSelect
        className="w-[50%] text-[1.4rem]"
        value={selectedValue}
        onChange={(v) => setSelectedValue(v)}
      >
        <Select.Option value="Session">세션전체</Select.Option>
        {JSON.parse(sessionStorage.getItem("resultByBook")).map((book) => (
          <Select.Option value={book.mybook_id} key={book.mybook_id}>
            {book.bookTitle}
          </Select.Option>
        ))}
      </StyledAntSelect>

      <ResultForStudy
        title={
          <div className="flex items-end space-x-3">
            <div>카드수</div>
            <a
              className="text-[1rem] text-blue-700"
              onClick={() => setMoreCardNumber((pre) => !pre)}
            >
              {moreCardNumber ? "접기" : "더보기"}
            </a>
          </div>
        }
        content={
          <CardNumberTable
            numberOfCards={resultOfSession.numCards}
            more={moreCardNumber}
          />
        }
      />

      <ResultForStudy
        title={
          <div className="flex items-end space-x-3">
            <div>클릭 수</div>
            <a
              className="text-[1rem] text-blue-700"
              onClick={() => console.log("원래있던 테이블로 구성해야함")}
            >
              자세히보기
            </a>
          </div>
        }
        content={
          <ClickedTimesByDifficultyChart
            clickedTimesByDifficulty={resultOfSession.clicks}
          />
        }
      />

      <ResultForStudy
        title={
          <div className="flex items-end space-x-3">
            <div>레벨 변동</div>
            <a
              className="text-[1rem] text-blue-700"
              onClick={() => setMoreChangedLevel((pre) => !pre)}
            >
              {moreCardNumber ? "접기" : "더보기"}
            </a>
          </div>
        }
        content={
          <ChangedLevelTable
            changedLevel={resultOfSession.levelChange}
            more={moreChangedLevel}
          />
        }
      />
      <ResultForStudy
        title={
          <div className="flex items-end space-x-3">
            <div>카드 상태 변경</div>
            <a
              className="text-[1rem] text-blue-700"
              onClick={() => setMoreChangedCardStatus((pre) => !pre)}
            >
              {moreChangedCardStatus ? "접기" : "더보기"}
            </a>
          </div>
        }
        content={
          <ChangedCardStatusTable
            numberOfCards={resultOfSession.numCards}
            changedCardStatus={resultOfSession.statusChange}
            more={moreChangedCardStatus}
          />
        }
      />
      <ResultForStudy
        title="사용자 플래그 변경"
        content={
          <ChangedFlagTable changedFlag={resultOfSession.userFlagChange} />
        }
      />
    </div>
  );
};

const StyledAntSelect = styled(Select)`
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
    border-right-width: 1px !important;
    outline: 0;
  }

  .ant-select-selection-item {
    font-size: 1.4rem;
    font-weight: 600;
  }
`;

const SummaryTag = ({ title, content }) => (
  <div className="flex flex-col gap-[2px]">
    <div className="text-base text-center font-[600] border border-gray-200  bg-slate-100">
      {title}
    </div>
    <div className="text-base text-center font-[600] text-[1.16667rem]  py-[10px] border border-gray-200">
      {content}
    </div>
  </div>
);

const SummaryTags = () => {
  const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));

  const { completed, hold, ing, yet } = resultOfSession.numCards;

  const totalGap =
    Math.round(resultOfSession.levelChange.total.gap * 100) / 100;

  const time = prettyMilliseconds(
    JSON.parse(sessionStorage.getItem("resultOfSession")).studyHour,
    { colonNotation: true, secondsDecimalDigits: 0 }
  );
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
        break;
    }
  };
  return (
    <div className="grid w-full grid-cols-3 grid-rows-2 gap-4">
      <SummaryTag
        title={"학습 시작"}
        content={moment(sessionStorage.getItem("started")).format("M.D hh:mm")}
      />
      <SummaryTag
        title={"학습 종료"}
        content={moment(sessionStorage.getItem("endTimeOfSession")).format(
          "M.D hh:mm"
        )}
      />
      <SummaryTag title={"실제 학습 시간"} content={displayTime(time)} />
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
              return "" + totalGap;
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
  const [cardIdForMore, setCardIdForMore] = useState();
  const [cardContent, setCardContent] = useState(null);

  const getThirdCol =
    contentType === "clickedTimes"
      ? function (card) {
          return card.studyStatus.clickTimesInSession;
        }
      : function (card) {
          const time = prettyMilliseconds(card.studyStatus.studyHourInSession, {
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
                break;
            }
          };

          return displayTime(time);
        };

  return (
    <table className="w-full table-fixed" cellPadding={0} cellSpacing={0}>
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[10%]">순위</th>
          <th className="text-[1rem] font-normal bg-slate-100">앞면</th>
          {contentType !== "newCards" && (
            <th className="text-[1rem] font-normal bg-slate-100 w-[23%]">
              {contentType === "clickedTimes" ? "총 학습횟수" : "총 학습시간"}
            </th>
          )}
          <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
            카드보기
          </th>
        </tr>
      </thead>
      <tbody>
        {cards.length > 0 &&
          cards.map((card, index) => (
            <Fragment key={card._id}>
              <tr className="border-b border-collapse border-b-gray-200">
                <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
                  {new String(
                    contents.find(
                      (content) =>
                        content._id === card.content.mycontent_id ||
                        content._id === card.content.buycontent_id
                    ).face1
                  ).replace(/(<([^>]+)>)/gi, "")}
                </td>
                {contentType !== "newCards" && (
                  <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                    {getThirdCol(card)}
                  </td>
                )}
                <td
                  className="text-[1rem] py-[4px] font-normal text-center"
                  onClick={() => {
                    if (cardIdForMore !== card._id) {
                      setCardIdForMore(card._id);
                      setCardContent({
                        contents: contents.find(
                          (content) =>
                            content._id === card.content.mycontent_id ||
                            content._id === card.content.buycontent_id
                        ),
                        type: card.card_info.cardtype,
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
                  <a>{cardIdForMore === card._id ? "접기" : "보기"}</a>
                </td>
              </tr>
              {cardContent && cardIdForMore === card._id && (
                <tr className="border-b border-collapse border-b-gray-200">
                  <td
                    colSpan={contentType !== "newCards" ? 4 : 3}
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
          ))}
        {cards.length === 0 && contentType === "newCards" && (
          <tr className="border-b border-collapse border-b-gray-200">
            <td
              className="text-[1rem] py-[4px] font-normal text-center"
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

const MyModal = (props) => <Modal {...props} />;

const StudyResult = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  const [visibleClickedTimesPage, setVisibleClickedTimesPage] = useState(false);
  const [visibleElapsedTimeOnCard, setVisibleElapsedTimeOnCard] =
    useState(false);

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
      const insertedCardList = JSON.parse(
        sessionStorage.getItem("cardListStudying")
      );
      const createdCards = JSON.parse(sessionStorage.getItem("createdCards"));

      const rankingCardListByNumberOfClickCard = insertedCardList
        .filter((card) => card.studyStatus.isUpdated)
        .sort(
          (a, b) =>
            b.studyStatus.clickTimesInSession -
            a.studyStatus.clickTimesInSession
        );
      const topFiveClicked = rankingCardListByNumberOfClickCard.filter(
        (_, i) => i < 5
      );

      const rankingCardListByElapsedTimeOnCard = insertedCardList
        .filter((card) => card.studyStatus.isUpdated)
        .sort(
          (a, b) =>
            b.studyStatus.studyHourInSession - a.studyStatus.studyHourInSession
        );
      const topFiveStudyHour = rankingCardListByElapsedTimeOnCard.filter(
        (_, i) => i < 5
      );
      const fiveCreatedCards = createdCards.filter((_, i) => i < 5);

      return {
        rankingCardListByNumberOfClickCard,
        topFiveClicked,
        rankingCardListByElapsedTimeOnCard,
        topFiveStudyHour,
        fiveCreatedCards,
      };
    }
  }, [ISSERVER]);

  useEffect(() => {
    if (!ISSERVER) {
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

  const closeClickedTimesPage = () => {
    setVisibleClickedTimesPage(false);
  };
  const closeElapsedTimeOnCard = () => {
    setVisibleElapsedTimeOnCard(false);
  };

  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px]">
          {isMounted &&
            data &&
            data.mycontent_getMycontentByMycontentIDs &&
            data.mycontent_getMycontentByMycontentIDs.mycontents && (
              <div className="w-full flex flex-col gap-[8px]">
                <ResultForStudy title="요약" content={<SummaryTags />} />
                <ResultForStudy
                  title={
                    <div className="flex items-end space-x-3">
                      <div>학습 횟수 많은 카드</div>
                      <a
                        className="text-[1rem] text-blue-700"
                        onClick={() => setVisibleClickedTimesPage(true)}
                      >
                        더보기
                      </a>
                      <SlidingPage
                        cards={
                          topFiveCardsBySubject.rankingCardListByNumberOfClickCard
                        }
                        closeDrawer={closeClickedTimesPage}
                        visible={visibleClickedTimesPage}
                        contentType={"clickedTimes"}
                      />
                    </div>
                  }
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
                  title={
                    <div className="flex items-end space-x-3">
                      <div>학습 시간 많은 카드</div>
                      <a
                        className="text-[1rem] text-blue-700"
                        onClick={() => setVisibleElapsedTimeOnCard(true)}
                      >
                        더보기
                      </a>
                      <SlidingPage
                        cards={
                          topFiveCardsBySubject.rankingCardListByElapsedTimeOnCard
                        }
                        closeDrawer={closeElapsedTimeOnCard}
                        visible={visibleElapsedTimeOnCard}
                        contentType={"studyHours"}
                      />
                    </div>
                  }
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

const SlidingPage = ({ visible, closeDrawer, cards, contentType }) => {
  const [mountCounter, setMountCounter] = useState(0);

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

  useEffect(() => {
    if (visible && mountCounter < 3) {
      setMountCounter((pre) => pre + 1);
    }
  }, [visible, mountCounter]);

  useEffect(() => {
    if (mountCounter === 1 && visible) {
      if (cards.filter((card) => card.content.location === "my").length > 0) {
        getMyCardsContent({
          variables: {
            mycontent_ids: cards
              .filter((card) => card.content.location === "my")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
      if (cards.filter((card) => card.content.location === "buy").length > 0) {
        getBuyCardsContent({
          variables: {
            buycontent_ids: cards
              .filter((card) => card.content.location === "buy")
              .map((card) => card.content.mycontent_id),
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mountCounter]);

  return (
    <DrawerWrapper
      title={
        contentType === "clickedTimes"
          ? "학습 횟수 많은 카드"
          : "학습 시간 많은 카드"
      }
      placement="bottom"
      width={"100%"}
      height={"calc(100vh - 39px)"}
      mask={false}
      visible={visible}
      onClose={closeDrawer}
      zIndex={10}
    >
      {data && data.mycontent_getMycontentByMycontentIDs && (
        <TableForTop5ClickedResult
          cards={cards}
          myContents={data.mycontent_getMycontentByMycontentIDs.mycontents}
          contentType={contentType}
          buyContents={
            !buyContentsData
              ? []
              : buyContentsData.buycontent_getBuycontentByBuycontentIDs
                  .buycontents
          }
        />
      )}
    </DrawerWrapper>
  );
};

const DrawerWrapper = styled(Drawer)`
  top: 39px;
  /* height: calc(100vh - 40px); */
  .ant-drawer-header {
    padding: 8px 12px 4px 8px;
  }

  .ant-drawer-close {
    font-size: 1.166667rem;
  }
  & .ant-drawer-title {
    font-size: 1.166667rem;
  }
  & .ant-drawer-body {
    padding: 10px 12px;
    background: #ffffff;
  }
  .ant-drawer-content-wrapper {
    transition: transform 1.3s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 1.3s cubic-bezier(0.23, 1, 0.32, 1);
  }
`;
