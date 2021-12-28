import Head from "next/head";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useQuery } from "@apollo/client";
import { QUERY_USER_CATEGORIES_AND_USER_BOOKS } from "../../../graphql/query/allQuery";
import { useRouter } from "next/router";

import styled from "styled-components";

import StudyFavoriteBooksTable from "../../../components/books/study/mainPage/booksTable/StudyFavoriteBooksTable";
import StudyBooksTable from "../../../components/books/study/mainPage/booksTable/StudyBooksTable";
import Layout from "../../../components/layout/Layout";
import { Button, Space } from "antd";

const StudyPage = () => {
  const router = useRouter();

  const [isFoldedMenu, setIsFoldedMenu] = useState();
  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);

  const [selectedBooks, setSelectedBooks] = useState([]);

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
          router.push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  useEffect(() => {
    sessionStorage.removeItem("books_selected");
  }, []);

  const directStart = () => {
    router.push({
      pathname: "/study/mode/directread",
      query: { name: JSON.stringify(selectedBooks) },
    });
  };
  const sesstionStart = async () => {
    let forCheckedKeys = {};
    data.mybook_getMybookByUserID.mybooks
      .filter((_book) =>
        selectedBooks.map((book) => book.book_id).includes(_book._id)
      )
      .forEach((book) => {
        forCheckedKeys[book._id] = book.recentStudyIndexes;
      });

    sessionStorage.setItem("forCheckedKeys", JSON.stringify(forCheckedKeys));
    router.push("/books/study/sessionConfig");
  };

  const changeSelectedBooks = useCallback((_booksArray) => {
    setSelectedBooks(_booksArray);
    sessionStorage.setItem("books_selected", JSON.stringify(_booksArray));
  }, []);

  if (loading) {
    return <div>loading..</div>;
  }
  if (error) {
    return <div>Error..</div>;
  }

  const myBook2 = data && data.mybook_getMybookByUserID.mybooks;
  const category2 =
    myBook2 &&
    data &&
    data.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0];
  return (
    <>
      <Head>
        <title>Study - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {myBook2 && category2 && (
        <Layout>
          <StyledRowMaxWidth>
            <StyledFlexSpaceBetween>
              <div>
                <span className="ForMainTitle">학습하기</span>
              </div>
              <div>
                <Space>
                  <Button onClick={directStart}>바로보기</Button>
                  <Button onClick={sesstionStart}>세션 설정 후 시작</Button>
                </Space>
              </div>
            </StyledFlexSpaceBetween>
            <div>
              <StudyFavoriteBooksTable
                category={category2}
                myBook={myBook2}
                selectedBooks={selectedBooks}
                changeSelectedBooks={changeSelectedBooks}
                isFoldedMenu={isFoldedMenu}
                changeFoldedMenu={changeFoldedMenu}
              />
            </div>

            <div>
              <StudyBooksTable
                category={category2}
                myBook={myBook2}
                selectedBooks={selectedBooks}
                changeSelectedBooks={changeSelectedBooks}
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

export default StudyPage;

const StyledRowMaxWidth = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 8px;

  & .ant-card-small > .ant-card-head {
    border-bottom: none;
    padding: 0 8px;
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

const StyledBottomBar = styled.div`
  overflow: hidden;
  /* border: 1px solid #d1d1d1; */
  border-top: 1px solid #e1e1e1;
  background-color: #f5f5f5;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 4.2rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 999;

  & > div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 1.2rem;
  }
  & > div:first-child {
    border-right: 1px solid #e1e1e1;
  }
`;

export const StyledFlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  .ForMainTitle {
    font-size: 1.4rem;
    font-weight: 500;
  }
`;
