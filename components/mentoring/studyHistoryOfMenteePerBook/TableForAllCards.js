import { useEffect, useMemo, useState } from "react";

import { useLazyQuery, useQuery } from "@apollo/client";
import { QUERY_MY_CARD_CONTENTS } from "../../../graphql/query/allQuery";

import prettyMilliseconds from "pretty-ms";

import TableRowRanked from "./tableCompoent/TableRowRanked";

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

export default TableForAllCards;
