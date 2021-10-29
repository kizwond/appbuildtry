import { SEARCH_USER_INFO } from "../../graphql/query/mentoring";
import { useQuery } from "@apollo/client";

const MentoringHome = () => {
  const { data, error, loading } = useQuery(SEARCH_USER_INFO, {
    variables: { username: "3" },
  });

  if (error) <div>error</div>;
  if (loading) <div>loading</div>;
  console.log({ data });

  return (
    <div>
      <div>Hello Mentoring Page!!</div>
    </div>
  );
};

export default MentoringHome;
