import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID, SESSION_CREATE_SESSION, GET_SESSTION_CONFIG } from "../../../../graphql/query/studySessionSetting";
import Layout from "../../../../components/layout/Layout";
import IndexTree from "../../../../components/books/study/sessionnSetting/IndexTree";
import { Col, Tabs, Row, Typography, Button, Space } from "antd";
import styled from "styled-components";
import { useRouter } from "next/router";
import SessionConfig from "../../../../components/books/study/sessionnSetting/SessionConfig";
import { StyledRowMaxWidth } from "../../../../components/common/styledComponent/page";
import useSessionConfig from "../../../../components/books/study/sessionnSetting/session-config/useHook/useSessionConfig";

const SessionSetting = () => {
  const router = useRouter();
  const [cardsList, setCardsList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [counter, setCounter] = useState(0);
  const [bookList, setBookList] = useState([]);

  const [advancedFilteredCardsList, setAdvancedFilteredCardsList] = useState([]);
  const [advancedFilteredCheckedIndexes, setAdvancedFilteredCheckedIndexes] = useState([]);
  const [isAdvancedFilteredCardListShowed, setIsAdvancedFilteredCardListShowed] = useState(false);

  const {
    // 모드
    mode,
    changeMode,
    // 모드 옵션
    modeOption,
    // 고급설정
    advancedFilter,
    changeAdvancedFilter,
    // useQuery 업데이트용
    updateData,
    // useMutaion Variables
    // sessionConfig,
  } = useSessionConfig();

  const {
    data: data2,
    loading: loading2,
    error: error2,
  } = useQuery(GET_SESSTION_CONFIG, {
    variables: {
      mybook_ids: bookList.map((book) => book.book_id),
    },
    onCompleted: (received_data) => {
      if (received_data.session_getSessionConfig.status === "200") {
        console.log({ useQueryData: received_data });
        updateData(received_data);
      } else if (received_data.session_getSessionConfig.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

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
          <Row style={{ padding: "8px" }}>
            <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
              <Row>
                <Col span={14} style={{ display: "flex" }}>
                  <StyledPointer activated="on">목차 설정</StyledPointer>
                  <StyledPointer activated="off">세션 설정</StyledPointer>
                </Col>
                <Col span={3}></Col>
                <Col span={7} style={{ display: "flex" }}>
                  <Button block disabled={"on" === "off"} size="small" style={{ height: "2rem", fontSize: "0.95rem !important", fontWeight: "600", marginLeft: "5px" }}>
                    <span style={{ fontSize: "0.95rem " }}>{"on" === "on" ? "다음" : "이전"}</span>
                  </Button>
                  <Button block disabled={"off" === "off"} size="small" style={{ height: "2rem", fontWeight: "600", marginLeft: "5px" }}>
                    <span style={{ fontSize: "0.95rem " }}>시작</span>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <StyledDivSecond>
            <Row>
              <Col xs={0} sm={0} md={0} lg={24} xl={24} xxl={24}>
                <Typography.Title level={4}>목차 설정</Typography.Title>
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
            <Row>
              <Col xs={0} sm={0} md={0} lg={18} xl={18} xxl={18}>
                <Typography.Title level={4}>세션 설정</Typography.Title>
              </Col>
              <Col sxs={0} sm={0} md={0} lg={6} xl={6} xxl={6}>
                <Button block size="small" style={{ height: "2rem", fontWeight: "600", marginLeft: "5px" }}>
                  <span style={{ fontSize: "0.95rem " }}>시작</span>
                </Button>
              </Col>
            </Row>
            {bookList.length - 1 === counter && (
              <SessionConfig
                submitCreateSessionConfigToServer={submitCreateSessionConfigToServer}
                onToggleIsAFilter={onToggleIsAFilter}
                onChangeAFCardList={onChangeAFCardList}
                AFCardList={advancedFilteredCardsList}
                book_ids={bookList.map((book) => book.book_id)}
                advancedFilteredCheckedIndexes={advancedFilteredCheckedIndexes}
                onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
                mode={mode}
                changeMode={changeMode}
                modeOption={modeOption}
                advancedFilter={advancedFilter}
                changeAdvancedFilter={changeAdvancedFilter}
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
  /* overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  } */

  & * {
    font-size: 0.7rem;
  }
  margin: 0 auto;
  max-width: 1440px;
  min-width: 363px;

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
  padding: 8px;

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
    /* display: none; */
  }
`;
const StyledDivSecond = styled.div`
  padding: 8px;

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
  width: 100%;
  min-width: 70px;
  height: 2rem;
  position: relative;
  background: ${(props) => (props.activated === "on" ? "#efedfc" : "#322a64")};
  color: ${(props) => (props.activated === "on" ? "black" : "white")};
  z-index: ${(props) => props.zIndex};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 700;

  &:hover {
    background: #dfa4a4;
  }

  &:before {
    content: "";
    position: absolute;
    right: -1rem;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: ${(props) => (props.activated === "on" ? "1rem solid #efedfc" : "1rem solid #322a64")};
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
  }
  &:hover:before {
    border-left: 1rem solid #dfa4a4;
  }

  &:nth-of-type(1) {
    z-index: 2;
  }

  &:nth-of-type(2) {
    z-index: 1;
    left: 5px;
  }
  &:nth-of-type(2):after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 1rem solid white;
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
  }
`;
