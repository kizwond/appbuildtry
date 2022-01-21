import { useQuery } from "@apollo/client";
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

  return <div>책 히스토리 화면</div>;
};

export default StudyHistoryPerBook;
