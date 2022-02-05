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
      const newArray = [
        ...contents.data.mycontent_getMycontentByMycontentIDs.mycontents,
        ...contents.data.buycontent_getBuycontentByBuycontentIDs.buycontents,
      ];
    },
  });

  const getTTSData = async () => {
    const cardListStudyingOrigin = JSON.parse(
      sessionStorage.getItem("cardListStudyingOrigin")
    );

    
    const contents = await getContentsByContentIds({
      variables: {
        mycontent_ids: [],
        buycontent_ids: [],
      },
    });

    // const readModeTTSOption = JSON.parse(
    //   sessionStorage.getItem("readModeTTSOption")
    // );
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
