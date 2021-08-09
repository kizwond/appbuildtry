import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout/Layout";

import LeftDrawer from "../../../components/books/write/editpage/LeftDrawer"
import RightDrawer from "../../../components/books/write/editpage/RightDrawer"
import { GetIndex, IndexCreateMutation } from "../../../graphql/query/writemain";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";

const Book = () => {
  const { query } = useRouter();
  console.log(query);

  return (
    <Layout>
      <div style={{display:"flex", justifyContent:"space-between"}}>
      <LeftDrawer book_id={query.bookid}/>
      <h1>hello {query.bookid}</h1>
      <RightDrawer book_id={query.bookid}/>
      </div>
    </Layout>
  );
};
export default Book;
