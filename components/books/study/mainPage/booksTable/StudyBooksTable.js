/* eslint-disable react/display-name */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

import { Table, Card, Space, Checkbox, Popover } from "antd";
import { DownOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";

import {
  StyledFlexAlignCenter,
  StyledFlexAllCenter,
  StyledFlexAllCenterDirectionColumn,
} from "../../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../../common/styledComponent/buttons";
import DoubleLinesEllipsisContainer from "../../../../common/styledComponent/DoubleLinesEllipsisContainer";

import makeDataSource from "../../../common/logic";
import CategorySettingButton from "../../../common/categorySetting/CategorySettingButton";
import NumberOfCardCell from "../../../common/tableComponent/NumberOfCardCell";
import SlidingMenuForBook from "../../../common/tableComponent/SlidingMenuForBook";
import { useRouter } from "next/router";
import computeFromNow from "../../../common/logic/computeFromNow";
import _ from "lodash";
import CreateBookButton from "../../../common/createBook/CreateBookButton";

const StudyBooksTable = ({
  category,
  myBook,
  selectedBooks,
  changeSelectedBooks,
  isFoldedMenu,
  changeFoldedMenu,
}) => {
  const router = useRouter();
  const movepage = useCallback(function (bookid) {
    localStorage.removeItem("book_id");
    localStorage.setItem("book_id", bookid);
    router.push(`/books/write/${bookid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      title: "????????????",
      key: "categoryName",
      className: "TableGroupingColumn",
      align: "center",
      width: 70,
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
      title: "??? ??????",
      key: "title",
      dataIndex: "title",
      className: "TableFirstColumn",
      align: "center",
      width: 140,
      render: (value, _record, index) => {
        const isSelected =
          selectedBooks.filter((_book) => _book.book_id === _record._id)
            .length > 0;
        const obj = {
          children:
            _record.classType === "empty-category" ? (
              <div>??? ????????????</div>
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
              >{`??? ${_record.totalBooksNum} ?????? ?????? ????????????. (?????? ??? ${_record.totalHiddenBooksNum} ???)`}</div>
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
      title: null,
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 20,
      onCell: (record) => ({
        onClick: () => {
          movepage(record._id);
        },
        style: { cursor: "pointer" },
      }),

      render: (_value, _record, _index) => {
        const obj = {
          children: (
            <StyledFlexAllCenter>
              <EditOutlined />
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
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>???</div>
          <div>?????????</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record, _index) => {
        const obj = {
          children: (
            <NumberOfCardCell
              value={_value}
              read={_record.read}
              flip={_record.flip}
              general={_record.general}
              common={_record.common}
              subject={_record.subject}
              isPc
            />
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
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>?????????</div>
          <div>?????????</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "flip",
      dataIndex: "flip",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record, _index) => {
        const obj = {
          children: (
            <StyledFlexAllCenter>{_value + _record.read}</StyledFlexAllCenter>
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
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>????????????</div>
          <div>(?????????)</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "flip",
      dataIndex: "flip",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record, _index) => {
        const isParentZero = _value + _record.read === 0;
        const completedRate =
          new String(
            Math.floor(100 * (_record.numCompleted / (_value + _record.read)))
          ) + " %";

        const obj = {
          children: isParentZero ? (
            <StyledFlexAllCenter>-</StyledFlexAllCenter>
          ) : (
            <StyledFlexAllCenterDirectionColumn>
              <div>{_record.numCompleted}</div>
              <div>({completedRate})</div>
            </StyledFlexAllCenterDirectionColumn>
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
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>???????????????</div>
          <div>(????????????)</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "flip",
      dataIndex: "flip",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record, _index) => {
        const isParentZero = _value + _record.read - _record.numCompleted === 0;
        const levelAverageForNotCompletedCard = Math.floor(
          100 *
            (_record.accuLevel / (_value + _record.read - _record.numCompleted))
        );

        const obj = {
          children: isParentZero ? (
            <StyledFlexAllCenter>-</StyledFlexAllCenter>
          ) : (
            <StyledFlexAllCenterDirectionColumn>
              <div>{_value + _record.read - _record.numCompleted}</div>
              <div>({levelAverageForNotCompletedCard})</div>
            </StyledFlexAllCenterDirectionColumn>
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
      title: "???????????????",
      key: "timeStudy",
      dataIndex: "timeStudy",
      align: "center",
      className: "TableMiddleColumn",
      width: 45,
      render: (_value, _record) => {
        const dateString = computeFromNow(_value);
        const obj = {
          children: (
            <StyledFlexAllCenter>
              {_value === null ? "-" : dateString}
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
    // {
    //   title: "?????????",
    //   key: "accuLevel",
    //   dataIndex: "accuLevel",
    //   className: "TableMiddleColumn TextAlignCenterColumn",
    //   align: "center",
    //   width: 60,
    //   render: (_value, _record, _index) => {
    //     const obj = {
    //       children: (
    //         <div>
    //           {/* ?????? ?????? ?????? = acculevel, ??? ?????? ?????? = total, ????????? = ??? ?????? ?????? / ?????? ?????? ?????? */}
    //           {_record.total === 0 ? (
    //             "-"
    //           ) : (
    //             <StyledProgress
    //               booktype={_record.type}
    //               percent={_record.accuLevel / _record.total}
    //             />
    //           )}
    //         </div>
    //       ),
    //       props: {
    //         colSpan: 1,
    //         rowSpan: 1,
    //       },
    //     };
    //     if (getConditionValue(_record)) {
    //       obj.props.colSpan = 0;
    //     } else {
    //       obj.props.colSpan = 1;
    //     }
    //     return obj;
    //   },
    // },
    {
      key: "seqInCategory",
      dataIndex: "seqInCategory",
      className: "TableLastColumn",
      align: "right",
      width: 20,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <SlidingMenuForBook
              record={_record}
              isFoldedMenu={isFoldedMenu}
              changeFoldedMenu={changeFoldedMenu}
              isPc
              tableType="study"
            />
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
          <div className="ForPcPageMainTitle">?????????</div>
          <CreateBookButton
            category={category}
            addNewCategoryIdOnExpandedRowKeys={
              addNewCategoryIdOnExpandedRowKeys
            }
            isPc
          />
          <CategorySettingButton
            category={dataSource.map((item) => ({
              name: item.categoryName,
              _id: item.mybookcate_id,
              hasBooks: item.classType !== "empty-category",
            }))}
            categorySetId={category._id}
            addNewCategoryIdOnExpandedRowKeys={
              addNewCategoryIdOnExpandedRowKeys
            }
            isPc
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

export default StudyBooksTable;

const StyledCard = styled(Card)`
  /* ?????? ?????? ????????? */

  & .ant-card-body {
    padding: 0 0 12px 0;
    & * {
      font-size: 13px;
    }
  }

  /* ???????????? ????????? ????????? ????????? ?????? ?????? */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  /* ???????????? ????????? ?????? */
  & .ant-checkbox-wrapper {
    margin-right: 3px;
  }

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }
`;
