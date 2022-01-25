import React, { Fragment, useState } from "react";

const TableRowRanked = ({ contentsData, card, index, getThirdCol }) => {
  const [isShowedCard, setIsShowedCard] = useState();
  const [cardContent, setCardContent] = useState(null);

  return (
    <Fragment>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
          {index + 1}
        </td>
        <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
          {new String(
            contentsData.find(
              (content) =>
                content._id === card.content.mycontent_id ||
                content._id === card.content.buycontent_id
            ).face1[0]
          ).replace(/(<([^>]+)>)/gi, "")}
        </td>
        <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
          {getThirdCol(card)}
        </td>
        <td
          className="text-[1rem] py-[4px] font-normal text-center"
          onClick={() => {
            if (isShowedCard) {
              setCardContent(null);
              setIsShowedCard(false);
            } else {
              setIsShowedCard(true);
              setCardContent({
                contents: contentsData.find(
                  (content) =>
                    content._id === card.content.mycontent_id ||
                    content._id === card.content.buycontent_id
                ),
                makerFlag: card.content.makerFlag,
                userFlag: card.content.userFlag,
                memo: card.content.memo,
              });
            }
          }}
        >
          →
        </td>
      </tr>
      {isShowedCard && (
        <tr className="border-b border-collapse border-b-gray-200">
          <td colSpan={4} className="p-2 text-[1rem]">
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
                  <span className="ml-1">{cardContent.makerFlag.comment}</span>
                </div>
              )}

              <div className="w-full pl-2">
                {cardContent.contents.face1.map((p, i) => (
                  <div key={i} dangerouslySetInnerHTML={{ __html: p }}></div>
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
};

export default TableRowRanked;
