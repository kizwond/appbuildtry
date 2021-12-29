import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useRouter } from "next/router";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { MUTATION_CREATE_SESSION } from "../../../../graphql/mutation/sessionConfig";
import { QUERY_SESSION_CONFIG_AND_INDEXSET_AND_CARDSET_BY_BOOK_IDS } from "../../../../graphql/query/allQuery";

import {
  computeNumberOfAllFilteredCards,
  computeNumberOfCardsPerBook,
  sortFilteredCards,
  getCardsByNumber,
} from /* --------------- */ "../../../../components/books/study/sessionConfig/logic/computeFunctions";
import useSessionConfig from "../../../../components/books/study/sessionConfig/useHook/useSessionConfig";

import styled from "styled-components";

import M_Layout from "../../../../components/layout/M_Layout";
import M_SessionNavigationBar /* ----------- */ from "../../../../components/books/study/sessionConfig/M_SessionNavigationBar";
import M_TabsOfBooksForInfromationTable /* - */ from "../../../../components/books/study/sessionConfig/M_TabsOfBooksForInfromationTable";
import M_SessionModeAndFilterConfig /* ----- */ from "../../../../components/books/study/sessionConfig/sessionModeAndFilterConfig/M_SessionModeAndFilterConfig";

const StudySessionConfig = () => {
  const router = useRouter();

  const [checkedKeys, setCheckedKeys] = useState([]);

  const bookList = useRef();

  const [activatedComponent, setActivatedComponent] = useState("index");
  const changeActivatedComponent = useCallback((_type) => {
    setActivatedComponent(_type);
  }, []);

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

  const [getSessionConfig, { data, loading, error }] = useLazyQuery(
    QUERY_SESSION_CONFIG_AND_INDEXSET_AND_CARDSET_BY_BOOK_IDS,
    {
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
      fetchPolicy: "network-only",
    }
  );

  const bookData = useMemo(
    () =>
      data &&
      computeNumberOfCardsPerBook({
        indexsets: data.indexset_getByMybookids.indexsets,
        cardsets: data.cardset_getByMybookIDs.cardsets,
        bookList: bookList.current,
      }),

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const numberOfFilteredCards = useMemo(
    () => {
      if (data) {
        return computeNumberOfAllFilteredCards({
          cardsets: data.cardset_getByMybookIDs.cardsets,
          checkedKeys,
          sessionConfig,
        });
      }
    },

    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkedKeys, sessionConfig]
  );

  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem("books_selected"));
    const book_list = booklist.map((book, index) => ({
      book_id: book.book_id,
      book_title: book.book_title,
      seq: index,
    }));
    const checkedKeys = JSON.parse(sessionStorage.getItem("forCheckedKeys"));
    if (book_list.length > 0) {
      bookList.current = book_list;
      getSessionConfig({
        variables: {
          mybook_ids: book_list.map((book) => book.book_id),
        },
      });
      setCheckedKeys(checkedKeys);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [session_createSession, {}] = useMutation(MUTATION_CREATE_SESSION, {
    onCompleted: (_data) => {
      if (_data.session_createSession.status === "200") {
        console.log("세션 생성 요청 후 받은 데이터", _data);
        sessionStorage.setItem(
          "session_Id",
          _data.session_createSession.sessions[0]._id
        );
        sessionStorage.setItem("study_mode", sessionConfig.studyMode);
        sessionStorage.removeItem("cardListStudying");
        console.time("카드스터딩넣기");
        const sortedCards = sortFilteredCards({
          numberOfFilteredCards,
          sortOption: sessionConfig.detailedOption.sortOption,
        });
        if (sessionConfig.detailedOption.numStartCards.onOff === "on") {
          const { studyingCards, remainedCards } = getCardsByNumber({
            sortedCards,
            numStartCards: sessionConfig.detailedOption.numStartCards,
          });
          sessionStorage.setItem(
            "cardListStudying",
            JSON.stringify(studyingCards)
          );
          sessionStorage.setItem(
            "cardListRemained",
            JSON.stringify(remainedCards)
          );
        } else {
          sessionStorage.setItem(
            "cardListStudying",
            JSON.stringify(sortedCards)
          );
          sessionStorage.setItem(
            "cardListRemained",
            JSON.stringify({
              yet: [],
              ing: [],
              hold: [],
              completed: [],
            })
          );
        }
        console.timeEnd("카드스터딩넣기");

        router.push(
          `/m/study/mode/${sessionConfig.studyMode}/${_data.session_createSession.sessions[0]._id}`
        );
      } else if (_data.session_createSession.status === "401") {
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
            sessionScope,
            sessionConfig,
          },
        },
        update: (cache) => {
          keysArray.forEach((item) => {
            cache.writeFragment({
              id: `Mybook:${item}`,
              fragment: gql`
                fragment MyBookRecenctStudyIndexesFragment on Mybook {
                  recentStudyIndexes
                }
              `,
              data: {
                recentStudyIndexes: checkedKeys[item],
              },
            });
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkedKeys, sessionConfig]);

  const onCheckIndexesCheckedKeys = useCallback(
    (checkedKeysValueOfBook, selectedBookId) => {
      setCheckedKeys({
        ...checkedKeys,
        [selectedBookId]: checkedKeysValueOfBook,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (error) {
    console.log("에러", error);
    console.log(variables);
    return <div>에러발생</div>;
  }

  return (
    <M_Layout>
      {!error && !loading && bookData && (
        <StyledDiv>
          <M_SessionNavigationBar
            activatedComponent={activatedComponent}
            changeActivatedComponent={changeActivatedComponent}
            submitCreateSessionConfigToServer={
              submitCreateSessionConfigToServer
            }
            numberOfFilteredCards={numberOfFilteredCards.length}
          />
          <StyledForTabsOfBooks activatedComponent={activatedComponent}>
            <M_TabsOfBooksForInfromationTable
              bookData={bookData}
              bookList={bookList.current}
              checkedKeys={checkedKeys}
              onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
            />
          </StyledForTabsOfBooks>

          <StyledSessionConfig activatedComponent={activatedComponent}>
            {
              <M_SessionModeAndFilterConfig
                mode={mode}
                changeMode={changeMode}
                modeOption={modeOption}
                advancedFilter={advancedFilter}
                changeAdvancedFilter={changeAdvancedFilter}
              />
            }
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
  .ant-input-number-sm.AdvancedFilterInputNumber {
    width: 60px;
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
