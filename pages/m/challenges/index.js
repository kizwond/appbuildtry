import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/router";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  QUERY_BUY_BOOKS,
  QUERY_USER_CATEGORIES_AND_USER_BOOKS,
  QUERY_USER_BOOKS,
} from "../../../graphql/query/allQuery";
import { MUTATION_CREATE_MY_BOOK_FROM_BUY_BOOK } from "../../../graphql/mutation/buyBook";

import styled from "styled-components";

import { Button, Card, Col, Drawer, Input, Row, Space } from "antd";
import { FormOutlined } from "@ant-design/icons";

import M_MyBooksTable from "../../../components/challenges/M_MyBooksTable.js";
import M_Layout from "../../../components/layout/M_Layout.js";
import { StyledFlexSpaceBetween } from "../../../components/common/styledComponent/page";
import { StyledButtonForMainPage } from "../../../components/common/styledComponent/buttons";

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

  const [createMyBookFromBuyBook] = useMutation(
    MUTATION_CREATE_MY_BOOK_FROM_BUY_BOOK,
    {
      onCompleted: (_data) => {
        if (_data.buybook_createMybookFromBuybook.msg == "책 생성 성공적!") {
          console.log("도전책을 내책으로 데이터", _data);
        } else if (_data.buybook_createMybookFromBuybook.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );
  const createMyBook = async (buybook_id) => {
    try {
      await createMyBookFromBuyBook({
        variables: { buybook_id },
        update: (cache, { data: { buybook_createMybookFromBuybook } }) => {
          const _data = cache.readQuery({
            query: QUERY_USER_BOOKS,
          });
          console.log({ _data, buybook_createMybookFromBuybook });
          cache.writeQuery({
            query: QUERY_USER_BOOKS,
            data: {
              ..._data,
              mybook_getMybookByUserID: {
                ..._data.mybook_getMybookByUserID,
                mybooks: [
                  ..._data.mybook_getMybookByUserID.mybooks,
                  ...buybook_createMybookFromBuybook.mybooks,
                ],
              },
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  if (buyBookError) <div>에러</div>;
  if (buyBookLoading) <div>로딩</div>;

  return (
    <M_Layout>
      {buyBookData && (
        <>
          <div className="relative top-[40px] h-[calc(100vh_-_60px)] overflow-auto px-[8px] flex flex-col gap-3 ">
            <StyledFlexSpaceBetween className="mt-2">
              <div className="text-[1.16667rem] font-[500]">북스토어</div>
              <div>
                <div className="flex gap-2">
                  <Button size="small">관리자 메뉴</Button>
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
            <div className="flex flex-wrap justify-start gap-y-5 gap-x-3 ml-2">
              <div>
                <div className="h-[190px] w-[162px] relative">
                  <Image
                    src="/image/bookcover/bookcover2.png"
                    layout="fill"
                    alt={"책이미지"}
                  />
                </div>
                <div className="font-sans font-semibold text-base">
                  책 제목입니다
                </div>
                <div className="text-sm text-gray-800">저자입니다</div>
                <div className="text-xs flex gap-2 items-center">
                  <div className="text-xs flex">
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
                  <div className="text-xs">2명</div>
                </div>
                <div className="text-sm">12,500원</div>
              </div>
              <div>
                <div className="h-[190px] w-[162px] relative">
                  <Image
                    src="/image/bookcover/bookcover2.png"
                    layout="fill"
                    alt={"책이미지"}
                  />
                </div>
                <div className="font-sans font-semibold text-base">
                  책 제목입니다
                </div>
                <div className="text-sm text-gray-800">저자입니다</div>
                <div className="text-xs flex gap-2 items-center">
                  <div className="text-xs flex">
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
                  <div className="text-xs">2명</div>
                </div>
                <div className="text-sm">12,500원</div>
              </div>
              <div>
                <div className="h-[190px] w-[162px] relative">
                  <Image
                    src="/image/bookcover/bookcover2.png"
                    layout="fill"
                    alt={"책이미지"}
                  />
                </div>
                <div className="font-sans font-semibold text-base">
                  책 제목입니다
                </div>
                <div className="text-sm text-gray-800">저자입니다</div>
                <div className="text-xs flex gap-2 items-center">
                  <div className="text-xs flex">
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
                  <div className="text-xs">2명</div>
                </div>
                <div className="text-sm">12,500원</div>
              </div>
              <div>
                <div className="h-[190px] w-[162px] relative">
                  <Image
                    src="/image/bookcover/bookcover2.png"
                    layout="fill"
                    alt={"책이미지"}
                  />
                </div>
                <div className="font-sans font-semibold text-base">
                  책 제목입니다
                </div>
                <div className="text-sm text-gray-800">저자입니다</div>
                <div className="text-xs flex gap-2 items-center">
                  <div className="text-xs flex">
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
                  <div className="text-xs">2명</div>
                </div>
                <div className="text-sm">12,500원</div>
              </div>
            </div>
          </div>
          {/* <StyledCard
            bordered={false}
            size="small"
            title={
              <StyledFlexSpaceBetween>
                <div>
                  <span className="mr-[10px] text-[1rem] font-bold">
                    도전 출판
                  </span>
                </div>
                <div>
                  <StyledButtonForMainPage
                    className="customButtonForMainPage"
                    onClick={() => {
                      setDrawerRegisterBuyBook(true);
                      getAllBooks();
                    }}
                  >
                    <FormOutlined className="IconForButton" />
                  </StyledButtonForMainPage>
                </div>
              </StyledFlexSpaceBetween>
            }
          >
            {buyBookData.buybook_getAllBuybook.buybooks.map((_book, _index) => (
              <Card
                size="small"
                key={_book._id}
                bodyStyle={{ padding: "5px 8px 5px 8px" }}
                style={{ marginBottom: "6px" }}
                hoverable
              >
                <Row>
                  <Col span={5}>
                    <div className="w-[55px] h-[75px] bg-cyan-400 flex items-center justify-center text-gray-50 text-[14px]">
                      CogBook
                    </div>
                  </Col>
                  <Col span={12}>
                    <div>카테고리: {_book.buybook_info.buybookcateName}</div>
                    <div>제목: {_book.buybook_info.title}</div>
                    <div>저자: {_book.buybook_info.authorName}</div>
                    <div>평점: {_book.buybook_info.status}</div>
                  </Col>
                  <Col span={7}>
                    <div>
                      <Button
                        block
                        onClick={() => {
                          createMyBook(_book._id);
                        }}
                      >
                        내 책에 추가
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            ))}
          </StyledCard> */}
          <DrawerWrapper
            title={
              <span
                className="ForMobilePageMainTitle"
                style={{
                  marginRight: "10px",
                }}
              >
                도전 출판 책 등록
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
      )}
    </M_Layout>
  );
};

export default Challenges;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  width: 100%;
  margin: 0 auto;
  position: relative;
  top: 40px;
  & .ant-card-body * {
    font-size: 1rem;
  }
`;

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
