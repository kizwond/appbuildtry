import { useMutation } from '@apollo/client';
import { CHANGE_POSITION_OF_BOOK } from '../../../graphql/query/writePage';
import { useRouter } from 'next/router';

import { Button, Table } from '../../../node_modules/antd/lib/index';

// todo 버튼 만들어서 useMutation부분 옮겨보자

const BooksTable = ({ category, myBook, handleToGetMyBook }) => {
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

  const booksArr = myBook.map((book) => {
    const cate = category.filter(
      (_cate) => _cate._id === book.mybook_info.mybookcate_id
    )[0];

    const cateLength = myBook.filter(
      (_book) => _book.mybook_info.mybookcate_id === cate._id
    ).length;

    const cateInfo = cate.mybookcate_info;
    return {
      ...book.mybook_info,
      category: cateInfo.name,
      categorySeq: cateInfo.seq,
      cateLength: cateLength,
      _id: book._id,
      key: book._id,
    };
  });

  const sortingBySeq = booksArr.sort(
    (_cateA, _cateB) => _cateA.seq_in_category - _cateB.seq_in_category
  );

  const sortingByCate = sortingBySeq.sort(
    (_cateA, _cateB) => _cateA.categorySeq - _cateB.categorySeq
  );

  const columns = [
    {
      title: '카테고리',
      key: 'category',
      dataIndex: 'category',

      render: (_txt, _record, _index) => {
        const obj = {
          children: _txt,
          props: {},
        };
        if (_record.seq_in_category === 0) {
          obj.props.rowSpan = _record.cateLength;
        } else {
          obj.props.rowSpan = 0;
        }

        return obj;
      },
    },
    {
      title: '책 제목',
      key: 'title',
      dataIndex: 'title',
    },
    {
      title: '책순서',
      key: 'seq_in_category',
      dataIndex: 'seq_in_category',
      // eslint-disable-next-line react/display-name
      render: (txt, _record, index) => (
        <>
          <Button
            onClick={() => {
              positionBooks('up', _record._id);
              console.log(index);
            }}
            disabled={_record.seq_in_category === 0}
            size="small"
            shape="circle"
            loading={loading}
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
            loading={loading}
          >
            하
          </Button>
        </>
      ),
    },
    {
      title: '책순서',
      key: 'seq_in_category',
      dataIndex: 'seq_in_category',
    },
  ];

  return (
    <Table
      dataSource={sortingByCate}
      columns={columns}
      size="small"
      pagination={false}
    />
  );
};

export default BooksTable;
