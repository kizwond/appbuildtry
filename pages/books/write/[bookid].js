import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout/Layout";

import LeftDrawer from "../../../components/books/write/editpage/LeftDrawer";
import RightDrawer from "../../../components/books/write/editpage/RightDrawer";
import { GetIndex } from "../../../graphql/query/bookIndex";
import { useQuery } from "@apollo/client";
import WriteContainer from "../../../components/books/write/editpage/WriteContainer";

const Book = () => {
  const { query } = useRouter();
  console.log(query);
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var bookid = localStorage.getItem("book_id")
    if(query.bookid === undefined){
       var book_id = bookid
     } else {
       book_id = query.bookid;
     }
  } 
  
  const [indexChanged, setIndexChanged] = useState()
  const [indexSetId, setIndexSetId] = useState()
  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_id: book_id },
  });
  const index_changed = (value) => {
    console.log("index changed!!!!", value)
    setIndexChanged(value)
  }

  useEffect(() => {
    if (data) {
      console.log(data)
      localStorage.removeItem("first_index")
      localStorage.setItem("first_index", data.indexset_getbymybookid.indexsets[0].indexes[0]._id)
      setIndexChanged(data.indexset_getbymybookid.indexsets[0].indexes[0]._id)
      setIndexSetId(data.indexset_getbymybookid.indexsets[0]._id)
    }
  }, [data,indexChanged]);
  
  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <LeftDrawer index_changed={index_changed} indexChanged={indexChanged} book_id={book_id} />
        <WriteContainer indexChanged={indexChanged} indexSetId={indexSetId}/>
        <RightDrawer book_id={book_id} />
      </div>
    </Layout>
  );
};
export default Book;
