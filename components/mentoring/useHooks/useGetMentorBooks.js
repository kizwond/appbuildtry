import { useEffect, useMemo } from "react";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";

import { GET_MY_BOOKS_BY_BOOK_IDS } from "../../../graphql/query/allQuery";

const useGetMentorBooks = (mentoringData) => {
  const [getBooksInfo, { data: mentorBooks, error, loading }] = useLazyQuery(GET_MY_BOOKS_BY_BOOK_IDS, {
    onCompleted: (data) => console.log({ 멘토책정보: data }),
  });

  useEffect(() => {
    if (mentoringData) {
      const mentorInfo = mentoringData.mentoring_getMentoring.mentorings[0];

      const myMentorBooksIds = mentorInfo.myMentors.map((mentor) => mentor.mybook_id);

      getBooksInfo({
        variables: {
          mybook_ids: myMentorBooksIds,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentoringData]);

  const myMentorBooks = useMemo(() => {
    return (
      mentorBooks &&
      mentoringData.mentoring_getMentoring.mentorings[0].myMentors.map((mentor) => {
        return {
          ...mentor,
          key: mentor._id,
          mentorNameAndId: `${mentor.mentorName}(${mentor.mentorUsername})`,
          // 아래는 정렬용 이름
          // forSorting: `${_.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.mentorGroup, { _id: mentor.mentorGroup_id }).name}${mentor.mybookTitle}`,
          mentorGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.mentorGroup, { _id: mentor.mentorGroup_id }).name,
          studyHistory:
            _(_.find(mentorBooks.mybook_getMybookByMybookIDs.mybooks, (book) => book._id === mentor.mybook_id).stats?.studyHistory)
              .map((history) => history.studyHour)
              .take(3)
              .value() === []
              ? _(_.find(mentorBooks.mybook_getMybookByMybookIDs.mybooks, (book) => book._id === mentor.mybook_id).stats.studyHistory)
                  .map((history) => history.studyHour)
                  .take(3)
                  .value()
              : ["0.5", "2", "0"],
        };
      })
      // 정렬
      // .sort((a, b) => {
      //   if (a.forSorting > b.forSorting) return 1;
      //   if (a.forSorting < b.forSorting) return -1;
      //   if (a.forSorting === b.forSorting) return 0;
      // })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentorBooks]);

  return myMentorBooks;
};

export default useGetMentorBooks;
