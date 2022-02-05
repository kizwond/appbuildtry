import { SoundOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button } from "antd";
import React from "react";
import { useState } from "react";
import { QUERY_MY_CARD_CONTENTS } from "../../graphql/query/allQuery";

const TTSButton = () => {
  const [ttsArray, setTtsArray] = useState([]);

  const [getContentsByContentIds] = useLazyQuery(QUERY_MY_CARD_CONTENTS, {
    onCompleted: (data) => {
      console.log(data);
      const contents = [
        ...data.mycontent_getMycontentByMycontentIDs.mycontents,
        ...data.buycontent_getBuycontentByBuycontentIDs.buycontents,
      ];
      console.log(contents);
      const cardListStudying = JSON.parse(
        sessionStorage.getItem("cardListStudying")
      );
      const contentsListSortedByCardSeq = cardListStudying.map((card) =>
        contents.find(card.content.mycontent_id)
      );
      console.log({ contentsListSortedByCardSeq });

      const readModeTTSOption = JSON.parse(
        sessionStorage.getItem("readModeTTSOption")
      );
    },
  });

  const getTTSData = async () => {
    const cardListStudyingOrigin = JSON.parse(
      sessionStorage.getItem("cardListStudyingOrigin")
    );
    const mycontent_ids = cardListStudyingOrigin
      .filter((card) => card.content.location === "my")
      .map((card) => card.content.mycontent_id);
    const buycontent_ids = cardListStudyingOrigin
      .filter((card) => card.content.location === "buy")
      .map((card) => card.content.buycontent_id);

    getContentsByContentIds({
      variables: {
        mycontent_ids,
        buycontent_ids,
      },
    });

    // console.log({ readModeTTSOption, cardListStudyingOrigin });
  };

  return (
    <Button
      size="small"
      onClick={getTTSData}
      style={{
        fontSize: "1rem",
        borderRadius: "5px",
        marginRight: "5px",
      }}
      type="primary"
      icon={<SoundOutlined />}
    />
  );
};

export default TTSButton;
