import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import { QUERY_BUY_BOOKS_BY_BUY_BOOK_ID } from "../../../../graphql/query/allQuery";
import { initializeApollo, addApolloState } from "../../../../lib/apollo";

const BuyBookDetail = (props) => {
  const router = useRouter();
  // if (router.isFallback) {
  //   <div>Loading....</div>;
  // }
  console.log({ props });

  const { data } = useQuery(QUERY_BUY_BOOKS_BY_BUY_BOOK_ID, {
    onCompleted: (data) => console.log(data),
    variables: {
      buybook_ids: [router.query.bookId],
    },
  });
  return <div>dd</div>;
};

export default BuyBookDetail;

// export const getStaticProps = async ({ params }) => {
//   console.log({ params });
//   const apolloClient = initializeApollo();
//   await apolloClient.query({
//     query: QUERY_BUY_BOOKS_BY_BUY_BOOK_ID,
//     variables: { buybook_ids: [params.bookId] },
//   });

//   return addApolloState(apolloClient, {
//     props: {},
//     revalidate: 1,
//   });
// };

// export async function getStaticPaths({ context }) {
//   return {
//     paths: [
//       {
//         params: {
//           bookId: "23",
//         },
//       },
//     ],
//     fallback: true,
//   };
// }
