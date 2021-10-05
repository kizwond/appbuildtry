import React, { useState, memo, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import { CHANGE_STUDY_LIKE } from '../../../../graphql/query/studyPage';
import { CHANGE_WRITE_LIKE } from '../../../../graphql/query/writePage';

import { Tooltip } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';

const FavoriteBook = ({ handleToGetMyBook, record, changeActivedTable, changeFoldedMenu, tableType }) => {
  const { _id, writelike, studylike } = record;

  const router = useRouter();
  const [changeLike] = useMutation(tableType === 'study' ? CHANGE_STUDY_LIKE : CHANGE_WRITE_LIKE, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      const query = tableType === 'study' ? 'mybook_changestudylike' : 'mybook_changewritelike';
      if (received_data[query].status === '200') {
        handleToGetMyBook(received_data[query].mybooks);
      } else if (received_data[query].status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });
  async function updateBook(_boolean) {
    const variables =
      tableType === 'study'
        ? {
            mybook_id: _id,
            studylike: _boolean,
          }
        : {
            mybook_id: _id,
            writelike: _boolean,
          };
    try {
      await changeLike({
        variables,
      });
    } catch (error) {
      console.log(error);
    }
  }

  const like = tableType === 'study' ? studylike : writelike;

  return (
    <>
      {like ? (
        <Tooltip
          mouseEnterDelay={0.3}
          mouseLeaveDelay={0}
          title="즐겨찾기 해제"
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
              updateBook(false);
              changeActivedTable('');
              changeFoldedMenu('');
            }}
          >
            <StarFilled className="writeLiked" style={{ color: '#fca311' }} />
          </div>
        </Tooltip>
      ) : (
        <Tooltip
          mouseEnterDelay={0.3}
          mouseLeaveDelay={0}
          title="즐겨찾기 등록"
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
              updateBook(true);
              changeActivedTable('');
              changeFoldedMenu('');
            }}
          >
            <StarOutlined className="writeUnliked" style={{ color: '#DEE2E6' }} />
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default memo(FavoriteBook);
