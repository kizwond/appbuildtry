/* eslint-disable react/display-name */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "moment";

import { Table, Card, Space, Drawer, Popover } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined, DownOutlined, RightOutlined } from "@ant-design/icons";

import BookOrderButton from "../../common/BookOrderButton";
import HideOrShowButton from "../../common/HideOrShowButton";
import FavoriteBook from "../../common/FavoriteBook";
import MoveToBookSetting from "../../common/MoveToBookSetting";

import makeDataSource from "../../common/logic";
import { StyledFlexAlignCenter, StyledFlexSpaceBetween } from "../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../common/styledComponent/buttons";
import DoubleLinesEllipsisContainer from "../../../common/styledComponent/DoubleLinesEllipsisContainer";

const M_BooksTable = ({ category, myBook, isPopupSomething, chagePopup, activedTable, changeActivedTable, newCateId }) => {
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

  const dataSource = useMemo(() => makeDataSource(myBook, category.mybookcates, isShowedHiddenBook, changeIsShowedHiddenBook), [myBook, category, isShowedHiddenBook, changeIsShowedHiddenBook]);

  const movepage = useCallback(function (bookid) {
    localStorage.removeItem("book_id");
    localStorage.setItem("book_id", bookid);
    router.push(`/m/write/${bookid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) {
    return null;
  }

  const getConditionValue = (_record) => {
    return (!expandedRowKeys.includes(_record.key) && _record.relationship === "parent") || _record.classType === "hiddenBar" || _record.classType === "middle-hiddenBar" || _record.classType === "empty-category";
  };

  const columns = [
    {
      title: "카테고리",
      key: "categoryName",
      className: "categoryCol",
      align: "center",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) =>
        _record.relationship === "parent" ? (
          <StyledFlexAlignCenter
            // style={{ display: "flex", alignItems: "center", height: "30px" }}
            onClick={() => {
              if (expandedRowKeys.includes(_record.key)) {
                setExpandedRowKeys(expandedRowKeys.filter((key) => key !== _record.key));
              }
              if (!expandedRowKeys.includes(_record.key)) {
                setExpandedRowKeys([...expandedRowKeys, _record.key]);
              }
            }}
          >
            {_record.classType === "empty-category" ? null : expandedRowKeys.includes(_record.key) ? <DownOutlined /> : <RightOutlined />}
            <DoubleLinesEllipsisContainer style={{ marginLeft: "2px" }}>{_value}</DoubleLinesEllipsisContainer>
          </StyledFlexAlignCenter>
        ) : null,
    },
    {
      title: "책 제목",
      key: "title",
      dataIndex: "title",
      className: "Row-First-Left",
      align: "center",
      width: 85,
      render: (value, _record, index) => {
        const obj = {
          children:
            _record.classType === "empty-category" ? (
              <div>빈 칸테고리</div>
            ) : _record.relationship === "parent" && !expandedRowKeys.includes(_record.key) ? (
              <div
                onClick={() => {
                  if (expandedRowKeys.includes(_record.key)) {
                    setExpandedRowKeys(expandedRowKeys.filter((key) => key !== _record.key));
                  }
                  if (!expandedRowKeys.includes(_record.key)) {
                    setExpandedRowKeys([...expandedRowKeys, _record.key]);
                  }
                }}
              >{`총 ${_record.totalBooksNum} 권의 책이 있습니다. (숨김 책 ${_record.totalHiddenBooksNum} 권)`}</div>
            ) : _record.classType === "middle-hiddenBar" || _record.classType === "hiddenBar" ? (
              <DoubleLinesEllipsisContainer>{value}</DoubleLinesEllipsisContainer>
            ) : (
              <StyledFlexAlignCenter
                onClick={() => {
                  movepage(_record._id);
                }}
                style={{ cursor: "pointer" }}
              >
                <StyledFlexAlignCenter>
                  <StyledBookTypeDiv booktype={_record.type}>{_record.type === "my" ? null : "$"}</StyledBookTypeDiv>
                </StyledFlexAlignCenter>
                <DoubleLinesEllipsisContainer>{value}</DoubleLinesEllipsisContainer>
              </StyledFlexAlignCenter>
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
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "normal",
      align: "center",
      ellipsis: true,
      width: 33,
      render: (_value, _record) => {
        const obj = {
          children: (
            <div style={{ width: "100%" }}>
              <Popover
                arrowPointAtCenter
                content={
                  <>
                    <StyledFlexSpaceBetween>
                      <div>읽기카드:</div>
                      <div>{_record.read}</div>
                    </StyledFlexSpaceBetween>
                    <StyledFlexSpaceBetween>
                      <div>뒤집기카드:</div>
                      <div>{_record.flip}</div>
                    </StyledFlexSpaceBetween>
                    <StyledFlexSpaceBetween>
                      <div>목차카드:</div>
                      <div>수정必</div>
                    </StyledFlexSpaceBetween>
                    <StyledFlexSpaceBetween>
                      <div>일반카드:</div>
                      <div>수정必</div>
                    </StyledFlexSpaceBetween>
                  </>
                }
                trigger="click"
                overlayClassName="M-Popover-NumberOfCards"
              >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", width: "100%" }}>{_value}</div>
              </Popover>
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
      title: "카드생성이력",
      key: "writeHistory",
      dataIndex: "writeHistory",
      className: "normal",
      align: "center",
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
                        <span className="CardCounter">{theDayBeforeYesterdayCreatedCards === 0 ? "-" : theDayBeforeYesterdayCreatedCards}</span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div className="AchivedCard" style={{ height: yesterdayCreatedCards >= 100 ? "100%" : `${yesterdayCreatedCards}%` }}>
                        <span className="CardCounter" style={{ fontSize: "6px" }}>
                          {yesterdayCreatedCards === 0 ? "-" : yesterdayCreatedCards}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div
                        className="AchivedCard"
                        style={{
                          height: todayCreatedCards >= 100 ? "100%" : `${todayCreatedCards}%`,
                        }}
                      >
                        <span className="CardCounter">{todayCreatedCards === 0 ? "-" : todayCreatedCards}</span>
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
      // title: "이동",
      key: "seqInCategory",
      dataIndex: "seqInCategory",
      className: "normal",
      align: "right",
      width: 25,
      render: (value, _record) => {
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
                    height: "4.2rem",
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
                style={{ position: "absolute", textAlign: "initial", height: "4.2rem" }}
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
                  <HideOrShowButton record={_record} />
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
      // title: "상설",
      className: "Row-Last-One",
      align: "center",
      width: 25,
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
          expandIcon: () => null,
        }}
      />
    </StyledCard>
  );
};

export default M_BooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  & * {
    font-size: 0.8rem;
  }

  & .ant-table-container * {
    font-size: 1rem;
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

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }

  & .FirstBookCustom > .anticon-arrow-up > svg,
  & .LastBookCustom > .anticon-arrow-down > svg {
    color: #4d4d4d;
  }

  & .anticon-arrow-down > svg {
    font-size: 16px;
    color: #dee2e6;
  }

  & .anticon-arrow-up > svg {
    font-size: 16px;
    color: #dee2e6;
  }

  & .anticon-star > svg {
    font-size: 16px;
  }

  & .anticon-eye > svg {
    font-size: 16px;
    color: #dee2e6;
  }

  & .anticon-eye-invisible > svg {
    font-size: 16px;
    color: #dee2e6;
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

  & .ant-table-tbody > tr > td.Row-Last-One {
    position: relative;
    z-index: 5000;
    background-color: white !important;
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
    height: 4.2rem;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastEvenBook > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 4.2rem;
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
    height: 4.2rem;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastOddBook > .Row-First-Left > div {
    background-color: #fff;
    height: 4.2rem;

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
    height: 4.2rem;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .EvenNumberRow > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 4.2rem;

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
    height: 4.2rem;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .OddNumberRow > .Row-First-Left > div {
    background-color: #fff;
    height: 4.2rem;

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
    background: #e1e1e1;
    display: flex;
    justify-content: center;
  }

  & .CardCounter {
    position: absolute;
    font-size: 0.6rem;
    bottom: 3px;
    display: block;
    color: #707070;
  }
`;
