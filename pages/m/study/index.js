import { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useQuery } from "@apollo/client";
import { QUERY_USER_CATEGORIES_AND_USER_BOOKS } from "../../../graphql/query/allQuery";

import styled from "styled-components";

import M_Layout from "../../../components/layout/M_Layout";
import M_StudyFavoriteBooksTable from "../../../components/books/study/mainPage/booksTable/M_StudyFavoriteBooksTable";
import M_StudyBooksTable from "../../../components/books/study/mainPage/booksTable/M_StudyBooksTable";
import { Popover, Tooltip } from "antd";

const M_StudyMainPage = () => {
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
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
      fetchPolicy: "network-only",
    }
  );

  const directStart = () => {
    if (selectedBooks.length > 0) {
      router.push({
        pathname: "/m/study/mode/directread",
        query: { name: JSON.stringify(selectedBooks) },
      });
    }
  };

  const getCheckedIndexKeys = (data, selectedBooks) => {
    let forCheckedKeys = {};
    data.mybook_getMybookByUserID.mybooks
      .filter((_book) =>
        selectedBooks.map((book) => book.book_id).includes(_book._id)
      )
      .forEach((book) => {
        forCheckedKeys[book._id] = book.recentStudyIndexes;
      });
    if (forCheckedKeys !== {}) {
      sessionStorage.setItem("forCheckedKeys", JSON.stringify(forCheckedKeys));
    }
    return forCheckedKeys;
  };

  const changeSelectedBooks = useCallback((_booksArray) => {
    sessionStorage.removeItem("forCheckedKeys");
    sessionStorage.removeItem("books_selected");
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
        <title>{"Study - I'mTheBook"}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {myBook2 && category2 && (
        <M_Layout>
          <StyledRowMaxWidth>
            <div>
              <M_StudyFavoriteBooksTable
                category={category2}
                myBook={myBook2}
                selectedBooks={selectedBooks}
                changeSelectedBooks={changeSelectedBooks}
                isFoldedMenu={isFoldedMenu}
                changeFoldedMenu={changeFoldedMenu}
              />
            </div>

            <div>
              <M_StudyBooksTable
                category={category2}
                myBook={myBook2}
                selectedBooks={selectedBooks}
                changeSelectedBooks={changeSelectedBooks}
                isFoldedMenu={isFoldedMenu}
                changeFoldedMenu={changeFoldedMenu}
              />
            </div>
          </StyledRowMaxWidth>
          <StyledBottomBar>
            <div onClick={directStart}>바로 보기</div>

            <div>
              {selectedBooks.length > 0 ? (
                <Link
                  as="/m/study/sessionConfig"
                  href={{
                    pathname: "/m/study/sessionConfig",
                    query: {
                      selectedBooks: JSON.stringify(selectedBooks),
                      initialCheckedKey: JSON.stringify(
                        getCheckedIndexKeys(data, selectedBooks)
                      ),
                    },
                  }}
                >
                  <a>세션 설정 후 시작</a>
                </Link>
              ) : (
                <Tooltip
                  title="선택한 책이 없습니다."
                  color={"#2e2e2e"}
                  trigger={["click"]}
                >
                  <a>세션 설정 후 시작</a>
                </Tooltip>
              )}
            </div>
          </StyledBottomBar>
        </M_Layout>
      )}
    </>
  );
};

export default M_StudyMainPage;

const StyledRowMaxWidth = styled.div`
  margin: 0 auto;
  position: absolute;
  top: 40px;
  height: calc(100vh - 76px);
  overflow: scroll;

  & .ant-card-small > .ant-card-head {
    border-bottom: none;
    padding: 0 8px;
  }

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
  /* padding: 8px 0; */
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
