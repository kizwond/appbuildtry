/* eslint-disable react/display-name */
import { useMutation } from '@apollo/client';
import { CHANGE_POSITION_OF_BOOK } from '../../../graphql/query/writePage';
import { useRouter } from 'next/router';

import { Table, Popconfirm } from 'antd';
import BookOrderButton from './BookOrderButton';
import BookTitleChange from './BookTitleChange';
import { useState } from 'react';

// todo 버튼 만들어서 useMutation부분 옮겨보자

const BooksTablePagination = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup }) => {
  const booksArr = myBook.map((book) => {
    const cate = category.filter((_cate) => _cate._id === book.mybook_info.mybookcate_id)[0];

    const cateLength = myBook.filter((_book) => _book.mybook_info.mybookcate_id === cate._id).length;

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

  const sortingBySeq = booksArr.sort((_cateA, _cateB) => _cateA.seq_in_category - _cateB.seq_in_category);

  const sortingByCate = sortingBySeq.sort((_cateA, _cateB) => _cateA.categorySeq - _cateB.categorySeq);

  const columns = [
    {
      title: '카테고리',
      key: 'category',
      className: 'category-top',
      dataIndex: 'category',
      render: (_txt, _record, _index) => {
        const obj = {
          children: _txt,
          props: {},
        };
        const startNum = _index - _record.seq_in_category;
        const lastNum = startNum + _record.cateLength;
        const tenDigitOfStart = parseInt(startNum / 10);
        const tenDigitOfLast = parseInt(lastNum / 10);
        const tenDigitOf_index = parseInt(_index / 10);
        const gapStartLast = tenDigitOfLast - tenDigitOfStart;
        const gapIndexLast = tenDigitOfLast - tenDigitOf_index;
        if (_index === 0 && tenDigitOfStart < tenDigitOf_index && tenDigitOf_index < tenDigitOfLast) {
          obj.props.rowSpan = 10;
        } else if (_record.seq_in_category === 0 && gapStartLast > 0) {
          obj.props.rowSpan = 10 - (startNum % 10);
        } else if (_record.seq_in_category === 0 && gapStartLast === 0) {
          obj.props.rowSpan = _record.cateLength;
        } else if (_index === 0 && gapIndexLast === 0) {
          obj.props.rowSpan = lastNum % 10;
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
      title: '제목 변경',
      key: 'title',
      dataIndex: 'title',
      render: (_title, _record) => (
        <BookTitleChange
          mybook_id={_record._id}
          title={_title}
          hide_or_show={_record.hide_or_show}
          isPopupSomething={isPopupSomething}
          chagePopup={chagePopup}
          handleToGetMyBook={handleToGetMyBook}
        />
      ),
    },
    {
      title: '책순서',
      render: (txt, _record) => <BookOrderButton handleToGetMyBook={handleToGetMyBook} _record={_record} />,
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
