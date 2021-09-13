import { useMutation } from '@apollo/client';
import { memo } from 'react';
import { useRouter } from 'next/router';
import { CHANGE_POSITION_OF_BOOK } from '../../../../graphql/query/writePage';

import { Button } from 'antd';

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
    <>
      <Button
        onClick={() => {
          positionBooks('up', _record._id);
        }}
        disabled={_record.seq_in_category === 0}
        size="small"
        shape="circle"
      >
        상
      </Button>
      <Button
        onClick={() => {
          positionBooks('down', _record._id);
        }}
        disabled={_record.seq_in_category + 1 === _record.cateLength}
        size="small"
        shape="circle"
      >
        하
      </Button>
    </>
  );
};

export default memo(BookOrderButton);
