import { GET_MENTORING, SEARCH_USER_INFO } from "../../../graphql/query/mentoring";
import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";

const MentoringHome = () => {
  const [update, { data, error, loading }] = useLazyQuery(SEARCH_USER_INFO, {
    variables: { username: "1" },
  });

  const [getMentoring, { data: meto, error: error1, loading: loading1 }] = useLazyQuery(GET_MENTORING);

  useEffect(() => {
    update();
    getMentoring();
  }, []);

  if (error) <div>error</div>;
  if (loading) <div>loading</div>;

  if (data) console.log({ data, meto });

  return (
    <div>
      <div>Hello Mentoring Page!!</div>
    </div>
  );
};

export default MentoringHome;
