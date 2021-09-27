import React, { useState, memo } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { DELETE_A_BOOK } from '../../../../graphql/query/writePage';

import { Popconfirm, Tooltip, Button } from 'antd';
import { DeleteFilled, DeleteOutlined } from '@ant-design/icons';

const DeleteBookButton = ({ handleToGetMyBook, isPopupSomething, chagePopup, mybook_id, title }) => {
  const [visible, setVisible] = useState(false);

  const router = useRouter();
  const [deleteBook, { variables }] = useMutation(DELETE_A_BOOK, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybook_delete.status === '200') {
        handleToGetMyBook(received_data.mybook_delete.mybooks);
      } else if (received_data.mybook_delete.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function handleDeleteBook(_title) {
    try {
      await deleteBook({
        variables: {
          mybook_id,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(variables);
    }
  }

  return (
    <Popconfirm
      icon={<DeleteFilled style={{ color: '#1890ff' }} />}
      title={`${title}을 삭제하시겠습니까?`}
      okText="삭제"
      cancelText="취소"
      placement="topRight"
      onVisibleChange={(visible) => {
        if (!visible) {
          chagePopup(false);
          setVisible(false);
        }
        if (visible) {
          chagePopup(true);
          setVisible(true);
        }
      }}
      onConfirm={() => {
        handleDeleteBook();
      }}
    >
      {isPopupSomething && !visible ? (
        <Button type="text" shape="circle" size="small" icon={<DeleteOutlined />} />
      ) : isPopupSomething && visible ? (
        <Button type="primary" shape="circle" size="small" icon={<DeleteOutlined />} />
      ) : (
        <Tooltip
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0}
          title="책삭제"
          color="rgba(242, 7, 7, 0.645)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <Button shape="circle" type="text" size="small" icon={<DeleteOutlined />} />
        </Tooltip>
      )}
    </Popconfirm>
  );
};

export default memo(DeleteBookButton);
