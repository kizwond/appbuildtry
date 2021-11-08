import { useEffect, useMemo, useRef, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import _ from "lodash";

import { GET_MENTORING, GET_BOOKS_INFO } from "../../../graphql/query/mentoring";

const useGetMentoringAndMenteeBooks = () => {
  const [getBooksInfo, { data: menteeBooks, error, loading }] = useLazyQuery(GET_BOOKS_INFO, {
    onCompleted: (data) => console.log({ 책정보: data }),
  });

  const [getMentoring, { data: mentoringData, error: error1, loading: loading1 }] = useLazyQuery(GET_MENTORING, {
    onCompleted: (data) => {
      console.log({ 멘토링정보: data });
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

  const newData = useMemo(() => {
    return (
      menteeBooks &&
      mentoringData &&
      _(mentoringData.mentoring_getMentoring.mentorings[0].myMentees)
        .map(({ mybookTitle, menteeGroup_id, mybook_id, menteeUsername, menteeName }) => ({
          key: mybook_id,
          mybookTitle,
          mybook_id,
          menteeUsername,
          menteeName,
          menteeGroup_id,
          menteeGroupName: _.find(mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup, { _id: menteeGroup_id }).name,
          studyHistory:
            _(_.find(menteeBooks.mybook_getManyMybookInfo.mybooks, (book) => book._id === mybook_id).stats?.studyHistory)
              .map((history) => history.studyHour)
              .take(5)
              .value() === []
              ? _(_.find(menteeBooks.mybook_getManyMybookInfo.mybooks, (book) => book._id === mybook_id).stats.studyHistory)
                  .map((history) => history.studyHour)
                  .take(5)
                  .value()
              : ["0.5", "2", "0", "1", "2"],
        }))
        .value()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menteeBooks]);

  // const menteeGroupSelector = useMemo(() => {
  //   return (
  //     mentoringData && (
  //       <>
  //         <Select defaultValue={mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup[0]._id} size="small" onChange={(v) => (selectorRef.current = v)}>
  //           {mentoringData.mentoring_getMentoring.mentorings[0].mentoring_info.menteeGroup.map((group: any) => (
  //             <Select.Option key={group._id} value={group._id}>
  //               {group.name}
  //             </Select.Option>
  //           ))}
  //           {/* <Select.Option value="미지정">dk </Select.Option>
  //           <Select.Option value="그룹1">그룹1 </Select.Option>
  //           <Select.Option value="그룹2">그룹2 </Select.Option> */}
  //         </Select>
  //       </>
  //     )
  //   );
  // }, [mentoringData]);

  return { newData, mentoringData };
};

export default useGetMentoringAndMenteeBooks;
