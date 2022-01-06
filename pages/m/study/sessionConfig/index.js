import Head from "next/head";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
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
import { LoadingOutlined } from "@ant-design/icons";
import { useCustomCallbackToSessionStore } from "../../../../components/books/study/mainPage/useHooks/useCustomCallbackToSessionStorage";

const StudySessionConfig = ({
  isRefreshPage,
  selectedBooks,
  initialCheckedKey,
}) => {
  const router = useRouter();

  const writeSessionDataInSessionStorage = useCustomCallbackToSessionStore();

  /* 세션 설정 customHook */
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

  /* 목차선택 관련 코드 */
  const [checkedKeys, setCheckedKeys] = useState([]);
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
  useEffect(() => {
    if (!isRefreshPage) {
      setCheckedKeys(initialCheckedKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (isRefreshPage) {
      const checkedKeys = JSON.parse(sessionStorage.getItem("forCheckedKeys"));
      setCheckedKeys(checkedKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activatedComponent, setActivatedComponent] = useState("index");
  const changeActivatedComponent = useCallback((_type) => {
    setActivatedComponent(_type);
  }, []);

  const { data, loading, error } = useQuery(
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
      variables: {
        mybook_ids:
          typeof window === "undefined"
            ? []
            : !isRefreshPage
            ? selectedBooks.map((book) => book.book_id)
            : JSON.parse(sessionStorage.getItem("books_selected")).map(
                (book) => book.book_id
              ),
      },
      fetchPolicy: "network-only",
    }
  );

  const bookData = useMemo(
    () =>
      typeof window !== "undefined" &&
      data &&
      computeNumberOfCardsPerBook({
        indexsets: data.indexset_getByMybookids.indexsets,
        cardsets: data.cardset_getByMybookIDs.cardsets,
        bookList: !isRefreshPage
          ? selectedBooks
          : JSON.parse(sessionStorage.getItem("books_selected")),
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

    // 디펜던시에서 sessionConfig가 매 랜더링마다 변경되어서  useMemo가 실행된다. 크게 의미가 없다. sessionConfig 메모라이징 할 방법 찾아야함
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [checkedKeys, sessionConfig]
  );

  const sessionResults = useMemo(
    () => ({
      mybook_id: null,
      numCards: {
        yet: { selected: 0, inserted: 0, started: 0, finished: 0 },
        ing: { selected: 0, inserted: 0, started: 0, finished: 0 },
        hold: { selected: 0, inserted: 0, started: 0, finished: 0 },
        completed: { selected: 0, inserted: 0, started: 0, finished: 0 },
      },
      clicks: {
        total: 0,
        diffi1: 0,
        diffi2: 0,
        diffi3: 0,
        diffi4: 0,
        diffi5: 0,
        hold: 0,
        completed: 0,
        etc: 0,
      },
      statusChange: {
        yet: { yet: 0, ing: 0, hold: 0, completed: 0 },
        ing: { yet: 0, ing: 0, hold: 0, completed: 0 },
        hold: { yet: 0, ing: 0, hold: 0, completed: 0 },
        completed: { yet: 0, ing: 0, hold: 0, completed: 0 },
      },
      levelChange: {
        total: { count: 0, gap: 0 },
        up: { count: 0, gap: 0 },
        down: { count: 0, gap: 0 },
      },
      userFlagChange: {
        flag0: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag1: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag2: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag3: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag4: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
        flag5: { flag0: 0, flag1: 0, flag2: 0, flag3: 0, flag4: 0, flag5: 0 },
      },
    }),

    []
  );

  const [session_createSession, {}] = useMutation(MUTATION_CREATE_SESSION, {
    onCompleted: (_data) => {
      if (_data.session_createSession.status === "200") {
        console.log("세션 생성 요청 후 받은 데이터", _data);
        const sortedCards = sortFilteredCards({
          numberOfFilteredCards,
          sortOption: sessionConfig.detailedOption.sortOption,
        });

        writeSessionDataInSessionStorage({
          _data,
          sessionConfig,
          sortedCards,
          isRefreshPage,
          selectedBooks,
        });

        // sessionStorage.setItem(
        //   "session_Id",
        //   _data.session_createSession.sessions[0]._id
        // );
        // sessionStorage.setItem("study_mode", sessionConfig.studyMode);
        // sessionStorage.setItem(
        //   "resultOfSession",
        //   JSON.stringify(sessionResults)
        // );
        // sessionStorage.setItem(
        //   "resultByBook",
        //   JSON.stringify(
        //     !props.isRefreshPage
        //       ? props.selectedBooks.map((book) => ({
        //           ...sessionResults,
        //           mybook_id: book.book_id,
        //         }))
        //       : JSON.parse(sessionStorage.getItem("books_selected")).map(
        //           (book) => ({
        //             ...sessionResults,
        //             mybook_id: book.book_id,
        //           })
        //         )
        //   )
        // );
        // sessionStorage.removeItem("cardListStudying");
        // console.time("카드스터딩넣기");

        // if (sessionConfig.detailedOption.numStartCards.onOff === "on") {
        //   const { studyingCards, remainedCards } = getCardsByNumber({
        //     sortedCards,
        //     numStartCards: sessionConfig.detailedOption.numStartCards,
        //   });
        //   sessionStorage.setItem(
        //     "cardListStudying",
        //     JSON.stringify(studyingCards)
        //   );
        //   sessionStorage.setItem(
        //     "cardListRemained",
        //     JSON.stringify(remainedCards)
        //   );
        // } else {
        //   sessionStorage.setItem(
        //     "cardListStudying",
        //     JSON.stringify(sortedCards)
        //   );
        //   sessionStorage.setItem(
        //     "cardListRemained",
        //     JSON.stringify({
        //       yet: [],
        //       ing: [],
        //       hold: [],
        //       completed: [],
        //     })
        //   );
        // }
        // console.timeEnd("카드스터딩넣기");

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

  if (error) {
    console.log("에러", error);
    // console.log(variables);
    return <div>에러발생</div>;
  }

  return (
    <>
      <Head>
        <title>{"세션설정 - I'mTheBook"}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>{" "}
      <M_Layout>
        {loading && (
          <div
            style={{
              width: "100%",
              margin: "0 auto",
              marginTop: "150px",
              fontSize: "30px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <LoadingOutlined />
            로딩 중...
          </div>
        )}
        {typeof window !== "undefined" && !loading && bookData && (
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
                bookList={
                  !isRefreshPage
                    ? selectedBooks
                    : JSON.parse(sessionStorage.getItem("books_selected"))
                }
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
    </>
  );
};
export default StudySessionConfig;

export function getServerSideProps({ query }) {
  if (query.selectedBooks) {
    return {
      props: {
        isRefreshPage: false,
        selectedBooks: JSON.parse(query.selectedBooks),
        initialCheckedKey: JSON.parse(query.initialCheckedKey),
      },
    };
  }

  return {
    props: {
      isRefreshPage: true,
      selectedBooks: [],
      initialCheckedKey: [],
    },
  };
}

const StyledDiv = styled.div`
  margin: 0 auto;
  max-width: 1024px;
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
