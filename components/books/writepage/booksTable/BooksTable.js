/* eslint-disable react/display-name */
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import BookOrderButton from './BookOrderButton';
import BookTitleChange from './BookTitleChange';

const BooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const firstBooks = myBook.filter((book) => book.mybook_info.seq_in_category === 0);

  const newArry = firstBooks.map((firstbook) => {
    const filteredBooks = myBook.filter((_book) => _book.mybook_info.mybookcate_id === firstbook.mybook_info.mybookcate_id);
    const childrenBooks = filteredBooks.filter((_book) => _book.mybook_info.seq_in_category !== 0);
    const mybookcate = category.find((cate) => cate._id === firstbook.mybook_info.mybookcate_id).mybookcate_info;
    const { name, seq } = mybookcate;

    const children = childrenBooks.map((_book, _index) => ({
      ..._book.mybook_info,
      category: name,
      categorySeq: seq,
      lastChild: childrenBooks.length === _index + 1,
      key: _book._id,
      _id: _book._id,
    }));

    return {
      ...firstbook.mybook_info,
      category: name,
      categorySeq: seq,
      lastChild: filteredBooks.length === 1 ? true : false,
      _id: firstbook._id,
      key: firstbook._id,
      children: children,
    };
  });

  useEffect(() => {
    if (myBook.length > 0) {
      setExpandedRowKeys(newArry.map((book) => book._id));
    }
  }, [myBook]);

  const columns = [
    {
      title: '카테고리',
      key: 'category',
      className: 'categoryCol',
      dataIndex: 'category',
      render: (txt, record) => (record.seq_in_category == 0 ? txt : null),
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
      dataSource={newArry}
      columns={columns}
      size="small"
      rowKey={(record) => record._id}
      pagination={false}
      // rowSelection을 첫번째 행에서 옮기는 것은 안되고 styled에서 selection 애들 모두 display:none 처리하고
      // 체크 박스로 같이 처리해보자 자세한건 세션설정에서 썼던 코드 참고해서 짜보자
      rowClassName={(record, index) =>
        !expandedRowKeys.includes(record._id) && record.seq_in_category === 0 ? 'foldedCategory' : record.lastChild ? 'lastBook' : 'Books'
      }
      rowSelection={{}}
      expandable={{
        expandedRowKeys,
        indentSize: 0,
        expandedRowClassName: (record, index, indent) => '',
        onExpand: (ex, re) => {
          if (!ex) {
            setExpandedRowKeys(expandedRowKeys.filter((key) => key !== re._id));
          }
          if (ex) {
            setExpandedRowKeys([...expandedRowKeys, re._id]);
          }
        },
      }}
    />
  );
};

export default BooksTable;
