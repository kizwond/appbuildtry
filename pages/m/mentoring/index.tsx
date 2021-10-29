import { GET_MENTORING, REQUEST_MENTORING, SEARCH_USER_INFO } from "../../../graphql/query/mentoring";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useEffect } from "react";

const MentoringHome = () => {
  const [update, { data, error, loading }] = useLazyQuery(SEARCH_USER_INFO, {
    variables: { username: "2" },
    onCompleted: (_d) =>
      requestMentoring({
        variables: {
          forCreateMentoringReq: {
            mentorUser_id: _d.user_getUserMinInfo._id,
            mentorUsername: _d.user_getUserMinInfo.username,
            mentorName: _d.user_getUserMinInfo.name,
            mentorOrganization: _d.user_getUserMinInfo.organization,
            mybook_id: "6179f165ea855a37bc5e4dfe",
            mybookTitle: "1",
            comment: "안녕하세요, 멘토해주실래요?",
          },
        },
      }),
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

  if (data) {
    console.log({ data });
  }
  if (mentoringData) {
    console.log({ mentoringData });
  }
  if (mentoringData2) {
    console.log({ mentoringData2 });
  }

  return (
    <div>
      <div>Hello Mentoring Page!!</div>
    </div>
  );
};

export default MentoringHome;
