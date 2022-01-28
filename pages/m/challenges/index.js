import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, Card, Col, Drawer, Row, Space } from "antd";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import {
  QUERY_BUY_BOOKS,
  QUERY_USER_CATEGORIES_AND_USER_BOOKS,
  QUERY_USER_BOOKS,
} from "../../../graphql/query/allQuery";
import M_MyBooksTable from "../../../components/challenges/M_MyBooksTable.js";
import styled from "styled-components";
import M_Layout from "../../../components/layout/M_Layout.js";
import { FormOutlined } from "@ant-design/icons";
import Image from "next/image";
import { MUTATION_CREATE_MY_BOOK_FROM_BUY_BOOK } from "../../../graphql/mutation/buyBook";
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
    onCompleted: (data) => console.log("도전출판 북 서버에서 받음", data),
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
          <StyledCard
            bordered={false}
            size="small"
            title={
              <StyledFlexSpaceBetween>
                <div>
                  <span
                    style={{
                      marginRight: "10px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
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
          </StyledCard>
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
