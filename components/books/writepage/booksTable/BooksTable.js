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
    const childrenBooks = showedList.filter((_, _index) => _index !== 0);
    const children = childrenBooks.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats.numCards,
      ..._book.stats.recent,
      numSession: _book.stats.numSession,
      progress: _book.stats.progress,
      relationship: 'child',
      categoryOrder: seq,
      categoryName: name,
      key: `KEY:${_cate._id}INDEX:${_index + 1}`,
      _id: _book._id,
      lastChild: !isShowedHiddenBook ? markedShowList.length === _index + 2 : showedList.length === _index + 2,
      markedShowLastChild: markedShowList.length === _index + 2,
    }));

    const parentBooks = showedList.filter((_, _index) => _index === 0);
    const parent =
      parentBooks.length > 0
        ? {
            ...parentBooks[0].mybook_info,
            ...parentBooks[0].stats.numCards,
            ...parentBooks[0].stats.recent,
            numSession: parentBooks[0].stats.numSession,
            progress: parentBooks[0].stats.progress,
            relationship: 'parent',
            categoryOrder: seq,
            categoryName: name,
            key: `KEY:${_cate._id}INDEX:0`,
            _id: parentBooks[0]._id,
            showedListLength: showedList.length,
            markedShowLastChild: children.length === 0,
            children,
          }
        : null;

    return parent;
  });
  const dataForFoldedCategory2 = rowDataForFoldedCategory2.filter((_cate) => _cate !== null);

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
          children: !expandedRowKeys.includes(_record.key) && _record.relationship === 'parent' ? `카테고리내  책 수량: ${_record.showedListLength}` : value,
          props: {},
        };
        if (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') {
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
        if (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') {
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
        if (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') {
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
        if (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') {
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
        if (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') {
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
      dataSource={dataForFoldedCategory2}
      columns={columns}
      size="small"
      rowKey={(record) => record.key}
      pagination={false}
      // rowSelection을 첫번째 행에서 옮기는 것은 안되고 styled에서 selection 애들 모두 display:none 처리하고
      // 체크 박스로 같이 처리해보자 자세한건 세션설정에서 썼던 코드 참고해서 짜보자
      rowClassName={(record, index) =>
        !expandedRowKeys.includes(record.key) && record.relationship === 'parent' ? 'foldedCategory' : record.lastChild ? 'lastBook' : 'Books'
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
            setExpandedRowKeys(expandedRowKeys.filter((key) => key !== re.key));
          }
          if (ex) {
            setExpandedRowKeys([...expandedRowKeys, re.key]);
          }
        },
      }}
    />
  );
};

export default BooksTable;
