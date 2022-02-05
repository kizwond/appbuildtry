import { SoundOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

const TTSButton = () => {
  const getTTSData = () => {
    const readModeTTSOption = JSON.parse(
      sessionStorage.getItem("readModeTTSOption")
    );
    const cardListStudyingOrigin = JSON.parse(
      sessionStorage.getItem("cardListStudyingOrigin")
    );
    console.log({ readModeTTSOption, cardListStudyingOrigin });
  };

  const [getContentsByContentIds, { loading: loading2, error: error2, data }] =
    useLazyQuery(QUERY_MY_CARD_CONTENTS, { onCompleted: afterGetContent });

  const newArray = data
    ? [
        ...contentsList,
        ...data.mycontent_getMycontentByMycontentIDs.mycontents,
        ...data.buycontent_getBuycontentByBuycontentIDs.buycontents,
      ]
    : [];

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
