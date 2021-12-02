/* eslint-disable react/display-name */
import { useCallback, useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "../../../../node_modules/moment/moment";

import { Table, Card, Space, Drawer } from "antd";
import {
  DollarCircleFilled,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

import BookOrderButton from "../../common/BookOrderButton";
import HideOrShowButton from "../../common/HideOrShowButton";
import FavoriteBook from "../../common/FavoriteBook";
import MoveToBookSetting from "../../common/MoveToBookSetting";

import makeDataSource from "../../common/logic";
import { StyledTwoLinesEllipsis } from "../../../common/styledComponent/page";

const BooksTable = ({
  category,
  myBook,
  isPopupSomething,
  chagePopup,
  activedTable,
  changeActivedTable,
  newCateId,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();

  const router = useRouter();

  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);
  const changeIsShowedHiddenBook = useCallback(
    (isShowedAllBooks, isShowedHiddenBook, id) => {
      if (isShowedAllBooks) {
        setIsShowedHiddenBook(
          isShowedHiddenBook.filter((_cateId) => _cateId !== id)
        );
      }
      if (!isShowedAllBooks) {
        setIsShowedHiddenBook([...isShowedHiddenBook, id]);
      }
    },
    []
  );

  useEffect(() => {
    setExpandedRowKeys([...expandedRowKeys, `KEY:${newCateId}INDEX:0`]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCateId]);

  useEffect(() => {
    setExpandedRowKeys(
      category.mybookcates.map((_cate) => `KEY:${_cate._id}INDEX:0`)
    );
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const movepage = useCallback(function (bookid) {
    localStorage.removeItem("book_id");
    localStorage.setItem("book_id", bookid);
    router.push(`/books/write/${bookid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dataSource = useMemo(
    () =>
      makeDataSource(
        myBook,
        category.mybookcates,
        isShowedHiddenBook,
        changeIsShowedHiddenBook
      ),
    [myBook, category, isShowedHiddenBook, changeIsShowedHiddenBook]
  );

  if (!mounted) {
    return null;
  }

  const getConditionValue = (_record) => {
    return (
      (!expandedRowKeys.includes(_record.key) &&
        _record.relationship === "parent") ||
      _record.classType === "hiddenBar" ||
      _record.classType === "middle-hiddenBar" ||
      _record.classType === "empty-category"
    );
  };

  const columns = [
    {
      title: "카테고리",
      key: "categoryName",
      className: "TableGroupingColumn",
      align: "center",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) =>
        _record.relationship === "parent" ? (
          <StyledTwoLinesEllipsis>{_value}</StyledTwoLinesEllipsis>
        ) : null,
    },
    {
      title: "책 제목",
      key: "title",
      dataIndex: "title",
      className: "TableFirstColumn",
      align: "center",
      width: 95,
      render: (value, _record, index) => {
        const obj = {
          children:
            _record.classType === "empty-category" ? (
              <div>빈 칸테고리</div>
            ) : _record.relationship === "parent" &&
              !expandedRowKeys.includes(_record.key) ? (
              <div>{`총 ${_record.totalBooksNum} 권의 책이 있습니다. (숨김 책 ${_record.totalHiddenBooksNum} 권)`}</div>
            ) : _record.classType === "middle-hiddenBar" ||
              _record.classType === "hiddenBar" ? (
              <StyledTwoLinesEllipsis>{value}</StyledTwoLinesEllipsis>
            ) : (
              <div
                onClick={() => {
                  movepage(_record._id);
                }}
                style={{ cursor: "pointer" }}
              >
                <StyledTwoLinesEllipsis>
                  <DollarCircleFilled
                    style={{ marginRight: "3px", color: "aqua" }}
                  />
                  {value}
                </StyledTwoLinesEllipsis>
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
          <div>카드 수</div>
          <div>(읽기/뒤집기)</div>
        </>
      ),
      key: "total",
      align: "center",
      dataIndex: "total",
      className: "TableMiddleColumn",
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
      title: "수정일",
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "TableMiddleColumn",
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
          <div>최근 3일간</div>
          <div>카드생성</div>
        </>
      ),
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "TableMiddleColumn",
      width: 60,
      render: (_value, _record) => {
        const now = new Date();

        const today = moment(now).format("YYYYMMDD");
        const todayCards = _record.writeHistory?.filter(
          (_arr) => _arr.date === today
        )[0];
        const todayCreatedCards = todayCards ? todayCards.numCreatedCards : 0;

        const yesterday = moment(now).subtract(1, "days").format("YYYYMMDD");
        const yesterdayCards = _record.writeHistory?.filter(
          (_arr) => _arr.date === yesterday
        )[0];
        const yesterdayCreatedCards = yesterdayCards
          ? yesterdayCards.numCreatedCards
          : 0;

        const theDayBeforeYesterday = moment(now)
          .subtract(1, "days")
          .format("YYYYMMDD");
        const theDayBeforeYesterdayCards = _record.writeHistory?.filter(
          (_arr) => _arr.date === theDayBeforeYesterday
        )[0];
        const theDayBeforeYesterdayCreatedCards = theDayBeforeYesterdayCards
          ? theDayBeforeYesterdayCards.numCreatedCards
          : 0;

        const obj = {
          children: (
            <div>
              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div className="singleBar">
                    <div className="graphBar">
                      <div
                        className="AchivedCard"
                        style={{
                          height:
                            theDayBeforeYesterdayCreatedCards >= 100
                              ? "100%"
                              : `${theDayBeforeYesterdayCreatedCards}%`,
                        }}
                      >
                        <span className="CardCounter">
                          {theDayBeforeYesterdayCreatedCards}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div
                        className="AchivedCard"
                        style={{
                          height:
                            yesterdayCreatedCards >= 100
                              ? "100%"
                              : `${yesterdayCreatedCards}%`,
                        }}
                      >
                        <span className="CardCounter">
                          {yesterdayCreatedCards}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div
                        className="AchivedCard"
                        style={{
                          height:
                            todayCreatedCards >= 100
                              ? "100%"
                              : `${todayCreatedCards}%`,
                        }}
                      >
                        <span className="CardCounter">{todayCreatedCards}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 1,
                    borderBottom: "1px solid #c5c6c7",
                  }}
                ></div>
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
      key: "seqInCategory",
      dataIndex: "seqInCategory",
      className: "TableLastColumn",
      align: "right",
      width: 35,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <div
              style={{
                position: "relative",
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
                width={"250px"}
                closable={false}
                mask={false}
                visible={
                  activedTable === "bookTable" && _record._id === isFoldedMenu
                }
                getContainer={false}
                style={{
                  position: "absolute",
                  textAlign: "initial",
                  height: "3rem",
                  top: "0.6rem",
                }}
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
                  <BookOrderButton
                    _record={_record}
                    changeFoldedMenu={changeFoldedMenu}
                  />{" "}
                  |
                  <FavoriteBook
                    record={_record}
                    changeActivedTable={changeActivedTable}
                    changeFoldedMenu={changeFoldedMenu}
                    tableType="write"
                  />{" "}
                  |
                  <HideOrShowButton
                    record={_record}
                    changeFoldedMenu={changeFoldedMenu}
                  />{" "}
                  |
                  <MoveToBookSetting mybook_id={_record._id} />
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
    // {
    //   title: "상설",
    //   align: "center",
    //   className: "TableLastColumn",
    //   width: 35,
    //   render: (value, _record, index) => {
    //     const obj = {
    //       children: (
    //         <div>
    //           <MoveToBookSetting mybook_id={_record._id} title={_record.title} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
    //         </div>
    //       ),
    //       props: {},
    //     };
    //     if (getConditionValue(_record)) {
    //       obj.props.colSpan = 0;
    //     } else {
    //       obj.props.colSpan = 1;
    //     }
    //     return obj;
    //   },
    // },
  ];

  return (
    <StyledCard
      bordered={false}
      size="small"
      title={
        <div style={{ fontSize: "1rem", fontWeight: "bold" }}>나의 책</div>
      }
    >
      <Table
        dataSource={dataSource}
        tableLayout="fixed"
        columns={columns}
        size="small"
        rowKey={(record) => record.key}
        pagination={false}
        rowClassName={(record, index) =>
          record.classType === "empty-category"
            ? "EmptyCategoryRow"
            : !expandedRowKeys.includes(record.key) &&
              record.relationship === "parent"
            ? "FoldedCategoryRow"
            : record.classType === "hiddenBar"
            ? "LastHiddenBarRow"
            : record.classType === "middle-hiddenBar"
            ? "MiddleHiddenBar"
            : record.classType === "last-even-book"
            ? "LastEvenNumberRow"
            : record.classType === "last-odd-book"
            ? "LastOddNumberRow"
            : record.classType === "even-book"
            ? "EvenNumberRow"
            : "OddNumberRow"
        }
        expandable={{
          expandedRowKeys,
          onExpand: (ex, re) => {
            if (!ex) {
              setExpandedRowKeys(
                expandedRowKeys.filter((key) => key !== re.key)
              );
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
    font-size: 1rem;
  }

  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  /* 개별 책 펼치기  */
  & .ant-drawer-content {
    overflow: hidden;
    background-color: #73bcfc;
    background-clip: padding-box;
    border: 0;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }

  /* 아이콘 크기 및 색상 - 부모 div Hover시 동작 포함 */
  & .anticon-double-right > svg {
    font-size: 18px;
    color: #a3a3a3;
  }

  & .anticon-double-left > svg {
    font-size: 18px;
    color: #a3a3a3;
  }
  & .PullCustomCircleButton:hover > .anticon-double-left > svg {
    color: #fff;
  }

  & .HandleOnOffShow > span {
    font-size: 0.7rem;
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
  }
`;
