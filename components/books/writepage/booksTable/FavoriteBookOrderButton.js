import { useMutation } from '@apollo/client';
import { memo, useState } from 'react';
import { useRouter } from 'next/router';
import { CHANGE_POSITION_OF_BOOK, CHANGE_POSITION_OF_WRITE_LIKED_BOOK } from '../../../../graphql/query/writePage';

import { Space, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { CHANGE_POSITION_OF_STUDY_LIKED_BOOK } from '../../../../graphql/query/studyPage';

const FavoriteBookOrderButton = ({ _record, handleToGetMyBook, tableType }) => {
  const router = useRouter();
  const [rePosition, { loading }] = useMutation(tableType === 'study' ? CHANGE_POSITION_OF_STUDY_LIKED_BOOK : CHANGE_POSITION_OF_WRITE_LIKED_BOOK, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      const query = tableType === 'study' ? 'mybook_changestudylikeorder' : 'mybook_changewritelikeorder';
      if (received_data[query].status === '200') {
        handleToGetMyBook(received_data[query].mybooks);
      } else if (received_data[query].status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });

  async function positionBooks(direction, id) {
    try {
      await rePosition({
        variables: {
          direction: direction,
          mybook_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Space size={2}>
      {_record.isFirstBook ? (
        <Tooltip
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0}
          color="#4d4d4d"
          title="첫번째 책"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <div
            className="FirstBookCustom"
            style={{
              width: '34px',
              height: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ArrowUpOutlined />
          </div>
        </Tooltip>
      ) : (
        <Tooltip
          mouseEnterDelay={0.3}
          mouseLeaveDelay={0}
          title="위로 이동"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <div
            className="customCircleButton"
            style={{
              width: '34px',
              height: '24px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              positionBooks('up', _record._id);
            }}
          >
            <ArrowUpOutlined />
          </div>
        </Tooltip>
      )}
      {_record.isLastBook ? (
        <Tooltip
          mouseEnterDelay={0.5}
          mouseLeaveDelay={0}
          color="#4d4d4d"
          title="마지막 책"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <div
            className="LastBookCustom"
            style={{
              width: '34px',
              height: '24px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ArrowDownOutlined />
          </div>
        </Tooltip>
      ) : (
        <Tooltip
          mouseEnterDelay={0.3}
          mouseLeaveDelay={0}
          title="아래로 이동"
          overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
          overlayStyle={{ alignSelf: 'middle' }}
        >
          <div
            className="customCircleButton"
            style={{
              width: '34px',
              height: '24px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => {
              positionBooks('down', _record._id);
            }}
          >
            <ArrowDownOutlined />
          </div>
        </Tooltip>
      )}
    </Space>
  );
};

export default memo(FavoriteBookOrderButton);
