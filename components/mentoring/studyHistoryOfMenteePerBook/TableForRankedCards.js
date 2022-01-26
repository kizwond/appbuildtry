import { useQuery } from "@apollo/client";
import prettyMilliseconds from "pretty-ms";
import { Fragment, useState } from "react";
import { QUERY_MY_CARD_CONTENTS } from "../../../graphql/query/allQuery";

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

export default TableForRankedCards;
