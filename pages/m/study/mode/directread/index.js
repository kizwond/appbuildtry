import React, { useEffect, useState } from "react";
import StudyLayout from "../../../../../components/layout/StudyLayout";
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
    if(query.name){
        var book_ids = JSON.parse(query.name).map((item) => item.book_id);
        // console.log(book_ids);
    }
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = JSON.parse(sessionStorage.getItem("books_selected"));
    var book_ids = book_id.map((item) => item.book_id);
    // console.log(book_ids);
  } 

  const [indexChanged, setIndexChanged] = useState();
  const [indexSetId, setIndexSetId] = useState();
  const [indexSets, setIndexSets] = useState();

  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_ids: book_ids },
  });

  const index_changed = (value) => {
    console.log("index changed!!!!----------------------->", value);
    setIndexChanged(value);
  };

  useEffect(() => {
    if (data) {
      console.log(data);
      localStorage.removeItem("first_index");
      localStorage.setItem("first_index", data.indexset_getByMybookids.indexsets[0].indexes[0]._id);
      setIndexChanged(data.indexset_getByMybookids.indexsets[0].indexes[0]._id);
      setIndexSetId(data.indexset_getByMybookids.indexsets[0]._id);
      setIndexSets(data.indexset_getByMybookids.indexsets);
    }
  }, [data]);

  return (
    <>
      <StudyLayout>
        <div style={{width: "90%", margin: "auto", marginBottom: "120px", marginTop: "50px" }}>
          <DirectReadContainer FroalaEditorView={FroalaEditorView} indexChanged={indexChanged} index_changed={index_changed} indexSets={indexSets}/>
        </div>
      </StudyLayout>
    </>
  );
};
export default SessionSetting;
