import { memo, useCallback } from "react";

import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import {
  QUERY_SESSION_FOR_RESULT_BY_SESSION_ID,
  QUERY_EXAM_FOR_RESULT_BY_SESSION_ID,
} from "../../../graphql/query/allQuery";
import produce from "immer";
import moment from "moment";
import _ from "lodash";

const StudyHistoryOfLastWeek = ({ data, isAllList }) => {
  const router = useRouter();

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

          router.push(`/m/mentoring/resultOfSession/${variables.session_id}`);
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

          router.push(`/m/mentoring/resultOfExam/${variablesExam.session_id}`);
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

  const list = isAllList
    ? _([...data.session_getSessionByMybookid.sessions])
    : _([...data.session_getSessionByMybookid.sessions]).takeRight(5);
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] bg-slate-100 w-[15%]">시작일</th>
          <th className="text-[1rem] bg-slate-100 w-[30%]">학습모드</th>
          <th className="text-[1rem] bg-slate-100 w-[31%]">시간</th>
          <th className="text-[1rem] bg-slate-100 w-[24%]"></th>
        </tr>
      </thead>
      <tbody>
        {list
          .reverse()
          .map((session) => {
            const startedDate = moment(session.session_info.timeStarted).format(
              "M/D"
            );

            const studyMode =
              session.sessionConfig.studyMode === "flip"
                ? "뒤집기"
                : session.sessionConfig.studyMode === "exam"
                ? "시험"
                : new Error(
                    `${session.sessionConfig.studyMode}는 알 수 없는 학습 모드입니다`
                  );

            const isWithBook =
              session.sessionScope.length > 1 ? "(혼합)" : null;
            return (
              <tr
                key={session._id}
                className="border-b border-collapse border-b-gray-200"
              >
                <td className="text-[1rem] border-r border-collapse border-r-gray-200  text-center">
                  {startedDate}
                </td>
                <td className="text-[1rem] border-r border-collapse border-r-gray-200 text-center">
                  {studyMode}
                  {isWithBook}
                </td>
                <td className="text-[1rem] border-r border-collapse border-r-gray-200 flex items-center justify-center">
                  <div className="flex justify-end w-full item-center">
                    {moment(session.session_info.timeStarted).format(
                      "HH:mm"
                    ) !== "Invalid date" &&
                      moment(session.session_info.timeStarted).format("HH:mm")}
                  </div>
                  <div className="flex-none w-[15px] flex item-center justify-center">
                    ~
                  </div>
                  <div className="flex w-full item-center">
                    {moment(session.session_info.timeFinished).format(
                      "HH:mm"
                    ) !== "Invalid date" &&
                      moment(session.session_info.timeFinished).format("HH:mm")}
                  </div>
                </td>
                <td
                  className="text-[1rem] text-center"
                  onClick={() => {
                    if (session.sessionConfig.studyMode === "exam") {
                      getExamResult({ session_id: session._id });
                    } else if (session.sessionConfig.studyMode === "flip") {
                      getSessionResult({ session_id: session._id });
                    } else {
                      throw new Error(
                        `${session.sessionConfig.studyMode}는 없는 모드입니다`
                      );
                    }
                  }}
                >
                  <a>자세히보기</a>
                </td>
              </tr>
            );
          })
          .value()}
      </tbody>
    </table>
  );
};

export default memo(StudyHistoryOfLastWeek);
