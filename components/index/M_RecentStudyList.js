import { useLazyQuery, useQuery } from "@apollo/client";
import Link from "next/link";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import {
  QUERY_SESSION_BY_USER,
  QUERY_SESSION_FOR_RESULT_BY_USER,
} from "../../graphql/query/allQuery";
import { Space } from "antd";

const M_RecentStudyList = () => {
  const router = useRouter();
  const { data, loading, error } = useQuery(QUERY_SESSION_FOR_RESULT_BY_USER, {
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

  const [getSessionDataForResult] = useLazyQuery(QUERY_SESSION_BY_USER, {
    onCompleted: (received_data) => {
      if (received_data.session_getSessionByUserid.status === "200") {
        console.log("세션 결과 데이터 받음", received_data);
      } else if (received_data.session_getSessionByUserid.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

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
                날짜
              </th>
              <th className="text-[1rem] font-normal bg-slate-100 w-[38%]">
                책 이름
              </th>
              <th className="text-[1rem] font-normal bg-slate-100">Mode</th>
              <th className="text-[1rem] font-normal bg-slate-100 w-[29%]"></th>
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
                      {session.session_info.timeFinished &&
                        moment(session.session_info.timeFinished).format(
                          "YY.MM.DD"
                        )}
                    </td>
                    <td className="text-[1rem] p-[4px] font-normal border-r border-collapse border-r-gray-200">
                      {session.sessionScope[0].title}
                      {session.sessionScope.length > 1 &&
                        "외 " + (session.sessionScope.length - 1) + "권"}
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
                    <td className="text-[1rem] p-[4px] font-normal text-center">
                      <Space size={18}>
                        <a
                          onClick={() => {
                            router.push("/study/result");
                          }}
                        >
                          결과
                        </a>
                        <Link href={"/"}>
                          <a>다시 시작</a>
                        </Link>
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
