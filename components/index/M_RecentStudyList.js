import { useLazyQuery, useQuery } from "@apollo/client";
import Link from "next/link";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import {
  QUERY_SESSION_BY_USER,
  QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
  QUERY_SESSION_FOR_RESTARTING_SESSION_BY_SESSION_ID,
  QUERY_EXAM_FOR_RESULT_BY_SESSION_ID,
} from "../../graphql/query/allQuery";
import { Drawer, Space } from "antd";
import { useCallback } from "react";
import produce from "immer";
import styled from "styled-components";
import { useState } from "react";
import useCreateReadSession from "../../hooks/useCreateReadSession";

const M_RecentStudyList = () => {
  console.log("학습이력페이지 랜더링");

  const [drawerVisible, setDrawerVisible] = useState(false);
  const closeDrawer = useCallback(() => {
    setDrawerVisible(false);
  }, []);
  const openDrawer = useCallback(() => {
    setDrawerVisible(true);
  }, []);

  const router = useRouter();
  const { data, loading, error } = useQuery(QUERY_SESSION_BY_USER, {
    onCompleted: (received_data) => {
      if (received_data.session_getSessionByUserid.status === "200") {
        console.log("세션 결과 요약용 데이터 받음", received_data);
      } else if (received_data.session_getSessionByUserid.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
    fetchPolicy: "network-only",
  });

  const [getSessionDataForResult, { variables }] = useLazyQuery(
    QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
    {
      onCompleted: (received_data) => {
        if (received_data.session_getSession.status === "200") {
          console.log("세션 결과 데이터 받음", received_data);

          sessionStorage.setItem(
            "startTimeForSessionHistory",
            received_data.session_getSession.sessions[0].session_info
              .timeStarted
          );
          sessionStorage.setItem(
            "endTimeForSessionHistory",
            received_data.session_getSession.sessions[0].session_info
              .timeFinished
          );
          sessionStorage.setItem(
            "cardListStudyingForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].cardlistUpdated
            )
          );
          sessionStorage.setItem(
            "createdCardsForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].createdCards
            )
          );
          sessionStorage.setItem(
            "cardlist_to_send_ForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].clickHistory
            )
          );
          sessionStorage.setItem(
            "resultOfSessionForSessionHistory",
            JSON.stringify(
              received_data.session_getSession.sessions[0].resultOfSession
            )
          );
          sessionStorage.setItem(
            "resultByBookForSessionHistory",
            JSON.stringify(
              produce(
                received_data.session_getSession.sessions[0].resultByBook,
                (draft) => {
                  draft.forEach((book) => {
                    book.bookTitle =
                      received_data.session_getSession.sessions[0].sessionScope.find(
                        (scope) => scope.mybook_id === book.mybook_id
                      ).title;
                  });
                }
              )
            )
          );

          router.push(`/m/study/result/${variables.session_id}`);
        } else if (received_data.session_getSession.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );
  const getSessionResult = useCallback(async ({ session_id }) => {
    try {
      getSessionDataForResult({
        variables: {
          session_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [getExamDataForResult, { variables: variablesExam }] = useLazyQuery(
    QUERY_EXAM_FOR_RESULT_BY_SESSION_ID,
    {
      onCompleted: (received_data) => {
        if (received_data.session_getSession.status === "200") {
          console.log("시험 결과 데이터 받음", received_data);
          sessionStorage.setItem(
            "cardListWithExamResult",
            JSON.stringify(
              received_data.session_getSession.sessions[0].cardlistUpdated
            )
          );

          sessionStorage.setItem(
            "startTimeForExam",
            received_data.session_getSession.sessions[0].session_info
              .timeStarted
          );
          sessionStorage.setItem(
            "endTimeForExam",
            received_data.session_getSession.sessions[0].session_info
              .timeFinished
          );

          router.push(`/m/study/examresult/${variablesExam.session_id}`);
        } else if (received_data.session_getSession.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );
  const getExamResult = useCallback(async ({ session_id }) => {
    try {
      getExamDataForResult({
        variables: {
          session_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [getSessionDataForSessionConfig, { variables: vari }] = useLazyQuery(
    QUERY_SESSION_FOR_RESTARTING_SESSION_BY_SESSION_ID,
    {
      onCompleted: (received_data) => {
        if (received_data.session_getSession.status === "200") {
          console.log("세션 결과 데이터 받음", received_data);
          const sessionConfig =
            received_data.session_getSession.sessions[0].sessionConfig;
          sessionStorage.setItem(
            "sessionConfigForRestartingSession",
            JSON.stringify(sessionConfig)
          );

          const getCheckedIndexKeys = (data) => {
            let checkedIndexesforRestartingSession = {};

            data.forEach((book) => {
              checkedIndexesforRestartingSession[book.mybook_id] =
                book.index_ids;
            });
            if (checkedIndexesforRestartingSession !== {}) {
            }
            return checkedIndexesforRestartingSession;
          };
          const checkedIndexesforRestartingSession = getCheckedIndexKeys(
            received_data.session_getSession.sessions[0].sessionScope
          );
          sessionStorage.setItem(
            "checkedIndexesForRestartingSession",
            JSON.stringify(checkedIndexesforRestartingSession)
          );

          const booksForRestartingSession =
            received_data.session_getSession.sessions[0].sessionScope.map(
              (book) => ({
                book_id: book.mybook_id,
                book_title: book.title,
              })
            );
          sessionStorage.setItem(
            "booksForRestartingSession",
            JSON.stringify(booksForRestartingSession)
          );
          console.log({ sessionConfig });
          router.push(
            {
              query: {
                selectedBooks: JSON.stringify(booksForRestartingSession),
                initialCheckedKey: JSON.stringify(
                  checkedIndexesforRestartingSession
                ),
                sessionConfigForRestartingSession:
                  JSON.stringify(sessionConfig),
              },
              pathname: `/m/study/sessionConfig/[id]`,
            },
            `/m/study/sessionConfig/${vari.session_id}`
          );
        } else if (received_data.session_getSession.status === "401") {
          router.push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  const getSessionConfigData = useCallback(async ({ session_id }) => {
    try {
      getSessionDataForSessionConfig({
        variables: {
          session_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className="text-[1rem] w-full px-[8px] flex flex-col gap-1">
      <header>
        <Space style={{ display: "flex" }}>
          <span
            className="text-gray-700"
            style={{ fontSize: "1.5rem", fontWeight: 700 }}
          >
            최근 학습 이력
          </span>
          <a className="text-sky-600" onClick={openDrawer}>
            자세히 보기
          </a>
        </Space>
      </header>
      <main>
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-collapse border-y border-y-gray-200">
              <th className="text-[1rem] bg-slate-100 w-[17%]">시작일</th>
              <th className="text-[1rem] bg-slate-100 w-[21%]">모드</th>
              <th className="text-[1rem] bg-slate-100 w-[36%]">책 이름</th>
              <th className="text-[1rem] bg-slate-100 w-[12%]"></th>
              <th className="text-[1rem] bg-slate-100 w-[14%]"></th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.session_getSessionByUserid.sessions &&
              data.session_getSessionByUserid.sessions.length > 0 &&
              _.takeRight(data.session_getSessionByUserid.sessions, 5)
                .reverse()
                .map((session) => (
                  <TableRowForRecentStudy
                    key={session._id}
                    session={session}
                    getExamResult={getExamResult}
                    getSessionResult={getSessionResult}
                    getSessionConfigData={getSessionConfigData}
                  />
                ))}
          </tbody>
        </table>
      </main>
      <DrawerWrapper
        title="최근 학습 이력"
        placement="right"
        width={"100%"}
        height={"calc(100vh - 39px)"}
        mask={false}
        visible={drawerVisible}
        onClose={closeDrawer}
        zIndex={10}
      >
        {data &&
          data.session_getSessionByUserid.sessions &&
          data.session_getSessionByUserid.sessions.length > 0 && (
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-collapse border-y border-y-gray-200">
                  <th className="text-[1rem] bg-slate-100 w-[18%]">시작일</th>
                  <th className="text-[1rem] bg-slate-100 w-[18%]">Mode</th>
                  <th className="text-[1rem] bg-slate-100 w-[27%]">책 이름</th>
                  <th className="text-[1rem] bg-slate-100 w-[10%]"></th>
                  <th className="text-[1rem] bg-slate-100 w-[14%]"></th>
                  <th className="text-[1rem] bg-slate-100 w-[10%]"></th>
                </tr>
              </thead>
              <tbody>
                {data.session_getSessionByUserid.sessions.map((session) => (
                  <TableRowForRecentStudy
                    key={session._id}
                    session={session}
                    getExamResult={getExamResult}
                    getSessionResult={getSessionResult}
                    getSessionConfigData={getSessionConfigData}
                  />
                ))}
              </tbody>
            </table>
          )}
      </DrawerWrapper>
    </article>
  );
};

const TableRowForRecentStudy = ({
  session,
  getExamResult,
  getSessionResult,
  getSessionConfigData,
}) => {
  const createReadSession = useCreateReadSession(false, session.sessionScope);

  console.log(session.sessionScope);
  return (
    <tr className="border-b border-collapse border-b-gray-200">
      <td className="text-[1rem] p-[4px] border-r border-collapse border-r-gray-200  text-center">
        {session.session_info.timeStarted &&
          moment(session.session_info.timeStarted).format("YY.MM.DD")}
      </td>
      <td className="text-[1rem] p-[4px] border-r border-collapse border-r-gray-200 text-center">
        {session.sessionConfig.studyMode === "read"
          ? "책모드"
          : session.sessionConfig.studyMode === "flip"
          ? "카드-뒤집기"
          : session.sessionConfig.studyMode === "exam"
          ? "카드-시험"
          : null}
      </td>
      <td className="text-[1rem] p-[4px] border-r border-collapse border-r-gray-200">
        <div className="flex w-full">
          <div className="truncate">{session.sessionScope[0].title}</div>
          {session.sessionScope.length > 1 && (
            <div className="flex-none w-[40px]">
              {"외 " + (session.sessionScope.length - 1) + "권"}
            </div>
          )}
        </div>
      </td>
      <td
        className="text-[1rem] p-[4px] border-r border-collapse border-r-gray-200 text-center"
        onClick={() => {
          console.log(session);
          if (session.sessionConfig.studyMode === "exam") {
            getExamResult({ session_id: session._id });
          } else if (session.sessionConfig.studyMode === "flip") {
            getSessionResult({ session_id: session._id });
          } else if (session.sessionConfig.studyMode === "read") {
            console.log("아직 페이지 없음");
          } else {
            throw new Error(
              `${session.sessionConfig.studyMode}는 없는 모드입니다`
            );
          }
        }}
      >
        <a>결과</a>
      </td>
      <td
        className="text-[1rem] p-[4px] text-center"
        onClick={() => {
          if (session.sessionConfig.studyMode === "exam") {
            console.log("아직 시험모드 재시작 없음");
          } else if (session.sessionConfig.studyMode === "flip") {
            getSessionConfigData({ session_id: session._id });
          } else if (session.sessionConfig.studyMode === "read") {
            createReadSession();
          } else {
            throw new Error(
              `${session.sessionConfig.studyMode}는 없는 모드입니다`
            );
          }
        }}
      >
        <a>재시작</a>
      </td>
    </tr>
  );
};

export default M_RecentStudyList;

const DrawerWrapper = styled(Drawer)`
  top: 39px;
  /* height: calc(100vh - 40px); */
  .ant-drawer-header {
    padding: 8px 12px 4px 8px;
  }

  .ant-drawer-close {
    font-size: 1.166667rem;
  }
  & .ant-drawer-title {
    font-size: 1.166667rem;
  }
  & .ant-drawer-body {
    padding: 10px 12px;
    background: #ffffff;
  }
  .ant-drawer-content-wrapper {
    transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
`;
