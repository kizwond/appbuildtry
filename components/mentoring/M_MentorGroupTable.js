import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Col, Input, Modal, Row, Table, Tag, Drawer, Form } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  MUTATION_CHANGE_MENTORING_GROUP_ORDER,
  MUTATION_CREATE_MENTORING_GROUP,
  MUTATION_DELETE_MENTORING_GROUP,
  MUTATION_UPDATE_MENTORING_GROUP,
} from "../../graphql/mutation/mentoring";
import { StyledButtonForMainPage } from "../common/styledComponent/buttons";
import {
  StyledFlexAlignCenter,
  StyledFlexSpaceBetween,
} from "../common/styledComponent/page";

const M_MenteeGroupTable = ({
  mentorGroup,
  drawerMentorGroupVisible,
  changevisible,
}) => {
  const router = useRouter();

  const inputRefs = useRef({});
  const [inputValues, setInputValues] = useState({});
  const [activedInput, setActivedInput] = useState("");

  const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);

  const [form] = Form.useForm();
  const { resetFields, getFieldInstance } = form;

  useEffect(() => {
    let inialValues = {};
    mentorGroup.forEach((group) => {
      inialValues[group._id] = group.name;
    });
    setInputValues(inialValues);
  }, [mentorGroup]);

  const [changeMentoringGroupName] = useMutation(
    MUTATION_UPDATE_MENTORING_GROUP,
    {
      onCompleted: (data) => {
        if (data.mentoring_updateMentoringGroup.status === "200") {
          setActivedInput("");
          console.log("멘토링 그룹 이름 변경 후 받은 데이터", data);
        } else if (data.mentoring_updateMentoringGroup.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  async function changeGroupName({ mentoringGroup_id, newMentoringGroupName }) {
    try {
      await changeMentoringGroupName({
        variables: {
          groupType: "mentor",
          mentoringGroup_id,
          newMentoringGroupName,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [createNewMentoringGroupName, { loading }] = useMutation(
    MUTATION_CREATE_MENTORING_GROUP,
    {
      onCompleted: (data) => {
        if (data.mentoring_createMentoringGroup.status === "200") {
          resetFields();
          setNewGroupModalVisible(false);
          console.log("멘토링 그룹 생성 후 받은 데이터", data);
        } else if (data.mentoring_createMentoringGroup.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  async function createGroupName({ newGroupName }) {
    try {
      await createNewMentoringGroupName({
        variables: {
          groupType: "mentor",
          newGroupName,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [changeMentoringGroupOrder] = useMutation(
    MUTATION_CHANGE_MENTORING_GROUP_ORDER,
    {
      onCompleted: (data) => {
        if (data.mentoring_changeMentoringGroupOrder.status === "200") {
          console.log("멘토링 그룹 순서 변경 후 받은 데이터", data);
        } else if (data.mentoring_changeMentoringGroupOrder.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  async function changeGroupOrder({ mentoringGroup_id, direction }) {
    try {
      await changeMentoringGroupOrder({
        variables: {
          groupType: "mentor",
          mentoringGroup_id,
          direction,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [deleteMentoringGroup] = useMutation(MUTATION_DELETE_MENTORING_GROUP, {
    onCompleted: (data) => {
      if (data.mentoring_deleteMentoringGroup.status === "200") {
        console.log("멘토링 그룹 순서 변경 후 받은 데이터", data);
      } else if (data.mentoring_deleteMentoringGroup.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  async function deleteGroup({ currentMentoringGroup_id }) {
    try {
      await deleteMentoringGroup({
        variables: {
          groupType: "mentor",
          currentMentoringGroup_id,
          moveToMentoringGroup_id: mentorGroup[0]._id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  var focusInput;
  var newGroupFocus;

  return (
    <>
      <DrawerWrapper
        title={
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div>멘토 그룹 관리</div>
            <div>
              <StyledButtonForMainPage
                onClick={() => {
                  clearTimeout(newGroupFocus);
                  !newGroupModalVisible && setNewGroupModalVisible(true);
                  newGroupFocus = setTimeout(
                    () => form.getFieldInstance("menteeGroupName").focus(),
                    200
                  );
                }}
              >
                <PlusOutlined className="IconForButton" />
              </StyledButtonForMainPage>
            </div>
          </div>
        }
        placement="right"
        width={"100%"}
        visible={drawerMentorGroupVisible}
        onClose={() => {
          changevisible(false);
        }}
        headerStyle={{ padding: "12px 12px 8px 12px" }}
        bodyStyle={{ backgroundColor: "#e9e9e9" }}
      >
        <StyledModal
          visible={newGroupModalVisible}
          title={<div className="ForPageMainTitle">새 그룹 생성</div>}
          okButtonProps={{
            size: "small",
            loading: loading,
          }}
          cancelButtonProps={{
            size: "small",
          }}
          onCancel={() => {
            clearTimeout(newGroupFocus);
            setNewGroupModalVisible(false);
            resetFields();
          }}
          onClose={() => console.log("창닫기")}
          onOk={() => {
            form
              .validateFields()
              .then(({ menteeGroupName }) => {
                createGroupName({ newGroupName: menteeGroupName });
              })
              .catch((info) => {
                console.log("Validate Failed:", info);
              });
          }}
        >
          <Form form={form} id="newMenteeGroupForm">
            <Form.Item
              name="menteeGroupName"
              rules={[
                {
                  required: true,
                  message: "그룹 이름은 필수값입니다",
                },
                {
                  validator: (_, value) =>
                    mentorGroup.map((gr) => gr.name).includes(value)
                      ? Promise.reject(new Error("동일한 그룹명이 존재합니다."))
                      : Promise.resolve(),
                },
              ]}
            >
              <Input placeholder="그룹이름을 입력하세요." />
            </Form.Item>
          </Form>
        </StyledModal>

        <Table
          size="small"
          pagination={false}
          dataSource={mentorGroup.map((group) => ({
            ...group,
            key: group._id,
          }))}
          bordered={false}
          columns={[
            {
              title: "그룹명",
              dataIndex: "name",
              render: function menteeGroupElement(value, record, index) {
                return (
                  <>
                    <Row align="middle">
                      <Col span={activedInput.includes(record._id) ? 17 : 12}>
                        <Input
                          ref={(ref) => (inputRefs.current[record._id] = ref)}
                          size="small"
                          value={inputValues[record._id]}
                          onChange={(e) =>
                            setInputValues({
                              ...inputValues,
                              [record._id]: e.target.value,
                            })
                          }
                          bordered={activedInput.includes(record._id)}
                          disabled={!activedInput.includes(record._id)}
                        />
                      </Col>
                      <Col
                        span={activedInput.includes(record._id) ? 7 : 3}
                        onClick={() => {
                          if (!activedInput.includes(record._id)) {
                            clearTimeout(focusInput);
                            setActivedInput(record._id);
                            focusInput = setTimeout(
                              () => inputRefs.current[record._id].focus(),
                              100
                            );
                          }
                        }}
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {!activedInput.includes(record._id) ? (
                          <EditFilled style={{ fontSize: "1rem" }} />
                        ) : (
                          <StyledFlexSpaceBetween>
                            <div
                              onClick={() => {
                                // 서버요청보내야함
                                if (
                                  inputValues[record._id] !== "" &&
                                  value !== inputValues[record._id]
                                ) {
                                  changeGroupName({
                                    mentoringGroup_id: record._id,
                                    newMentoringGroupName:
                                      inputValues[record._id],
                                  });
                                }
                              }}
                            >
                              <Tag>수정</Tag>
                            </div>
                            <div
                              onClick={() => {
                                setActivedInput("");
                                setInputValues({
                                  ...inputValues,
                                  [record._id]: value,
                                });
                              }}
                            >
                              <Tag>취소</Tag>
                            </div>
                          </StyledFlexSpaceBetween>
                        )}
                      </Col>
                      <Col span={activedInput.includes(record._id) ? 0 : 6}>
                        <StyledFlexAlignCenter>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              changeGroupOrder({
                                mentoringGroup_id: record._id,
                                direction: "up",
                              });
                            }}
                          >
                            <ArrowUpOutlined style={{ fontSize: "1rem" }} />
                          </div>
                          <div
                            style={{
                              width: "100%",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onClick={() => {
                              changeGroupOrder({
                                mentoringGroup_id: record._id,
                                direction: "down",
                              });
                            }}
                          >
                            <ArrowDownOutlined style={{ fontSize: "1rem" }} />
                          </div>
                        </StyledFlexAlignCenter>
                      </Col>
                      <Col
                        span={activedInput.includes(record._id) ? 0 : 3}
                        onClick={() => {
                          deleteGroup({ currentMentoringGroup_id: record._id });
                        }}
                      >
                        삭제
                      </Col>
                    </Row>
                  </>
                );
              },
            },
            // {
            //   title: "그룹명 변경",
            //   align: "center",
            //   width: 0,
            //   colSpan: 0,
            //   onCell: (record, rowIndex) => {
            //     return {
            //       onClick: (event) => {}, // click row
            //       onDoubleClick: (event) => {}, // double click row
            //       onContextMenu: (event) => {}, // right button click row
            //       onMouseEnter: (event) => {}, // mouse enter row
            //       onMouseLeave: (event) => {}, // mouse leave row
            //     };
            //   },
            // },
            // {
            //   title: "상하 이동",
            //   align: "center",
            //   width: "30%",
            // },
            // {
            //   title: "삭제",
            //   align: "center",
            //   width: "15%",
            // },
          ]}
        />
      </DrawerWrapper>
    </>
  );
};

export default M_MenteeGroupTable;

const DrawerWrapper = styled(Drawer)`
  top: 40px;
  & .ant-card-actions {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    & > li {
      margin: 0;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  & div,
  & button,
  & span,
  & object,
  & iframe,
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6,
  & p,
  & blockquote,
  & pre,
  & abbr,
  & address,
  & cite,
  & code,
  & del,
  & dfn,
  & em,
  & img,
  & ins,
  & kbd,
  & q,
  & samp,
  & small,
  & strong,
  & sub,
  & sup,
  & var,
  & b,
  & i,
  & dl,
  & dt,
  & dd,
  & ol,
  & ul,
  & li,
  & fieldset,
  & form,
  & label,
  & legend,
  & table,
  & caption,
  & tbody,
  & tfoot,
  & thead,
  & tr,
  & th,
  & td,
  & article,
  & aside,
  & canvas,
  & details,
  & figcaption,
  & figure,
  & footer,
  & header,
  & hgroup,
  & menu,
  & nav,
  & section,
  & summary,
  & time,
  & mark,
  & audio,
  & video,
  & input {
    font-size: 1rem;
  }

  & .ant-drawer-header-title {
    justify-content: start;
    width: 100%;
  }

  & .ant-drawer-title {
    width: 100%;
  }

  & .ant-input {
    height: 22px;
  }
  & .ant-input[disabled] {
    color: black;
  }
`;

const StyledModal = styled(Modal)`
  min-width: 330px;

  & .ant-modal-body {
    padding: 8px 24px 8px 24px;
    min-height: 64px;
    & * {
      font-size: 1rem;
    }
  }

  & .ant-modal-footer {
    padding: 10px 24px;
  }

  & .ant-form-item {
    margin-bottom: 16px;
  }

  & .ant-form-item-with-help,
  & .ant-form-item-has-error {
    margin-bottom: 0;
  }

  & .ant-form-item-with-help .ant-form-item-explain {
    min-height: 16px;
  }
`;
