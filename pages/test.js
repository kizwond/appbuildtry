import { useRouter } from "next/router";
import React from "react";
import { QUERY_SESSION_CONFIG_AND_INDEXSET_AND_CARDSET_BY_BOOK_IDS } from "../graphql/query/allQuery";

const test = () => {
  return <div>d</div>;
};

export default test;

// export async function getStaticProps(context) {
//   const { book_ids} = context.params
//   const apolloClient = initializeApollo()
//   await apolloClient.query({
//     query: QUERY_SESSION_CONFIG_AND_INDEXSET_AND_CARDSET_BY_BOOK_IDS,
//     variables: {mybook_ids: book_ids},
//   })
// initializeApollo
//   return addApolloState(apolloClient, {
//     props: {},
//   })
// }
