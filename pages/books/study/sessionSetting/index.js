import React, { useEffect, useState, useRef } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID, SESSION_CREATE_SESSION } from "../../../../graphql/query/studySessionSetting";
import Layout from "../../../../components/layout/Layout";
import IndexTree from "../../../../components/books/study/sessionnSetting/IndexTree";
import { Card, Col, Tabs } from "antd";
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

  const submitCreateSessionConfigToServer = async (_sessionConfig, _mode) => {
    const keysArray = Object.keys(checkedKeys);
    const sessionScope = keysArray.map((item) => ({
      mybook_id: item,
      index_ids: isAdvancedFilteredCardListShowed ? advancedFilteredCheckedIndexes[item] : checkedKeys[item],
    }));
    const selectedMode = _sessionConfig[_mode];
    try {
      await session_createSession({
        variables: {
          forCreateSession: {
            sessionScope: sessionScope,
            sessionConfig: {
              studyMode: _mode,
              detailedOption: {
                sortOption: selectedMode.sortOption,
                useCardtype: selectedMode.useCardtype,
                useStatus: selectedMode.useStatus,
                needStudyTimeCondition: selectedMode.needStudyTimeCondition,
                needStudyTimeRange: selectedMode.needStudyTimeRange,
                numStartCards: {
                  onOff: selectedMode.numStartCards.onOff,
                  yet: selectedMode.numStartCards.yet,
                  ing: selectedMode.numStartCards.ing,
                  hold: selectedMode.numStartCards.hold,
                  completed: selectedMode.numStartCards.completed,
                },
              },
              advancedFilter: {
                onOff: _sessionConfig.advancedFilter.onOff,
                cardMaker: {
                  onOff: _sessionConfig.advancedFilter.cardMaker.onOff,
                  value: _sessionConfig.advancedFilter.cardMaker.value,
                },
                examResult: {
                  onOff: _sessionConfig.advancedFilter.examResult.onOff,
                  value: _sessionConfig.advancedFilter.examResult.value,
                },
                level: {
                  onOff: _sessionConfig.advancedFilter.level.onOff,
                  value: _sessionConfig.advancedFilter.level.value,
                },
                makerFlag: {
                  onOff: _sessionConfig.advancedFilter.makerFlag.onOff,
                  value: _sessionConfig.advancedFilter.makerFlag.value,
                },
                userFlag: {
                  onOff: _sessionConfig.advancedFilter.userFlag.onOff,
                  value: _sessionConfig.advancedFilter.userFlag.value,
                },
                recentDifficulty: {
                  onOff: _sessionConfig.advancedFilter.recentDifficulty.onOff,
                  value: _sessionConfig.advancedFilter.recentDifficulty.value,
                },
                recentStudyTime: {
                  onOff: _sessionConfig.advancedFilter.recentStudyTime.onOff,
                  value: _sessionConfig.advancedFilter.recentStudyTime.value,
                },
                studyTimes: {
                  onOff: _sessionConfig.advancedFilter.studyTimes.onOff,
                  value: _sessionConfig.advancedFilter.studyTimes.value,
                },
              },
            },
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
      if (counter < bookList.length - 1) {
        console.log("카운터설정");
        setCounter((prev) => prev + 1);
      }

      setCardsList([...cardsList, received_data]);
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
      if (counter < bookList.length - 1 && counter >= 0) {
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
          <StyledDivSecond>
            <Card size="small" bordered={false}>
              <Tabs type="card" tabPosition="top">
                {!isAdvancedFilteredCardListShowed &&
                  cardsList[0] &&
                  bookList.map((book, index) => (
                    <Tabs.TabPane tab={book.book_title} key={book.book_id}>
                      <Card size="small" style={{ background: "yellow", marginTop: "0px" }}>
                        <IndexTree
                          bookIndexInfo={cardsList[index]?.session_getNumCardsbyIndex?.indexsets[0]?.indexes}
                          checkedKeys={checkedKeys[book.book_id]}
                          selectedbookId={book.book_id}
                          onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
                        />
                      </Card>
                    </Tabs.TabPane>
                  ))}
                {isAdvancedFilteredCardListShowed &&
                  bookList.map((book, index) => (
                    <Tabs.TabPane tab={book.book_title} key={book.book_id}>
                      <Card size="small" style={{ background: "yellow", marginTop: "0px" }}>
                        <IndexTree
                          bookIndexInfo={advancedFilteredCardsList[index]?.session_getNumCardsbyIndex?.indexsets[0]?.indexes}
                          checkedKeys={advancedFilteredCheckedIndexes[book.book_id]}
                          selectedbookId={book.book_id}
                          onCheckIndexesCheckedKeys={onAdvancedFilteredCheckIndexesCheckedKeys}
                        />
                      </Card>
                    </Tabs.TabPane>
                  ))}
              </Tabs>
            </Card>
          </StyledDivSecond>
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
  min-width: 358px;
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
    max-width: 378px;
    min-height: 94vh;
    border-right: 1px solid lightgray;
  }
  @media screen and (min-width: 100px) and (max-width: 991px) {
  }
`;
const StyledDivSecond = styled.div`
  min-width: 358px;
  & * {
    font-size: 0.7rem;
  }

  & .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab-active,
  .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active {
    border-bottom-color: yellow;
    top: 1px;
    z-index: 1;
  }
  & .ant-tabs-card > .ant-tabs-nav .ant-tabs-tab-active,
  .ant-tabs-card > div > .ant-tabs-nav .ant-tabs-tab-active {
    color: #1890ff;
    font-size: 0.85rem;
    font-weight: 600;
    background: yellow;
  }

  & .ant-tabs-top > .ant-tabs-nav {
    margin: 0;
  }
  @media screen and (min-width: 992px) {
    flex: auto;
  }
  @media screen and (min-width: 100px) and (max-width: 991px) {
    flex: auto;
  }
`;
