import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React from "react";
import {
  QUERY_BUY_BOOKS_BY_BUY_BOOK_ID,
  QUERY_BUY_BOOKS,
} from "../../../../graphql/query/allQuery";
import { initializeApollo, addApolloState } from "../../../../lib/apollo";

const BuyBookDetail = (props) => {
  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading....</div>;
  }

  const { __APOLLO_STATE__: normalizedData } = props;
  const {
    _id: bookId,
    buybook_info: {
      authorCompany,
      authorName,
      coverImage,
      hashtag,
      introductionOfAuthor,
      introductionOfBook,
      listOfIndex,
      numCards,
      price,
      status,
      timeCreated,
      title,
    },
  } = normalizedData[`Buybook:${router.query.bookId}`];

  return (
    <div>
      <div>{bookId}</div>
      <div>{title}</div>
      <div>{authorName}</div>
      <div>{authorCompany}</div>
      <div>{listOfIndex}</div>
      <div>{price}</div>
      <div>{coverImage}</div>
      <div>{hashtag}</div>
      <div>{introductionOfAuthor}</div>
      <div>{introductionOfBook}</div>
    </div>
  );
};

export default BuyBookDetail;

export const getStaticProps = async ({ params }) => {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: QUERY_BUY_BOOKS_BY_BUY_BOOK_ID,
    variables: { buybook_ids: [params.bookId] },
  });

  return addApolloState(apolloClient, {
    props: {},
    revalidate: 1,
  });
};

export async function getStaticPaths({ context }) {
  const apolloClient = initializeApollo();
  await apolloClient.query({
    query: QUERY_BUY_BOOKS,
  });

  let paths = [];
  for (let a in apolloClient.cache.data.data) {
    if (a !== "ROOT_QUERY") {
      paths.push({
        params: {
          bookId: a.replace("Buybook:", ""),
        },
      });
    }
  }

  return {
    paths,
    fallback: true,
  };
}
