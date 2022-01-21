import { useQuery } from "@apollo/client";
import moment from "moment";
import { QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID } from "../../../graphql/query/allQuery";

const StudyHistoryPerBook = ({ mybook_id }) => {
  const { data, variables } = useQuery(QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID, {
    onCompleted: (received_data) => {
      if (received_data.session_getSessionByMybookid.status === "200") {
        console.log("멘토링용 책 섹션 데이터 받음", received_data);
      } else if (received_data.session_getSessionByMybookid.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
    variables: {
      mybook_id,
      mybook_ids: [mybook_id],
    },
  });

  return (
    <div className="p-3 bg-white">
      {data && (
        <div className="mb-4">
          최근 일주일 학습 실적
          <TableForMentorSessionHistory data={data} />
        </div>
      )}
    </div>
  );
};

export default StudyHistoryPerBook;

const TableForMentorSessionHistory = ({ data }) => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] font-normal bg-slate-100 w-[15%]">시작일</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[30%]">
          학습모드
        </th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[31%]">시간</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[24%]"></th>
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
            : session.sessionConfig.studyMode === "read"
            ? "읽기"
            : session.sessionConfig.studyMode === "exam"
            ? "시험"
            : new Error(
                `${session.sessionConfig.studyMode}는 알 수 없는 학습 모드입니다`
              );

        const timeOnSessionStage = `${moment(
          session.session_info.timeStarted
        ).format("HH:mm")} ~ ${moment(session.session_info.timeFinished).format(
          "HH:mm"
        )}`;

        const 혼자왔니 =
          session.sessionScope.length > 1 ? "(혼합)" : null && "어 싱글이야";
        return (
          <tr
            key={session._id}
            className="border-b border-collapse border-b-gray-200"
          >
            <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200  text-center">
              {startedDate}
            </td>
            <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center">
              {studyMode}
              {혼자왔니}
            </td>
            <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center">
              {timeOnSessionStage}
            </td>
            <td className="text-[1rem] font-normal text-center">
              <a>자세히보기</a>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);
