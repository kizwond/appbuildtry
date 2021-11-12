/* eslint-disable react/display-name */
import { forwardRef, memo, useRef, useState } from "react";

import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import { MUTATION_CREATE_MY_BOOK_CATEGORY, MUTATION_DELETE_MY_BOOK_CATEGORY, MUTATION_UPDATE_MY_BOOK_CATEGORY_NAME, MUTATION_UPDATE_MY_BOOK_CATEGORY_ORDER } from "../../../../graphql/mutation/categorySet";
import { FRAGMENT_MYBOOK } from "../../../../graphql/fragment/book";

import styled from "styled-components";
import { Modal, Button, Input, Table, Space } from "antd";
import { EditFilled, CloseCircleFilled, CheckCircleFilled, DeleteOutlined, ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

const CategorySettingModal = forwardRef(({ category, visible, changeVisible }, ref) => {
  const [editingCell, setEditingCell] = useState("");
  const [cateName, setCateName] = useState("");
  const [expandedRowKeys, setExpandedRowKeys] = useState("");
  const newIdRef = useRef();

  const [createNewCategory] = useMutation(MUTATION_CREATE_MY_BOOK_CATEGORY, {
    onCompleted: (received_data) => {
      console.log("책생성후 받은 데이터", received_data);
      if (received_data.mybookcateset_createMybookcate.status === "200") {
        ref(received_data.mybookcateset_createMybookcate.mybookcatesets[0].mybookcates[newIdRef.current]._id);
      } else if (received_data.mybookcateset_createMybookcate.status === "401") {
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

  const [changeCategoryName] = useMutation(MUTATION_UPDATE_MY_BOOK_CATEGORY_NAME, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (received_data.mybookcateset_updateMybookcateInfo.status === "200") {
        // handleToGetMyCategory(received_data.mybookcateset_updateMybookcateInfo.mybookcatesets[0].mybookcates);
      } else if (received_data.mybookcateset_updateMybookcateInfo.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });
  async function updateCategory({ mybookcate_id, name }) {
    try {
      await changeCategoryName({
        variables: {
          forUpdateMybookcateInfo: {
            mybookcateset_id: "618df7479bc52c0f84f85459",
            mybookcate_id,
            name,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [changeCategoryOrder] = useMutation(MUTATION_UPDATE_MY_BOOK_CATEGORY_ORDER, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (received_data.mybookcateset_updateMybookcateOrder.status === "200") {
        // handleToGetMyCategory(received_data.mybookcateset_updateMybookcateOrder.mybookcates);
      } else if (received_data.mybookcateset_updateMybookcateOrder.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });
  async function changeCategoryPosition({ mybookcate_id, direction }) {
    try {
      await changeCategoryOrder({
        variables: {
          forUpdateMybookcateOrder: {
            mybookcateset_id: "618df7479bc52c0f84f85459",
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
      } else if (received_data.mybookcateset_deleteMybookcate.status === "401") {
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
            mybookcateset_id: "618df7479bc52c0f84f85459",
            mybookcate_id,
            moveToMybookcate_id: category.mybookcates.find((cate) => cate.isFixed === "yes")._id,
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
      title: <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>카테고리 이름</div>,
      key: "name",
      dataIndex: "name",
      width: 200,
      render: (_value, _record) => {
        return (
          <div
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center" }}
            onClick={() => {
              setExpandedRowKeys([]);
            }}
          >
            {editingCell === _record.key ? (
              <>
                <Input
                  size="small"
                  value={cateName}
                  onChange={(e) => {
                    setCateName(e.target.value);
                  }}
                />
                <Button
                  size="small"
                  type="primary"
                  disabled={cateName.length === 0 || dataSource.map((_c) => _c.name).includes(cateName)}
                  onClick={() => {
                    updateCategory({ mybookcate_id: _record._id, name: cateName });
                    setCateName("");
                    setEditingCell("");
                  }}
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
              </>
            ) : (
              <>
                {_value}
                <Button
                  size="small"
                  type="text"
                  icon={<EditFilled />}
                  disabled={editingCell !== "" || _record.isFixed === "yes"}
                  onClick={() => {
                    setEditingCell(_record.key);
                    setCateName(_record.name);
                  }}
                />
              </>
            )}
          </div>
        );
      },
    },

    {
      title: <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>순서변경</div>,
      key: "seq",
      dataIndex: "seq",
      width: 90,
      align: "center",
      render: (_value, _record, _index) => {
        return (
          <Space>
            <Button
              size="small"
              type="text"
              icon={<ArrowUpOutlined />}
              disabled={_record.isFixed === "yes" || _index === 1}
              onClick={() => {
                changeCategoryPosition({ mybookcate_id: _record._id, direction: "up" });
              }}
            />
            <Button
              size="small"
              type="text"
              icon={<ArrowDownOutlined />}
              disabled={_record.isFixed === "yes" || _index === dataSource.length - 1}
              onClick={() => {
                changeCategoryPosition({ mybookcate_id: _record._id, direction: "down" });
              }}
            />
          </Space>
        );
      },
    },

    {
      title: <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>삭제</div>,
      key: "deleteCategory",
      dataIndex: "deleteCategory",
      width: 50,
      align: "center",
      render: (_value, _record) => {
        return (
          <Button
            size="small"
            type="text"
            icon={<DeleteOutlined />}
            disabled={_record.isFixed === "yes"}
            onClick={() => {
              deleteACategory({ mybookcate_id: _record._id });
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      <StyledModal
        visible={visible}
        title={<div style={{ fontSize: "1rem", fontWeight: "bold" }}>카테고리 관리</div>}
        onCancel={() => changeVisible(false)}
        mask={false} // 모달 바깥 전체화면 덮기 기능
        footer={[
          <Button key="close" onClick={() => changeVisible(false)} size="small">
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
                  value={cateName}
                  onChange={(e) => {
                    setCateName(e.target.value);
                  }}
                  style={{ marginRight: "5px" }}
                />
                <Button
                  size="small"
                  type="primary"
                  icon={<CheckCircleFilled />}
                  disabled={cateName.length === 0 || dataSource.map((_c) => _c.name).includes(cateName)}
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
                  icon={<CloseCircleFilled />}
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
            onExpand: (ex, re) => {
              console.log({ expandedRowKeys });
              if (!ex) {
                setExpandedRowKeys([]);
                setCateName("");
              }
              if (ex) {
                setExpandedRowKeys([re.key]);
              }
            },
          }}
          pagination={false}
        />
      </StyledModal>
    </>
  );
});

export default memo(CategorySettingModal);

const StyledModal = styled(Modal)`
  & * {
    font-size: 0.8rem;
  }

  & .AddNewCategory {
    width: 25px;
    height: 25px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: "pointer";
  }
  & .AddNewCategory:hover {
    background-color: #a9a9a9;
  }
  & .AddNewCategory > .anticon-plus > svg {
    font-size: 14px;
  }
  & .AddNewCategory:hover > .anticon-plus > svg {
    font-size: 18px;
    color: #fff;
  }

  & .ant-table-expand-icon-col {
    width: 2px;
  }
  & .ant-table-row-expand-icon {
    top: 20px;
    left: -10px;
    z-index: 10;
  }
`;
