import Head from "next/head";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";

import { Col } from "antd";
import styled from "styled-components";

import M_Layout from "../../../components/layout/M_Layout";
import M_BooksTable from "../../../components/books/writepage/booksTable/M_BooksTable";
import M_FavoriteBooksTable from "../../../components/books/writepage/booksTable/M_FavoriteBooksTable";

const M_WriteMain = () => {
  const router = useRouter();

  const [isFoldedMenu, setIsFoldedMenu] = useState();
  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);

  const newCateRef = useRef();

  const { loading, error, data } = useQuery(GET_USER_ALL_CATEGORY_AND_BOOKS, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (
        received_data.mybookcateset_getMybookcatesetByUserID.status === "200"
      ) {
      } else if (
        received_data.mybookcateset_getMybookcatesetByUserID.status === "401"
      ) {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const myBook2 = data && data.mybook_getMybookByUserID.mybooks;
  const category2 =
    myBook2 &&
    data &&
    data.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0];

  if (loading) {
    return <div>loading..</div>;
  }
  if (error) {
    return <div>Error..</div>;
  }
  return (
    <>
      <Head>
        <title>Write - CogBook</title>
      </Head>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {myBook2 && category2 && (
        <M_Layout>
          <StyledRowMaxWidth>
            <Col span={24}>
              <M_FavoriteBooksTable
                ref={(ref) => (newCateRef.current = ref)}
                category={category2}
                myBook={myBook2}
                isFoldedMenu={isFoldedMenu}
                changeFoldedMenu={changeFoldedMenu}
              />
            </Col>
            <Col span={24}>
              <M_BooksTable
                category={category2}
                myBook={myBook2}
                newCateId={newCateRef.current}
                isFoldedMenu={isFoldedMenu}
                changeFoldedMenu={changeFoldedMenu}
              />
            </Col>
          </StyledRowMaxWidth>
        </M_Layout>
      )}
    </>
  );
};

export default M_WriteMain;

const StyledRowMaxWidth = styled.div`
  margin: 0 auto;
  position: absolute;
  top: 40px;

  & .ant-card-small > .ant-card-head {
    border-bottom: none;
    padding: 0 8px;
  }

  & .ant-checkbox-inner {
    width: 12px;
    height: 12px;
  }
  & .ant-checkbox-inner::after {
    width: 4px;
    height: 7px;
  }

  /* 아이콘 크기 및 색상 - 부모 div Hover시 동작 포함 */

  & .PullCustomCircleButton > .anticon-double-left > svg {
    font-size: 14px;
    color: #a3a3a3;
  }
  & .PullCustomCircleButton:hover > .anticon-double-left > svg {
    color: #fff;
  }
  & .PullCustomCircleButton > .anticon-setting > svg {
    font-size: 14px;
    color: #a3a3a3;
  }
  & .PullCustomCircleButton:hover > .anticon-setting > svg {
    color: #fff;
  }
`;
