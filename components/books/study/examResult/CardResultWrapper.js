import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { QUERY_MY_CARD_CONTENTS } from "../../../../graphql/query/allQuery";
import CardResult from "./CardResult";

const CardResultWrapper = ({ cards }) => {
  const router = useRouter();
  const { data, loading, error } = useQuery(QUERY_MY_CARD_CONTENTS, {
    onCompleted: (received_data) => {
      if (received_data.mycontent_getMycontentByMycontentIDs.status === "200") {
        console.log("카드 컨텐츠 데이터 받음", received_data);
      } else if (
        received_data.mycontent_getMycontentByMycontentIDs.status === "401"
      ) {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
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

  return (
    <div className="flex flex-col gap-[8px]">
      {data &&
        cards.map((card, index) => {
          const frontOfCard = new String(card.content).replace(
            /(<([^>]+)>)/gi,
            ""
          );
          const face2 = new String(
            [
              ...data.mycontent_getMycontentByMycontentIDs.mycontents,
              ...data.buycontent_getBuycontentByBuycontentIDs.buycontents,
            ].find((content) => {
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
              seq={index + 1}
            />

            // 유사도 검사
            // <CardResult2
            //   key={card.cardId}
            //   face1={frontOfCard}
            //   answer={card.answer}
            //   face2={face2}
            //   seq={index + 1}
            // />
          );
        })}
    </div>
  );
};

export default CardResultWrapper;
