import Head from "next/head";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { QUERY_USER_CATEGORIES_AND_USER_BOOKS } from "../../../graphql/query/allQuery";

import { Col } from "antd";
import styled from "styled-components";

import Layout from "../../../components/layout/Layout";
import BooksTable from "../../../components/books/write/mainPage/booksTable/BooksTable";
import FavoriteBooksTable from "../../../components/books/write/mainPage/booksTable/FavoriteBooksTable";

const WriteMainPage = () => {
  const router = useRouter();

  const [isFoldedMenu, setIsFoldedMenu] = useState();
  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);

  const { loading, error, data } = useQuery(
    QUERY_USER_CATEGORIES_AND_USER_BOOKS,
    {
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
      fetchPolicy: "network-only",
    }
  );

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
        <title>Im더북</title>
      </Head>

      {myBook2 && category2 && (
        <Layout>
          <StyledRowMaxWidth>
            <div className="WritePageHeaderWrapper">
              <span className="ForMainTitle">만들기</span>
            </div>
            <div>
              <FavoriteBooksTable
                category={category2}
                myBook={myBook2}
                isFoldedMenu={isFoldedMenu}
                changeFoldedMenu={changeFoldedMenu}
              />
            </div>
            <div>
              <BooksTable
                category={category2}
                myBook={myBook2}
                isFoldedMenu={isFoldedMenu}
                changeFoldedMenu={changeFoldedMenu}
              />
            </div>
          </StyledRowMaxWidth>
        </Layout>
      )}
    </>
  );
};

export default WriteMainPage;

const StyledRowMaxWidth = styled.div`
  width: 1024px;
  margin: 0 auto;
  padding: 0 8px;

  .WritePageHeaderWrapper {
    display: flex;
    height: 40px;
    align-items: center;
  }
  .ForMainTitle {
    font-size: 18px;
    font-weight: 500;
  }

  & .ant-card-small > .ant-card-head {
    border-bottom: none;
    padding: 0;
  }

  &
    .ant-card-small
    > .ant-card-head
    > .ant-card-head-wrapper
    > .ant-card-head-title {
    padding: 0 0 8px 0;
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

  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastEvenNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastEvenNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastEvenNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastOddNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastOddNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastOddNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.EvenNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.EvenNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.EvenNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.OddNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.OddNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.OddNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small .ant-table-thead > tr > th {
    font-size: 13px;
  }
`;
