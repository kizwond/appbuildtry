import { useEffect, useMemo, useState } from "react";
import { useLazyQuery } from "@apollo/client";
import _ from "lodash";

import { GET_MENTORING, GET_MY_BOOKS_BY_BOOK_IDS } from "../../../graphql/query/allQuery";
import { useRouter } from "next/router";

const useGetMentoringAndMenteeBooks = () => {
  const router = useRouter();
  const [isFetching, setIsFetfetching] = useState(false);
  const [getBooksInfo, { data: menteeBooks, error, loading }] = useLazyQuery(GET_MY_BOOKS_BY_BOOK_IDS, {
    onCompleted: (data) => {
      setIsFetfetching(false);
      if (data.mybook_getMybookByMybookIDs.status === "200") {
        console.log("멘티 책 정보 받음", data);
      } else if (data.mybook_getMybookByMybookIDs.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const [getMentoring, { data: mentoringData, error: error1, loading: loading1 }] = useLazyQuery(GET_MENTORING, {
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
      console.log("유즈이펙트");
      const mentoInfo = mentoringData.mentoring_getMentoring.mentorings[0];

      const myMenteeBooksIds = _(mentoInfo.myMentees)
        .map((mentee) => mentee.mybook_id)
        .value();

      getBooksInfo({
        variables: {
          mybook_ids: myMenteeBooksIds,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mentoringData]);

  useEffect(() => {
    getMentoring();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setIsFetfetching(true);
  }, [mentoringData]);

  const newData = useMemo(() => {
    return (
      menteeBooks &&
      mentoringData &&
      _(mentoringData.mentoring_getMentoring.mentorings[0].myMentees)
        .map((mentee) => ({
          ...mentee,
          key: mentee.mybook_id,
          menteeNameAndId: `${mentee.menteeName}(${mentee.menteeUsername})`,
          menteeGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup, { _id: mentee.menteeGroup_id }).name,
          menteeSeq: mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup.findIndex((gr) => gr._id === mentee.menteeGroup_id),
          studyHistory: isFetching
            ? []
            : _(_.find(menteeBooks.mybook_getMybookByMybookIDs.mybooks, (book) => book._id === mentee.mybook_id).stats?.studyHistory)
                .map((history) => history.studyHour)
                .take(3)
                .value() === []
            ? _(_.find(menteeBooks.mybook_getMybookByMybookIDs.mybooks, (book) => book._id === mentee.mybook_id).stats.studyHistory)
                .map((history) => history.studyHour)
                .take(3)
                .value()
            : ["0.5", "2", "0"],
        }))
        .value()
        .sort((a, b) => {
          if (a.menteeSeq > b.menteeSeq) return 1;
          if (a.menteeSeq < b.menteeSeq) return -1;
          if (a.menteeSeq === b.menteeSeq) return 0;
        })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menteeBooks, mentoringData]);

  return { newData, mentoringData };
};

export default useGetMentoringAndMenteeBooks;
