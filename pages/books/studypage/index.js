import Head from "next/head";
import { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";

import styled from "styled-components";

import { Space, Col, Button } from "antd";
import Layout from "../../../components/layout/Layout";
import CategorySettingButton from "../../../components/books/writepage/categorySetting/CategorySettingButton";
import StudyBooksTable from "../../../components/books/studypage/booksTable/StudyBooksTable";
import StudyFavoriteBooksTable from "../../../components/books/studypage/booksTable/StudyFavoriteBooksTable";
import { StyledRowMaxWidth } from "../../../components/common/styledComponent/page";
import { GET_USER_ALL_CATEGORY_AND_BOOKS } from "../../../graphql/query/allQuery";

const StudyPage = () => {
  const router = useRouter();

  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);

  const [selectedBooks, setSelectedBooks] = useState([]);

  const { loading, error, data } = useQuery(GET_USER_ALL_CATEGORY_AND_BOOKS, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (
        received_data.mybookcateset_getMybookcatesetByUserID.status === "200"
      ) {
        setIsReceivedData(true);
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

  useEffect(() => {
    sessionStorage.removeItem("books_selected");
  }, []);

  const sesstionStart = () => {
    router.push("/books/study/sessionSetting");
  };

  const handleToGetMyBook = useCallback((books) => {
    setMyBook(books);
  }, []);
  const handleToGetMyCategory = useCallback((_categories) => {
    setCategory(_categories);
  }, []);

  const changeSelectedBooks = useCallback((_booksArray) => {
    setSelectedBooks(_booksArray);
    sessionStorage.setItem("books_selected", JSON.stringify(_booksArray));
  }, []);

  if (!isReceivedData) {
    return null;
  }
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
        <StyledRowMaxWidth topcompo="true">
          <StyledSpace>
            <CategorySettingButton category={category2} />
            <Button onClick={sesstionStart} size="small">
              세션 시작
            </Button>
          </StyledSpace>
        </StyledRowMaxWidth>

        <StyledRowMaxWidth>
          {myBook2.filter((_book) => _book.mybook_info.isStudyLike).length >
            0 && (
            <Col span={24}>
              <StudyFavoriteBooksTable
                category={category2}
                myBook={myBook2}
                selectedBooks={selectedBooks}
                changeSelectedBooks={changeSelectedBooks}
              />
            </Col>
          )}

          <Col span={24}>
            <StudyBooksTable
              category={category2}
              myBook={myBook2}
              selectedBooks={selectedBooks}
              changeSelectedBooks={changeSelectedBooks}
            />
          </Col>
        </StyledRowMaxWidth>
      </Layout>
    </>
  );
};

export default StudyPage;

const StyledSpace = styled(Space)`
  & * {
    font-size: 0.8rem;
  }

  padding: 12px 12px 0 12px;
`;
