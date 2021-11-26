import { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import _ from "lodash";

import { GET_MY_BOOKS_BY_BOOK_IDS } from "../../../graphql/query/allQuery";

const useGetMentorBooks = (mentoringData, previousMentoringData) => {
  const router = useRouter();

  const [newData, setNewData] = useState(null);

  const [getBooksInfo, { data: mentorBooks, error, loading }] = useLazyQuery(GET_MY_BOOKS_BY_BOOK_IDS, {
    onCompleted: (data) => {
      if (data.mybook_getMybookByMybookIDs.status === "200") {
        const fordata = _.sortBy(
          mentoringData.mentoring_getMentoring.mentorings[0].myMentors.map((mentor) => ({
            ...mentor,
            key: mentor._id,
            mentorNameAndId: `${mentor.mentorName}(${mentor.mentorUsername})`,
            mentorGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.mentorGroup, { _id: mentor.mentorGroup_id }).name,
            mentorSeq: mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.mentorGroup.findIndex((gr) => gr._id === mentor.mentorGroup_id),
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
          })),
          ["mentorSeq"]
        );
        setNewData(fordata);
        console.log("멘토 정보 업데이트 프로세스 작업 종료(with책 정보 갱신)", data);
      } else if (data.mybook_getMybookByMybookIDs.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  useEffect(() => {
    if (mentoringData) {
      const mentorInfo = mentoringData.mentoring_getMentoring.mentorings[0];
      const myMentorBooksIds = mentorInfo.myMentors.map((mentor) => mentor.mybook_id);
      // setIsFetfetching(true);
      if (typeof previousMentoringData === "undefined") {
        getBooksInfo({
          variables: {
            mybook_ids: myMentorBooksIds,
          },
        });
        return;
      }

      const previousMentorInfo = previousMentoringData.mentoring_getMentoring.mentorings[0];
      const previousMyMentorBooksIds = previousMentorInfo.myMentors.map((mentor) => mentor.mybook_id);
      const isDifferentBetweenDataAndPreviousData = myMentorBooksIds.some((_value) => !previousMyMentorBooksIds.includes(_value));
      if (isDifferentBetweenDataAndPreviousData) {
        getBooksInfo({
          variables: {
            mybook_ids: myMentorBooksIds,
          },
        });
      } else {
        const fordata = _.sortBy(
          _(newData)
            .map((mentor) => ({
              ...mentor,
              mentorGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.mentorGroup, { _id: mentor.mentorGroup_id }).name,
              mentorSeq: mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.mentorGroup.findIndex((gr) => gr._id === mentor.mentorGroup_id),
            }))
            .value(),
          ["menteeSeq"]
        );
        setNewData(fordata);
        console.log("멘토 정보 업데이트 프로세스 작업 종료(without책 정보 갱신)");
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentoringData]);

  return newData;
};

export default useGetMentorBooks;
