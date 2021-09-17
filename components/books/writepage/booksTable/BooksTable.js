/* eslint-disable react/display-name */
import { Table } from 'antd';
import { useEffect, useState } from 'react';
import BookOrderButton from './BookOrderButton';
import BookTitleChange from './BookTitleChange';
import HideOrShowButton from './HideOrShowButton';
import DeleteBookButton from './DeleteBookButton';
import { Switch } from 'antd';
import { Button } from '../../../../node_modules/antd/lib/index';
import produce from 'immer';

const BooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);
  console.log('마운트 윗 코드');

  console.log({ expandedRowKeys });
  useEffect(() => {
    setExpandedRowKeys(category.filter((_cate) => _cate._id));
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return null;
  }

  console.log('마운트 아래 코드');
  console.log({ expandedRowKeys });

  const dataSource = category.map((_cate, _categoryIndex) => {
    const { name, seq } = _cate.mybookcate_info;
    const categoryBooksList = myBook.filter((_book) => _cate._id === _book.mybook_info.mybookcate_id);
    const categoryBooksLength = categoryBooksList.length;
    const markedShowList = categoryBooksList.filter((_book) => _book.mybook_info.hide_or_show == 'show');
    const markedShowListLength = markedShowList.length;
    const markedHideList = categoryBooksList.filter((_book) => _book.mybook_info.hide_or_show == 'hide');
    const markedHideListLength = markedHideList.length;

    const isShowedAllBooks = isShowedHiddenBook.includes(_cate._id);
    const parentKey = `KEY:${_cate._id}INDEX:0`;
    const isUnfoldedCategory = expandedRowKeys.includes(parentKey);

    const showedList = isShowedAllBooks ? [...markedShowList, ...markedHideList] : markedShowList;

    const childrenBooks = showedList.filter((_, _index) => _index !== 0);
    const childrenArray = childrenBooks.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      numSession: _book.stats?.numSession,
      progress: _book.stats?.progress,
      relationship: 'child',
      categoryOrder: seq,
      categoryName: name,
      isEvenNumber: markedShowListLength > _index + 1 ? _index % 2 === 0 : (_index - markedShowListLength) % 2 === 0,
      key: `KEY:${_cate._id}INDEX:${_index + 1}`,
      _id: _book._id,
      isLastCategory: _categoryIndex + 1 == category.length,
      lastChild:
        markedShowListLength === 0
          ? false
          : markedHideListLength === 0
          ? Boolean(showedList.length === _index + 2)
          : isShowedAllBooks
          ? Boolean(showedList.length === _index + 2)
          : false,
      markedShowLastChild: markedShowListLength === _index + 2,
    }));

    const hiddenBar = {
      key: `KEY:${_cate._id}HIDDENBAR`,
      relationship: 'hiddenBar',
      title: (
        <div>
          {`${markedHideListLength} 숨겨진 책이 있습니다.`}
          <Button
            size="small"
            onClick={() => {
              if (isShowedAllBooks) {
                setIsShowedHiddenBook(isShowedHiddenBook.filter((_cateId) => _cateId !== _cate._id));
              }
              if (!isShowedAllBooks) {
                setIsShowedHiddenBook([...isShowedHiddenBook, _cate._id]);
              }
            }}
          >
            {!isShowedAllBooks ? '숨긴책도 보기' : '숨긴책은 접기'}
          </Button>
        </div>
      ),
      lastChild: markedShowListLength === 0 ? true : isShowedAllBooks ? false : true,
    };
    const withHiddenBar = childrenArray.map((i) => i);
    if (markedShowListLength > 0) {
      withHiddenBar.splice(markedShowListLength - 1, 0, hiddenBar);
    }
    if (markedShowListLength === 0) {
      withHiddenBar.splice(0, 0, hiddenBar);
    }
    const children = markedHideListLength > 0 ? withHiddenBar : childrenArray;

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
            isEvenNumber: false,
            key: `KEY:${_cate._id}INDEX:0`,
            _id: parentBooks[0]._id,
            showedListLength: markedShowListLength + markedHideListLength,
            hiddenBook: markedHideListLength,
            markedShowLastChild: markedHideListLength > 0 ? children.length === 1 : children.length === 0,
            children,
            isLastCategory: _categoryIndex + 1 == category.length,
          }
        : categoryBooksList.length > 0
        ? {
            key: `KEY:${_cate._id}INDEX:0`,
            relationship: 'parent',
            categoryOrder: seq,
            categoryName: name,
            type: 'all-hidden-books',
            title: (
              <div>
                {`${markedHideListLength} 숨겨진 책이 있습니다.`}
                <Button
                  size="small"
                  onClick={() => {
                    if (isShowedAllBooks) {
                      setIsShowedHiddenBook(isShowedHiddenBook.filter((_cateId) => _cateId !== _cate._id));
                    }
                    if (!isShowedAllBooks) {
                      setIsShowedHiddenBook([...isShowedHiddenBook, _cate._id]);
                    }
                  }}
                >
                  {!isShowedAllBooks ? '숨긴책도 보기' : '숨긴책은 접기'}
                </Button>
              </div>
            ),
            lastChild: markedShowListLength === 0 ? true : isShowedAllBooks ? false : true,
            isLastCategory: _categoryIndex + 1 == category.length,
          }
        : {
            relationship: 'parent',
            categoryOrder: seq,
            categoryName: name,
            key: `KEY:${_cate._id}INDEX:0`,
            type: 'empty-category',
            isLastCategory: _categoryIndex + 1 == category.length,
          };

    return parent;
  });

  console.log(dataSource);

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
      className: 'normal',
      ellipsis: true,
      render: (value, _record, index) => {
        const obj = {
          children:
            _record.type === 'empty-category'
              ? '빈 칸테고리'
              : !expandedRowKeys.includes(_record.key) && _record.relationship === 'parent'
              ? `카테고리내 책 수량: ${_record.showedListLength}(숨긴책: ${_record.hiddenBook})`
              : value,
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.relationship === 'hiddenBar' ||
          _record.type === 'all-hidden-books'
        ) {
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
      className: 'normal',
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
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.relationship === 'hiddenBar' ||
          _record.type === 'all-hidden-books'
        ) {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: '책순서',
      className: 'normal',
      render: (_value, _record) => {
        const obj = {
          children: _record.hide_or_show === 'hide' ? null : <BookOrderButton handleToGetMyBook={handleToGetMyBook} _record={_record} />,
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.relationship === 'hiddenBar' ||
          _record.type === 'all-hidden-books'
        ) {
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
      className: 'normal',
      render: (value, _record, index) => {
        const obj = {
          children: value,
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.relationship === 'hiddenBar' ||
          _record.type === 'all-hidden-books'
        ) {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: '숨김',
      key: 'hide_or_show',
      dataIndex: 'hide_or_show',
      className: 'normal',
      render: (value, _record, index) => {
        const obj = {
          children: <HideOrShowButton record={_record} handleToGetMyBook={handleToGetMyBook} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />,
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.relationship === 'hiddenBar' ||
          _record.type === 'all-hidden-books'
        ) {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: '삭제',
      className: 'normal',
      render: (value, _record, index) => {
        const obj = {
          children: (
            <DeleteBookButton
              mybook_id={_record._id}
              title={_record.title}
              isPopupSomething={isPopupSomething}
              chagePopup={chagePopup}
              handleToGetMyBook={handleToGetMyBook}
            />
          ),
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.relationship === 'hiddenBar' ||
          _record.type === 'all-hidden-books'
        ) {
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
      dataSource={dataSource}
      columns={columns}
      size="small"
      rowKey={(record) => record.key}
      pagination={false}
      // bordered
      // rowSelection을 첫번째 행에서 옮기는 것은 안되고 styled에서 selection 애들 모두 display:none 처리하고
      // 체크 박스로 같이 처리해보자 자세한건 세션설정에서 썼던 코드 참고해서 짜보자
      rowClassName={(record, index) =>
        (record.type === 'empty-category' && !record.isLastCategory) || record.type === 'all-hidden-books'
          ? 'NoBooksCategory'
          : !expandedRowKeys.includes(record.key) && record.relationship === 'parent' && !record.isLastCategory
          ? 'foldedCategory'
          : record.relationship === 'hiddenBar' && record.lastChild && !record.isLastCategory
          ? 'LastHiddenBar'
          : record.relationship === 'hiddenBar' && !record.lastChild && !record.isLastCategory
          ? 'MiddleHiddenBar'
          : record.lastChild
          ? 'lastBook'
          : (record.type === 'empty-category' && record.isLastCategory) || (record.type === 'all-hidden-books' && record.isLastCategory)
          ? 'Middle'
          : !expandedRowKeys.includes(record.key) && record.relationship === 'parent' && record.isLastCategory
          ? 'foldedCategory'
          : record.relationship === 'hiddenBar' && record.lastChild && record.isLastCategory
          ? 'LastHiddenBar'
          : record.relationship === 'hiddenBar' && !record.lastChild && record.isLastCategory
          ? 'MiddleHiddenBar'
          : record.isEvenNumber
          ? 'EvenNumberRow'
          : 'Books'
      }
      rowSelection={{
        hideSelectAll: true,
      }}
      // scroll={{
      //   y: 370,
      // }}
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
