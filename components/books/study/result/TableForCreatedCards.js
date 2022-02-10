import { Fragment, useState } from "react";
import decodeHtMLEntities from "../../../common/logic/decodeHtMLEntities";

const TableForCreatedCards = ({ cards, myContents }) => {
  console.log(cards);
  const [cardIdForMore, setCardIdForMore] = useState();
  const [cardContent, setCardContent] = useState(null);

  return (
    <table className="w-full table-fixed" cellPadding={0} cellSpacing={0}>
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] bg-slate-100 w-[10%]">순서</th>
          <th className="text-[1rem] bg-slate-100">앞면</th>

          <th className="text-[1rem] bg-slate-100 w-[13%]"></th>
        </tr>
      </thead>
      <tbody>
        {cards.length > 0 &&
          cards.map((card, index) => (
            <Fragment key={card.mycontent_id}>
              <tr className="border-b border-collapse border-b-gray-200">
                <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                  {index + 1}
                </td>
                <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
                  {decodeHtMLEntities(
                    myContents.find((content) => {
                      return content._id === card.mycontent_id;
                    }).face1[0]
                  )}
                </td>

                <td
                  className="text-[1rem] py-[4px] text-center"
                  onClick={() => {
                    if (cardIdForMore !== card.mycontent_id + index) {
                      setCardIdForMore(card.mycontent_id + index);
                      setCardContent({
                        contents: myContents.find(
                          (content) => content._id === card.mycontent_id
                        ),
                      });
                    } else {
                      setCardContent(null);
                      setCardIdForMore("");
                    }
                  }}
                >
                  <a>
                    {cardIdForMore === card.mycontent_id + index
                      ? "접기"
                      : "보기"}
                  </a>
                </td>
              </tr>
              {cardContent && cardIdForMore === card.mycontent_id + index && (
                <tr className="border-b border-collapse border-b-gray-200">
                  <td colSpan={3} className="p-2 text-[1rem]">
                    <div className="w-full p-2 bg-gray-100">
                      <div className="font-[500]">카드 내용 :</div>

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
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        {cards.length === 0 && (
          <tr className="border-b border-collapse border-b-gray-200">
            <td colSpan={3} className="p-2 text-[1rem] text-center">
              새로 생성한 카드가 없습니다
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableForCreatedCards;
