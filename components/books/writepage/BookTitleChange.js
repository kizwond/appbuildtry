import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { UPDATE_BOOK_TITLE_AND_HIDE } from '../../../graphql/query/writePage';

import { Popconfirm, Tooltip, Button, Form, Input } from 'antd';
import { EditFilled } from '@ant-design/icons';

const BookTitleChange = ({ handleToGetMyBook, isPopupSomething, chagePopup, mybook_id, title, hide_or_show }) => {
  const [buttonType, setButtonType] = useState('ghost');

  const [form] = Form.useForm();
  const { resetFields } = form;

  const router = useRouter();
  const [updateBookTitle, { loading, variables }] = useMutation(UPDATE_BOOK_TITLE_AND_HIDE, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybook_update.status === '200') {
        handleToGetMyBook(received_data.mybook_update.mybooks);
      } else if (received_data.mybook_update.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function updateBook(_title) {
    try {
      await updateBookTitle({
        variables: {
          mybook_id,
          title: _title,
          hide_or_show,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(variables);
    }
  }

  return (
    <Popconfirm
      title={
        <Form
          colon={false}
          form={form}
          id={mybook_id}
          scrollToFirstError={true}
          onFinish={(values) => {
            console.log('onfinish', values.book_title);
            updateBook(values.book_title);
          }}
          onFinishFailed={(values, errorFields, outOfDate) => {
            console.log('values', values);
            console.log('errorFields', errorFields);
            console.log('outOfDate', outOfDate);
          }}
        >
          <Form.Item
            name="book_title"
            label="책제목"
            rules={[
              {
                required: true,
                message: '책 제목을 입력해주세요!',
              },
            ]}
          >
            <Input placeholder="책 제목" />
          </Form.Item>
        </Form>
      }
      okText="변경"
      cancelText="취소"
      onVisibleChange={(visible) => {
        if (!visible) {
          chagePopup(false);
          setButtonType('default');
        }
        if (visible) {
          resetFields();
          chagePopup(true);
          setButtonType('primary');
        }
      }}
      okButtonProps={{
        form: mybook_id,
        key: 'submit',
        htmlType: 'submit',
      }}
    >
      {isPopupSomething ? (
        <Button type={buttonType} shape="circle" size="small" icon={<EditFilled />} />
      ) : (
        <Tooltip
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0}
          title="제목 변경"
          color="rgba(0, 0, 0, 0.522)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <Button shape="circle" size="small" icon={<EditFilled />} />
        </Tooltip>
      )}
    </Popconfirm>
  );
};

export default BookTitleChange;
