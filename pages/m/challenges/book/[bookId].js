import { useRouter } from "next/router";
import React from "react";
import { QUERY_BUY_BOOKS } from "../../../../graphql/query/allQuery";
import { initializeApollo } from "../../../../lib/apollo";

const BuyBookDetail = (props) => {
  const router = useRouter();
  console.log(router.query.bookId);
  console.log({ props });
  return <div>dd</div>;
};

export default BuyBookDetail;

export const getStaticProps = async (props) => {
  console.log(props);
  const apolloClient = initializeApollo(null, props);
  await apolloClient.query({
    query: QUERY_BUY_BOOKS,
  });
  console.log({ apolloClient });
  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
};

export async function getStaticPaths({ context }) {
  return {
    paths: [
      {
        params: {
          bookId: "23",
        },
      },
    ],
    fallback: true,
  };
}
