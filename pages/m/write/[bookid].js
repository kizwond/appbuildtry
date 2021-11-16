import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import M_Layout from "../../../components/layout/M_Layout";
import M_LeftDrawer from "../../../components/books/write/editpage/M_LeftDrawer";
import { GetIndex } from "../../../graphql/query/bookIndex";
import { useQuery } from "@apollo/client";
import M_WriteContainer from "../../../components/books/write/editpage/M_WriteContainer";

import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../../components/books/write/editpage/Editor"), {
  ssr: false,
});
const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const EditorFromCard = dynamic(() => import("../../../components/books/write/editpage/EditorFromCard"), {
  ssr: false,
});

const Book = () => {
  const { query } = useRouter();
  console.log(query);
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var bookid = localStorage.getItem("book_id");
    if (query.bookid === undefined) {
      var book_id = bookid;
    } else {
      book_id = query.bookid;
    }
  } 

  const [indexChanged, setIndexChanged] = useState();
  const [indexSetId, setIndexSetId] = useState();

  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_ids: [book_id] },
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
    }
  }, [data]);

  return (
    <>
      {indexSetId && (
        <>
          <M_Layout>
            <M_LeftDrawer index_changed={index_changed} book_id={book_id} />
            <M_WriteContainer
              book_id={book_id}
              indexChanged={indexChanged}
              indexSetId={indexSetId}
              Editor={Editor}
              EditorFromCard={EditorFromCard}
              FroalaEditorView={FroalaEditorView}
            />
          </M_Layout>
        </>
      )}
    </>
  );
};
export default Book;
