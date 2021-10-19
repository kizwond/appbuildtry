import Head from "next/head";
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_CATEGORY_AND_BOOKS_INFO } from "../../../graphql/query/writePage";
import { useRouter } from "next/router";

import styled from "styled-components";

import { Row, Space, Col, Button } from "../../../node_modules/antd/lib/index";
import Layout from "../../../components/layout/Layout";
import CategorySettingButton from "../../../components/books/writepage/categorySetting/CategorySettingButton";
import StudyBooksTable from "../../../components/books/studypage/booksTable/StudyBooksTable";
import StudyFavoriteBooksTable from "../../../components/books/studypage/booksTable/StudyFavoriteBooksTable";
import { StyledRowMaxWidth } from "../../../components/common/styledComponent/page";

const Writeanother = () => {
  const router = useRouter();

  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);

  const [activedTable, setActivedTable] = useState();

  const [isPopupSomething, setisPopupSomething] = useState(false);

  const [selectedBooks, setSelectedBooks] = useState([]);

  const { loading, error, data } = useQuery(GET_CATEGORY_AND_BOOKS_INFO, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (received_data.mybookcate_get.status === "200") {
        setMyBook(received_data.mybook_getAllMybook.mybooks);
        setCategory(received_data.mybookcate_get.mybookcates);
        setIsReceivedData(true);
      } else if (received_data.mybookcate_get.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

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

  const chagePopup = useCallback((_boolean) => {
    setisPopupSomething(_boolean);
  }, []);
  const changeActivedTable = useCallback((_table) => {
    setActivedTable(_table);
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
        {category.length >= 1 && (
          <StyledRowMaxWidth topcompo="true">
            <StyledSpace>
              <CategorySettingButton category={category} handleToGetMyCategory={handleToGetMyCategory} handleToGetMyBook={handleToGetMyBook} />
              <Button onClick={sesstionStart} size="small">
                세션 시작
              </Button>
            </StyledSpace>
          </StyledRowMaxWidth>
        )}

        <StyledRowMaxWidth>
          <Col span={24}>
            <StudyFavoriteBooksTable
              category={category}
              myBook={myBook}
              handleToGetMyBook={handleToGetMyBook}
              isPopupSomething={isPopupSomething}
              chagePopup={chagePopup}
              activedTable={activedTable}
              changeActivedTable={changeActivedTable}
              selectedBooks={selectedBooks}
              changeSelectedBooks={changeSelectedBooks}
            />
          </Col>
          <Col span={24}>
            <StudyBooksTable
              category={category}
              myBook={myBook}
              handleToGetMyBook={handleToGetMyBook}
              isPopupSomething={isPopupSomething}
              chagePopup={chagePopup}
              activedTable={activedTable}
              changeActivedTable={changeActivedTable}
              selectedBooks={selectedBooks}
              changeSelectedBooks={changeSelectedBooks}
            />
          </Col>
        </StyledRowMaxWidth>
      </Layout>
    </>
  );
};

export default Writeanother;

const StyledSpace = styled(Space)`
  & * {
    font-size: 0.8rem;
  }
  padding: 12px 12px 0 12px;
`;
