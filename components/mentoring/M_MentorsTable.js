import { Table } from "antd";
import React from "react";
import useGetMentorBooks from "../../components/mentoring/useHooks/useGetMentorBooks.js";

const M_MentorsTable = ({ mentoringData }) => {
  const myMentorBooks = useGetMentorBooks(mentoringData);

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
              title: "멘터이름",
              dataIndex: "mentorName",
              width: "15%",
            },
            {
              title: "학습이력",
              dataIndex: "studyHistory",
              width: "35%",
              // eslint-disable-next-line react/display-name
              render: (v) => (
                <>
                  {v.map((item, index) => (
                    <span key={index}>{`${index === 4 ? item : `${item}, `}`} </span>
                  ))}
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
