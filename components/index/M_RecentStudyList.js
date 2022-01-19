import { useLazyQuery, useQuery } from "@apollo/client";
import Link from "next/link";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import {
  QUERY_SESSION_BY_USER,
  QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
} from "../../graphql/query/allQuery";
import { Space } from "antd";
import { useCallback } from "react";
import produce from "immer";

const M_RecentStudyList = () => {
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
  });

  const [getSessionDataForResult, { variables }] = useLazyQuery(
    QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
    {
      onCompleted: (received_data) => {
        if (received_data.session_getSession.status === "200") {
          console.log("세션 결과 데이터 받음", received_data);

          sessionStorage.setItem(
            "cardListStudying",
            JSON.stringify(
              received_data.session_getSession.sessions[0].cardlistUpdated
            )
          );
          sessionStorage.setItem(
            "createdCards",
            JSON.stringify(
              received_data.session_getSession.sessions[0].createdCards
            )
          );
          sessionStorage.setItem(
            "resultOfSession",
            JSON.stringify(
              received_data.session_getSession.sessions[0].resultOfSession
            )
          );
          sessionStorage.setItem(
            "resultByBook",
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

          sessionStorage.setItem(
            "started",
            received_data.session_getSession.sessions[0].session_info
              .timeStarted
          );
          sessionStorage.setItem(
            "endTimeOfSession",
            received_data.session_getSession.sessions[0].session_info
              .timeFinished
          );
          router.push(`/m/study/result/${variables.session_id}`);
        } else if (received_data.session_getSession.status === "401") {
          router.push("/account/login");
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

  const [getSessionDataForSessionConfig, { variables: vari }] = useLazyQuery(
    QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
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
        <span className="text-gray-700">최근 학습 이력</span>
      </header>
      <main>
        <table className="w-full table-fixed">
          <thead>
            <tr className="border-collapse border-y border-y-gray-200">
              <th className="text-[1rem] font-normal bg-slate-100 w-[18%]">
                시작일
              </th>
              <th className="text-[1rem] font-normal bg-slate-100 w-[14%]">
                Mode
              </th>
              <th className="text-[1rem] font-normal bg-slate-100 w-[43%]">
                책 이름
              </th>
              <th className="text-[1rem] font-normal bg-slate-100 w-[25%]"></th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.session_getSessionByUserid.sessions &&
              data.session_getSessionByUserid.sessions.length > 0 &&
              _.takeRight(data.session_getSessionByUserid.sessions, 5)
                .reverse()
                .map((session) => (
                  <tr
                    key={session._id}
                    className="border-b border-collapse border-b-gray-200"
                  >
                    <td className="text-[1rem] p-[4px] font-normal border-r border-collapse border-r-gray-200  text-center">
                      {session.session_info.timeStarted &&
                        moment(session.session_info.timeStarted).format(
                          "YY.MM.DD"
                        )}
                    </td>
                    <td className="text-[1rem] p-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                      {session.sessionConfig.studyMode === "read"
                        ? "읽기"
                        : session.sessionConfig.studyMode === "flip"
                        ? "뒤집기"
                        : session.sessionConfig.studyMode === "exam"
                        ? "시험"
                        : null}
                    </td>
                    <td className="text-[1rem] p-[4px] font-normal border-r border-collapse border-r-gray-200">
                      <div className="flex w-full">
                        <div className="truncate">
                          {session.sessionScope[0].title}
                        </div>
                        <div className="flex-none w-[40px]">
                          {session.sessionScope.length > 1 &&
                            "외 " + (session.sessionScope.length - 1) + "권"}
                        </div>
                      </div>
                    </td>
                    <td className="text-[1rem] p-[4px] font-normal text-center">
                      <Space>
                        <a
                          onClick={() => {
                            getSessionResult({ session_id: session._id });
                          }}
                        >
                          결과
                        </a>
                        <a
                          onClick={() => {
                            getSessionConfigData({ session_id: session._id });
                          }}
                        >
                          결과
                        </a>
                        {/* <Link
                          as={`/m/study/sessionConfig/${session._id}`}
                          href={{
                            pathname: "/m/study/sessionConfig/[id]",
                            // query: {
                            //   selectedBooks: JSON.stringify(selectedBooks),
                            //   initialCheckedKey: JSON.stringify(
                            //     getCheckedIndexKeys(data, selectedBooks)
                            //   ),
                            // },
                          }}
                        >
                          <a>재시작</a>
                        </Link> */}
                      </Space>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </main>
    </article>
  );
};

export default M_RecentStudyList;
