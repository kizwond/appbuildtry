/* eslint-disable react/display-name */
import { forwardRef, memo, useRef, useState } from "react";

import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import {
  MUTATION_CREATE_MY_BOOK_CATEGORY,
  MUTATION_DELETE_MY_BOOK_CATEGORY,
  MUTATION_UPDATE_MY_BOOK_CATEGORY_NAME,
  MUTATION_UPDATE_MY_BOOK_CATEGORY_ORDER,
} from "../../../../graphql/mutation/categorySet";
import { FRAGMENT_MYBOOK } from "../../../../graphql/fragment/book";

import styled from "styled-components";
import { Modal, Button, Input, Table, Space } from "antd";
import {
  EditFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import { StyledTwoLinesEllipsis } from "../../../common/styledComponent/page";

const CategorySettingModal = forwardRef(
  ({ category, visible, changeVisible }, ref) => {
    const [editingCell, setEditingCell] = useState("");
    const [cateName, setCateName] = useState("");
    const [expandedRowKeys, setExpandedRowKeys] = useState("");
    const newIdRef = useRef();
    const router = useRouter();

    const inputRefs = useRef({});
    const newCateRef = useRef({});

    const [createNewCategory] = useMutation(MUTATION_CREATE_MY_BOOK_CATEGORY, {
      onCompleted: (received_data) => {
        console.log("책생성후 받은 데이터", received_data);
        if (received_data.mybookcateset_createMybookcate.status === "200") {
          ref(
            received_data.mybookcateset_createMybookcate.mybookcatesets[0]
              .mybookcates[newIdRef.current]._id
          );
        } else if (
          received_data.mybookcateset_createMybookcate.status === "401"
        ) {
          router.push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    });

    async function createCategory({ seq, name }) {
      try {
        await createNewCategory({
          variables: {
            forCreateMybookcate: {
              mybookcateset_id: category._id,
              name,
              seq,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
    const [changeCategoryName] = useMutation(
      MUTATION_UPDATE_MY_BOOK_CATEGORY_NAME,
      {
        onCompleted: (received_data) => {
          console.log("received_data", received_data);
          if (
            received_data.mybookcateset_updateMybookcateInfo.status === "200"
          ) {
          } else if (
            received_data.mybookcateset_updateMybookcateInfo.status === "401"
          ) {
            router.push("/account/login");
          } else {
            console.log("어떤 문제가 발생함");
          }
        },
      }
    );
    async function updateCategory({ mybookcate_id, name }) {
      try {
        await changeCategoryName({
          variables: {
            forUpdateMybookcateInfo: {
              mybookcateset_id: category._id,
              mybookcate_id,
              name,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    const [changeCategoryOrder] = useMutation(
      MUTATION_UPDATE_MY_BOOK_CATEGORY_ORDER,
      {
        onCompleted: (received_data) => {
          console.log("received_data", received_data);
          if (
            received_data.mybookcateset_updateMybookcateOrder.status === "200"
          ) {
          } else if (
            received_data.mybookcateset_updateMybookcateOrder.status === "401"
          ) {
            router.push("/account/login");
          } else {
            console.log("어떤 문제가 발생함");
          }
        },
      }
    );
    async function changeCategoryPosition({ mybookcate_id, direction }) {
      try {
        await changeCategoryOrder({
          variables: {
            forUpdateMybookcateOrder: {
              mybookcateset_id: category._id,
              mybookcate_id,
              direction,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    }

    const [deleteCategory] = useMutation(MUTATION_DELETE_MY_BOOK_CATEGORY, {
      onCompleted: (received_data) => {
        console.log("received_data", received_data);
        if (received_data.mybookcateset_deleteMybookcate.status === "200") {
        } else if (
          received_data.mybookcateset_deleteMybookcate.status === "401"
        ) {
          router.push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    });
    async function deleteACategory({ mybookcate_id }) {
      try {
        await deleteCategory({
          variables: {
            forDeleteMybookcate: {
              mybookcateset_id: category._id,
              mybookcate_id,
              moveToMybookcate_id: category.mybookcates.find(
                (cate) => cate.isFixed === "yes"
              )._id,
            },
          },
          refetchQueries: gql`
            ${FRAGMENT_MYBOOK}
            query {
              mybook_getMybookByUserID {
                status
                msg
                mybooks {
                  ...MyBookFragment
                }
              }
            }
          `,
        });
      } catch (error) {
        console.log(error);
      }
    }

    const dataSource = category.mybookcates.map((_cate) => ({
      ..._cate,
      _id: _cate._id,
      key: _cate._id,
    }));

    const columns = [
      {
        title: "카테고리 이름",
        key: "name",
        dataIndex: "name",
        width: 130,
        render: (_value, _record) => {
          const obj = {
            children: (
              <div
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                }}
                onClick={() => {
                  setExpandedRowKeys([]);
                }}
              >
                <div
                  style={{
                    display: editingCell === _record.key ? "flex" : "none",
                    width: "100%",
                  }}
                >
                  <Input
                    ref={(ref) => (inputRefs.current[_record.key] = ref)}
                    size="small"
                    value={cateName}
                    onChange={(e) => {
                      setCateName(e.target.value);
                    }}
                    style={{ marginRight: "5px" }}
                  />
                  <Button
                    size="small"
                    type="primary"
                    disabled={
                      cateName.length === 0 ||
                      dataSource.map((_c) => _c.name).includes(cateName)
                    }
                    onClick={() => {
                      updateCategory({
                        mybookcate_id: _record._id,
                        name: cateName,
                      });
                      setCateName("");
                      setEditingCell("");
                    }}
                    style={{ marginRight: "5px" }}
                  >
                    수정
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      setCateName("");
                      setEditingCell("");
                    }}
                  >
                    취소
                  </Button>
                </div>
                <div
                  style={{
                    display: !(editingCell === _record.key) ? "flex" : "none",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <StyledTwoLinesEllipsis>{_value}</StyledTwoLinesEllipsis>
                  <Button
                    size="small"
                    type="text"
                    icon={<EditFilled />}
                    disabled={editingCell !== "" || _record.isFixed === "yes"}
                    onClick={async () => {
                      await setEditingCell(_record.key);
                      await setCateName(_record.name);
                      inputRefs.current[_record.key].focus();
                    }}
                  />
                </div>
              </div>
            ),
            props: {},
          };

          if (editingCell === _record.key) {
            obj.props.colSpan = 3;
          } else {
            obj.props.colSpan = 1;
          }
          return obj;
        },
      },

      {
        title: "순서변경",
        key: "seq",
        dataIndex: "seq",
        width: 50,
        align: "center",
        render: (_value, _record, _index) => {
          const obj = {
            children: (
              <Space>
                <Button
                  size="small"
                  type="text"
                  icon={<ArrowUpOutlined />}
                  disabled={_record.isFixed === "yes" || _index === 1}
                  onClick={() => {
                    if (_index > 1) {
                      changeCategoryPosition({
                        mybookcate_id: _record._id,
                        direction: "up",
                      });
                    }
                  }}
                />
                <Button
                  size="small"
                  type="text"
                  icon={<ArrowDownOutlined />}
                  disabled={
                    _record.isFixed === "yes" ||
                    _index === dataSource.length - 1
                  }
                  onClick={() => {
                    changeCategoryPosition({
                      mybookcate_id: _record._id,
                      direction: "down",
                    });
                  }}
                />
              </Space>
            ),
            props: {},
          };

          if (editingCell === _record.key) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }

          return obj;
        },
      },

      {
        title: "삭제",
        key: "deleteCategory",
        dataIndex: "deleteCategory",
        width: 50,
        align: "center",
        render: (_value, _record) => {
          const obj = {
            children: (
              <Button
                size="small"
                type="text"
                icon={<DeleteOutlined />}
                disabled={_record.isFixed === "yes"}
                onClick={() => {
                  setExpandedRowKeys([]);
                  deleteACategory({ mybookcate_id: _record._id });
                }}
              />
            ),
            props: {},
          };

          if (editingCell === _record.key) {
            obj.props.colSpan = 0;
          } else {
            obj.props.colSpan = 1;
          }

          return obj;
        },
      },
    ];

    return (
      <>
        <StyledModal
          visible={visible}
          title={<div className="ForPageMainTitle">카테고리 관리</div>}
          onCancel={() => changeVisible(false)}
          mask={false} // 모달 바깥 전체화면 덮기 기능
          footer={[
            <Button
              key="close"
              onClick={() => changeVisible(false)}
              size="small"
            >
              닫기
            </Button>,
          ]}
        >
          <Table
            dataSource={dataSource}
            tableLayout="fixed"
            columns={columns}
            size="small"
            expandable={{
              expandedRowKeys,
              expandedRowRender: (_record, _index) => (
                <div style={{ margin: "0 10px", display: "flex" }}>
                  <Input
                    size="small"
                    ref={(ref) => (newCateRef.current[_record.key] = ref)}
                    value={cateName}
                    onChange={(e) => {
                      setCateName(e.target.value);
                    }}
                    style={{ marginRight: "5px" }}
                  />
                  <Button
                    size="small"
                    type="primary"
                    disabled={
                      cateName.length === 0 ||
                      dataSource.map((_c) => _c.name).includes(cateName)
                    }
                    style={{ marginRight: "5px" }}
                    onClick={() => {
                      createCategory({ name: cateName, seq: _index + 1 });
                      newIdRef.current = _index + 1;
                      setCateName("");
                      setExpandedRowKeys([]);
                    }}
                  >
                    생성
                  </Button>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => {
                      setCateName("");
                      setExpandedRowKeys([]);
                    }}
                  >
                    취소
                  </Button>
                </div>
              ),
              rowExpandable: (_record) => editingCell == "",
              onExpand: async (ex, re) => {
                console.log({ expandedRowKeys });
                if (!ex) {
                  setExpandedRowKeys([]);
                  setCateName("");
                }
                if (ex) {
                  await setExpandedRowKeys([re.key]);
                  console.log(newCateRef);
                  newCateRef.current[re.key].focus();
                }
              },
            }}
            pagination={false}
          />
        </StyledModal>
      </>
    );
  }
);

export default memo(CategorySettingModal);

const StyledModal = styled(Modal)`
  min-width: 340px;

  & .ant-modal-body {
    padding: 8px 24px 8px 24px;
    & * {
      font-size: 1rem;
    }
    & .anticon > svg {
      font-size: 1.333rem;
    }
  }

  & .ant-row.ant-form-item {
    margin-bottom: 8px;
  }

  & .ant-modal-footer {
    padding: 10px 24px;
  }

  .ant-table table {
    // ColorPicker 잘리는 문제 해결
    overflow: unset;
  }

  & .ant-table-expand-icon-col {
    width: 1px;
  }
  & .ant-table-row-expand-icon {
    top: 20px;
    left: -15px;
    z-index: 9999;
  }
`;
