/* eslint-disable react/display-name */
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import moment from "../../../../node_modules/moment/moment";

import { Table, Card, Space, Drawer, Checkbox, Progress } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import { StyledTwoLinesEllipsis } from "../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../common/styledComponent/buttons";
import BookOrderButton from "../../common/BookOrderButton";
import HideOrShowButton from "../../common/HideOrShowButton";
import FavoriteBook from "../../common/FavoriteBook";
import MoveToBookSetting from "../../common/MoveToBookSetting";
import makeDataSource from "../../common/logic";
import { StyledProgress } from "../../../common/styledComponent/antd/StyledProgress";

const StudyBooksTable = ({ category, myBook, isPopupSomething, chagePopup, activedTable, changeActivedTable, selectedBooks, changeSelectedBooks }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();

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
    setExpandedRowKeys(category.mybookcates.map((_cate) => `KEY:${_cate._id}INDEX:0`));
    setMounted(true);
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
      title: "카테고리",
      key: "categoryName",
      className: "TableGroupingColumn",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) => (_record.relationship === "parent" ? <StyledTwoLinesEllipsis>{_value}</StyledTwoLinesEllipsis> : null),
    },
    {
      title: "책 제목",
      key: "title",
      dataIndex: "title",
      className: "TableFirstColumn",
      width: 85,
      render: (value, _record, index) => {
        const isSelected = selectedBooks.filter((_book) => _book.book_id === _record._id).length > 0;
        const obj = {
          children:
            _record.classType === "empty-category" ? (
              <div>빈 칸테고리</div>
            ) : _record.relationship === "parent" && !expandedRowKeys.includes(_record.key) ? (
              <div>{`총 ${_record.totalBooksNum} 권의 책이 있습니다. (숨김 책 ${_record.totalHiddenBooksNum} 권)`}</div>
            ) : _record.classType === "middle-hiddenBar" || _record.classType === "hiddenBar" ? (
              <StyledTwoLinesEllipsis>{value}</StyledTwoLinesEllipsis>
            ) : (
              <Space>
                <Checkbox
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      changeSelectedBooks(selectedBooks.filter((_book) => _book.book_id !== _record._id));
                    }
                    if (!isSelected) {
                      changeSelectedBooks([...selectedBooks, { book_id: _record._id, book_title: _record.title }]);
                    }
                  }}
                />
                <div>
                  <StyledBookTypeDiv booktype={_record.type} />

                  <StyledTwoLinesEllipsis>{value}</StyledTwoLinesEllipsis>
                </div>
              </Space>
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
      title: "최근학습일",
      key: "timeStudy",
      dataIndex: "timeStudy",
      align: "center",
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
      title: "진도율",
      key: "timeModify",
      dataIndex: "timeModify",
      align: "center",
      className: "TableMiddleColumn",
      width: 75,
      render: (_value, _record) => {
        const obj = {
          children: (
            <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              {/* 카드 레벨 총합 = acculevel, 총 카드 갯수 = total, 진도율 = 총 카드 갯수 / 카드 레벨 총합 */}
              {_record.total === 0 ? "-" : <StyledProgress percent={_record.accuLevel / _record.total} trailColor="#bbbbbb" strokeWidth={13} />}
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
                    height: "3rem",
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
                visible={activedTable === "bookTable" && _record._id === isFoldedMenu}
                getContainer={false}
                style={{ position: "absolute", textAlign: "initial", height: "3rem", top: "0.6rem" }}
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
                  <FavoriteBook record={_record} changeActivedTable={changeActivedTable} changeFoldedMenu={changeFoldedMenu} tableType="study" /> |
                  <HideOrShowButton record={_record} isPopupSomething={isPopupSomething} chagePopup={chagePopup} /> |
                  <MoveToBookSetting mybook_id={_record._id} title={_record.title} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
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
    //   title: "설정",
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
    <StyledCard bordered={false} size="small" title={<div style={{ fontSize: "1rem", fontWeight: "bold" }}>나의 책</div>}>
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
          record.classType === "empty-category"
            ? "EmptyCategoryRow"
            : !expandedRowKeys.includes(record.key) && record.relationship === "parent"
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
        // rowSelection={{
        //   hideSelectAll: true,
        // }}
        // scroll={{
        //   y: 370,
        // }}
        expandable={{
          expandedRowKeys,
          // 아래 클래스이름 지정하는 것은 나중에 selected checkbox css 할 때 해보자
          expandedRowClassName: (record, index, indent) => "",
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

export default StudyBooksTable;

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
`;
