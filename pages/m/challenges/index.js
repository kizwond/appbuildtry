import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { useLazyQuery, useQuery } from "@apollo/client";
import {
  QUERY_BUY_BOOKS,
  QUERY_USER_CATEGORIES_AND_USER_BOOKS,
} from "../../../graphql/query/allQuery";

import styled from "styled-components";

import { Button, Drawer, Input } from "antd";

import M_MyBooksTable from "../../../components/challenges/M_MyBooksTable.js";
import M_Layout from "../../../components/layout/M_Layout.js";
import {
  StyledFlexSpaceBetween,
  StyledTwoLinesEllipsis,
} from "../../../components/common/styledComponent/page";

const Challenges = () => {
  const [drawerRegisterBuyBook, setDrawerRegisterBuyBook] = useState(false);
  const router = useRouter();

  const {
    data: buyBookData,
    error: buyBookError,
    loading: buyBookLoading,
  } = useQuery(QUERY_BUY_BOOKS, {
    onCompleted: (data) => {
      if (data.buybook_getAllBuybook.status == "200") {
        console.log("도전출판 북 서버에서 받음", data);
      } else if (data.buybook_getAllBuybook.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const [getAllBooksInfo, { data, error, loading }] = useLazyQuery(
    QUERY_USER_CATEGORIES_AND_USER_BOOKS,
    {
      onCompleted: (data) => {
        if (data.mybookcateset_getMybookcatesetByUserID.status === "200") {
          console.log("내 책 정보 받아오기 ", data);
        } else if (
          data.mybookcateset_getMybookcatesetByUserID.status === "401"
        ) {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  const getAllBooks = async () => {
    try {
      await getAllBooksInfo();
    } catch (error) {
      console.log(error);
    }
  };

  if (buyBookError) <div>에러</div>;
  if (buyBookLoading) <div>로딩</div>;

  return (
    <M_Layout>
      <>
        <div className="relative top-[40px] h-[calc(100vh_-_60px)] overflow-auto px-[8px] flex flex-col gap-3 ">
          <StyledFlexSpaceBetween className="mt-2">
            <div className="text-[1.16667rem] font-[500]">북스토어</div>
            <div>
              <div className="flex gap-2">
                <Button
                  size="small"
                  onClick={() =>
                    router.push("/admin/buy-book/examination-stage")
                  }
                >
                  관리자 메뉴
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setDrawerRegisterBuyBook(true);
                    getAllBooks();
                  }}
                >
                  판매 신청
                </Button>
              </div>
            </div>
          </StyledFlexSpaceBetween>
          <div>
            <Input.Search className="pl-2" />
          </div>
          <div className="flex flex-wrap justify-start ml-2 gap-y-5 gap-x-4">
            {buyBookData &&
              buyBookData.buybook_getAllBuybook.buybooks.length > 0 &&
              buyBookData.buybook_getAllBuybook.buybooks.map(
                ({
                  _id,
                  buybook_info: {
                    authorCompany,
                    authorName,
                    coverImage,
                    hashtag,
                    introductionOfAuthor,
                    introductionOfBook,
                    listOfIndex,
                    status: buyBookStatus,
                    timeCreated,
                    title,
                    price,
                  },
                }) => (
                  <Link href={`/m/challenges/book/${_id}`} key={_id}>
                    <a>
                      <div>
                        <div className="h-[210px] w-[154px] relative rounded shadow-md shadow-black/50">
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
                        <StyledTwoLinesEllipsis className="w-[154px] font-sans font-semibold text-xl mt-3">
                          {title}
                        </StyledTwoLinesEllipsis>
                        <div className="text-base text-gray-800">
                          {authorName}
                        </div>
                        <div className="flex items-center gap-2 text-base">
                          <div className="flex text-base">
                            <div className="w-[0.75rem] h-[0.75rem] relative">
                              <Image
                                src="/image/star_rate_black_24dp.svg"
                                layout="fill"
                                alt={"starRate"}
                              />
                            </div>
                            <div className="w-[0.75rem] h-[0.75rem] relative">
                              <Image
                                src="/image/star_rate_black_24dp.svg"
                                layout="fill"
                                alt={"starRate"}
                              />
                            </div>
                            <div className="w-[0.75rem] h-[0.75rem] relative">
                              <Image
                                src="/image/star_rate_black_24dp.svg"
                                layout="fill"
                                alt={"starRate"}
                              />
                            </div>
                            <div className="w-[0.75rem] h-[0.75rem] relative">
                              <Image
                                src="/image/star_rate_black_24dp.svg"
                                layout="fill"
                                alt={"starRate"}
                              />
                            </div>
                          </div>
                          <div className="text-base">2명</div>
                        </div>
                        <div className="text-lg">
                          {price && price.toLocaleString("ko-KR")} 원
                        </div>
                      </div>
                    </a>
                  </Link>
                )
              )}
          </div>
        </div>

        <DrawerWrapper
          title={
            <span
              className="ForMobilePageMainTitle"
              style={{
                marginRight: "10px",
              }}
            >
              도전 출판 판매 신청
            </span>
          }
          placement="right"
          width={"100%"}
          visible={drawerRegisterBuyBook}
          onClose={() => setDrawerRegisterBuyBook(false)}
          headerStyle={{ padding: "8px 12px 8px 12px" }}
          bodyStyle={{ backgroundColor: "#e9e9e9" }}
          mask={false}
        >
          {drawerRegisterBuyBook && (
            <M_MyBooksTable bookData={data} loading={loading} error={error} />
          )}
        </DrawerWrapper>
      </>
    </M_Layout>
  );
};

export default Challenges;

const DrawerWrapper = styled(Drawer)`
  top: 40px;
  & .ant-drawer-title {
    line-height: 16px;
  }
  & .ant-drawer-body * {
    font-size: 1rem;
  }
  & .ant-card-actions {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    & > li {
      margin: 4px 0;
    }
  }
  & .ant-card-actions > li > span {
    font-size: 0.8rem;
    line-height: 1.5715;
  }
`;
