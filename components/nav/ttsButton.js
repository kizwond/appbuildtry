import { SoundOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button } from "antd";
import React from "react";
import { QUERY_MY_CARD_CONTENTS } from "../../graphql/query/allQuery";

const TTSButton = () => {
  // const [getContentsByContentIds, { loading: loading2, error: error2, data }] =
  //   useLazyQuery(QUERY_MY_CARD_CONTENTS);

  // const getTTSData = async () => {
  //   getContentsByContentIds({
  //     variables: {
  //       mycontent_ids: [],
  //       buycontent_ids: [],
  //     },
  //   }).then();
  //   console.log(contents);
  // const newArray =
  //    [

  //       ...contents.data.mycontent_getMycontentByMycontentIDs.mycontents,
  //       ...contents.data.buycontent_getBuycontentByBuycontentIDs.buycontents,
  //     ]

  // const readModeTTSOption = JSON.parse(
  //   sessionStorage.getItem("readModeTTSOption")
  // );
  // const cardListStudyingOrigin = JSON.parse(
  //   sessionStorage.getItem("cardListStudyingOrigin")
  // );
  // console.log({ readModeTTSOption, cardListStudyingOrigin });
  // };

  return (
    <Button
      size="small"
      // onClick={getTTSData}
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
