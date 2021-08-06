import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/layout/Layout";
const BookSetting = () => {
  const { query } = useRouter();
  console.log(query);

  return (
    <Layout>
      <h1>hello {query.bookid}</h1>
    </Layout>
  );
};
export default BookSetting;
