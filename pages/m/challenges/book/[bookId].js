import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import React from 'react';
import {
  QUERY_BUY_BOOKS_BY_BUY_BOOK_ID,
  QUERY_BUY_BOOKS,
} from '../../../../graphql/query/allQuery';
import { initializeApollo, addApolloState } from '../../../../lib/apollo';

// 결론 이 페이지는 서버사이드 정적 페이지로 작성한다.
// 대신 getStaticPath는 따로 작성하지 않고 처음 로딩할 때만 정보를 불러온다.
// 그리고 정보 불러온 후는 CDN으로 올라가기 때문에 새로 고침해도 서버에 요청하지 않는다.

// 한가지 의문인 점은 여러 사용자가 모두 화면을 본다면 해당페이지는 당연히 CDN으로 올라갈 것인데??
// 그렇다면 빌드 후 여러 사용자가 서점에서 스크롤만 한다고 해도 바로 모든 책 상세 페이지가 CDN으로 올라 갈수 있다.
// 그렇게 되면 최신 정보가 올라가긴 힘들 것이다.

// 그래서 revalidate: 1을 주는 것인가?
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
  });
};

export async function getStaticPaths({ context }) {
  return {
    // paths:[{
    //   params: {
    //     bookId: "1",
    //   },
    // }],
    paths: [],
    fallback: true,
  };
}
