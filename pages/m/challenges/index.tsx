import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Card, Col, Drawer, Row, Space } from "antd";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import { GET_ALL_BUY_BOOKS, GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";
import M_MyBooksTable from "../../../components/challenges/M_MyBooksTable.js";
import styled from "styled-components";
import M_Layout from "../../../components/layout/M_Layout.js";
import { FormOutlined } from "@ant-design/icons";
import Image from "next/image";

interface ChallengesProps {}

const Challenges: FunctionComponent<ChallengesProps> = () => {
  const [drawerRegisterBuyBook, setDrawerRegisterBuyBook] = useState(false);
  const router = useRouter();

  const {
    data: buyBookData,
    error: buyBookError,
    loading: buyBookLoading,
  } = useQuery(GET_ALL_BUY_BOOKS, {
    onCompleted: () => console.log("도전출판 북 서버에서 받음"),
  });

  const [getAllBooksInfo, { data, error, loading }] = useLazyQuery(GET_USER_ALL_CATEGORY_AND_BOOKS, {
    onCompleted: (data) => {
      if (data.mybookcateset_getMybookcatesetByUserID.status === "200") {
        console.log({ receivedBookDataMentoring: data });
      } else if (data.mybookcateset_getMybookcatesetByUserID.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const getAllBooks = async () => {
    try {
      await getAllBooksInfo();
    } catch (error) {
      console.log(error);
    }
  };

  console.log({ buyBookData });
  return (
    <M_Layout>
      {buyBookData && (
        <>
          <StyledCard
            bordered={false}
            size="small"
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <span style={{ marginRight: "10px", fontSize: "1rem", fontWeight: "bold" }}>도전 출판</span>
                  {/* <DoubleRightOutlined rotate={visible ? 270 : 90} /> */}
                </div>
                <div>
                  <StyledButton
                    className="customButtonForMainPage"
                    onClick={() => {
                      setDrawerRegisterBuyBook(true);
                      getAllBooks();
                    }}
                  >
                    <FormOutlined className="writeUnliked" style={{ color: "#DEE2E6" }} />
                  </StyledButton>
                </div>
              </div>
            }
          >
            {buyBookData.buybook_getAllBuybook.buybooks.map((_book: any, _index: number) => (
              <Card size="small" key={_book._id} bodyStyle={{ padding: "5px 8px 5px 8px" }} style={{ marginBottom: "6px" }} hoverable>
                <Row>
                  <Col span={6}>
                    <Image src={`/image/bookcover/bookcover${(_index % 6) + 1}.png`} alt={_book.buybook_info.title} width={55} height={75} />
                  </Col>
                  <Col span={6}>
                    <div>카테고리: {_book.buybook_info.buybookcateName}</div>
                    <div>제목: {_book.buybook_info.title}</div>
                    <div>저자: {_book.buybook_info.authorName}</div>
                    <div>평점: {_book.buybook_info.status}</div>
                  </Col>
                </Row>
              </Card>
            ))}
          </StyledCard>
          <DrawerWrapper
            title={<span style={{ marginRight: "10px", fontSize: "1rem", fontWeight: "bold" }}>도전 출판 책 등록</span>}
            placement="right"
            width={"100%"}
            visible={drawerRegisterBuyBook}
            onClose={() => setDrawerRegisterBuyBook(false)}
            headerStyle={{ padding: "8px 12px 8px 12px" }}
            bodyStyle={{ backgroundColor: "#e9e9e9" }}
          >
            {drawerRegisterBuyBook && <M_MyBooksTable bookData={data} loading={loading} error={error} />}
          </DrawerWrapper>
        </>
      )}
    </M_Layout>
  );
};

export default Challenges;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  width: 100vw;
  margin: 0 auto;
  position: absolute;
  top: 40px;
  & * {
    font-size: 0.8rem;
  }
`;

const DrawerWrapper = styled(Drawer)`
  & * {
    font-size: 0.8rem;
  }
  top: 40px;

  & .ant-drawer-title {
    line-height: 16px;
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

const StyledButton = styled.button`
  width: 34px;
  height: 16px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: none;
`;
