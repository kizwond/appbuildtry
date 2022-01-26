import { useCallback } from "react";
import { useRouter } from "next/router";
import { QUERY_SESSION_FOR_RESULT_BY_SESSION_ID } from "../../../graphql/query/allQuery";
import produce from "immer";
import moment from "moment";

const StudyHistoryOfLaskWeek = ({ data }) => {
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

          router.push(`/m/mentoring/resultOfMentee/${variables.session_id}`);
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
        {data.session_getSessionByMybookid?.sessions?.map((session) => {
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

          const timeOnSessionStage = `${moment(
            session.session_info.timeStarted
          ).format("HH:mm")} ~ ${moment(
            session.session_info.timeFinished
          ).format("HH:mm")}`;

          const isWithBook = session.sessionScope.length > 1 ? "(혼합)" : null;
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
              <td className="text-[1rem] border-r border-collapse border-r-gray-200 text-center">
                {timeOnSessionStage}
              </td>
              <td
                className="text-[1rem] text-center"
                onClick={() => {
                  console.log("자세히보기");
                  getSessionResult({ session_id: session._id });
                }}
              >
                <a>자세히보기</a>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StudyHistoryOfLaskWeek;
