/* eslint-disable react/display-name */
import { useMutation, useLazyQuery } from '@apollo/client';
import { memo, useRef, useState } from 'react';
import {
  CHANGE_CATEGORY_NAME_MUTATION,
  CHANGE_CATEGORY_ORDER,
  CREATE_NEW_CATEGORY,
  DELETE_CATEGORY,
  GET_CATEGORY_AND_BOOKS_INFO,
} from '../../../../graphql/query/writePage';
import styled from 'styled-components';

import { Modal, Button, Input, Table } from 'antd';
import { EditFilled, CloseCircleFilled, CheckCircleFilled, DeleteOutlined, ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { Space } from '../../../../node_modules/antd/lib/index';

const CategorySettingModal = ({ category, visible, changeVisible, handleToGetMyCategory, handleToGetMyBook }) => {
  const [editingCell, setEditingCell] = useState('');
  const [cateName, setCateName] = useState('');
  const [expandedRowKeys, setExpandedRowKeys] = useState('');

  const [getBookAndCategory] = useLazyQuery(GET_CATEGORY_AND_BOOKS_INFO, {
    fetchPolicy: 'network-only',
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybookcate_get.status === '200') {
        handleToGetMyBook(received_data.mybook_getAllMybook.mybooks);
        handleToGetMyCategory(received_data.mybookcate_get.mybookcates);
      } else if (received_data.mybookcate_get.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });

  const [createNewCategory] = useMutation(CREATE_NEW_CATEGORY, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybookcate_create.status === '200') {
        handleToGetMyCategory(received_data.mybookcate_create.mybookcates);
      } else if (received_data.mybookcate_create.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function createCategory({ current_mybookcate_id, name }) {
    try {
      await createNewCategory({
        variables: {
          name: name,
          current_mybookcate_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [changeCategoryName] = useMutation(CHANGE_CATEGORY_NAME_MUTATION, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybookcate_update.status === '200') {
        handleToGetMyCategory(received_data.mybookcate_update.mybookcates);
      } else if (received_data.mybookcate_update.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function updateCategory({ mybookcate_id, name }) {
    try {
      await changeCategoryName({
        variables: {
          mybookcate_id,
          name,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [changeCategoryOrder] = useMutation(CHANGE_CATEGORY_ORDER, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybookcate_changeorder.status === '200') {
        handleToGetMyCategory(received_data.mybookcate_changeorder.mybookcates);
      } else if (received_data.mybookcate_changeorder.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function changeCategoryPosition({ mybookcate_id, direction }) {
    try {
      await changeCategoryOrder({
        variables: {
          mybookcate_id,
          direction,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybookcate_delete.status === '200') {
        console.log('쿼리 요청함');
        getBookAndCategory();
      } else if (received_data.mybookcate_delete.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function deleteACategory({ mybookcate_id }) {
    try {
      await deleteCategory({
        variables: {
          mybookcate_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const dataSource = category.map((_cate) => ({
    ..._cate.mybookcate_info,
    _id: _cate._id,
    key: _cate._id,
  }));

  const columns = [
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>카테고리 이름</div>,
      key: 'name',
      dataIndex: 'name',
      render: (_value, _record) => {
        return (
          <div
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}
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
                  type="text"
                  icon={<CheckCircleFilled />}
                  disabled={cateName.length === 0 || dataSource.map((_c) => _c.name).includes(cateName)}
                  onClick={() => {
                    updateCategory({ mybookcate_id: _record._id, name: cateName });
                    setCateName('');
                    setEditingCell('');
                  }}
                />
                <Button
                  size="small"
                  type="text"
                  icon={<CloseCircleFilled />}
                  onClick={() => {
                    setCateName('');
                    setEditingCell('');
                  }}
                />
              </>
            ) : (
              <>
                {_value}
                <Button
                  size="small"
                  type="text"
                  icon={<EditFilled />}
                  disabled={editingCell !== '' || _record.isFixed === 'yes'}
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
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>순서</div>,
      key: 'deleteCategory',
      dataIndex: 'deleteCategory',
      render: (_value, _record) => {
        return (
          <Button
            size="small"
            type="text"
            icon={<DeleteOutlined />}
            disabled={_record.isFixed === 'yes'}
            onClick={() => {
              deleteACategory({ mybookcate_id: _record._id });
            }}
          />
        );
      },
    },
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>순서변경</div>,
      key: 'seq',
      dataIndex: 'seq',
      render: (_value, _record, _index) => {
        return (
          <Space>
            <Button
              size="small"
              type="text"
              icon={<ArrowUpOutlined />}
              disabled={_record.isFixed === 'yes' || _index === 1}
              onClick={() => {
                changeCategoryPosition({ mybookcate_id: _record._id, direction: 'up' });
              }}
            />
            <Button
              size="small"
              type="text"
              icon={<ArrowDownOutlined />}
              disabled={_record.isFixed === 'yes' || _index === dataSource.length - 1}
              onClick={() => {
                changeCategoryPosition({ mybookcate_id: _record._id, direction: 'down' });
              }}
            />
          </Space>
        );
      },
    },
  ];

  return (
    <>
      {console.log('CategorySettingModal 랜더링')}
      <StyledModal
        visible={visible}
        title="카테고리 관리"
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
            expandedRowRender: (_record) => (
              <div style={{ margin: '0 10px', display: 'flex' }}>
                <Input
                  size="small"
                  value={cateName}
                  onChange={(e) => {
                    setCateName(e.target.value);
                  }}
                />
                <Button
                  size="small"
                  type="text"
                  icon={<CheckCircleFilled />}
                  disabled={cateName.length === 0 || dataSource.map((_c) => _c.name).includes(cateName)}
                  onClick={() => {
                    createCategory({ current_mybookcate_id: _record._id, name: cateName });
                    setCateName('');
                    setExpandedRowKeys([]);
                  }}
                />
                <Button
                  size="small"
                  type="text"
                  icon={<CloseCircleFilled />}
                  onClick={() => {
                    setCateName('');
                    setExpandedRowKeys([]);
                  }}
                />
              </div>
            ),
            rowExpandable: (_record) => editingCell == '',
            onExpand: (ex, re) => {
              console.log({ expandedRowKeys });
              if (!ex) {
                setExpandedRowKeys([]);
                setCateName('');
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
};

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
    cursor: 'pointer';
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
