/* eslint-disable react/display-name */
import { Table, Button, Card, Tooltip, Row, Col, Tag, Space, Drawer } from 'antd';
import { useEffect, useState } from 'react';
import BookOrderButton from './BookOrderButton';
import BookTitleChange from './BookTitleChange';
import HideOrShowButton from './HideOrShowButton';
import MoveToBookSetting from './MoveToBookSetting';
import FavoriteBook from './FavoriteBook';
import { VerticalAlignBottomOutlined, BarChartOutlined, DollarCircleFilled, DoubleLeftOutlined, DoubleRightOutlined, PauseOutlined } from '@ant-design/icons';
import moment from '../../../../node_modules/moment/moment';
import styled from 'styled-components';

const BooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();
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

  const noCategoryId = category.filter((_cate) => _cate.mybookcate_info.name == '(미지정)')[0]._id;
  const noCategoryBooksLength = myBook.filter((_book) => _book.mybook_info.mybookcate_id === noCategoryId).length;
  const filteredCategory = noCategoryBooksLength > 0 ? category : category.filter((_cate) => _cate.mybookcate_info.name !== '(미지정)');
  const dataSource = filteredCategory.map((_cate, _categoryIndex) => {
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
      ..._book.stats?.overall,
      numSession: _book.stats?.studyHistory,
      progress: _book.stats?.writeHistory,
      classType:
        markedHideListLength === 0 && markedShowListLength > 0 && markedShowListLength === _index + 1 && _index % 2 !== 0
          ? 'last-even-book'
          : markedHideListLength === 0 && markedShowListLength > 0 && markedShowListLength === _index + 1 && _index % 2 === 0
          ? 'last-odd-book'
          : _index % 2 !== 0
          ? 'even-book'
          : 'odd-book',
      categoryOrder: seq,
      categoryName: name,
      isFirstBook: _index === 0,
      isLastBook: markedShowListLength === _index + 1,
      key: `KEY:${_cate._id}INDEX:${_index + 1}`,
      _id: _book._id,
    }));

    const hiddenList = markedHideList.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      ..._book.stats?.overall,
      numSession: _book.stats?.studyHistory,
      progress: _book.stats?.writeHistory,
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
      isFirstBook: _index === 0,
      isLastBook: markedHideListLength === _index + 1,
      key: `KEY:${_cate._id}INDEX_HIDDEN:${_index}`,
      _id: _book._id,
    }));

    const hiddenBar = {
      key: `KEY:${_cate._id}HIDDENBAR`,
      classType: 'hiddenBar',
      title: (
        <>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '40px' }}>{`총 ${markedHideListLength} 권의 숨김 책이 있습니다.`}</div>
            <Tooltip
              title={isShowedAllBooks ? '숨긴 책 감추기' : '숨긴 책 표시'}
              color="rgba(7, 164, 237, 0.522)"
              overlayInnerStyle={{ fontSize: '0.65rem', minWidth: '0', minHeight: '0' }}
              overlayStyle={{ alignSelf: 'middle' }}
            >
              <Tag
                className="HandleOnOffShow"
                size="small"
                style={{ fontSize: '0.7rem' }}
                color={isShowedAllBooks ? '#cec8c8' : '#a9a7a7'}
                icon={<VerticalAlignBottomOutlined rotate={isShowedAllBooks ? 180 : 0} />}
                onClick={() => {
                  if (isShowedAllBooks) {
                    setIsShowedHiddenBook(isShowedHiddenBook.filter((_cateId) => _cateId !== _cate._id));
                  }
                  if (!isShowedAllBooks) {
                    setIsShowedHiddenBook([...isShowedHiddenBook, _cate._id]);
                  }
                }}
              >
                {isShowedAllBooks ? '접기' : '보기'}
              </Tag>
            </Tooltip>
          </div>
        </>
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
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>카테고리</div>,
      key: 'categoryName',
      className: 'categoryCol',
      width: 50,
      dataIndex: 'categoryName',
      render: (_value, _record) =>
        _record.relationship === 'parent' ? <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{_value}</div> : null,
    },
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>책 제목</div>,
      key: 'title',
      dataIndex: 'title',
      className: 'Row-First-Left',
      width: 100,
      render: (value, _record, index) => {
        const obj = {
          children:
            _record.classType === 'empty-category' ? (
              <div>빈 칸테고리</div>
            ) : _record.relationship === 'parent' && !expandedRowKeys.includes(_record.key) ? (
              <div>{`총 ${_record.totalBooksNum} 권의 책이 있습니다. (숨김 책 ${_record.totalHiddenBooksNum} 권)`}</div>
            ) : _record.classType === 'middle-hiddenBar' || _record.classType === 'hiddenBar' ? (
              <div
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </div>
            ) : (
              <div>
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <DollarCircleFilled style={{ marginRight: '3px', color: 'aqua' }} />
                  {value}
                </div>
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
      title: (
        <Tooltip
          title={
            <>
              <div>카드 수</div>
              <div>(읽기/뒤집기)</div>
            </>
          }
        >
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>카드 수</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>(읽기/뒤집기)</div>
        </Tooltip>
      ),
      key: 'total',
      align: 'center',
      dataIndex: 'total',
      className: 'normal',
      ellipsis: true,
      width: 80,
      render: (_value, _record) => {
        const obj = {
          children: <div>{`(999${_record.read}/999${_record.flip})`}</div>,
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
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>수정일</div>,
      key: 'timeModify',
      align: 'center',
      dataIndex: 'timeModify',
      className: 'normal',
      width: 50,
      render: (_value, _record) => {
        const newDate = new Date(Number(_value));
        const DateString = moment(newDate).format('YY.MM.DD');
        const obj = {
          children: <div>{_value === null ? '-' : DateString}</div>,
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
      title: (
        <>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>최근 3일간</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>카드생성</div>
        </>
      ),
      key: 'timeModify',
      align: 'center',
      dataIndex: 'timeModify',
      className: 'normal',
      width: 80,
      render: (_value, _record) => {
        const obj = {
          children: (
            <div style={{ paddingLeft: '5px', paddingRight: '5px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div className="AchivedCard" style={{ height: 32 >= 100 ? '100%' : `${2}%` }}>
                        <span className="CardCounter">3</span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div className="AchivedCard" style={{ height: 40 >= 100 ? '100%' : `${40}%` }}>
                        <span className="CardCounter">40</span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div className="AchivedCard" style={{ height: 123 >= 100 ? '100%' : `${2}%` }}>
                        <span className="CardCounter">123</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: '100%', height: 1, borderBottom: '1px solid #c5c6c7' }}></div>
              </div>
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
      title: '이동',
      key: 'seq_in_category',
      dataIndex: 'seq_in_category',
      className: 'normal',
      align: 'right',
      width: 40,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <div
              style={{
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'end',
                }}
                onClick={() => {
                  setIsFoldedMenu(_record._id);
                }}
              >
                <div
                  className="PullCustomCircleButton"
                  style={{
                    width: '44px',
                    height: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <DoubleLeftOutlined />
                </div>
              </div>

              <Drawer
                destroyOnClose={true}
                placement="right"
                width={'210px'}
                closable={false}
                mask={false}
                visible={_record._id === isFoldedMenu}
                getContainer={false}
                style={{ position: 'absolute', textAlign: 'initial', height: '30px', top: '2px' }}
                contentWrapperStyle={{ boxShadow: 'unset' }}
                drawerStyle={{ display: 'block' }}
                bodyStyle={{
                  padding: 'unset',
                  flexGrow: 'unset',
                  overflow: 'hidden',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Space size={3}>
                  <BookOrderButton handleToGetMyBook={handleToGetMyBook} _record={_record} /> |
                  <FavoriteBook record={_record} handleToGetMyBook={handleToGetMyBook} isPopupSomething={isPopupSomething} chagePopup={chagePopup} /> |
                  <HideOrShowButton record={_record} handleToGetMyBook={handleToGetMyBook} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
                </Space>
                <div
                  className="PushCustomCircleButton"
                  style={{
                    width: '44px',
                    height: '30px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setIsFoldedMenu('');
                  }}
                >
                  <DoubleRightOutlined />
                </div>
              </Drawer>
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
      title: '상설',
      align: 'center',
      className: 'Row-Last-One',
      width: 40,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <div>
              <MoveToBookSetting
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
    <StyledCard bordered={false} size="small">
      <Table
        dataSource={dataSource}
        tableLayout="fixed"
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
        // rowSelection={{
        //   hideSelectAll: true,
        // }}
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
    </StyledCard>
  );
};

export default BooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  & * {
    font-size: 0.8rem;
  }

  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  /* 개별 책 펼치기  */
  & .ant-drawer-content {
    overflow: hidden;
    background-color: #6c757d;
    background-clip: padding-box;
    border: 0;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }
  & .customCircleButton:hover {
    background-color: #495057;
  }
  & .PushCustomCircleButton {
    background-color: #212529;
  }
  & .PushCustomCircleButton:hover {
    background-color: #a9a9a9;
  }
  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }

  & .FirstBookCustom > .anticon-arrow-up > svg,
  & .LastBookCustom > .anticon-arrow-down > svg {
    color: #4d4d4d;
  }

  /* 아이콘 크기 및 색상 - 부모 div Hover시 동작 포함 */
  & .anticon-double-right > svg {
    font-size: 18px;
    color: #a3a3a3;
  }
  & .PushCustomCircleButton:hover > .anticon-double-right > svg {
    font-size: 18px;
    color: #fff;
  }

  & .anticon-double-left > svg {
    font-size: 18px;
    color: #a3a3a3;
  }
  & .PullCustomCircleButton:hover > .anticon-double-left > svg {
    color: #fff;
  }

  & .anticon-arrow-down > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-arrow-down > svg {
    color: #fff;
  }

  & .anticon-arrow-up > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-arrow-up > svg {
    color: #fff;
  }

  & .anticon-star > svg {
    font-size: 16px;
  }
  & .customCircleButton:hover > .anticon-star.writeUnliked > svg {
    color: #fff;
  }
  & .customCircleButton:hover > .anticon-star.writeLiked > svg {
    color: #fcc725;
  }

  & .anticon-eye > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-eye > svg {
    color: #fff;
  }

  & .anticon-eye-invisible > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-eye-invisible > svg {
    color: #fff;
  }

  & .anticon-setting > svg {
    font-size: 16px;
    color: #a3a3a3;
  }

  & .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding: 0;
  }

  & .ant-table table {
    border-collapse: collapse;
    background-color: white;
    overflow: hidden;
  }

  & .categoryCol {
    border-bottom: none;
  }

  & .Row-Last-One {
    position: relative;
    z-index: 3;
    background-color: white;
  }

  & .foldedCategory > .Row-First-Left > div {
    background: #e0e2f4;
    border-radius: 8px;
    margin: 3px 0px;

    padding-left: 15px;
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 0.7rem;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .MiddleHiddenBar > .Row-First-Left > div,
  & .LastHiddenBar > .Row-First-Left > div {
    background: #e0e2f4;
    border-radius: 8px;
    margin: 3px 0px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    height: 30px;
    font-size: 0.7rem;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .HandleOnOffShow > span {
    font-size: 0.7rem;
  }

  & .NoBooksCategory > .Row-First-Left > div {
    background: rgb(228, 224, 224);
    border-radius: 8px;
    margin: 3px 0px;

    padding-left: 15px;
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 0.7rem;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .foldedCategory > .categoryCol,
  & .NoBooksCategory > .categoryCol,
  & .LastHiddenBar > .categoryCol,
  & .lastEvenBook > .categoryCol,
  & .lastOddBook > .categoryCol {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .LastHiddenBar > .Row-First-Left,
  & .NoBooksCategory > .Row-First-Left,
  & .foldedCategory > .Row-First-Left {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .lastEvenBook > .Row-First-Left,
  & .lastEvenBook > .normal,
  & .lastEvenBook > .Row-Last-One {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .lastEvenBook > .normal > div,
  & .lastEvenBook > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastEvenBook > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .lastEvenBook > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .lastEvenBook > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .lastOddBook > .Row-First-Left,
  & .lastOddBook > .normal,
  & .lastOddBook > .Row-Last-One {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .lastOddBook > .normal > div,
  & .lastOddBook > .Row-Last-One > div {
    background-color: #fff;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastOddBook > .Row-First-Left > div {
    background-color: #fff;
    height: 34px;

    margin-bottom: 3px;
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .lastOddBook > .normal > div.BookOrder {
    color: #fff;
  }

  & .lastOddBook > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .EvenNumberRow > .normal > div,
  & .EvenNumberRow > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .EvenNumberRow > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 34px;

    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .EvenNumberRow > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .EvenNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .OddNumberRow > .normal > div,
  & .OddNumberRow > .Row-Last-One > div {
    background-color: #fff;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .OddNumberRow > .Row-First-Left > div {
    background-color: #fff;
    height: 34px;

    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .OddNumberRow > .normal > div.BookOrder {
    color: #fff;
  }

  & .OddNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  /* & .ant-table-thead .categoryCol::before {
    display: none;
  } */
  & .ant-table-thead .categoryCol {
    border-bottom: 1px solid #f0f0f0;
  }

  & .ant-table-tbody > tr > td {
    border-bottom: none;
  }

  & .singleBar {
    width: 18px;
    margin-left: 3px;
    margin-right: 3px;
  }
  & .graphBar {
    position: relative;
    height: 20px;
    background: rgba(237, 238, 233, 0);
  }

  & .AchivedCard {
    position: absolute;
    bottom: 0;
    width: 18px;
    background: #c5c6c7;
    display: flex;
    justify-content: center;
  }

  & .CardCounter {
    position: absolute;
    font-size: 0.6rem;
    bottom: 3px;
    display: block;
  }
`;
