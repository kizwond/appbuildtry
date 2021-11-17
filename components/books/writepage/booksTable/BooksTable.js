/* eslint-disable react/display-name */
import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "../../../../node_modules/moment/moment";

import { Table, Card, Space, Drawer } from "antd";
import { DollarCircleFilled, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import BookOrderButton from "../../common/BookOrderButton";
import HideOrShowButton from "../../common/HideOrShowButton";
import FavoriteBook from "../../common/FavoriteBook";
import MoveToBookSetting from "./MoveToBookSetting";

import makeDataSource from "../../common/logic";
import { StyledDivEllipsis } from "../../../common/styledComponent/page";

const BooksTable = ({ category, myBook, isPopupSomething, chagePopup, activedTable, changeActivedTable, newCateId }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();

  const router = useRouter();

  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);
  const changeIsShowedHiddenBook = useCallback((isShowedAllBooks, isShowedHiddenBook, id) => {
    if (isShowedAllBooks) {
      setIsShowedHiddenBook(isShowedHiddenBook.filter((_cateId) => _cateId !== id));
    }
    if (!isShowedAllBooks) {
      setIsShowedHiddenBook([...isShowedHiddenBook, id]);
    }
  }, []);

  useEffect(() => {
    setExpandedRowKeys([...expandedRowKeys, `KEY:${newCateId}INDEX:0`]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCateId]);

  useEffect(() => {
    setExpandedRowKeys(category.mybookcates.map((_cate) => `KEY:${_cate._id}INDEX:0`));
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const movepage = useCallback(function (bookid) {
    localStorage.removeItem("book_id");
    localStorage.setItem("book_id", bookid);
    router.push(`/books/write/${bookid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataSource = useMemo(() => makeDataSource(myBook, category.mybookcates, isShowedHiddenBook, changeIsShowedHiddenBook), [myBook, category, isShowedHiddenBook, changeIsShowedHiddenBook]);

  if (!mounted) {
    return null;
  }

  const getConditionValue = (_record) => {
    return (!expandedRowKeys.includes(_record.key) && _record.relationship === "parent") || _record.classType === "hiddenBar" || _record.classType === "middle-hiddenBar" || _record.classType === "empty-category";
  };

  const columns = [
    {
      title: <StyledDivEllipsis>카테고리</StyledDivEllipsis>,
      key: "categoryName",
      className: "categoryCol",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) => (_record.relationship === "parent" ? <StyledDivEllipsis>{_value}</StyledDivEllipsis> : null),
    },
    {
      title: <StyledDivEllipsis>책 제목</StyledDivEllipsis>,
      key: "title",
      dataIndex: "title",
      className: "Row-First-Left",
      width: 85,
      render: (value, _record, index) => {
        const obj = {
          children:
            _record.classType === "empty-category" ? (
              <div>빈 칸테고리</div>
            ) : _record.relationship === "parent" && !expandedRowKeys.includes(_record.key) ? (
              <div>{`총 ${_record.totalBooksNum} 권의 책이 있습니다. (숨김 책 ${_record.totalHiddenBooksNum} 권)`}</div>
            ) : _record.classType === "middle-hiddenBar" || _record.classType === "hiddenBar" ? (
              <StyledDivEllipsis>{value}</StyledDivEllipsis>
            ) : (
              <div
                onClick={() => {
                  movepage(_record._id);
                }}
                style={{ cursor: "pointer" }}
              >
                <StyledDivEllipsis>
                  <DollarCircleFilled style={{ marginRight: "3px", color: "aqua" }} />
                  {value}
                </StyledDivEllipsis>
              </div>
            ),
          props: {},
        };
        if (getConditionValue(_record)) {
          obj.props.colSpan = columns.length - 1;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: (
        <>
          <StyledDivEllipsis>카드 수</StyledDivEllipsis>
          <StyledDivEllipsis>(읽기/뒤집기)</StyledDivEllipsis>
        </>
      ),
      key: "total",
      align: "center",
      dataIndex: "total",
      className: "normal",
      ellipsis: true,
      width: 70,
      render: (_value, _record) => {
        const obj = {
          children: <div>{`(${_record.read}/${_record.flip})`}</div>,
          props: {
            colSpan: 1,
            rowSpan: 1,
          },
        };
        if (getConditionValue(_record)) {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: <StyledDivEllipsis>수정일</StyledDivEllipsis>,
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "normal",
      width: 45,
      render: (_value, _record) => {
        const newDate = new Date(Number(_value));
        const DateString = moment(newDate).format("YY.MM.DD");
        const obj = {
          children: <div>{_value === null ? "-" : DateString}</div>,
          props: {
            colSpan: 1,
            rowSpan: 1,
          },
        };
        if (getConditionValue(_record)) {
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
          <StyledDivEllipsis>최근 3일간</StyledDivEllipsis>
          <StyledDivEllipsis>카드생성</StyledDivEllipsis>
        </>
      ),
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "normal",
      width: 75,
      render: (_value, _record) => {
        const now = new Date();

        const today = moment(now).format("YYYYMMDD");
        const todayCards = _record.writeHistory?.filter((_arr) => _arr.date === today)[0];
        const todayCreatedCards = todayCards ? todayCards.numCreatedCards : 0;

        const yesterday = moment(now).subtract(1, "days").format("YYYYMMDD");
        const yesterdayCards = _record.writeHistory?.filter((_arr) => _arr.date === yesterday)[0];
        const yesterdayCreatedCards = yesterdayCards ? yesterdayCards.numCreatedCards : 0;

        const theDayBeforeYesterday = moment(now).subtract(1, "days").format("YYYYMMDD");
        const theDayBeforeYesterdayCards = _record.writeHistory?.filter((_arr) => _arr.date === theDayBeforeYesterday)[0];
        const theDayBeforeYesterdayCreatedCards = theDayBeforeYesterdayCards ? theDayBeforeYesterdayCards.numCreatedCards : 0;

        const obj = {
          children: (
            <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div className="AchivedCard" style={{ height: theDayBeforeYesterdayCreatedCards >= 100 ? "100%" : `${theDayBeforeYesterdayCreatedCards}%` }}>
                        <span className="CardCounter">{theDayBeforeYesterdayCreatedCards}</span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div className="AchivedCard" style={{ height: yesterdayCreatedCards >= 100 ? "100%" : `${yesterdayCreatedCards}%` }}>
                        <span className="CardCounter">{yesterdayCreatedCards}</span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div className="AchivedCard" style={{ height: todayCreatedCards >= 100 ? "100%" : `${todayCreatedCards}%` }}>
                        <span className="CardCounter">{todayCreatedCards}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ width: "100%", height: 1, borderBottom: "1px solid #c5c6c7" }}></div>
              </div>
            </div>
          ),
          props: {
            colSpan: 1,
            rowSpan: 1,
          },
        };
        if (getConditionValue(_record)) {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: "이동",
      key: "seq_in_category",
      dataIndex: "seq_in_category",
      className: "normal",
      align: "right",
      width: 35,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <div
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              <div
                style={{
                  width: "100%",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "end",
                }}
                onClick={() => {
                  changeFoldedMenu(_record._id);
                  changeActivedTable("bookTable");
                }}
              >
                <div
                  className="PullCustomCircleButton"
                  style={{
                    width: "44px",
                    height: "30px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <DoubleLeftOutlined />
                </div>
              </div>

              <Drawer
                destroyOnClose={true}
                placement="right"
                width={"210px"}
                closable={false}
                mask={false}
                visible={activedTable === "bookTable" && _record._id === isFoldedMenu}
                getContainer={false}
                style={{ position: "absolute", textAlign: "initial", height: "30px", top: "2px" }}
                contentWrapperStyle={{ boxShadow: "unset" }}
                drawerStyle={{ display: "block" }}
                bodyStyle={{
                  padding: "unset",
                  flexGrow: "unset",
                  overflow: "hidden",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Space size={3}>
                  <BookOrderButton _record={_record} /> |
                  <FavoriteBook record={_record} changeActivedTable={changeActivedTable} changeFoldedMenu={changeFoldedMenu} tableType="write" /> |
                  <HideOrShowButton record={_record} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
                </Space>
                <div
                  className="PushCustomCircleButton"
                  onClick={() => {
                    setIsFoldedMenu("");
                    changeActivedTable("");
                  }}
                >
                  <DoubleRightOutlined />
                </div>
              </Drawer>
            </div>
          ),
          props: {},
        };
        if (getConditionValue(_record)) {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
    {
      title: "상설",
      align: "center",
      className: "Row-Last-One",
      width: 35,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <div>
              <MoveToBookSetting mybook_id={_record._id} title={_record.title} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
            </div>
          ),
          props: {},
        };
        if (getConditionValue(_record)) {
          obj.props.colSpan = 0;
        } else {
          obj.props.colSpan = 1;
        }
        return obj;
      },
    },
  ];

  return (
    <StyledCard bordered={false} size="small" title={<div style={{ fontSize: "1rem", fontWeight: "bold" }}>나의 책</div>}>
      <Table
        dataSource={dataSource}
        tableLayout="fixed"
        columns={columns}
        size="small"
        rowKey={(record) => record.key}
        pagination={false}
        rowClassName={(record, index) =>
          record.classType === "empty-category"
            ? "NoBooksCategory"
            : !expandedRowKeys.includes(record.key) && record.relationship === "parent"
            ? "foldedCategory"
            : record.classType === "hiddenBar"
            ? "LastHiddenBar"
            : record.classType === "middle-hiddenBar"
            ? "MiddleHiddenBar"
            : record.classType === "last-even-book"
            ? "lastEvenBook"
            : record.classType === "last-odd-book"
            ? "lastOddBook"
            : record.classType === "even-book"
            ? "EvenNumberRow"
            : "OddNumberRow"
        }
        expandable={{
          expandedRowKeys,
          onExpand: (ex, re) => {
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
    width: 44px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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

  & .anticon-more > svg {
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
    border-bottom: 0.5px solid #dfdfdf;
  }

  & .LastHiddenBar > .Row-First-Left,
  & .NoBooksCategory > .Row-First-Left,
  & .foldedCategory > .Row-First-Left {
    border-bottom: 0.5px solid #dfdfdf;
  }

  & .lastEvenBook > .Row-First-Left,
  & .lastEvenBook > .normal,
  & .lastEvenBook > .Row-Last-One {
    border-bottom: 0.5px solid #dfdfdf;
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
    border-bottom: 0.5px solid #dfdfdf;
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
