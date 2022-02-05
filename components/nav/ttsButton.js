import { SoundOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button } from "antd";
import React from "react";
import { useEffect } from "react";
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
          if (
            readModeTTSOption.faceOneTTS[i + 1] &&
            content.face1 !== null &&
            content.face1.length > 0
          ) {
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
          content.selection.forEach((c, i) => {
            const contentWithoutTags = c
              .replace(/(<([^>]+)>)/gi, "")
              .replace(/&nbsp;/g, "");
            arr.push(`보기${i + 1}번 ${contentWithoutTags}`);
          });
        }
        if (content.face2 !== null || content.face2.length > 0) {
          content.face2.forEach((c, i) => {
            if (readModeTTSOption.faceTwoTTS[i + 1]) {
              const contentWithoutTags =
                i === 0 &&
                readModeTTSOption.faceOneTTS.selection &&
                content.selection !== null &&
                content.selection.length > 0
                  ? "정답은 " +
                    c.replace(/(<([^>]+)>)/gi, "").replace(/&nbsp;/g, "") +
                    "번 입니다."
                  : c.replace(/(<([^>]+)>)/gi, "").replace(/&nbsp;/g, "");
              arr.push(contentWithoutTags);
            }
          });
        }

        return arr;
      });

      const flattenContents = tts.flat();
      setTtsArray(flattenContents);
      console.log(flattenContents);
    },
  });

  // 유즈이펙트로 tts 데이터 변경될 때만 읽어주면 됨
  useEffect(() => {
    if (ttsArray.length > 0) {
      console.log("여기서 tts 라이브러리 실행 해주삼.");
    }

    return () => {
      //  라이브러리 종료 될 때 메모리에서 제거하기 위해서는 여기에 무슨 코드를 넣어야할 수도 있음.
      // 끝나면 cleanup함수를 호출해야 할 수도?? https://react.vlpt.us/basic/16-useEffect.html
      // 잘 모르겠음. 지난번에 음성이 다른 페이지에서도 계속 나왔던 기억이 있어서 ... ~~🤭🤭
    };
  }, [ttsArray]);

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
