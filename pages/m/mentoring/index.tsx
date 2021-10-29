import { GET_MENTORING, REQUEST_MENTORING, SEARCH_USER_INFO } from "../../../graphql/query/mentoring";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";

const MentoringHome = () => {
  const [update, { data, error, loading }] = useLazyQuery(SEARCH_USER_INFO, {
    variables: { username: "1" },
  });

  const [getMentoring, { data: mentoringData, error: error1, loading: loading1 }] = useLazyQuery(GET_MENTORING);
  const [requestMentoring, { data: mentoringData2, error: error2, loading: loading2 }] = useMutation(REQUEST_MENTORING);

  useEffect(() => {
    update();
    getMentoring();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) <div>error</div>;
  if (loading) <div>loading</div>;

  if (data) console.log({ data, mentoringData });

  return (
    <div>
      <div>Hello Mentoring Page!!</div>
    </div>
  );
};

export default MentoringHome;
