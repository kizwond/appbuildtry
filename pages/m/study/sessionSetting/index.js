import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
  SESSION_CREATE_SESSION,
  GET_SESSTION_CONFIG,
} from "../../../../graphql/query/studySessionSetting";
import M_Layout from "../../../../components/layout/M_Layout";
import IndexTree from "../../../../components/books/study/sessionnSetting/IndexTree";
import { Col, Tabs, Row, Typography, Button, Space } from "antd";
import styled from "styled-components";
import { useRouter } from "next/router";
import SessionConfig from "../../../../components/books/study/sessionnSetting/SessionConfig";
import { StyledRowMaxWidth } from "../../../../components/common/styledComponent/page";
import useSessionConfig from "../../../../components/books/study/sessionnSetting/session-config/useHook/useSessionConfig";
import summaryAll from "../../../../components/books/study/sessionnSetting/session-config/common/business/getIndexesSummary";

const SessionSetting = () => {
  const router = useRouter();

  const [cardsList, setCardsList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const onInputCheckedKeys = useCallback((value) => {
    setCheckedKeys(value);
  }, []);

  const [counter, setCounter] = useState(0);
  const [bookList, setBookList] = useState([]);

  const [selectedCardsInfo, setSelectedCardsInfo] = useState({});
  const changeSelectedCardsInfo = useCallback((summary) => {
    setSelectedCardsInfo(summary);
  }, []);

  const [visualCompo, setVisualCompo] = useState("index");

  const [advancedFilteredCardsList, setAdvancedFilteredCardsList] = useState(
    []
  );
  const [
    isAdvancedFilteredCardListShowed,
    setIsAdvancedFilteredCardListShowed,
  ] = useState(false);

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
    sessionConfig,
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
        router.push("/m/account/login");
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
      if (data.session_createSession.status === "200") {
        console.log("세션 생성 요청 후 받은 데이터", data);
        sessionStorage.setItem(
          "session_Id",
          data.session_createSession.sessions[0]._id
        );
        sessionStorage.setItem("study_mode", sessionConfig.studyMode);
        router.push(
          `/m/study/mode/${sessionConfig.studyMode}/${data.session_createSession.sessions[0]._id}`
        );
      } else if (data.session_createSession.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const submitCreateSessionConfigToServer = async () => {
    const keysArray = Object.keys(checkedKeys);
    const sessionScope = keysArray.map((item) => ({
      mybook_id: item,
      index_ids: checkedKeys[item],
    }));
    try {
      await session_createSession({
        variables: {
          forCreateSession: {
            sessionScope: sessionScope,
            sessionConfig,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const [loadData, { loading, error, data, variables }] = useLazyQuery(
    GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
    {
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
          router.push("m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  useEffect(() => {
    if (data?.session_getNumCardsbyIndex?.indexsets[0]) {
      const bookIndexIdsList =
        data.session_getNumCardsbyIndex.indexsets[0].indexes.map(
          (item) => item._id
        );
      setCheckedKeys({
        ...checkedKeys,
        [data.session_getNumCardsbyIndex.indexsets[0].indexset_info.mybook_id]:
          bookIndexIdsList,
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

  const onCheckIndexesCheckedKeys = (
    checkedKeysValueOfBook,
    selectedBookId
  ) => {
    setCheckedKeys({
      ...checkedKeys,
      [selectedBookId]: checkedKeysValueOfBook,
    });
  };

  const onToggleIsAFilter = (falsy) => {
    setIsAdvancedFilteredCardListShowed(falsy);
  };
  const onChangeAFCardList = (value) => {
    setAdvancedFilteredCardsList(value);
  };

  if (!error && !loading && cardsList.length > 0) {
    const summary =
      counter === bookList.length - 1
        ? summaryAll(cardsList, checkedKeys)
        : {
            progress_for_total_card: 0,
            total_cards_number_for_total_card: 0,
            yet_cards_number_for_total_card: 0,
            total_on_study_cards_number_for_total_card: 0,
            until_today_on_study_cards_number_for_total_card: 0,
            until_now_on_study_cards_number_for_total_card: 0,
            from_tomorrow_on_study_cards_number_for_total_card: 0,
            completed_cards_number_for_total_card: 0,
            holding_cards_number_for_total_card: 0,
          };
    return (
      <M_Layout>
        <StyledDiv>
          <Row style={{ padding: "8px" }}>
            <Col xs={24} sm={24} md={24} lg={0} xl={0} xxl={0}>
              <Row>
                <Col span={14} style={{ display: "flex" }}>
                  <StyledPointer
                    activated={visualCompo}
                    style={{ cursor: "pointer" }}
                    onClick={() => setVisualCompo("index")}
                  >
                    목차 설정
                  </StyledPointer>
                  <StyledPointer
                    activated={visualCompo}
                    style={{ cursor: "pointer" }}
                    onClick={() => setVisualCompo("config")}
                  >
                    세션 설정
                  </StyledPointer>
                </Col>
                <Col span={3}></Col>
                <Col span={7} style={{ display: "flex" }}>
                  <Button
                    block
                    disabled={"on" === "off"}
                    size="small"
                    onClick={() =>
                      visualCompo === "index"
                        ? setVisualCompo("config")
                        : setVisualCompo("index")
                    }
                    style={{
                      height: "2rem",
                      fontSize: "0.95rem !important",
                      fontWeight: "600",
                      marginLeft: "5px",
                    }}
                  >
                    <span style={{ fontSize: "0.95rem " }}>
                      {visualCompo === "index" ? "다음" : "이전"}
                    </span>
                  </Button>
                  <Button
                    block
                    disabled={visualCompo === "index"}
                    size="small"
                    onClick={submitCreateSessionConfigToServer}
                    style={{
                      height: "2rem",
                      fontWeight: "600",
                      marginLeft: "5px",
                      backgroundColor:
                        visualCompo === "config" ? "green" : null,
                      color: visualCompo === "config" ? "white" : null,
                    }}
                  >
                    <span style={{ fontSize: "0.95rem " }}>시작</span>
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          <StyledDivSecond visualCompo={visualCompo}>
            <Row>
              <Col xs={0} sm={0} md={0} lg={24} xl={24} xxl={24}>
                <Typography.Title level={4}>목차 설정</Typography.Title>
              </Col>
            </Row>
            <Tabs
              type="card"
              tabPosition="top"
              size="small"
              tabBarStyle={{ margin: 0 }}
              defaultActiveKey={bookList[0].book_id}
            >
              {!isAdvancedFilteredCardListShowed &&
                bookList.map((book, index) => (
                  <Tabs.TabPane tab={book.book_title} key={book.book_id}>
                    <StyledDivTabContentWrapper>
                      <IndexTree
                        bookIndexInfo={
                          cardsList[index]?.session_getNumCardsbyIndex
                            ?.indexsets[0]?.indexes
                        }
                        checkedKeys={checkedKeys[book.book_id]}
                        summaryAll={summary}
                        selectedbookId={book.book_id}
                        onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
                        selectedCardsInfo={selectedCardsInfo}
                        changeSelectedCardsInfo={changeSelectedCardsInfo}
                      />
                    </StyledDivTabContentWrapper>
                  </Tabs.TabPane>
                ))}
              {isAdvancedFilteredCardListShowed &&
                bookList.map((book, index) => (
                  <Tabs.TabPane tab={book.book_title} key={book.book_id}>
                    <StyledDivTabContentWrapper>
                      <IndexTree
                        bookIndexInfo={
                          advancedFilteredCardsList[index]
                            ?.session_getNumCardsbyIndex?.indexsets[0]?.indexes
                        }
                        checkedKeys={checkedKeys[book.book_id]}
                        selectedbookId={book.book_id}
                        onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
                        selectedCardsInfo={selectedCardsInfo}
                        changeSelectedCardsInfo={changeSelectedCardsInfo}
                      />
                    </StyledDivTabContentWrapper>
                  </Tabs.TabPane>
                ))}
            </Tabs>
          </StyledDivSecond>
          <StyledDivFirst
            isAdvancedFilteredCardListShowed={isAdvancedFilteredCardListShowed}
            visualCompo={visualCompo}
          >
            <Row>
              <Col xs={0} sm={0} md={0} lg={18} xl={18} xxl={18}>
                <Typography.Title level={4}>세션 설정</Typography.Title>
              </Col>
              <Col xs={0} sm={0} md={0} lg={6} xl={6} xxl={6}>
                <Button
                  block
                  size="small"
                  onClick={submitCreateSessionConfigToServer}
                  style={{
                    height: "2rem",
                    fontWeight: "600",
                    marginLeft: "5px",
                    backgroundColor: "green",
                    color: "white",
                  }}
                >
                  <span style={{ fontSize: "0.95rem " }}>시작</span>
                </Button>
              </Col>
            </Row>
            {bookList.length - 1 === counter && (
              <SessionConfig
                onToggleIsAFilter={onToggleIsAFilter}
                onChangeAFCardList={onChangeAFCardList}
                AFCardList={advancedFilteredCardsList}
                book_ids={bookList.map((book) => book.book_id)}
                advancedFilteredCheckedIndexes={checkedKeys}
                onChangeIndexesOfAFCardList={onInputCheckedKeys}
                mode={mode}
                changeMode={changeMode}
                modeOption={modeOption}
                advancedFilter={advancedFilter}
                changeAdvancedFilter={changeAdvancedFilter}
              />
            )}
          </StyledDivFirst>
        </StyledDiv>
      </M_Layout>
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

  & .ant-radio-group {
    display: block;
  }
  & .ant-input-number-sm {
    font-size: 0.7rem;
    width: 32px;
  }
  & .ant-input-number-sm input {
    height: 20px;
    padding: 0 3px;
  }
  & .ant-input-number-handler-wrap {
    width: 0px;
    visibility: hidden;
  }
  @media screen and (min-width: 992px) {
    min-width: 400px;
  }
  @media screen and (min-width: 100px) and (max-width: 991px) {
    display: ${(props) => (props.visualCompo === "config" ? "block" : "none")};
  }
`;
const StyledDivSecond = styled.div`
  padding: 8px;

  @media screen and (min-width: 992px) {
    flex: auto;
  }
  @media screen and (min-width: 100px) and (max-width: 991px) {
    flex: auto;
    display: ${(props) => (props.visualCompo === "index" ? "block" : "none")};
  }

  & .ant-table.ant-table-small .ant-table-title {
    padding: reset;
    padding: 0px 8px 3px 8px;
  }

  & .ant-table-tbody > tr.ant-table-row-selected > td {
    background: initial;
    border-color: #f0f0f0;
  }

  & table tr td.ant-table-selection-column {
    padding: 4px 2px !important;
    text-align: center;
    width: 32px;
    min-width: 32px;
  }

  & .ant-table-cell.TableRowTitle.ant-table-cell-with-append {
    padding: 4px 5px 4px 2px;
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
  background: #efedfc;
  color: white;
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
    border-left: 1rem solid #efedfc;
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
  }
  &:hover:before {
    border-left: 1rem solid #dfa4a4;
  }

  &:nth-of-type(1) {
    z-index: 2;
    background: ${(props) =>
      props.activated === "index" ? "#322a64" : "#efedfc"};
    color: ${(props) => (props.activated === "index" ? "white" : "black")};
  }
  &:nth-of-type(1):before {
    border-left: ${(props) =>
      props.activated === "index"
        ? "1rem solid #322a64"
        : "1rem solid #efedfc"};
  }

  &:nth-of-type(2) {
    z-index: 1;
    background: ${(props) =>
      props.activated === "config" ? "#322a64" : "#efedfc"};
    color: ${(props) => (props.activated === "config" ? "white" : "black")};
    left: 5px;
  }
  &:nth-of-type(2):before {
    border-left: ${(props) =>
      props.activated === "config"
        ? "1rem solid #322a64"
        : "1rem solid #efedfc"};
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
