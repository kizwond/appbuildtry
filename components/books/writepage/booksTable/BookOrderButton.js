import { useMutation } from '@apollo/client';
import { memo } from 'react';
import { useRouter } from 'next/router';
import { CHANGE_POSITION_OF_BOOK } from '../../../../graphql/query/writePage';

import { Space } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

// todo 버튼 만들어서 useMutation부분 옮겨보자

const BookOrderButton = ({ _record, handleToGetMyBook }) => {
  const router = useRouter();
  const [rePosition, { loading }] = useMutation(CHANGE_POSITION_OF_BOOK, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybook_changeorder.status === '200') {
        handleToGetMyBook(received_data.mybook_changeorder.mybooks);
      } else if (received_data.mybook_changeorder.status === '401') {
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
      <div
        className="customCircleButton"
        style={{
          width: '34px',
          height: '24px',
          borderRadius: '12px',
          // background: 'yellow',
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
      <div
        className="customCircleButton"
        style={{
          width: '34px',
          height: '24px',
          borderRadius: '12px',
          // background: 'yellow',
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
    </Space>
  );
};

export default memo(BookOrderButton);
