import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID, SESSION_CREATE_SESSION } from "../../../../graphql/query/studySessionSetting";
import Layout from "../../../../components/layout/Layout";
import IndexTree from "../../../../components/books/study/sessionnSetting/IndexTree";
import { Col, Tabs, Row, Typography } from "antd";
import styled from "styled-components";
import { useRouter } from "next/router";
import SessionConfig from "../../../../components/books/study/sessionnSetting/SessionConfig";
import { StyledRowMaxWidth } from "../../../../components/common/styledComponent/page";

const SessionSetting = () => {
  const router = useRouter();
  const [cardsList, setCardsList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [counter, setCounter] = useState(0);
  const [bookList, setBookList] = useState([]);

  const [advancedFilteredCardsList, setAdvancedFilteredCardsList] = useState([]);
  const [advancedFilteredCheckedIndexes, setAdvancedFilteredCheckedIndexes] = useState([]);
  const [isAdvancedFilteredCardListShowed, setIsAdvancedFilteredCardListShowed] = useState(false);

  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem("books_selected"));
    const book_list = booklist.map((book, index) => ({
      book_id: book.book_id,
      book_title: book.book_title,
      seq: index,
    }));
    setBookList(book_list);
  }, []);

  const [session_createSession] = useMutation(SESSION_CREATE_SESSION, {
    onCompleted: (data) => {
      sessionStorage.setItem("session_Id", data.session_createSession.sessions[0]._id);
      router.push(`/books/study/mode/flip/${data.session_createSession.sessions[0]._id}`);
    },
  });

  const submitCreateSessionConfigToServer = async (_sessionConfig) => {
    const keysArray = Object.keys(checkedKeys);
    const sessionScope = keysArray.map((item) => ({
      mybook_id: item,
      index_ids: isAdvancedFilteredCardListShowed ? advancedFilteredCheckedIndexes[item] : checkedKeys[item],
    }));
    try {
      await session_createSession({
        variables: {
          forCreateSession: {
            sessionScope: sessionScope,
            sessionConfig: _sessionConfig,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [loadData, { loading, error, data, variables }] = useLazyQuery(GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID, {
    variables: {
      forGetNumCardsbyIndex: {
        mybook_id: bookList[counter]?.book_id,
        advancedFilter: null,
      },
    },
    onCompleted: (received_data) => {
      if (received_data.session_getNumCardsbyIndex.status === "200") {
        console.log({ received_data });
        if (counter < bookList.length - 1) {
          console.log("카운터설정");
          setCounter((prev) => prev + 1);
        }

        setCardsList([...cardsList, received_data]);
      } else if (received_data.session_getNumCardsbyIndex.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  useEffect(() => {
    if (data?.session_getNumCardsbyIndex?.indexsets[0]) {
      const bookIndexIdsList = data.session_getNumCardsbyIndex.indexsets[0].indexes.map((item) => item._id);
      setCheckedKeys({
        ...checkedKeys,
        [data.session_getNumCardsbyIndex.indexsets[0].indexset_info.mybook_id]: bookIndexIdsList,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (bookList.length > 0) {
      if (counter < bookList.length) {
        loadData();
      }
    }
  }, [bookList, loadData, counter]);

  if (error) {
    console.log("에러", error);
    console.log(variables);
    return <div>에러발생</div>;
  }

  const onCheckIndexesCheckedKeys = (checkedKeysValueOfBook, selectedBookId) => {
    setCheckedKeys({
      ...checkedKeys,
      [selectedBookId]: checkedKeysValueOfBook,
    });
  };
  const onAdvancedFilteredCheckIndexesCheckedKeys = (checkedKeysValueOfBook, selectedBookId) => {
    setAdvancedFilteredCheckedIndexes({
      ...advancedFilteredCheckedIndexes,
      [selectedBookId]: checkedKeysValueOfBook,
    });
  };

  const onToggleIsAFilter = (falsy) => {
    setIsAdvancedFilteredCardListShowed(falsy);
  };
  const onChangeAFCardList = (value) => {
    setAdvancedFilteredCardsList(value);
  };
  const onChangeIndexesOfAFCardList = (value) => {
    setAdvancedFilteredCheckedIndexes(value);
  };

  if (!error && !loading) {
    return (
      <Layout>
        <StyledDiv>
          <StyledDivSecond>
            <Row>
              <Col xs={0} sm={0} md={0} lg={24} xl={24} xxl={24}>
                <Typography.Title level={4}>목차 설정</Typography.Title>
              </Col>
              <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
                <div style={{ display: "flex" }}>
                  <StyledPointer zIndex={3}>목차 설정</StyledPointer>
                  <StyledPointer activated="on" zIndex={2} style={{ left: "8px" }}>
                    세션 설정
                  </StyledPointer>
                </div>
              </Col>
            </Row>
            <Tabs type="card" tabPosition="top" size="small" tabBarStyle={{ margin: 0 }}>
              {!isAdvancedFilteredCardListShowed &&
                cardsList[0] &&
                bookList.map((book, index) => (
                  <Tabs.TabPane tab={book.book_title} key={book.book_id}>
                    <StyledDivTabContentWrapper>
                      <IndexTree
                        bookIndexInfo={cardsList[index]?.session_getNumCardsbyIndex?.indexsets[0]?.indexes}
                        checkedKeys={checkedKeys[book.book_id]}
                        selectedbookId={book.book_id}
                        onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
                      />
                    </StyledDivTabContentWrapper>
                  </Tabs.TabPane>
                ))}
              {isAdvancedFilteredCardListShowed &&
                bookList.map((book, index) => (
                  <Tabs.TabPane tab={book.book_title} key={book.book_id}>
                    <StyledDivTabContentWrapper>
                      <IndexTree
                        bookIndexInfo={advancedFilteredCardsList[index]?.session_getNumCardsbyIndex?.indexsets[0]?.indexes}
                        checkedKeys={advancedFilteredCheckedIndexes[book.book_id]}
                        selectedbookId={book.book_id}
                        onCheckIndexesCheckedKeys={onAdvancedFilteredCheckIndexesCheckedKeys}
                      />
                    </StyledDivTabContentWrapper>
                  </Tabs.TabPane>
                ))}
            </Tabs>
          </StyledDivSecond>
          <StyledDivFirst isAdvancedFilteredCardListShowed={isAdvancedFilteredCardListShowed}>
            {bookList.length - 1 === counter && (
              <SessionConfig
                submitCreateSessionConfigToServer={submitCreateSessionConfigToServer}
                onToggleIsAFilter={onToggleIsAFilter}
                onChangeAFCardList={onChangeAFCardList}
                AFCardList={advancedFilteredCardsList}
                book_ids={bookList.map((book) => book.book_id)}
                advancedFilteredCheckedIndexes={advancedFilteredCheckedIndexes}
                onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
              />
            )}
          </StyledDivFirst>
        </StyledDiv>
      </Layout>
    );
  }

  return <></>;
};
export default SessionSetting;

const StyledDiv = styled.div`
  /* 스크롤바 숨김 */
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  margin: 0 auto;
  max-width: 1440px;

  display: flex;
  @media screen and (min-width: 992px) {
    flex-direction: row;
  }
  @media screen and (min-width: 100px) and (max-width: 991px) {
    flex-direction: column;
  }

  @media screen and (min-width: 100px) and (max-width: 768px) {
    padding-top: 40px;
  }
`;
const StyledDivFirst = styled.div`
  min-width: 363px;
  padding: 8px;
  & * {
    font-size: 0.7rem;
  }
  & span.ant-radio + * {
    font-size: 0.7rem;
  }
  & .ant-radio-group {
    display: block;
  }
  & .ant-input-number-sm {
    font-size: 0.7rem;
    width: 32px;
  }
  & .ant-input-number-sm input {
    height: 16px;
    padding: 0 3px;
  }
  & .ant-input-number-handler-wrap {
    width: 0px;
    visibility: hidden;
  }
  @media screen and (min-width: 992px) {
    min-width: 385px;
  }
  @media screen and (min-width: 100px) and (max-width: 991px) {
  }
`;
const StyledDivSecond = styled.div`
  min-width: 363px;
  padding: 8px;
  & * {
    font-size: 0.7rem;
  }

  @media screen and (min-width: 992px) {
    flex: auto;
  }
  @media screen and (min-width: 100px) and (max-width: 991px) {
    flex: auto;
  }

  & .ant-table-tbody > tr.ant-table-row-selected > td {
    background: initial;
    border-color: #f0f0f0;
  }

  & table tr td.ant-table-selection-column {
    padding: 8px 2px !important;
    text-align: center;
    width: 32px;
    min-width: 32px;
  }

  & .ant-table-cell.TableRowTitle.ant-table-cell-with-append {
    padding: 8px 5px 8px 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }
`;

const StyledDivTabContentWrapper = styled.div`
  border: 1px solid #f0f0f0;
  border-top: none;
  padding: 5px;
`;

const StyledPointer = styled.div`
  width: 100px;
  height: 34px;
  position: relative;
  background: ${(props) => (props.activated === "on" ? "#efedfc" : "#322a64")};
  color: ${(props) => (props.activated === "on" ? "black" : "white")};
  z-index: ${(props) => props.zIndex};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  &:hover {
    background: #dfa4a4;
  }

  &:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 17px solid white;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
  }
  &:before {
    content: "";
    position: absolute;
    right: -17px;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: ${(props) => (props.activated === "on" ? "17px solid #efedfc" : "17px solid #322a64")};
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
  }
  &:hover:before {
    content: "";
    position: absolute;
    right: -17px;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 17px solid #dfa4a4;
    border-top: 17px solid transparent;
    border-bottom: 17px solid transparent;
  }
`;
