/* eslint-disable react/display-name */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Table, Card, Space, Drawer, Popover } from "antd";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

import BookOrderButton from "../../../common/BookOrderButton";
import HideOrShowButton from "../../../common/HideOrShowButton";
import FavoriteBook from "../../../common/FavoriteBook";
import MoveToBookSetting from "../../../common/MoveToBookSetting";

import makeDataSource from "../../../common/logic";
import {
  StyledFlexAlignCenter,
  StyledFlexAllCenterDimension100Percent,
  StyledFlexSpaceBetween,
} from "../../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../../common/styledComponent/buttons";
import DoubleLinesEllipsisContainer from "../../../../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledBookSettingBarDrawer } from "../../../../common/styledComponent/antd/StyledBookSettingBarDrawer";
import WriteHistoryGraphBarComponent from "./WriteHistoryGraphBarComponent";
import CreateBookButton from "../../../common/createBook/CreateBookButton";
import CategorySettingButton from "../../../common/categorySetting/CategorySettingButton";

const BooksTable = ({ category, myBook, isFoldedMenu, changeFoldedMenu }) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);

  const [newCategoryId, setNewCategoryId] = useState(null);
  const addNewCategoryIdOnExpandedRowKeys = useCallback((id) => {
    setNewCategoryId(id);
  }, []);
  useEffect(() => {
    if (newCategoryId !== null) {
      setExpandedRowKeys([...expandedRowKeys, `KEY:${newCategoryId}INDEX:0`]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCategoryId]);

  const router = useRouter();

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
    setExpandedRowKeys(
      category.mybookcates.map((_cate) => `KEY:${_cate._id}INDEX:0`)
    );
    setMounted(true);
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
    return (
      (!expandedRowKeys.includes(_record.key) &&
        _record.relationship === "parent") ||
      _record.classType === "hiddenBar" ||
      _record.classType === "middle-hiddenBar" ||
      _record.classType === "empty-category" ||
      _record.classType === "firstHiddenBar" ||
      _record.classType === "OnlyShowHiddenBar"
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
          <StyledFlexAlignCenter
            onClick={() => {
              if (expandedRowKeys.includes(_record.key)) {
                setExpandedRowKeys(
                  expandedRowKeys.filter((key) => key !== _record.key)
                );
              }
              if (!expandedRowKeys.includes(_record.key)) {
                setExpandedRowKeys([...expandedRowKeys, _record.key]);
              }
            }}
          >
            {expandedRowKeys.includes(_record.key) ? (
              <DownOutlined />
            ) : (
              <RightOutlined />
            )}
            <DoubleLinesEllipsisContainer style={{ marginLeft: "2px" }}>
              {_value}
            </DoubleLinesEllipsisContainer>
          </StyledFlexAlignCenter>
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
              <div
                onClick={() => {
                  if (expandedRowKeys.includes(_record.key)) {
                    setExpandedRowKeys(
                      expandedRowKeys.filter((key) => key !== _record.key)
                    );
                  }
                  if (!expandedRowKeys.includes(_record.key)) {
                    setExpandedRowKeys([...expandedRowKeys, _record.key]);
                  }
                }}
              >{`총 ${_record.totalBooksNum} 권의 책이 있습니다. (숨김 책 ${_record.totalHiddenBooksNum} 권)`}</div>
            ) : _record.classType === "middle-hiddenBar" ||
              _record.classType === "hiddenBar" ||
              _record.classType === "OnlyShowHiddenBar" ||
              _record.classType === "firstHiddenBar" ? (
              value
            ) : (
              <StyledFlexAlignCenter
                onClick={() => {
                  movepage(_record._id);
                }}
                style={{ cursor: "pointer" }}
              >
                <StyledFlexAlignCenter>
                  <StyledBookTypeDiv booktype={_record.type} />
                </StyledFlexAlignCenter>
                <DoubleLinesEllipsisContainer>
                  {value}
                </DoubleLinesEllipsisContainer>
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
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 26,
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
                <StyledFlexAllCenterDimension100Percent>
                  {_value}
                </StyledFlexAllCenterDimension100Percent>
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
      title: "최근생성일",
      key: "writeHistory",
      dataIndex: "writeHistory",
      className: "TableMiddleColumn TextAlignCenterColumn",
      align: "center",
      width: 45,
      render: (_value, _record) => {
        const obj = {
          children: (
            <div>
              {_value.length === 0
                ? "-"
                : _value[_value.length - 1].date[2] +
                  _value[_value.length - 1].date[3] +
                  "." +
                  _value[_value.length - 1].date[4] +
                  _value[_value.length - 1].date[5] +
                  "." +
                  _value[_value.length - 1].date[6] +
                  _value[_value.length - 1].date[7]}
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
      className: "TableMiddleColumn TextAlignCenterColumn",
      align: "center",
      width: 60,
      render: (_value, _record) => {
        const obj = {
          children: <WriteHistoryGraphBarComponent _record={_record} />,
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
      width: 20,
      render: (value, _record) => {
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
                  changeFoldedMenu(`table${_record._id}`);
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

              <StyledBookSettingBarDrawer
                booktype={_record.type}
                destroyOnClose={true}
                className="BookDrawerMenu"
                placement="right"
                width={"250px"}
                closable={false}
                mask={false}
                visible={`table${_record._id}` === isFoldedMenu}
                getContainer={false}
              >
                <Space size={3}>
                  <BookOrderButton
                    _record={_record}
                    changeFoldedMenu={changeFoldedMenu}
                    isPc
                  />{" "}
                  |
                  <FavoriteBook
                    record={_record}
                    changeFoldedMenu={changeFoldedMenu}
                    tableType="write"
                    isPc
                  />{" "}
                  |
                  <HideOrShowButton
                    record={_record}
                    changeFoldedMenu={changeFoldedMenu}
                    isPc
                  />{" "}
                  |
                  <MoveToBookSetting mybook_id={_record._id} isPc />
                </Space>
                <div
                  className="PushCustomCircleButton"
                  onClick={() => {
                    changeFoldedMenu("");
                  }}
                >
                  <DoubleRightOutlined />
                </div>
              </StyledBookSettingBarDrawer>
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
    <StyledCard
      bordered={false}
      size="small"
      title={
        <Space>
          <div className="ForPageMainTitle">나의책</div>
          <CreateBookButton category={category} />
          <CategorySettingButton
            category={category}
            addNewCategoryIdOnExpandedRowKeys={
              addNewCategoryIdOnExpandedRowKeys
            }
          />
        </Space>
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
            : record.classType === "OnlyShowHiddenBar"
            ? "OnlyShowHiddenBar"
            : record.classType === "firstHiddenBar"
            ? "FirstHiddenBar"
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
          expandIcon: () => null,
        }}
      />
    </StyledCard>
  );
};

export default BooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */

  & .ant-card-body {
    padding: 0 0 12px 0;
    & * {
      font-size: 1rem;
    }
  }
  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }
`;
