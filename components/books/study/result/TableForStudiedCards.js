import prettyMilliseconds from "pretty-ms";
import { Fragment, useState } from "react";

const TableForStudiedCards = ({
  cards,
  myContents,
  buyContents,
  contentType,
}) => {
  const contents = [...myContents, ...buyContents];
  const [cardIdForMore, setCardIdForMore] = useState();
  const [cardContent, setCardContent] = useState(null);

  const getThirdCol =
    contentType === "changedLevel"
      ? function (card) {
          return card.studyStatus.levelOriginal;
        }
      : contentType === "clickedTimes"
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

  const getCardStatusForResult = (recentSelection, ratio) => {
    switch (recentSelection) {
      case "difficulty":
        return ratio;

      case "restore":
        return "복원";

      case "hold":
        return "보류";

      case "completed":
        return "졸업";

      case "move":
        return "이동";

      case "finish":
        return "종료";

      case "pass":
        return "통과";

      default:
        throw new Error(`${recentSelection} 는 알수 없는 결과입니다`);
    }
  };

  return (
    <table className="w-full table-fixed" cellPadding={0} cellSpacing={0}>
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[10%]">순위</th>
          <th className="text-[1rem] font-normal bg-slate-100">앞면</th>
          {contentType !== "newCards" && (
            <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
              {contentType === "changedLevel"
                ? "기존레벨"
                : contentType === "clickedTimes"
                ? "학습횟수"
                : "학습시간"}
            </th>
          )}
          {contentType === "clickedCard" && (
            <th className="text-[1rem] font-normal bg-slate-100 w-[13%]">
              선택
            </th>
          )}
          {contentType === "changedLevel" && (
            <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
              변경레벨
            </th>
          )}
          <th className="text-[1rem] font-normal bg-slate-100 w-[13%]"></th>
        </tr>
      </thead>
      <tbody>
        {cards.length > 0 &&
          cards.map((card, index) => (
            <Fragment key={card._id + index}>
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
                {contentType === "clickedCard" && (
                  <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                    {getCardStatusForResult(
                      card.studyStatus.recentSelection,
                      card.studyStatus.recentStudyRatio
                    )}
                  </td>
                )}
                {contentType === "changedLevel" && (
                  <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                    {card.studyStatus.levelCurrent}
                  </td>
                )}
                <td
                  className="text-[1rem] py-[4px] font-normal text-center"
                  onClick={() => {
                    if (cardIdForMore !== card._id + index) {
                      setCardIdForMore(card._id + index);
                      setCardContent({
                        contents: contents.find(
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
                  <a>{cardIdForMore === card._id + index ? "접기" : "보기"}</a>
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

export default TableForStudiedCards;
