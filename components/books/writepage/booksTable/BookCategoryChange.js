import React, { useState, memo } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { BOOK_CATEGORY_CHANGE_MUTATION, UPDATE_BOOK_TITLE_AND_HIDE } from '../../../../graphql/query/writePage';

import { Popconfirm, Tooltip, Button, Form, Input, Select } from 'antd';
import { BarsOutlined } from '@ant-design/icons';

const BookCategoryChange = ({ handleToGetMyBook, isPopupSomething, chagePopup, mybook_id, title, category, mybookcate_id }) => {
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const { resetFields } = form;

  const router = useRouter();
  const [chnageCategory, { variables }] = useMutation(BOOK_CATEGORY_CHANGE_MUTATION, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybook_movetoothercate.status === '200') {
        handleToGetMyBook(received_data.mybook_movetoothercate.mybooks);
      } else if (received_data.mybook_movetoothercate.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function updateBook(_cate_id) {
    try {
      await chnageCategory({
        variables: {
          mybook_id,
          target_mybookcate_id: _cate_id,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(variables);
    }
  }

  return (
    <Popconfirm
      placement="topRight"
      icon={<BarsOutlined style={{ color: '#1890ff' }} />}
      visible={visible}
      title={
        <Form
          colon={false}
          form={form}
          id={mybook_id}
          onFinish={(values) => {
            if (values.book_category !== 'info') {
              updateBook(values.book_category);
            }
          }}
          onFinishFailed={(values, errorFields, outOfDate) => {
            console.log('values', values);
            setVisible(true);
            chagePopup(true);
          }}
          requiredMark={false}
        >
          <Form.Item
            initialValue={mybookcate_id}
            name="book_category"
            label="카테고리 이동"
            rules={[
              {
                required: true,
                message: '책 제목을 입력해주세요!',
              },
            ]}
          >
            <Select style={{ width: 120 }} getPopupContainer={(node) => node.parentNode}>
              <Select.Option value="info">선택</Select.Option>
              {category && category.map((_category) => <Select.Option key={_category._id}>{_category.mybookcate_info.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Form>
      }
      okText="변경"
      cancelText="취소"
      onVisibleChange={(visible) => {
        if (!visible) {
          chagePopup(false);
          setVisible(visible);
        }
        if (visible) {
          resetFields();
          chagePopup(true);
          setVisible(visible);
        }
      }}
      okButtonProps={{
        form: mybook_id,
        key: 'submit',
        htmlType: 'submit',
      }}
    >
      {isPopupSomething && !visible ? (
        <Button type="text" shape="circle" size="small" icon={<BarsOutlined />} />
      ) : isPopupSomething && visible ? (
        <Button type="primary" shape="circle" size="small" icon={<BarsOutlined />} />
      ) : (
        <Tooltip
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0}
          title="제목 변경"
          color="rgba(0, 0, 0, 0.522)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <Button shape="circle" type="text" size="small" icon={<BarsOutlined />} />
        </Tooltip>
      )}
    </Popconfirm>
  );
};

export default memo(BookCategoryChange);
