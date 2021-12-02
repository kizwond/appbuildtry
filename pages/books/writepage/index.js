import Head from "next/head";
import { useCallback, useMemo, useRef, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_AND_BOOKS_INFO } from "../../../graphql/query/writePage";
import { useRouter } from "next/router";

import styled from "styled-components";

import { Space, Col } from "antd";
import Layout from "../../../components/layout/Layout";
import CreateBookButton from "../../../components/books/writepage/createBook/CreateBookButton";
import CategorySettingButton from "../../../components/books/writepage/categorySetting/CategorySettingButton";
import BooksTable from "../../../components/books/writepage/booksTable/BooksTable";
import FavoriteBooksTable from "../../../components/books/writepage/booksTable/FavoriteBooksTable";
import { StyledRowMaxWidth } from "../../../components/common/styledComponent/page";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";

const WriteMain = () => {
  const router = useRouter();

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

  const myBook2 = useMemo(() => data?.mybook_getMybookByUserID.mybooks, [data]);
  const category2 = useMemo(
    () => data?.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0],
    [data]
  );

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
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        {category2.length >= 1 && (
          <StyledRowMaxWidth topcompo="true">
            <StyledSpace>
              <CreateBookButton category={category2} />
              <CategorySettingButton
                ref={(ref) => (newCateRef.current = ref)}
                category={category2}
              />
            </StyledSpace>
          </StyledRowMaxWidth>
        )}

        <StyledRowMaxWidth>
          <Col span={24}>
            <FavoriteBooksTable category={category2} myBook={myBook2} />
          </Col>
          <Col span={24}>
            <BooksTable
              category={category2}
              myBook={myBook2}
              newCateId={newCateRef.current}
            />
          </Col>
        </StyledRowMaxWidth>
      </Layout>
    </>
  );
};

export default WriteMain;

const StyledSpace = styled(Space)`
  & * {
    font-size: 0.8rem;
  }
  padding: 12px 12px 0 12px;
`;
