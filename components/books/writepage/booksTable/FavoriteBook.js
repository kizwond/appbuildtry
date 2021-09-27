import React, { useState, memo, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CHANGE_WRITE_LIKE, UPDATE_BOOK_TITLE_AND_HIDE } from '../../../../graphql/query/writePage';

import { Tooltip } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';

const FavoriteBook = ({ handleToGetMyBook, record, isPopupSomething, chagePopup }) => {
  const [visible, setVisible] = useState(false);
  const { title, _id, writelike } = record;
  // const isShowed = hide_or_show === 'show';

  // visible false로 설정안하면 버튼 클릭하고 빠르게 onMouseLeave 이벤트 발생해도 false로 전환 안됨
  useEffect(() => {
    setVisible(false);
  }, [writelike]);

  const router = useRouter();
  const [changeWriteLike, { variables }] = useMutation(CHANGE_WRITE_LIKE, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybook_changewritelike.status === '200') {
        handleToGetMyBook(received_data.mybook_changewritelike.mybooks);
      } else if (received_data.mybook_changewritelike.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function updateBook(_boolean) {
    try {
      await changeWriteLike({
        variables: {
          mybook_id: _id,
          writelike: _boolean,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(variables);
    }
  }

  return (
    <>
      {writelike ? (
        <Tooltip
          visible={visible}
          title="즐겨찾기 해제"
          color="rgba(0, 0, 0, 0.522)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <StarFilled
            style={{ color: '#faad14' }}
            onMouseEnter={() => {
              setVisible(true);
            }}
            onMouseLeave={() => {
              setVisible(false);
            }}
            shape="circle"
            size="small"
            onClick={() => {
              updateBook(false);
              setVisible(false);
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip
          visible={visible}
          title="즐겨찾기 등록"
          color="rgb(250, 173, 20, 0.722)"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <StarOutlined
            style={{ color: '#a3a3a3' }}
            onMouseEnter={() => {
              setVisible(true);
            }}
            onMouseLeave={() => {
              setVisible(false);
            }}
            shape="circle"
            size="small"
            onClick={() => {
              updateBook(true);
              setVisible(false);
            }}
          />
        </Tooltip>
      )}
    </>
  );
};

export default memo(FavoriteBook);
