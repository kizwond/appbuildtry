/* eslint-disable react/display-name */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { Table, Card, Space, Checkbox, Popover } from "antd";
import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  DownOutlined,
  RightOutlined,
} from "@ant-design/icons";

import {
  StyledFlexAlignCenter,
  StyledFlexAllCenter,
  StyledFlexAllCenterDimension100Percent,
  StyledFlexSpaceBetween,
} from "../../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../../common/styledComponent/buttons";
import { StyledProgress } from "../../../../common/styledComponent/StyledProgress";
import { StyledBookSettingBarDrawer } from "../../../../common/styledComponent/antd/StyledBookSettingBarDrawer";
import DoubleLinesEllipsisContainer from "../../../../common/styledComponent/DoubleLinesEllipsisContainer";

import BookOrderButton from "../../../common/BookOrderButton";
import HideOrShowButton from "../../../common/HideOrShowButton";
import FavoriteBook from "../../../common/FavoriteBook";
import makeDataSource from "../../../common/logic";
import MoveToBookSetting from "../../../common/MoveToBookSetting";
import moment from "moment";
import CategorySettingButton from "../../../common/categorySetting/CategorySettingButton";

const StudyBooksTable = ({
  category,
  myBook,
  selectedBooks,
  changeSelectedBooks,
  isFoldedMenu,
  changeFoldedMenu,
}) => {
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

  const checkRef = useRef({});

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
        const isSelected =
          selectedBooks.filter((_book) => _book.book_id === _record._id)
            .length > 0;
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
              <div
                onClick={() => {
                  checkRef.current[_record.key].props.onChange();
                }}
                style={{ cursor: "pointer", display: "flex" }}
              >
                <StyledFlexAlignCenter>
                  <StyledBookTypeDiv booktype={_record.type} />
                  <Checkbox
                    ref={(ref) => (checkRef.current[_record.key] = ref)}
                    checked={isSelected}
                    onChange={() => {
                      if (isSelected) {
                        changeSelectedBooks(
                          selectedBooks.filter(
                            (_book) => _book.book_id !== _record._id
                          )
                        );
                      }
                      if (!isSelected) {
                        changeSelectedBooks([
                          ...selectedBooks,
                          { book_id: _record._id, book_title: _record.title },
                        ]);
                      }
                    }}
                  />
                </StyledFlexAlignCenter>
                <DoubleLinesEllipsisContainer>
                  {value}
                </DoubleLinesEllipsisContainer>
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
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 26,
      render: (_value, _record, _index) => {
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
          children: (
            <StyledFlexAllCenter>
              {_value === null ? "-" : DateString}
            </StyledFlexAllCenter>
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
      title: "진도율",
      key: "accuLevel",
      dataIndex: "accuLevel",
      className: "TableMiddleColumn TextAlignCenterColumn",
      align: "center",
      width: 60,
      render: (_value, _record, _index) => {
        const obj = {
          children: (
            <div>
              {/* 카드 레벨 총합 = acculevel, 총 카드 갯수 = total, 진도율 = 총 카드 갯수 / 카드 레벨 총합 */}
              {_record.total === 0 ? (
                "-"
              ) : (
                <StyledProgress
                  booktype={_record.type}
                  percent={_record.accuLevel / _record.total}
                />
              )}
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
      width: 20,
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
                    tableType="study"
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
      // title={<div className="ForPageMainTitle">나의 책</div>}
      title={
        <Space>
          <div className="ForPageMainTitle">나의책</div>
          <div>
            <CategorySettingButton
              category={category}
              addNewCategoryIdOnExpandedRowKeys={
                addNewCategoryIdOnExpandedRowKeys
              }
            />
          </div>
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

export default StudyBooksTable;

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

  /* 체크박스 오른쪽 여백 */
  & .ant-checkbox-wrapper {
    margin-right: 3px;
  }

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }
`;
