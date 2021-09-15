/* eslint-disable react/display-name */
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import BookOrderButton from './BookOrderButton';
import BookTitleChange from './BookTitleChange';
import HideOrShowButton from './HideOrShowButton';
import { Switch } from 'antd';

const BooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState(false);









  const rowDataForFoldedCategory2 = category.map((_cate) => {
    const { name, seq } = _cate.mybookcate_info;
    const markedShowList = myBook.filter((_book) => _cate._id === _book.mybook_info.mybookcate_id && _book.mybook_info.hide_or_show == 'show');
    const markedHideList = myBook.filter((_book) => _cate._id === _book.mybook_info.mybookcate_id && _book.mybook_info.hide_or_show == 'hide');

    const showedList = isShowedHiddenBook ? [...markedShowList, ...markedHideList] : markedShowList;
    const childrenBooks = showedList.filter((_, _index) => _index !== 0)
    const children = childrenBooks.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats.numCards,
      ..._book.stats.recent,
      numSession: _book.stats.numSession,
      progress: _book.stats.progress,
      relationship: 'child',
      categoryOrder: seq,
      categoryName: name,
      key: _book._id,
      lastChild: !isShowedHiddenBook ? markedShowList.length === _index + 1 : showedList.length === _index + 1,
      markedShowLastChild: markedShowList.length === _index + 1,
    }));

    const parentBooks = showedList.filter((_, _index) => _index === 0)
    const parent = parentBooks.length > 0 ? parentBooks.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats.numCards,
      ..._book.stats.recent,
      numSession: _book.stats.numSession,
      progress: _book.stats.progress,
      relationship: 'parent',
      categoryOrder: seq,
      categoryName: name,
      key: _book._id,
      markedShowLastChild: markedShowList.length === _index + 1,
      showedListLength: showedList.length,
      children
    })) : null;

    return parent
  });
  const dataForFoldedCategory2 = rowDataForFoldedCategory2.filter((_cate) => _cate !== null);




















  
























  const rowDataForFoldedCategory = category.map((_cate) => {
    const { name, seq } = _cate.mybookcate_info;
    const markedShowList = myBook.filter((_book) => _cate._id === _book.mybook_info.mybookcate_id && _book.mybook_info.hide_or_show == 'show');
    const markedHideList = myBook.filter((_book) => _cate._id === _book.mybook_info.mybookcate_id && _book.mybook_info.hide_or_show == 'hide');

    const showedList = isShowedHiddenBook ? [...markedShowList, ...markedHideList] : markedShowList;
    const childrenBooks = showedList.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats.numCards,
      ..._book.stats.recent,
      numSession: _book.stats.numSession,
      progress: _book.stats.progress,
      relationship: 'child',
      categoryOrder: seq,
      categoryName: name,
      key: _book._id,
      _id: _book._id,
      firstChild: _index === 0,
      lastChild: !isShowedHiddenBook ? markedShowList.length === _index + 1 : showedList.length === _index + 1,
      markedShowLastChild: markedShowList.length === _index + 1,
    }));

    const dataSourceWithAllCategory = {
      relationship: 'parent',
      categoryOrder: seq,
      categoryName: name,
      key: _cate._id,
      _id: _cate._id,
      children: childrenBooks,
    };
    return dataSourceWithAllCategory
  });
  const dataForFoldedCategory = rowDataForFoldedCategory.filter((_cate) => _cate.children.length > 0);

  useEffect(() => {
    if (myBook.length > 0) {
      setExpandedRowKeys(dataForFoldedCategory.map((_cate) => _cate._id));
    }
  }, [myBook]);

  const columns = [
    {
      title: '카테고리',
      key: 'categoryName',
      className: 'categoryCol',
      dataIndex: 'categoryName',
      render: (_value, _record) => (_record.relationship === 'parent' ? _value : null),
    },
    {
      title: '책 제목',
      key: 'title',
      dataIndex: 'title',
      render: (value, _record, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (_record.relationship === 'parent') {
          obj.props.colSpan = columns.length - 1;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: '제목 변경',
      key: 'title',
      dataIndex: 'title',
      render: (_value, _record) => {
        const obj = {
          children: (
            <BookTitleChange
              mybook_id={_record._id}
              title={_value}
              hide_or_show={_record.hide_or_show}
              isPopupSomething={isPopupSomething}
              chagePopup={chagePopup}
              handleToGetMyBook={handleToGetMyBook}
            />
          ),
          props: {
            colSpan: 1,
            rowSpan: 1,
          },
        };
        if (_record.relationship === 'parent') {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: '책순서',
      render: (_value, _record) => {
        const obj = {
          children: _record.hide_or_show === 'hide' ? null : <BookOrderButton handleToGetMyBook={handleToGetMyBook} _record={_record} />,
          props: {},
        };
        if (_record.relationship === 'parent') {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: '책순서',
      key: 'seq_in_category',
      dataIndex: 'seq_in_category',
      render: (value, _record, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (_record.relationship === 'parent') {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: (
        <div>
          숨김{' '}
          <Switch
            size="small"
            // checked={props.target?.includes(props.switchArrayValue)}
            onClick={(checked) => {
              console.log(checked);
              setIsShowedHiddenBook(checked);
            }}
          />
        </div>
      ),
      key: 'hide_or_show',
      dataIndex: 'hide_or_show',
      render: (value, _record, index) => {
        const obj = {
          children: <HideOrShowButton record={_record} handleToGetMyBook={handleToGetMyBook} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />,
          props: {},
        };
        if (_record.relationship === 'parent') {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
  ];

  return (
    <Table
      dataSource={isShowedHiddenBook ? dataForFoldedCategory : dataForFoldedCategory}
      columns={columns}
      size="small"
      rowKey={(record) => record._id}
      pagination={false}
      // rowSelection을 첫번째 행에서 옮기는 것은 안되고 styled에서 selection 애들 모두 display:none 처리하고
      // 체크 박스로 같이 처리해보자 자세한건 세션설정에서 썼던 코드 참고해서 짜보자
      rowClassName={(record, index) =>
        !expandedRowKeys.includes(record._id) && record.relationship === 'parent' ? 'foldedCategory' : record.lastChild ? 'lastBook' : 'Books'
      }
      rowSelection={{
        hideSelectAll: true,
      }}
      scroll={{
        y: 370,
      }}
      expandable={{
        expandedRowKeys,
        // 아래 클래스이름 지정하는 것은 나중에 selected checkbox css 할 때 해보자
        expandedRowClassName: (record, index, indent) => '',
        onExpand: (ex, re) => {
          console.log({ expandedRowKeys });
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
