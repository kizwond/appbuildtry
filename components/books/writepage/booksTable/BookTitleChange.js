import React, { useState, memo } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { UPDATE_BOOK_TITLE_AND_HIDE } from '../../../../graphql/query/writePage';

import { Popconfirm, Tooltip, Button, Form, Input } from 'antd';
import { EditFilled } from '@ant-design/icons';

const BookTitleChange = ({ handleToGetMyBook, isPopupSomething, chagePopup, mybook_id, title, hide_or_show }) => {
  const [buttonType, setButtonType] = useState('ghost');
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const { resetFields } = form;

  const router = useRouter();
  const [updateBookTitle, { variables }] = useMutation(UPDATE_BOOK_TITLE_AND_HIDE, {
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
      icon={<EditFilled style={{ color: '#1890ff' }} />}
      visible={visible}
      title={
        <Form
          colon={false}
          form={form}
          id={mybook_id}
          onFinish={(values) => {
            updateBook(values.book_title);
          }}
          onFinishFailed={(values, errorFields, outOfDate) => {
            console.log('values', values);
            setVisible(true);
            chagePopup(true);
            setButtonType('primary');
          }}
          requiredMark={false}
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
            <Input placeholder={title} />
          </Form.Item>
        </Form>
      }
      okText="변경"
      cancelText="취소"
      onVisibleChange={(visible) => {
        if (!visible) {
          chagePopup(false);
          setButtonType('default');
          setVisible(visible);
        }
        if (visible) {
          resetFields();
          chagePopup(true);
          setButtonType('primary');
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
        <Button type="text" shape="circle" size="small" icon={<EditFilled />} />
      ) : isPopupSomething && visible ? (
        <Button type="primary" shape="circle" size="small" icon={<EditFilled />} />
      ) : (
        <Tooltip
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0}
          title="제목 변경"
          color="rgba(0, 0, 0, 0.522)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <Button shape="circle" type="text" size="small" icon={<EditFilled />} />
        </Tooltip>
      )}
    </Popconfirm>
  );
};

export default memo(BookTitleChange);
