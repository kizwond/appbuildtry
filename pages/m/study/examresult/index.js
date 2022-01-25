import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import Head from "next/head";
import { useEffect } from "react";
import M_Layout from "../../../../components/layout/M_Layout";

import { QUERY_MY_CARD_CONTENTS } from "../../../../graphql/query/allQuery";
const ExamResult = () => {
  const cards =
    typeof window === "undefined"
      ? []
      : JSON.parse(sessionStorage.getItem("examLog"));
  console.log({ cards });

  const ISSERVER = typeof window === "undefined";

  return (
    <>
      <Head>
        <title>Result - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <M_Layout>
        <div className="w-full mx-auto absolute top-[40px] h-[calc(100vh_-_40px)] overflow-y-auto px-[8px] min-w-[360px] pb-[15px] pt-[8px]">
          {!ISSERVER && <CardResultWrapper cards={cards} />}
        </div>
      </M_Layout>
    </>
  );
};

export default ExamResult;

const CardResult = ({ face1, answer, face2, cardId }) => (
  <div className="flex border border-gray-300 border-solid rounded">
    <div className="flex items-center justify-center border-r basis-14 border-r-gray-300">
      n
    </div>

    <div className="flex-auto min-w-0 p-2 border-r border-r-gray-300">
      <div className="flex text-base">
        <div className="flex-none w-12">앞면 :</div>
        <div className="truncate">{face1}</div>
      </div>
      <div className="flex text-base">
        <div className="flex-none w-12">입력 :</div>
        <div className="truncate">{answer}</div>
      </div>
      <div className="flex text-base">
        <div className="flex-none w-12">정답 :</div>
        <div className="truncate">{face2}</div>
      </div>
    </div>

    <div className="flex items-center justify-center grow-0 shrink-0 basis-16">
      {face2.indexOf(" ") > -1 ? (
        <CheckOutlined className="text-[2.5rem]" />
      ) : (
        <CloseOutlined className="text-[2.5rem]" />
      )}
    </div>
  </div>
);

const CardResultWrapper = ({ cards }) => {
  const { data, loading, error } = useQuery(QUERY_MY_CARD_CONTENTS, {
    onCompleted: (data) => {
      console.log(data);
    },
    variables: {
      mycontent_ids: cards
        .filter((card) => card.card_info.content.location === "my")
        .map((card) => card.card_info.content.mycontent_id),
      buycontent_ids: cards
        .filter((card) => card.card_info.content.location === "buy")
        .map((card) => card.card_info.content.buycontent_id),
    },
  });

  const contentData = [
    ...data.mycontent_getMycontentByMycontentIDs.mycontents,
    ...data.buycontent_getBuycontentByBuycontentIDs.buycontents,
  ];

  return (
    <div className="flex flex-col gap-[8px]">
      {data &&
        cards.map((card) => {
          const frontOfCard = new String(card.content).replace(
            /(<([^>]+)>)/gi,
            ""
          );
          const face2 = new String(
            contentData.find((content) => {
              return (
                content._id === card.card_info.content.mycontent_id ||
                content._id === card.card_info.content.buycontent_id
              );
            }).face2
          ).replace(/(<([^>]+)>)/gi, "");
          return (
            <CardResult
              key={card.cardId}
              face1={frontOfCard}
              answer={card.answer}
              face2={face2}
            />
          );
        })}
    </div>
  );
};
