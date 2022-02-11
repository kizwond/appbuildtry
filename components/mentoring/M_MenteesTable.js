import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Button,
  Col,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import { useRouter } from "next/router";
import React, { useCallback, useState } from "react";
import {
  MUTATION_RE_ASSIGN_MENTORING_GROUP_MEMBER,
  MUTATION_TERMINATE_MENTORING,
} from "../../graphql/mutation/mentoring";
import DoubleLinesEllipsisContainer from "../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledFlexAlignCenter } from "../common/styledComponent/page";
import { StyledBookTypeDiv } from "../common/styledComponent/buttons";
import { DisconnectOutlined, ExportOutlined } from "@ant-design/icons";
import moment from "moment";
import styled from "styled-components";
import StudyHistoryPerBook from "../common/studyHistoryPerBook/StudyHistoryPerBook";
import Text from "antd/lib/typography/Text";
import _ from "lodash";

const M_MenteesTable = ({ newData, isMenteeEditMode, menteeGroup }) => {
  const router = useRouter();
  const [
    visibleIdOfBookStudyHistoryDrawer,
    setVisibleIdOfBookStudyHistoryDrawer,
  ] = useState("");
  const openDrawer = useCallback((mybook_id) => {
    setVisibleIdOfBookStudyHistoryDrawer(mybook_id);
  }, []);
  const closeDrawer = useCallback(() => {
    setVisibleIdOfBookStudyHistoryDrawer("");
  }, []);

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

  const [reassignMentoringMemberToAnotherGroup] = useMutation(
    MUTATION_RE_ASSIGN_MENTORING_GROUP_MEMBER,
    {
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
    }
  );

  async function reassignMentoringMember({ target_id, newMentoringGroup_id }) {
    try {
      await reassignMentoringMemberToAnotherGroup({
        variables: {
          groupType: "mentee",
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
          className="mt-2"
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
                onFinish={({ selector }) =>
                  reassignMentoringMember({
                    target_id: _record._id,
                    newMentoringGroup_id: selector,
                  })
                }
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
              render: function title(v) {
                return (
                  <DoubleLinesEllipsisContainer>
                    {v}
                  </DoubleLinesEllipsisContainer>
                );
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
                      <StyledBookTypeDiv booktype={_record.bookType} />
                    </StyledFlexAlignCenter>
                    <DoubleLinesEllipsisContainer>
                      {v}
                    </DoubleLinesEllipsisContainer>
                  </StyledFlexAlignCenter>
                );
              },
            },
            {
              title: "멘티",
              dataIndex: "menteeUsername",
              ellipsis: true,
              width: "15%",
              align: "center",
              filters: _.uniqBy(
                newData.map((item) => ({
                  text: item.menteeUsername,
                  value: item.menteeUsername,
                })),
                "text"
              ),
              onFilter: (value, record) =>
                record.menteeUsername.indexOf(value) === 0,
              filterSearch: true,
              render: function disp(v, record) {
                return (
                  <div className="px-1 overflow-hidden">
                    <div>{record.menteeName}</div>
                    <div>({record.menteeUsername})</div>
                  </div>
                );
              },
            },
            {
              title: isMenteeEditMode ? "편집" : "최근 학습일",
              dataIndex: "studyHistory",
              width: "35%",
              align: "center",
              // eslint-disable-next-line react/display-name
              render: (v, record) =>
                isMenteeEditMode ? (
                  <Row>
                    <Col
                      span={12}
                      onClick={() => {
                        if (
                          !expandedRowKeys.includes(record._Id) &&
                          menteeGroup.filter(
                            (gr) => gr._id !== record.menteeGroup_id
                          ).length > 0
                        ) {
                          setExpandedRowKeys([record._id]);
                        }
                      }}
                    >
                      <Button
                        disabled={
                          menteeGroup.filter(
                            (gr) => gr._id !== record.menteeGroup_id
                          ).length === 0
                        }
                        icon={<ExportOutlined />}
                        shape="circle"
                      />
                    </Col>
                    <Popconfirm
                      title={
                        record.mentorUsername +
                        "님과의 멘토링을 정말 종료하시겠습니까?"
                      }
                      okText="멘토링 종료하기"
                      cancelText="취소"
                      placement="topRight"
                      onConfirm={() => {
                        terminateMento({
                          menteeUser_id: record.menteeUser_id,
                          mentorUser_id: record.mentorUser_id,
                          mybook_id: record.mybook_id,
                        });
                      }}
                    >
                      <Col span={12} onClick={() => {}}>
                        <Button icon={<DisconnectOutlined />} shape="circle" />
                      </Col>
                    </Popconfirm>
                  </Row>
                ) : (
                  <div className="flex justify-around gap-2">
                    <div className="min-w-[48px]">
                      {v ? moment(new Date(Number(v))).format("YY.MM.DD") : "-"}
                    </div>
                    <Text
                      href="#"
                      target="_blank"
                      onClick={() => {
                        openDrawer(record.mybook_id);
                      }}
                    >
                      상세보기
                    </Text>
                    <DrawerWrapper
                      title="상세 보기"
                      placement="right"
                      width={"100%"}
                      visible={
                        visibleIdOfBookStudyHistoryDrawer === record.mybook_id
                      }
                      onClose={closeDrawer}
                      headerStyle={{ padding: "12px 12px 8px 12px" }}
                      bodyStyle={{ backgroundColor: "#e9e9e9" }}
                    >
                      {visibleIdOfBookStudyHistoryDrawer ===
                        record.mybook_id && (
                        <StudyHistoryPerBook
                          mybook_id={record.mybook_id}
                          forWhom="mentor"
                          menteeUser_id={record.menteeUser_id}
                        />
                      )}
                    </DrawerWrapper>
                  </div>
                ),
            },
          ]}
        />
      ) : null}
    </>
  );
};

export default M_MenteesTable;

const DrawerWrapper = styled(Drawer)`
  top: 40px;

  height: calc(100vh - 40px);

  & .ant-drawer-wrapper-body {
    height: ${({ setheight }) => setheight || "auto"}px;
  }
  & .ant-card-actions {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    & > li {
      margin: 0;
      height: 3.5rem;
      & > span {
        width: 100%;
        height: 100%;
        & > div {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
`;
