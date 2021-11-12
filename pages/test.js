import { useQuery } from "@apollo/client";
import React from "react";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../graphql/query/allQuery";

const Test = () => {
  const { data } = useQuery(GET_USER_ALL_CATEGORY_AND_BOOKS);

  console.log({ data });
  return <div>테스트</div>;
};

export default Test;
