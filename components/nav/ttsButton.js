import { SoundOutlined, PauseOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { QUERY_MY_CARD_CONTENTS } from "../../graphql/query/allQuery";
import { detect, detectAll } from "tinyld";
import _ from "lodash";
import decodeHtMLEntities from "../common/logic/decodeHtMLEntities";

const TTSButton = ({ ttsOn, setTtsOn }) => {
  const [ttsArray, setTtsArray] = useState([]);
  const [paused, setPaused] = useState(false);

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
      const contentsListSortedByCardSeq = cardListStudying.map((card) => contents.find((content) => (content._id === card.content.mycontent_id||content._id === card.content.buycontent_id)));
      console.log({ contentsListSortedByCardSeq });

      const seperateEngAndKor = (str) => {
        const arrayForTTS = [];

        while (str.length > 0) {
          const positionOfEnglish = str.search(/[a-zA-Z]/) == -1 ? 1000000 : str.search(/[a-zA-Z]/);
          const positionOfKorean = str.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/) == -1 ? 1000000 : str.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/);

          const targetPosition = Math.max(positionOfEnglish, positionOfKorean);
          const singleParagraph = str.substring(0, targetPosition);

          str = str.replace(singleParagraph, "");

          arrayForTTS.push(singleParagraph);
        }

        return arrayForTTS;
      };

      const tts = contentsListSortedByCardSeq.map((content) => {
        let arr = [];
        content.face1.forEach((c, i) => {
          if (
            readModeTTSOption.faceOneTTS[i + 1] &&
            content.face1 !== null &&
            content.face1.length > 0
          ) {
            const contentOnlyString = decodeHtMLEntities(c).replace(
              /\/|\~/g,
              " "
            );
            const seperatedWithEngAndKor = seperateEngAndKor(contentOnlyString);
            arr.push(seperatedWithEngAndKor);
          }
        });

        if (readModeTTSOption.faceOneTTS.selection && content.selection !== null && content.selection.length > 0) {
          content.selection.forEach((c, i) => {
            const contentWithoutTags = decodeHtMLEntities(c).replace(
              /\/|\~/g,
              " "
            );
            arr.push(`${i + 1} ${seperateEngAndKor(contentWithoutTags)}`);
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
                  ? "정답 " + decodeHtMLEntities(c).replace(/\/|\~/g, " ")
                  : decodeHtMLEntities(c).replace(/\/|\~/g, " ");
              arr.push(seperateEngAndKor(contentWithoutTags));
            }
          });
        }

        return arr;
      });

      const flattenContents = _.flattenDeep(tts);
      setTtsArray(flattenContents);
      console.log(flattenContents);
    },
  });

  const speakText = (ttsArray) => {
    window.speechSynthesis.cancel();
    const readModeTTSOption = JSON.parse(sessionStorage.getItem("readModeTTSOption"));
    if (ttsArray.length > 0) {
      ttsArray.map((item, index) => {
        
        var detected = detect(item);
        console.log(index, detected);
        if (!["ko", "en"].includes(detected)) {
          var lang = "en";
        } else {
          lang = detected;
        }
        const speechMsg = new SpeechSynthesisUtterance();
        // speechMsg.rate = readModeTTSOption.rate; // 속도: 0.1 ~ 10
        // speechMsg.pitch = readModeTTSOption.pitch; // 음높이: 0 ~ 2
        speechMsg.rate = 1; // 속도: 0.1 ~ 10
        speechMsg.pitch = 1; // 음높이: 0 ~ 2
        speechMsg.lang = lang;
        speechMsg.text = item;
        window.speechSynthesis.speak(speechMsg);
      });
      // sessionStorage.removeItem("ttsOrder");
      // ttsOption 변경시 리셋
      // 목차 변경시 리셋
    }
  };

  // 유즈이펙트로 tts 데이터 변경될 때만 읽어주면 됨
  useEffect(() => {
    if (ttsArray.length > 0) {
      console.log("여기서 tts 라이브러리 실행 해주삼.");
      console.log("ttsArray===================>", ttsArray);
      speakText(ttsArray);
    }

    return () => {
      //  라이브러리 종료 될 때 메모리에서 제거하기 위해서는 여기에 무슨 코드를 넣어야할 수도 있음.
      // 끝나면 cleanup함수를 호출해야 할 수도?? https://react.vlpt.us/basic/16-useEffect.html
      // 잘 모르겠음. 지난번에 음성이 다른 페이지에서도 계속 나왔던 기억이 있어서 ... ~~🤭🤭
    };
  }, [ttsArray]);

  const getTTSData = async () => {
    setTtsOn(true);
    const cardListStudyingOrigin = JSON.parse(sessionStorage.getItem("cardListStudyingOrigin"));
    const mycontent_ids = cardListStudyingOrigin.filter((card) => card.content.location === "my").map((card) => card.content.mycontent_id);
    const buycontent_ids = cardListStudyingOrigin.filter((card) => card.content.location === "buy").map((card) => card.content.buycontent_id);

    getContentsByContentIds({
      variables: {
        mycontent_ids,
        buycontent_ids,
      },
    });

    // console.log({ readModeTTSOption, cardListStudyingOrigin });
  };

  const getTTSDataPause = async () => {
    console.log("pause clicked!!!");
    window.speechSynthesis.pause();
    setPaused(true);
  };

  const continueTTS = async () => {
    console.log("continueTTS clicked!!!");
    window.speechSynthesis.resume();
    setPaused(false);
  };

  return (
    <>
      {ttsOn === true && paused === false&& (
        <>
          <Button
            size="small"
            onClick={getTTSDataPause}
            style={{
              fontSize: "1rem",
              borderRadius: "5px",
              marginRight: "5px",
            }}
            type="primary"
            icon={<PauseOutlined />}
          />
        </>
      )}
      {ttsOn === false && paused === false && (
        <>
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
        </>
      )}
      {paused === true && (
        <>
          <Button
            size="small"
            onClick={continueTTS}
            style={{
              fontSize: "1rem",
              borderRadius: "5px",
              marginRight: "5px",
            }}
            type="primary"
            icon={<SoundOutlined />}
          >
            재개
          </Button>
        </>
      )}
    </>
  );
};

export default TTSButton;
