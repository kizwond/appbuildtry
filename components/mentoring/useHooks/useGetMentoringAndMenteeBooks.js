import { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";

import { GET_MENTORING, GET_MY_BOOKS_BY_BOOK_IDS } from "../../../graphql/query/allQuery";
import { useRouter } from "next/router";

const useGetMentoringAndMenteeBooks = () => {
  const [newData, setNewData] = useState(null);

  const router = useRouter();
  const [getBooksInfo, { data: menteeBooks, error, loading }] = useLazyQuery(GET_MY_BOOKS_BY_BOOK_IDS, {
    onCompleted: (data) => {
      if (data.mybook_getMybookByMybookIDs.status === "200") {
        const fordata = _.sortBy(
          mentoringData.mentoring_getMentoring.mentorings[0].myMentees.map((mentee) => ({
            ...mentee,
            key: mentee.mybook_id,
            menteeNameAndId: `${mentee.menteeName}(${mentee.menteeUsername})`,
            menteeGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup, { _id: mentee.menteeGroup_id }).name,
            menteeSeq: mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup.findIndex((gr) => gr._id === mentee.menteeGroup_id),
            studyHistory:
              _(_.find(menteeBooks.mybook_getMybookByMybookIDs.mybooks, (book) => book._id === mentee.mybook_id).stats?.studyHistory)
                .map((history) => history.studyHour)
                .take(3)
                .value() === []
                ? _(_.find(menteeBooks.mybook_getMybookByMybookIDs.mybooks, (book) => book._id === mentee.mybook_id).stats.studyHistory)
                    .map((history) => history.studyHour)
                    .take(3)
                    .value()
                : ["0.5", "2", "0"],
          })),
          ["menteeSeq"]
        );
        setNewData(fordata);
        console.log("멘티정보 업데이트 프로세스 작업 종료(with책 정보 갱신)", data);
      } else if (data.mybook_getMybookByMybookIDs.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const [getMentoring, { data: mentoringData, previousData: previousMentoringData, error: error1, loading: loading1 }] = useLazyQuery(GET_MENTORING, {
    onCompleted: (data) => {
      if (data.mentoring_getMentoring.status === "200") {
        console.log("멘토링 정보 받음", data);
      } else if (data.mentoring_getMentoring.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  useEffect(() => {
    if (mentoringData) {
      console.log("멘티정보 업데이트 프로세스 작업 중");
      const mentoInfo = mentoringData.mentoring_getMentoring.mentorings[0];
      const myMenteeBooksIds = mentoInfo.myMentees.map((mentee) => mentee.mybook_id);

      if (typeof previousMentoringData === "undefined") {
        getBooksInfo({
          variables: {
            mybook_ids: myMenteeBooksIds,
          },
        });
        return;
      }
      const previousMentoInfo = previousMentoringData.mentoring_getMentoring.mentorings[0];

      const previousMyMenteeBooksIds = previousMentoInfo.myMentees.map((mentee) => mentee.mybook_id);

      const isDifferentBetweenDataAndPreviousData = myMenteeBooksIds.some((_value) => !previousMyMenteeBooksIds.includes(_value));
      if (isDifferentBetweenDataAndPreviousData) {
        getBooksInfo({
          variables: {
            mybook_ids: myMenteeBooksIds,
          },
        });
      } else {
        const fordata = _.sortBy(
          _(newData)
            .map((mentee) => ({
              ...mentee,
              menteeGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup, { _id: mentee.menteeGroup_id }).name,
              menteeSeq: mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup.findIndex((gr) => gr._id === mentee.menteeGroup_id),
            }))
            .value(),
          ["menteeSeq"]
        );
        setNewData(fordata);
        console.log("멘티정보 업데이트 프로세스 작업 종료(without책 정보 갱신)");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentoringData]);

  useEffect(() => {
    getMentoring();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { newData, mentoringData, previousMentoringData };
};

export default useGetMentoringAndMenteeBooks;
