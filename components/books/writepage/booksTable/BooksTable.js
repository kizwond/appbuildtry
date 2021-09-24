/* eslint-disable react/display-name */
import { Table, Button, Card } from 'antd';
import { useEffect, useState } from 'react';
import BookOrderButton from './BookOrderButton';
import BookTitleChange from './BookTitleChange';
import HideOrShowButton from './HideOrShowButton';
import DeleteBookButton from './DeleteBookButton';

const BooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);
  console.log('마운트 윗 코드');

  console.log({ expandedRowKeys });
  useEffect(() => {
    setExpandedRowKeys(category.map((_cate) => `KEY:${_cate._id}INDEX:0`));
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
    if (categoryBooksLength === 0) {
      return {
        relationship: 'parent',
        classType: 'empty-category',
        categoryOrder: seq,
        categoryName: name,
        key: `KEY:${_cate._id}INDEX:0`,
        // children: [],
      };
    }

    const markedShowList = categoryBooksList.filter((_book) => _book.mybook_info.hide_or_show == 'show');
    const markedShowListLength = markedShowList.length;
    const markedHideList = categoryBooksList.filter((_book) => _book.mybook_info.hide_or_show == 'hide');
    const markedHideListLength = markedHideList.length;

    const isShowedAllBooks = isShowedHiddenBook.includes(_cate._id);
    const parentKey = `KEY:${_cate._id}INDEX:0`;
    const isUnfoldedCategory = expandedRowKeys.includes(parentKey);

    const showList = markedShowList.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      numSession: _book.stats?.numSession,
      progress: _book.stats?.progress,
      classType:
        markedHideListLength === 0 && markedShowListLength > 0 && markedShowListLength === _index + 1 && _index % 2 !== 0
          ? 'last-even-book'
          : markedHideListLength === 0 && markedShowListLength > 0 && markedShowListLength === _index + 1 && _index % 2 === 0
          ? 'last-odd-book'
          : _index % 2 !== 0
          ? 'even-book'
          : 'odd-book',
      categoryOrder: seq,
      isLastBookInShowList: markedShowListLength === _index + 1,
      categoryName: name,
      key: `KEY:${_cate._id}INDEX:${_index + 1}`,
      _id: _book._id,
    }));

    const hiddenList = markedHideList.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      numSession: _book.stats?.numSession,
      progress: _book.stats?.progress,
      classType:
        markedHideListLength > 0 && isShowedAllBooks && markedHideListLength === _index + 1 && _index % 2 !== 0
          ? 'last-even-book'
          : markedHideListLength > 0 && isShowedAllBooks && markedHideListLength === _index + 1 && _index % 2 === 0
          ? 'last-odd-book'
          : _index % 2 !== 0
          ? 'even-book'
          : 'odd-book',
      categoryOrder: seq,
      categoryName: name,
      key: `KEY:${_cate._id}INDEX_HIDDEN:${_index}`,
      _id: _book._id,
    }));

    const hiddenBar = {
      key: `KEY:${_cate._id}HIDDENBAR`,
      classType: 'hiddenBar',
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
    };

    let showedList;

    // 전체 책이 1권
    if (categoryBooksLength === 1) {
      //숨긴 책이 0권 일때
      if (markedHideListLength === 0) {
        showedList = [...showList];
      }
      // 숨긴 책이 1권 일때 (표시 책 0권)
      else if (markedHideListLength === 1) {
        showedList = !isShowedAllBooks ? [{ ...hiddenBar }] : [{ ...hiddenBar, classType: 'middle-hiddenBar' }, ...hiddenList];
      }
    }
    // 전체 책이 2권 이상
    else if (categoryBooksLength >= 2) {
      // 숨긴 책이 0권이며, 표시 책이 2권 이상일 때
      if (markedHideListLength === 0) {
        showedList = [...showList];
      }
      // 숨긴 책과 표시 책 각각 1권 이상일 때
      else if (markedShowListLength >= 1 && markedHideListLength >= 1) {
        showedList = !isShowedAllBooks ? [...showList, { ...hiddenBar }] : [...showList, { ...hiddenBar, classType: 'middle-hiddenBar' }, ...hiddenList];
      }
      // 표시 책이 0권 일때
      else if (markedShowListLength === 0) {
        showedList = !isShowedAllBooks ? [{ ...hiddenBar }] : [{ ...hiddenBar, classType: 'middle-hiddenBar' }, ...hiddenList];
      }
    }

    const parentBooks = showedList[0];
    const childrenBooks = showedList.filter((_, _index) => _index !== 0);
    const parent = {
      ...parentBooks,
      key: `KEY:${_cate._id}INDEX:0`,
      categoryOrder: seq,
      categoryName: name,
      relationship: 'parent',
      children: childrenBooks,
      totalBooksNum: categoryBooksLength,
      totalHiddenBooksNum: markedHideListLength,
    };

    return parent;
  });

  console.log(dataSource);

  const columns = [
    {
      title: '카테고리',
      key: 'categoryName',
      className: 'categoryCol',
      ellipsis: true,
      width: 120,
      dataIndex: 'categoryName',
      render: (_value, _record) => (_record.relationship === 'parent' ? _value : null),
    },
    {
      title: (
        <div
          style={{
            paddingLeft: '5px',
          }}
        >
          책 제목
        </div>
      ),
      key: 'title',
      dataIndex: 'title',
      className: 'Row-First-Left',
      width: 168,
      render: (value, _record, index) => {
        const obj = {
          children:
            _record.classType === 'empty-category' ? (
              <div>빈 칸테고리</div>
            ) : _record.relationship === 'parent' && !expandedRowKeys.includes(_record.key) ? (
              <div>
                `카테고리내 책 수량: ${_record.totalBooksNum}(숨긴책: ${_record.totalHiddenBooksNum})`
              </div>
            ) : (
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </div>
            ),
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.classType === 'hiddenBar' ||
          _record.classType === 'middle-hiddenBar' ||
          _record.classType === 'empty-category'
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
      align: 'center',
      dataIndex: 'title',
      className: 'normal',
      width: 80,
      render: (_value, _record) => {
        const obj = {
          children: (
            <div>
              <BookTitleChange
                mybook_id={_record._id}
                title={_value}
                hide_or_show={_record.hide_or_show}
                isPopupSomething={isPopupSomething}
                chagePopup={chagePopup}
                handleToGetMyBook={handleToGetMyBook}
              />
            </div>
          ),
          props: {
            colSpan: 1,
            rowSpan: 1,
          },
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.classType === 'hiddenBar' ||
          _record.classType === 'middle-hiddenBar' ||
          _record.classType === 'empty-category'
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
      align: 'center',
      width: 80,
      render: (_value, _record) => {
        const obj = {
          children: <div>{_record.hide_or_show === 'hide' ? '.' : <BookOrderButton handleToGetMyBook={handleToGetMyBook} _record={_record} />}</div>,
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.classType === 'hiddenBar' ||
          _record.classType === 'middle-hiddenBar' ||
          _record.classType === 'empty-category'
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
      width: 80,
      render: (value, _record, index) => {
        const obj = {
          children: <div>{value}</div>,
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.classType === 'hiddenBar' ||
          _record.classType === 'middle-hiddenBar' ||
          _record.classType === 'empty-category'
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
      align: 'center',
      dataIndex: 'hide_or_show',
      className: 'normal',
      width: 80,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <div>
              <HideOrShowButton record={_record} handleToGetMyBook={handleToGetMyBook} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
            </div>
          ),
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.classType === 'hiddenBar' ||
          _record.classType === 'middle-hiddenBar' ||
          _record.classType === 'empty-category'
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
      align: 'center',
      className: 'Row-Last-One',
      width: 80,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <div>
              <DeleteBookButton
                mybook_id={_record._id}
                title={_record.title}
                isPopupSomething={isPopupSomething}
                chagePopup={chagePopup}
                handleToGetMyBook={handleToGetMyBook}
              />
            </div>
          ),
          props: {},
        };
        if (
          (!expandedRowKeys.includes(_record.key) && _record.relationship === 'parent') ||
          _record.classType === 'hiddenBar' ||
          _record.classType === 'middle-hiddenBar' ||
          _record.classType === 'empty-category'
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
    <Card>
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
          record.classType === 'empty-category'
            ? 'NoBooksCategory'
            : !expandedRowKeys.includes(record.key) && record.relationship === 'parent'
            ? 'foldedCategory'
            : record.classType === 'hiddenBar'
            ? 'LastHiddenBar'
            : record.classType === 'middle-hiddenBar'
            ? 'MiddleHiddenBar'
            : record.classType === 'last-even-book'
            ? 'lastEvenBook'
            : record.classType === 'last-odd-book'
            ? 'lastOddBook'
            : record.classType === 'even-book'
            ? 'EvenNumberRow'
            : 'OddNumberRow'
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
    </Card>
  );
};

export default BooksTable;
