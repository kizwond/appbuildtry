import React, { useState, memo, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { UPDATE_BOOK_TITLE_AND_HIDE } from '../../../../graphql/query/writePage';

import { Tooltip, Button } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const HideOrShowButton = ({ handleToGetMyBook, record, isPopupSomething, chagePopup }) => {
  const [visible, setVisible] = useState(false);
  const { title, _id, hide_or_show } = record;
  const isShowed = hide_or_show === 'show';

  // visible false로 설정안하면 버튼 클릭하고 빠르게 onMouseLeave 이벤트 발생해도 false로 전환 안됨
  useEffect(() => {
    setVisible(false);
  }, [hide_or_show]);

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
  async function updateBook(hide) {
    try {
      await updateBookTitle({
        variables: {
          mybook_id: _id,
          title,
          hide_or_show: hide,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(variables);
    }
  }

  return (
    <>
      {isShowed ? (
        <Tooltip
          visible={visible}
          title="숨기기"
          color="rgba(0, 0, 0, 0.522)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <EyeOutlined
            onMouseEnter={() => {
              setVisible(true);
            }}
            onMouseLeave={() => {
              setVisible(false);
            }}
            size="small"
            onClick={() => {
              updateBook('hide');
              setVisible(false);
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip
          visible={visible}
          title="표시하기"
          color="rgba(7, 164, 237, 0.522)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <EyeInvisibleOutlined
            onMouseEnter={() => {
              setVisible(true);
            }}
            onMouseLeave={() => {
              setVisible(false);
            }}
            size="small"
            onClick={() => {
              updateBook('show');
              setVisible(false);
            }}
          />
        </Tooltip>
      )}
    </>
  );
};

export default memo(HideOrShowButton);
