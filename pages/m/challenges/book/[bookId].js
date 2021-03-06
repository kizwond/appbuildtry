import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import {
  QUERY_BUY_BOOKS_BY_BUY_BOOK_ID,
  QUERY_BUY_BOOKS,
} from "../../../../graphql/query/allQuery";
import { initializeApollo, addApolloState } from "../../../../lib/apollo";

import M_Layout from "../../../../components/layout/M_Layout";
import { StyledTwoLinesEllipsis } from "../../../../components/common/styledComponent/page";
import { Button, Card } from "antd";
import { MUTATION_CREATE_MY_BOOK_FROM_BUY_BOOK } from "../../../../graphql/mutation/buyBook";
import { useMutation, useQuery } from "@apollo/client";
import ReviewArea from "../../../../components/challenges/bookDetail/ReviewArea";
import RatingArea from "../../../../components/challenges/bookDetail/RatingArea";
import CommentCard from "../../../../components/challenges/bookDetail/CommentCard";

// 결론 이 페이지는 서버사이드 정적 페이지로 작성한다.
// 대신 getStaticPath는 따로 작성하지 않고 처음 로딩할 때만 정보를 불러온다.
// 그리고 정보 불러온 후는 CDN으로 올라가기 때문에 새로 고침해도 서버에 요청하지 않는다.

// 한가지 의문인 점은 여러 사용자가 모두 화면을 본다면 해당페이지는 당연히 CDN으로 올라갈 것인데??
// 그렇다면 빌드 후 여러 사용자가 서점에서 스크롤만 한다고 해도 바로 모든 책 상세 페이지가 CDN으로 올라 갈수 있다.
// 그렇게 되면 최신 정보가 올라가긴 힘들 것이다.

// 그래서 revalidate: 1을 주는 것인가?
const BuyBookDetail = (props) => {
  const router = useRouter();

  const { data, error, loading } = useQuery(QUERY_BUY_BOOKS_BY_BUY_BOOK_ID, {
    onCompleted: (data) => console.log(data),
    variables: { buybook_ids: [router.query.bookId] },
  });

  const [createMybookFromBuyBook] = useMutation(
    MUTATION_CREATE_MY_BOOK_FROM_BUY_BOOK,
    {
      onCompleted: (data) => {
        if (data.buybook_createMybookFromBuybook.status === "200") {
          console.log("구매하기 성공 ", data);
          router.back();
        } else if (data.buybook_createMybookFromBuybook.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );
  const createMybook = async () => {
    try {
      await createMybookFromBuyBook({
        variables: {
          buybook_id: router.query.bookId,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const book = data?.buybook_getBuybookByBuybookIDs?.buybooks[0];
  const bookId = book && book._id;
  const authorCompany = book && book.buybook_info.authorCompany;
  const authorName = book && book.buybook_info.authorName;
  const coverImage = book && book.buybook_info.coverImage;
  const hashtag = book && book.buybook_info.hashtag;
  const introductionOfAuthor = book && book.buybook_info.introductionOfAuthor;

  const introductionOfBook = book && book.buybook_info.introductionOfBook;
  const listOfIndex = book && book.buybook_info.listOfIndex;
  const numCards = book && book.buybook_info.numCards;
  const price = book && book.buybook_info.price;
  const status = book && book.buybook_info.status;
  const timeCreated = book && book.buybook_info.timeCreated;
  const title = book && book.buybook_info.title;

  return (
    <>
      {book && (
        <>
          <Head>
            <title>📘 {title} - CogBook</title>
            <meta name="description" content={introductionOfBook}></meta>
          </Head>
          <M_Layout>
            <div className="relative top-[40px] h-[calc(100vh_-_60px)] overflow-auto px-[8px] flex flex-col gap-3 ">
              <div className="text-[1.16667rem] font-[500]">책 상세 페이지</div>
              <div className="flex gap-4">
                <div className="relative rounded shadow-md h-56 w-36 min-w-[10rem] shadow-black/30">
                  {coverImage && (
                    <Image
                      className="rounded"
                      src={coverImage}
                      layout="fill"
                      alt={"책이미지"}
                    />
                  )}
                  {!coverImage && (
                    <div className="flex items-center justify-center w-full h-full p-2 rounded shadow-md bg-emerald-500 text-sky-50 shadow-black/20">
                      {title}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between w-full">
                  <div>
                    <StyledTwoLinesEllipsis className="font-sans text-2xl font-black">
                      {title}
                    </StyledTwoLinesEllipsis>
                    <div className="font-mono ">
                      <div>
                        {authorName}
                        <span className="text-sm italic"> 저</span>
                      </div>
                      <div className="text-base">
                        {authorCompany}
                        <span className="text-sm italic"> 출판사</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-base">
                      카드 개수: <span>읽기({numCards?.read ?? 0}), </span>
                      <span>뒤집기({numCards?.flip ?? 0})</span>
                    </div>
                    <div className="text-xl font-bold">
                      {price && price.toLocaleString("ko-KR")} 원
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button type="primary">카트</Button>
                      <Button type="primary">선물</Button>
                      <Button type="primary" onClick={createMybook}>
                        구매하기
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <div className="px-2 text-lg font-bold border-b border-b-slate-500">
                  책 소개
                </div>
                <div className="px-2 text-base">
                  {introductionOfBook &&
                    introductionOfBook.length > 0 &&
                    introductionOfBook.split("\n").map((line, i) => (
                      <span key={i}>
                        {line} <br />
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <div className="px-2 text-lg font-bold border-b border-b-slate-500">
                  저자 소개
                </div>
                <div className="px-2 text-base">
                  {introductionOfAuthor &&
                    introductionOfAuthor.length > 0 &&
                    introductionOfAuthor.split("\n").map((line, i) => (
                      <span key={i}>
                        {line} <br />
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <div className="px-2 text-lg font-bold border-b border-b-slate-500">
                  목차
                </div>
                <div className="px-2 text-base">
                  {listOfIndex &&
                    listOfIndex.length > 0 &&
                    listOfIndex.split("\n").map((line, i) => (
                      <span key={i}>
                        {line} <br />
                      </span>
                    ))}
                </div>
              </div>
              <div>
                <div className="px-2 mb-1 text-lg font-bold border-b border-b-slate-500 ">
                  태그
                </div>
                <div className="relative flex gap-2 px-2 text-base">
                  {hashtag &&
                    hashtag.length > 0 &&
                    [hashtag].map((hash, idx) => (
                      <span
                        key={hash + idx}
                        className="px-3 py-1 text-sm rounded bg-lime-500 text-sky-50"
                      >
                        #{hash}
                      </span>
                    ))}
                </div>
              </div>
              <ReviewArea />
              <RatingArea />
              {[1, 2, 3, 4, 5, 6].map((comment) => (
                <CommentCard key={comment} />
              ))}
            </div>
          </M_Layout>
        </>
      )}
    </>
  );
};

export default BuyBookDetail;

// export const getStaticProps = async ({ params }) => {
//   const apolloClient = initializeApollo();
//   await apolloClient.query({
//     query: QUERY_BUY_BOOKS_BY_BUY_BOOK_ID,
//     variables: { buybook_ids: [params.bookId] },
//   });

//   return addApolloState(apolloClient, {
//     props: {},
//   });
// };

// export async function getStaticPaths({ context }) {
//   const apolloClient = initializeApollo();
//   await apolloClient.query({
//     query: QUERY_BUY_BOOKS,
//   });

//   let paths = [];
//   for (let a in apolloClient.cache.data.data) {
//     if (a !== "ROOT_QUERY") {
//       paths.push({
//         params: {
//           bookId: a.replace("Buybook:", ""),
//         },
//       });
//     }
//   }

//   return {
//     paths,
//     fallback: true,
//   };
// }
