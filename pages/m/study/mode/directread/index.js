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
    // const ttsUse = sessionStorage.getItem("ttsUse");
    // if (ttsUse === null) {
    //   if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
    //     console.log("이 브라우저는 음성 합성을 지원하지 않습니다.");
    //     sessionStorage.setItem("ttsUse", "unable");
    //   } else {
    //     sessionStorage.setItem("ttsUse", "able");
    //   }
    // }
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
