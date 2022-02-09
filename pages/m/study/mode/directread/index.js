import React, { useCallback, useEffect, useState } from "react";
import DirectReadLayout from "../../../../../components/layout/DirectReadLayout";
import dynamic from "next/dynamic";
import DirectReadContainer from "../../../../../components/books/study/mode/directread/DirectReadContainer";
import { useQuery } from "@apollo/client";
import { GetIndex } from "../../../../../graphql/query/bookIndex";
import { useRouter } from "next/router";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const SessionSetting = () => {
  const { query } = useRouter();
  if (query.name) {
    var book_ids = JSON.parse(query.name).map((item) => item.book_id);
    // console.log(book_ids);
  }
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = JSON.parse(sessionStorage.getItem("books_selected"));
    var book_ids = book_id.map((item) => item.book_id);
    // console.log(book_ids);
    const ttsUse = sessionStorage.getItem("ttsUse");
    if (ttsUse === null) {
      if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
        console.log("이 브라우저는 음성 합성을 지원하지 않습니다.");
        sessionStorage.setItem("ttsUse", "unable");
      } else {
        sessionStorage.setItem("ttsUse", "able");
      }
    }
  }

  const [indexChanged, setIndexChanged] = useState();
  const [indexSetId, setIndexSetId] = useState();
  const [indexSets, setIndexSets] = useState();
  const [ttsOn, setTtsOn] = useState(false);

  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_ids: book_ids },
  });

  const index_changed = (value) => {
    console.log("index changed!!!!----------------------->", value);
    setIndexChanged(value);
  };

  // function setSpeech() {
  //   return new Promise(function (resolve, reject) {
  //     let synth = window.speechSynthesis;
  //     let id;

  //     id = setInterval(() => {
  //       if (synth.getVoices().length !== 0) {
  //         resolve(synth.getVoices());
  //         clearInterval(id);
  //       }
  //     }, 100);
  //   });
  // }
  // const speakText = useCallback(() => {
  //   window.speechSynthesis.cancel();
  //   let voiceEn = [];
  //   let voiceKo = [];
  //   let s = setSpeech();
  //   s.then((voices) => {
  //     console.log(voices);
  //     voiceEn = voices.filter((item) => item.lang === "en-US");
  //     voiceKo = voices.filter((item) => item.lang === "ko-KR" && item.voiceURI !== "Microsoft Heami - Korean (Korean)");
  //   });

  //   const readModeTTSOption = JSON.parse(sessionStorage.getItem("readModeTTSOption"));

  //   console.log(voiceEn);
  //   console.log(voiceEn);
  //   let lang = "ko";
  //   const speechMsg = new SpeechSynthesisUtterance();
  //   speechMsg.rate = readModeTTSOption.rate; // 속도: 0.1 ~ 10
  //   speechMsg.pitch = readModeTTSOption.pitch; // 음높이: 0 ~ 2
  //   // speechMsg.rate = 1; // 속도: 0.1 ~ 10
  //   // speechMsg.pitch = 1; // 음높이: 0 ~ 2
  //   speechMsg.lang = "ko";
  //   speechMsg.text = "학습을 시작합니다.";
  //   if (lang === "ko") {
  //     speechMsg.voice = voiceKo[0];
  //   } else if (lang === "en") {
  //     speechMsg.voice = voiceEn[0];
  //   }
  //   window.speechSynthesis.speak(speechMsg);
  // }, []);

  useEffect(() => {
    if (data) {
      const isFinished = sessionStorage.getItem("isFinished");
      if (isFinished === "true") {
        alert("학습이 종료되었습니다. 메인화면으로 이동합니다.");
        window.location.href = "/";
      }
      console.log(data);
      localStorage.removeItem("first_index");
      localStorage.setItem("first_index", data.indexset_getByMybookids.indexsets[0].indexes[0]._id);
      setIndexChanged(data.indexset_getByMybookids.indexsets[0].indexes[0]._id);
      setIndexSetId(data.indexset_getByMybookids.indexsets[0]._id);
      setIndexSets(data.indexset_getByMybookids.indexsets);

      // speakText();
    }
  }, [data]);

  return (
    <>
      <DirectReadLayout mode="책" indexChanged={indexChanged} index_changed={index_changed} indexSets={indexSets} ttsOn={ttsOn} setTtsOn={setTtsOn}>
        <div style={{ marginBottom: "120px", marginTop: "50px" }}>
          <DirectReadContainer FroalaEditorView={FroalaEditorView} indexChanged={indexChanged} index_changed={index_changed} indexSets={indexSets} />
        </div>
      </DirectReadLayout>
    </>
  );
};
export default SessionSetting;
