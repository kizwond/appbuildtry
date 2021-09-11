import { useMutation } from '@apollo/client';
import { CHANGE_POSITION_OF_BOOK } from '../../../graphql/query/writePage';
import { useRouter } from 'next/router';

import { Button, Table } from '../../../node_modules/antd/lib/index';
import BookOrderButton from './BookOrderButton';

// todo 버튼 만들어서 useMutation부분 옮겨보자

const BooksTablePagination = ({ category, myBook, handleToGetMyBook }) => {
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
      className: 'category-top',
      dataIndex: 'category',
      render: (_txt, _record, _index) => {
        const obj = {
          children: <div> {_txt} </div>,
          props: {},
        };
        const startNum = _index - _record.seq_in_category;
        const lastNum = startNum + _record.cateLength;
        const tenDigitOfStart = parseInt(startNum / 10);
        const tenDigitOfLast = parseInt(lastNum / 10);
        const tenDigitOf_index = parseInt(_index / 10);
        const gapStartLast = tenDigitOfLast - tenDigitOfStart;
        const gapIndexLast = tenDigitOfLast - tenDigitOf_index;
        const lengthInPage =
          gapStartLast > 0 ? 10 - (startNum % 10) : _record.cateLength;
        if (
          _index === 0 &&
          tenDigitOfStart < tenDigitOf_index &&
          tenDigitOf_index < tenDigitOfLast
        ) {
          console.log(
            `${_index}번호 1번째 조건 ${
              _index === 0 &&
              tenDigitOfStart < tenDigitOf_index &&
              tenDigitOf_index < tenDigitOfLast
            }`
          );

          obj.props.rowSpan = 10;
        } else if (_record.seq_in_category === 0 && gapStartLast > 0) {
          console.log(
            `${_index}번호 2번째 조건, seq: ${_record.seq_in_category}, 시작-끝: ${gapStartLast} `
          );

          obj.props.rowSpan = 10 - (startNum % 10);
        } else if (_record.seq_in_category === 0 && gapStartLast === 0) {
          console.log(
            `${_index}번호 3번째 조건 seq: ${_record.seq_in_category}, 시작-끝: ${gapStartLast} `
          );

          obj.props.rowSpan = _record.cateLength;
        } else if (_index === 0 && gapIndexLast === 0) {
          console.log(
            `${_index}번호 4번째 조건, 인덱스: ${_index}, 인덱스-마지막: ${lastNum} `
          );

          obj.props.rowSpan = lastNum % 10;
        } else {
          console.log(`${_index}번호 마지막 조건  `);

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
      render: (txt, _record) => (
        <BookOrderButton
          handleToGetMyBook={handleToGetMyBook}
          _record={_record}
        />
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
      // pagination={false}
    />
  );
};

export default BooksTablePagination;
