import { useMutation } from "@apollo/client";
import { Button, Form, Input, Select, Space, Table, Tag } from "antd";
import React, { useState } from "react";
import { MUTATION_RE_ASSIGN_MENTORING_GROUP_MEMBER, MUTATION_TERMINATE_MENTORING } from "../../graphql/mutation/mentoring";

const M_MenteesTable = ({ newData, isMenteeEditMode, menteeGroup }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const [terminateMentoring] = useMutation(MUTATION_TERMINATE_MENTORING, {
    onCompleted: (data) => {
      if (data.mentoring_terminateMentoring.status === "200") {
        console.log("멘토링 종료 후 받은 데이터", data);
      } else if (data.mentoring_terminateMentoring.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  async function terminateMento({ menteeUser_id, mentorUser_id, mybook_id }) {
    try {
      await terminateMentoring({
        variables: {
          forTerminateMentoring: {
            menteeUser_id,
            mentorUser_id,
            mybook_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [reassignMentoringMemberToAnotherGroup] = useMutation(MUTATION_RE_ASSIGN_MENTORING_GROUP_MEMBER, {
    onCompleted: (data) => {
      if (data.mentoring_moveToOtherMentoringGroup.status === "200") {
        console.log("멘토링 멤버 다른 그룹으로 옮긴 후 받은 데이터", data);
        setExpandedRowKeys([]);
      } else if (data.mentoring_moveToOtherMentoringGroup.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  async function reassignMentoringMember({ target_id, newMentoringGroup_id }) {
    try {
      await reassignMentoringMemberToAnotherGroup({
        variables: {
          groupType: "mentor",
          target_id,
          newMentoringGroup_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {newData ? (
        <Table
          size="small"
          pagination={false}
          dataSource={newData}
          expandable={{
            expandIcon: () => null,
            columnWidth: 0,
            expandedRowKeys,
            // eslint-disable-next-line react/display-name
            expandedRowRender: (_record, _index) => (
              <Form
                layout="inline"
                onFinish={({ selector }) => reassignMentoringMember({ target_id: _record._id, newMentoringGroup_id: selector })}
                onValuesChange={(cv) => console.log(cv)}
                initialValues={{ selector: menteeGroup[0]._id }}
                size="small"
              >
                <Form.Item name="selector">
                  <Select style={{ width: "140px" }}>
                    {menteeGroup
                      .filter((gr) => gr._id !== _record.menteeGroup_id)
                      .map(({ _id, name }) => (
                        <Select.Option key={_id} value={_id}>
                          {name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit">옮기기</Button>
                </Form.Item>
                <Form.Item>
                  <Button htmlType="reset">취소</Button>
                </Form.Item>
              </Form>
            ),
          }}
          columns={[
            {
              title: "그룹",
              dataIndex: "menteeGroupName",
              width: "15%",
            },
            {
              title: "책",
              dataIndex: "mybookTitle",
              width: "25%",
            },
            {
              title: "멘토",
              dataIndex: "menteeName",
              ellipsis: true,
              width: "15%",
            },
            {
              title: isMenteeEditMode ? "편집" : "최근 학습시간",
              dataIndex: "studyHistory",
              width: "35%",
              // eslint-disable-next-line react/display-name
              render: (v, record) =>
                isMenteeEditMode ? (
                  <Space>
                    <Button
                      onClick={() => {
                        setExpandedRowKeys([record._id]);
                      }}
                    >
                      옮기기
                    </Button>
                    <Button
                      onClick={() => {
                        terminateMento({ menteeUser_id: record.menteeUser_id, mentorUser_id: record.mentorUser_id, mybook_id: record.mybook_id });
                      }}
                    >
                      취소
                    </Button>
                  </Space>
                ) : (
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

export default M_MenteesTable;
