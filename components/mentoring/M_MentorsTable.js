import { DeleteOutlined, DisconnectOutlined, ExportOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Form, Popconfirm, Row, Select, Space, Table, Tag } from "antd";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useGetMentorBooks from "../../components/mentoring/useHooks/useGetMentorBooks.js";
import { MUTATION_RE_ASSIGN_MENTORING_GROUP_MEMBER, MUTATION_TERMINATE_MENTORING } from "../../graphql/mutation/mentoring.js";
import { StyledBookTypeDiv } from "../common/styledComponent/buttons.js";
import DoubleLinesEllipsisContainer from "../common/styledComponent/DoubleLinesEllipsisContainer.js";
import { StyledFlexAlignCenter } from "../common/styledComponent/page.js";

const M_MentorsTable = ({ mentoringData, previousMentoringData, mentorGroup, isMentorEditMode }) => {
  const router = useRouter();

  const myMentorBooks = useGetMentorBooks(mentoringData, previousMentoringData);

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
      {myMentorBooks ? (
        <Table
          size="small"
          pagination={false}
          dataSource={myMentorBooks}
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
                initialValues={{ selector: mentorGroup[0]._id }}
                size="small"
              >
                <Form.Item name="selector">
                  <Select style={{ width: "140px" }}>
                    {mentorGroup
                      .filter((gr) => gr._id !== _record.mentorGroup_id)
                      .map(({ _id, name }) => (
                        <Select.Option key={_id} value={_id}>
                          {name}
                        </Select.Option>
                      ))}
                  </Select>
                </Form.Item>
                <Form.Item>
                  <Button htmlType="submit" disabled={mentorGroup.filter((gr) => gr._id !== _record.mentorGroup_id).length === 0}>
                    옮기기
                  </Button>
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
              dataIndex: "mentorGroupName",
              width: "15%",
              render: function title(v) {
                return <DoubleLinesEllipsisContainer>{v}</DoubleLinesEllipsisContainer>;
              },
            },
            {
              title: "책",
              dataIndex: "mybookTitle",
              width: "25%",
              render: function category(v, _record) {
                return (
                  <StyledFlexAlignCenter>
                    <StyledFlexAlignCenter>
                      <StyledBookTypeDiv booktype={_record.bookType}>{_record.bookType === "my" ? null : "$"}</StyledBookTypeDiv>
                    </StyledFlexAlignCenter>
                    <DoubleLinesEllipsisContainer>{v}</DoubleLinesEllipsisContainer>
                  </StyledFlexAlignCenter>
                );
              },
            },
            {
              title: "멘토",
              dataIndex: "mentorName",
              ellipsis: true,
              width: "15%",
            },
            {
              title: "최근 학습시간",
              dataIndex: "studyHistory",
              width: "35%",
              // eslint-disable-next-line react/display-name
              render: (v, record) =>
                isMentorEditMode ? (
                  <Row>
                    <Col
                      span={12}
                      onClick={() => {
                        if (!expandedRowKeys.includes(record._Id) && mentorGroup.filter((gr) => gr._id !== record.mentorGroup_id).length > 0) {
                          setExpandedRowKeys([record._id]);
                        }
                      }}
                    >
                      <Button disabled={mentorGroup.filter((gr) => gr._id !== record.mentorGroup_id).length === 0} icon={<ExportOutlined />} shape="circle" />
                    </Col>
                    <Popconfirm
                      title={record.menteeUsername + "님과의 멘토링을 정말 종료하시겠습니까?"}
                      okText="멘토링 종료하기"
                      cancelText="취소"
                      placement="topRight"
                      onConfirm={() => {
                        terminateMento({ menteeUser_id: record.menteeUser_id, mentorUser_id: record.mentorUser_id, mybook_id: record.mybook_id });
                      }}
                    >
                      <Col span={12} onClick={() => {}}>
                        <Button icon={<DisconnectOutlined />} shape="circle" />
                      </Col>
                    </Popconfirm>
                  </Row>
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

export default M_MentorsTable;
