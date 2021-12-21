import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { MUTATION_CREATE_SESSION } from "../../../../graphql/mutation/sessionConfig";
import {
  QUERY_INDEX_SET_BY_BOOK_ID_AND_ADVANCED_FILTER,
  QUERY_SESSION_CONFIG,
} from "../../../../graphql/query/allQuery";

import styled from "styled-components";

import M_Layout from "../../../../components/layout/M_Layout";
import M_SessionNavigationBar from "../../../../components/books/studypage/sessionConfig/M_SessionNavigationBar";
import SessionConfig from "../../../../components/books/study/sessionnSetting/SessionConfig";
import useSessionConfig from "../../../../components/books/study/sessionnSetting/session-config/useHook/useSessionConfig";
import M_TabsOfBooksForInfromationTable from "../../../../components/books/study/sessionConfig/M_TabsOfBooksForInfromationTable";
import M_SessionModeAndFilterConfig from "../../../../components/books/study/sessionConfig/sessionModeAndFilterConfig/M_SessionModeAndFilterConfig";

const StudySessionConfig = () => {
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

  const [activatedComponent, setActivatedComponent] = useState("index");
  const changeActivatedComponent = useCallback((_type) => {
    setActivatedComponent(_type);
  }, []);

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
    refetch,
  } = useQuery(QUERY_SESSION_CONFIG, {
    variables: {
      mybook_ids: bookList.map((book) => book.book_id),
    },
    onCompleted: (received_data) => {
      if (received_data.session_getSessionConfig.status === "200") {
        console.log("세션 설정 데이터 받음", received_data);
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

  const [session_createSession] = useMutation(MUTATION_CREATE_SESSION, {
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

  const submitCreateSessionConfigToServer = useCallback(async () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedKeys, sessionConfig]);

  const [loadData, { loading, error, data, variables }] = useLazyQuery(
    QUERY_INDEX_SET_BY_BOOK_ID_AND_ADVANCED_FILTER,
    {
      variables: {
        forGetNumCardsbyIndex: {
          mybook_id: bookList[counter]?.book_id,
          advancedFilter: null,
        },
      },
      onCompleted: (received_data) => {
        if (received_data.session_getNumCardsbyIndex.status === "200") {
          console.log(
            `${bookList[counter].book_id} 책 정보 받음`,
            received_data
          );
          if (counter < bookList.length - 1) {
            console.log("책 정보 받은 후 카운터설정", counter + 1);
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

  return (
    <M_Layout>
      {!error && !loading && cardsList.length > 0 && (
        <StyledDiv>
          <M_SessionNavigationBar
            activatedComponent={activatedComponent}
            changeActivatedComponent={changeActivatedComponent}
            submitCreateSessionConfigToServer={
              submitCreateSessionConfigToServer
            }
          />

          <StyledForTabsOfBooks activatedComponent={activatedComponent}>
            <M_TabsOfBooksForInfromationTable
              bookList={bookList}
              cardsList={cardsList}
              checkedKeys={checkedKeys}
              onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
              selectedCardsInfo={selectedCardsInfo}
              changeSelectedCardsInfo={changeSelectedCardsInfo}
              isAdvancedFilteredCardListShowed={
                isAdvancedFilteredCardListShowed
              }
              advancedFilteredCardsList={advancedFilteredCardsList}
              activatedComponent={activatedComponent}
              counter={counter}
            />
          </StyledForTabsOfBooks>

          <StyledSessionConfig activatedComponent={activatedComponent}>
            {bookList.length - 1 === counter && (
              <M_SessionModeAndFilterConfig
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
          </StyledSessionConfig>
        </StyledDiv>
      )}
    </M_Layout>
  );
};
export default StudySessionConfig;

const StyledDiv = styled.div`
  margin: 0 auto;
  max-width: 1440px;
  min-width: 360px;
  padding-top: 40px;

  * {
    font-size: 1rem;
  }
`;

const StyledSessionConfig = styled.div`
  display: ${(props) =>
    props.activatedComponent === "config" ? "block" : "none"};
  margin: 8px;

  .ant-radio-group {
    display: block;
  }

  .ant-input-number-input {
    height: 20px;
    padding: 0 3px;
  }
  .ant-input-number-sm {
    width: 2.3rem;
    line-height: 1;
  }

  .ant-input-number-handler-wrap {
    width: 0px;
    visibility: hidden;
  }
`;
const StyledForTabsOfBooks = styled.div`
  display: ${(props) =>
    props.activatedComponent === "index" ? "block" : "none"};
  margin: 8px;

  .ant-table.ant-table-small .ant-table-title {
    padding: reset;
    padding: 0px 8px 3px 8px;
  }

  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: white;
  }
  .ant-table-tbody > tr.SelectedIndexCardsInfo > td {
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding: 4px;
  }

  .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }
`;
