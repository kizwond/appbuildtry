import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout/Layout";

import LeftDrawer from "../../../components/books/write/editpage/LeftDrawer";
import RightDrawer from "../../../components/books/write/editpage/RightDrawer";
import { GetIndex, IndexCreateMutation } from "../../../graphql/query/writemain";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import WriteContainer from "../../../components/books/write/editpage/WriteContainer";
const Book = () => {
  const { query } = useRouter();
  console.log(query);
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    const bookid = localStorage.getItem("book_id")
    console.log(bookid)
    if(bookid !== null){
      localStorage.removeItem("book_id")
      localStorage.setItem("book_id", query.bookid)
    }else{
      localStorage.setItem("book_id", query.bookid)
    }
  }

 
  
  return (
    <Layout>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <LeftDrawer book_id={query.bookid} />
        <WriteContainer book_id={query.bookid} />
        <RightDrawer book_id={query.bookid} />
      </div>
    </Layout>
  );
};
export default Book;
