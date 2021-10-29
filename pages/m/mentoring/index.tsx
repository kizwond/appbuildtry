import { SEARCH_USER_INFO } from "../../../graphql/query/mentoring";
import { useQuery } from "@apollo/client";

const MentoringHome = () => {
  const { data, error, loading } = useQuery(SEARCH_USER_INFO, {
    variables: { username: "1" },
  });

  if (error) <div>error</div>;
  if (loading) <div>loading</div>;

  if (data) console.log({ data });

  return (
    <div>
      <div>Hello Mentoring Page!!</div>
    </div>
  );
};

export default MentoringHome;
