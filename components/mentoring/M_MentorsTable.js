import { Table, Tag } from "antd";
import React from "react";
import useGetMentorBooks from "../../components/mentoring/useHooks/useGetMentorBooks.js";

const M_MentorsTable = ({ mentoringData, previousMentoringData }) => {
  const myMentorBooks = useGetMentorBooks(mentoringData, previousMentoringData);

  return (
    <>
      {myMentorBooks ? (
        <Table
          size="small"
          pagination={false}
          dataSource={myMentorBooks}
          columns={[
            {
              title: "그룹",
              dataIndex: "mentorGroupName",
              width: "15%",
            },
            {
              title: "책",
              dataIndex: "mybookTitle",
              width: "25%",
            },
            {
              title: "멘토",
              dataIndex: "mentorNameAndId",
              ellipsis: true,
              width: "15%",
            },
            {
              title: "최근 학습시간",
              dataIndex: "studyHistory",
              width: "35%",
              // eslint-disable-next-line react/display-name
              render: (v) => (
                <>
                  {v.map((item, index) => (
                    <span key={index}>{`${index === 2 ? item : `${item}, `}`} </span>
                  ))}
                  <Tag style={{ marginLeft: "5px" }}>상세보기</Tag>
                </>
              ),
            },
          ]}
        />
      ) : null}
    </>
  );
};

export default M_MentorsTable;
