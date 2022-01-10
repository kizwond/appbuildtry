import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  EditFilled,
  PlusOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Button, Input, Modal, Table, Drawer, Form } from "antd";
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
import { StyledFlexAlignCenter } from "../common/styledComponent/page";

const M_MenteeGroupTable = ({
  menteeGroup,
  drawerMenteeGroupVisible,
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
    menteeGroup.forEach((group) => {
      inialValues[group._id] = group.name;
    });
    setInputValues(inialValues);
  }, [menteeGroup]);

  useEffect(() => {
    if (newGroupModalVisible) {
      setTimeout(() => {
        getFieldInstance("menteeGroupName").focus({ cursor: "end" });
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newGroupModalVisible]);

  useEffect(() => {
    if (activedInput !== "" && inputRefs.current[activedInput]) {
      setTimeout(() => {
        inputRefs.current[activedInput].focus({ cursor: "end" });
      }, 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activedInput]);

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
          groupType: "mentee",
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
          groupType: "mentee",
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
          groupType: "mentee",
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
          groupType: "mentee",
          currentMentoringGroup_id,
          moveToMentoringGroup_id: menteeGroup[0]._id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

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
            <div className="ForMobilePageMainTitle">멘티 그룹 관리</div>
            <div>
              <StyledButtonForMainPage
                onClick={() => {
                  !newGroupModalVisible && setNewGroupModalVisible(true);
                }}
              >
                <PlusOutlined className="IconForButton" />
              </StyledButtonForMainPage>
            </div>
          </div>
        }
        placement="right"
        width={"100%"}
        visible={drawerMenteeGroupVisible}
        onClose={() => {
          changevisible(false);
        }}
        headerStyle={{ padding: "12px 12px 8px 12px" }}
        bodyStyle={{ backgroundColor: "#e9e9e9" }}
      >
        <StyledModal
          visible={newGroupModalVisible}
          title={<div className="ForMobilePageMainTitle">새 그룹 생성</div>}
          okButtonProps={{
            size: "small",
            loading: loading,
          }}
          cancelButtonProps={{
            size: "small",
          }}
          onCancel={() => {
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
                    menteeGroup.map((gr) => gr.name).includes(value)
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
          dataSource={menteeGroup.map((group) => ({
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: 8,
                      marginRight: 8,
                      gap: activedInput.includes(record._id) ? 8 : 0,
                    }}
                  >
                    <Input
                      ref={(ref) => (inputRefs.current[record._id] = ref)}
                      value={inputValues[record._id]}
                      onChange={(e) =>
                        setInputValues({
                          ...inputValues,
                          [record._id]: e.target.value,
                        })
                      }
                      bordered={activedInput.includes(record._id)}
                      disabled={!activedInput.includes(record._id)}
                      style={{
                        display: "block",
                        flex: activedInput.includes(record._id)
                          ? null
                          : "0 0 50%",
                        maxWidth: activedInput.includes(record._id)
                          ? null
                          : "50%",
                      }}
                    />
                    {activedInput.includes(record._id) && (
                      <>
                        <Button
                          onClick={() => {
                            // 서버요청보내야함
                            if (
                              inputValues[record._id] !== "" &&
                              value !== inputValues[record._id]
                            ) {
                              changeGroupName({
                                mentoringGroup_id: record._id,
                                newMentoringGroupName: inputValues[record._id],
                              });
                            }
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          onClick={() => {
                            setActivedInput("");
                            setInputValues({
                              ...inputValues,
                              [record._id]: value,
                            });
                          }}
                        >
                          취소
                        </Button>
                      </>
                    )}
                    {!activedInput.includes(record._id) && (
                      <>
                        <div
                          onClick={() => {
                            if (!activedInput.includes(record._id)) {
                              setActivedInput(record._id);
                            }
                          }}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flex: "0 0 12.5%",
                            maxWidth: "12.5%",
                            position: "relative",
                          }}
                        >
                          <EditFilled style={{ fontSize: "1rem" }} />
                        </div>
                        <div
                          style={{
                            display: "block",
                            flex: "0 0 25%",
                            maxWidth: "25%",
                            position: "relative",
                          }}
                        >
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
                        </div>
                        <div
                          onClick={() => {
                            deleteGroup({
                              currentMentoringGroup_id: record._id,
                            });
                          }}
                          style={{
                            display: "block",
                            flex: "0 0 12.5%",
                            maxWidth: "12.5%",
                            position: "relative",
                          }}
                        >
                          삭제
                        </div>
                      </>
                    )}
                  </div>
                );
              },
            },
          ]}
        />
      </DrawerWrapper>
    </>
  );
};

export default M_MenteeGroupTable;

const DrawerWrapper = styled(Drawer)`
  top: 40px;
  & .ant-drawer-body * {
    font-size: 1rem;
  }

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
  & .ant-drawer-header-title {
    justify-content: start;
    width: 100%;
  }

  & .ant-drawer-title {
    width: 100%;
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
