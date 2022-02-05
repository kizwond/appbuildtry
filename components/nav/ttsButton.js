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
      const readModeTTSOption = JSON.parse(
        sessionStorage.getItem("readModeTTSOption")
      );
      const cardListStudying = JSON.parse(
        sessionStorage.getItem("cardListStudying")
      );
      const contents = [
        ...data.mycontent_getMycontentByMycontentIDs.mycontents,
        ...data.buycontent_getBuycontentByBuycontentIDs.buycontents,
      ];
      console.log(contents);
      const contentsListSortedByCardSeq = cardListStudying.map((card) =>
        contents.find((content) => content._id === card.content.mycontent_id)
      );
      console.log({ contentsListSortedByCardSeq });

      const tts = contentsListSortedByCardSeq.map((content) => {
        let arr = [];
        content.face1.forEach((c, i) => {
          if (readModeTTSOption.faceOneTTS[i + 1]) {
            const contentWithoutTags = c
              .replace(/(<([^>]+)>)/gi, "")
              .replace(/&nbsp;/g, "");
            arr.push(contentWithoutTags);
          }
        });

        if (
          readModeTTSOption.faceOneTTS.selection &&
          content.selection !== null &&
          content.selection.length > 0
        ) {
          content.selection.forEach((c) => {
            const contentWithoutTags = c
              .replace(/(<([^>]+)>)/gi, "")
              .replace(/&nbsp;/g, "");
            arr.push("1" + contentWithoutTags);
          });
        }
        if (content.face2 !== null || content.face2.length > 0) {
          content.face2.forEach((c, i) => {
            if (readModeTTSOption.faceTwoTTS[i + 1]) {
              const contentWithoutTags = c
                .replace(/(<([^>]+)>)/gi, "")
                .replace(/&nbsp;/g, "");
              arr.push(contentWithoutTags);
            }
          });
        }

        return arr;
      });

      const flattenContents = tts.flat();
      console.log(flattenContents);
    },
    fetchPolicy: "network-only",
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
