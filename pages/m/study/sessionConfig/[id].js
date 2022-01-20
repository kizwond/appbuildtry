import Head from "next/head";
import Link from "next/link";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/router";
import { gql, useMutation, useQuery } from "@apollo/client";
import { MUTATION_CREATE_SESSION } from "../../../../graphql/mutation/sessionConfig";
import { QUERY_SESSION_INDEXSET_AND_CARDSET_BY_BOOK_IDS } from "../../../../graphql/query/allQuery";

import {
  computeNumberOfAllFilteredCards,
  computeNumberOfCardsPerBook,
} from /* --------------- */ "../../../../components/books/study/sessionConfig/logic/computeFunctions";
import useSessionConfig from "../../../../components/books/study/sessionConfig/useHook/useSessionConfig";

import styled from "styled-components";

import M_Layout from "../../../../components/layout/M_Layout";
import M_SessionNavigationBar /* ----------- */ from "../../../../components/books/study/sessionConfig/M_SessionNavigationBar";
import M_TabsOfBooksForInfromationTable /* - */ from "../../../../components/books/study/sessionConfig/M_TabsOfBooksForInfromationTable";
import M_SessionModeAndFilterConfig /* ----- */ from "../../../../components/books/study/sessionConfig/sessionModeAndFilterConfig/M_SessionModeAndFilterConfig";
import {
  LoadingOutlined,
  StepBackwardOutlined,
  StepForwardOutlined,
} from "@ant-design/icons";
import { useCustomCallbackToSessionStore } from "../../../../components/books/study/mainPage/useHooks/useCustomCallbackToSessionStorage";
import { message, Tooltip } from "antd";

const StudySessionConfig = ({
  isRefreshPage,
  selectedBooks,
  initialCheckedKey,
  sessionConfigForRestartingSession,
}) => {
  const router = useRouter();
  console.log({
    isRefreshPage,
    selectedBooks,
    initialCheckedKey,
    sessionConfigForRestartingSession,
  });

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
    [checkedKeys]
  );
  useEffect(() => {
    if (!isRefreshPage) {
      setCheckedKeys(initialCheckedKey);
    }
    if (isRefreshPage) {
      const checkedKeys = JSON.parse(
        sessionStorage.getItem("checkedIndexesForRestartingSession")
      );
      setCheckedKeys(checkedKeys);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!isRefreshPage) {
      updateData(sessionConfigForRestartingSession);
    }
    if (isRefreshPage) {
      const sessionConfigForRestartingSession = JSON.parse(
        sessionStorage.getItem("sessionConfigForRestartingSession")
      );
      updateData(sessionConfigForRestartingSession);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [activatedComponent, setActivatedComponent] = useState("index");
  const changeActivatedComponent = useCallback((_type) => {
    setActivatedComponent(_type);
  }, []);

  const { data, loading, error } = useQuery(
    QUERY_SESSION_INDEXSET_AND_CARDSET_BY_BOOK_IDS,
    {
      onCompleted: (received_data) => {
        if (received_data.indexset_getByMybookids.status === "200") {
          console.log("세션 설정 데이터 받음", received_data);
          // updateData(received_data);
        } else if (received_data.indexset_getByMybookids.status === "401") {
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
            : JSON.parse(
                sessionStorage.getItem("booksForRestartingSession")
              ).map((book) => book.book_id),
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
          : JSON.parse(sessionStorage.getItem("booksForRestartingSession")),
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

  const [session_createSession, {}] = useMutation(MUTATION_CREATE_SESSION, {
    onCompleted: (_data) => {
      if (_data.session_createSession.status === "200") {
        console.log("세션 생성 요청 후 받은 데이터", _data);
        sessionStorage.setItem(
          "checkedIndexesForRestartingSession",
          JSON.stringify(checkedKeys)
        );
        writeSessionDataInSessionStorage({
          _data,
          sessionConfig,
          selectedBooks: !isRefreshPage
            ? selectedBooks
            : JSON.parse(sessionStorage.getItem("booksForRestartingSession")),
          numberOfFilteredCards,
        });

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
    const selectedBooksInLocalStorage = JSON.parse(
      sessionStorage.getItem("booksForRestartingSession")
    );
    const sessionScope = selectedBooksInLocalStorage.map((book) => ({
      mybook_id: book.book_id,
      title: book.book_title,
      index_ids: checkedKeys[book.book_id],
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
          selectedBooksInLocalStorage.forEach((book) => {
            cache.writeFragment({
              id: `Mybook:${book.book_id}`,
              fragment: gql`
                fragment MyBookRecenctStudyIndexesFragment on Mybook {
                  recentStudyIndexes
                }
              `,
              data: {
                recentStudyIndexes: checkedKeys[book.book_id],
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
                    : JSON.parse(
                        sessionStorage.getItem("booksForRestartingSession")
                      )
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
        <StyledBottomBar>
          <div
            className="text-[1.2rem]"
            onClick={() => {
              if (activatedComponent === "index") {
                changeActivatedComponent("config");
              } else {
                changeActivatedComponent("index");
              }
            }}
          >
            <div className="flex justify-end w-full item-center">
              {activatedComponent === "config" && <StepBackwardOutlined />}
            </div>
            <div className="flex-none w-[70px] flex item-center justify-center">
              {activatedComponent === "index" ? "세션 설정" : "목차 설정"}
            </div>
            <div className="flex w-full item-center">
              {activatedComponent === "index" && <StepForwardOutlined />}
            </div>
          </div>
          <div
            className={
              data && numberOfFilteredCards.length > 0
                ? "text-[1.2rem]"
                : "text-[1.2rem] text-gray-300"
            }
            onClick={() => {
              if (numberOfFilteredCards.length > 0) {
                submitCreateSessionConfigToServer();
              } else {
                message.error("선택하신 책이 없습니다.", 0.7);
              }
            }}
          >
            시작
          </div>
        </StyledBottomBar>
      </M_Layout>
    </>
  );
};
export default StudySessionConfig;

const StyledBottomBar = styled.div`
  overflow: hidden;
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
  }
  & > div:first-child {
    border-right: 1px solid #e1e1e1;
  }
`;

export function getServerSideProps({ query }) {
  if (query.selectedBooks) {
    return {
      props: {
        isRefreshPage: false,
        selectedBooks: JSON.parse(query.selectedBooks),
        initialCheckedKey: JSON.parse(query.initialCheckedKey),
        sessionConfigForRestartingSession: JSON.parse(
          query.sessionConfigForRestartingSession
        ),
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
  height: calc(100vh - 90px);
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
