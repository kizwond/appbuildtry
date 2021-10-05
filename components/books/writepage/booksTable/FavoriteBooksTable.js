/* eslint-disable react/display-name */
import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import moment from '../../../../node_modules/moment/moment';

import { Table, Button, Card, Tooltip, Space, Drawer } from 'antd';
import { DollarCircleFilled, DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';

import HideOrShowButton from './HideOrShowButton';
import MoveToBookSetting from './MoveToBookSetting';
import FavoriteBook from './FavoriteBook';
import FavoriteBookOrderButton from './FavoriteBookOrderButton';

const FavoriteBooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup, activedTable, changeActivedTable }) => {
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();
  const [visible, setVisible] = useState(true);

  const router = useRouter();

  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);
  console.log('마운트 윗 코드');

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  function movepage(bookid) {
    localStorage.removeItem('book_id');
    localStorage.setItem('book_id', bookid);
    router.push(`/books/write/${bookid}`);
  }

  console.log('마운트 아래 코드');

  const writeLikedBooksList = myBook.filter((_book) => _book.mybook_info.writelike === true);
  const sortedBook = writeLikedBooksList.sort((book_A, book_B) => book_A.mybook_info.seq_in_writelike - book_B.mybook_info.seq_in_writelike);
  const dataSource = sortedBook.map((_book, _index) => {
    return {
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      ..._book.stats?.overall,
      studyHistory: _book.stats?.studyHistory,
      writeHistory: _book.stats?.writeHistory,
      categoryName: category.find((_cate) => _cate._id === _book.mybook_info.mybookcate_id).mybookcate_info.name,
      isFirstBook: _index === 0,
      isLastBook: writeLikedBooksList.length === _index + 1,
      key: _book._id,
      _id: _book._id,
    };
  });

  console.log({ dataSource });

  const columns = [
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>카테고리</div>,
      key: 'categoryName',
      className: 'Row-First-Left',
      width: 50,
      dataIndex: 'categoryName',
      render: (_value, _record) => <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{_value}</div>,
    },
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>책 제목</div>,
      key: 'title',
      dataIndex: 'title',
      className: 'TitleCol',
      width: 85,
      render: (value, _record, index) => (
        <div
          onClick={() => {
            movepage(_record._id);
          }}
          style={{ cursor: 'pointer' }}
        >
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
    },
    {
      title: (
        <>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>카드 수</div>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>(읽기/뒤집기)</div>
        </>
      ),
      key: 'total',
      align: 'center',
      dataIndex: 'total',
      className: 'normal',
      ellipsis: true,
      width: 70,
      render: (_value, _record) => <div>{`(${_record.read}/${_record.flip})`}</div>,
    },
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>수정일</div>,
      key: 'timeModify',
      align: 'center',
      dataIndex: 'timeModify',
      className: 'normal',
      width: 45,
      render: (_value, _record) => {
        const newDate = new Date(Number(_value));
        const DateString = moment(newDate).format('YY.MM.DD');

        return <div>{_value === null ? '-' : DateString}</div>;
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
      width: 75,
      render: (_value, _record) => {
        const now = new Date();

        const today = moment(now).format('YYYYMMDD');
        const todayCards = _record.writeHistory?.filter((_arr) => _arr.date === today)[0];
        const todayCreatedCards = todayCards ? todayCards.numCreatedCards : 0;

        const yesterday = moment(now).subtract(1, 'days').format('YYYYMMDD');
        const yesterdayCards = _record.writeHistory?.filter((_arr) => _arr.date === yesterday)[0];
        const yesterdayCreatedCards = yesterdayCards ? yesterdayCards.numCreatedCards : 0;

        const theDayBeforeYesterday = moment(now).subtract(1, 'days').format('YYYYMMDD');
        const theDayBeforeYesterdayCards = _record.writeHistory?.filter((_arr) => _arr.date === theDayBeforeYesterday)[0];
        const theDayBeforeYesterdayCreatedCards = theDayBeforeYesterdayCards ? theDayBeforeYesterdayCards.numCreatedCards : 0;

        return (
          <div style={{ paddingLeft: '5px', paddingRight: '5px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div className="singleBar">
                  <div className="graphBar">
                    <div
                      className="AchivedCard"
                      style={{ height: theDayBeforeYesterdayCreatedCards >= 100 ? '100%' : `${theDayBeforeYesterdayCreatedCards}%` }}
                    >
                      <span className="CardCounter">{theDayBeforeYesterdayCreatedCards}</span>
                    </div>
                  </div>
                </div>
                <div className="singleBar">
                  <div className="graphBar">
                    <div className="AchivedCard" style={{ height: yesterdayCreatedCards >= 100 ? '100%' : `${yesterdayCreatedCards}%` }}>
                      <span className="CardCounter">{yesterdayCreatedCards}</span>
                    </div>
                  </div>
                </div>
                <div className="singleBar">
                  <div className="graphBar">
                    <div className="AchivedCard" style={{ height: todayCreatedCards >= 100 ? '100%' : `${todayCreatedCards}%` }}>
                      <span className="CardCounter">{todayCreatedCards}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ width: '100%', height: 1, borderBottom: '1px solid #c5c6c7' }}></div>
            </div>
          </div>
        );
      },
    },
    {
      title: '이동',
      key: 'seq_in_category',
      dataIndex: 'seq_in_category',
      className: 'normal',
      align: 'right',
      width: 35,
      render: (value, _record, index) => (
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
              changeFoldedMenu(_record._id);
              changeActivedTable('favoriteTable');
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
            visible={activedTable === 'favoriteTable' && _record._id === isFoldedMenu}
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
              <FavoriteBookOrderButton handleToGetMyBook={handleToGetMyBook} _record={_record} tableType="write" /> |
              <FavoriteBook
                record={_record}
                handleToGetMyBook={handleToGetMyBook}
                changeActivedTable={changeActivedTable}
                changeFoldedMenu={changeFoldedMenu}
              />{' '}
              |
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
                changeFoldedMenu('');
                changeActivedTable('');
              }}
            >
              <DoubleRightOutlined />
            </div>
          </Drawer>
        </div>
      ),
    },
    {
      title: '상설',
      align: 'center',
      className: 'Row-Last-One',
      width: 35,
      render: (value, _record, index) => (
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
    },
  ];

  return (
    <StyledCard
      bordered={false}
      size="small"
      title={
        <div>
          <span style={{ marginRight: '30px', fontSize: '1rem', fontWeight: 'bold' }}>즐겨찾기</span>
          {dataSource.length > 0 && (
            <Button onClick={() => setVisible((_prev) => !_prev)} size="small">
              {visible ? '접기' : '펼치기'}
            </Button>
          )}
        </div>
      }
    >
      {visible && dataSource.length > 0 && (
        <Table
          dataSource={dataSource}
          tableLayout="fixed"
          columns={columns}
          size="small"
          pagination={false}
          rowClassName={(record, index) => (index % 2 !== 0 ? 'EvenNumberRow' : 'OddNumberRow')}
        />
      )}
    </StyledCard>
  );
};

export default FavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  & * {
    font-size: 0.8rem;
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

  & .HandleOnOffShow > span {
    font-size: 0.7rem;
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
  & .EvenNumberRow > .TitleCol > div {
    background-color: #f5f5f5;
    height: 34px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .EvenNumberRow > .normal > div,
  & .EvenNumberRow > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .EvenNumberRow > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .EvenNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
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
  & .OddNumberRow > .TitleCol > div {
    background-color: #fff;
    height: 34px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .OddNumberRow > .normal > div,
  & .OddNumberRow > .Row-Last-One > div {
    background-color: #fff;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .OddNumberRow > .normal > div.BookOrder {
    color: #fff;
  }

  & .OddNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
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
