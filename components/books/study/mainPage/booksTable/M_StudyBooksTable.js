/* eslint-disable react/display-name */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Table, Card, Space, Checkbox } from "antd";
import { DownOutlined, EditOutlined, RightOutlined } from "@ant-design/icons";

import {
  StyledFlexAlignCenter,
  StyledFlexAllCenter,
} from "../../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../../common/styledComponent/buttons";
import DoubleLinesEllipsisContainer from "../../../../common/styledComponent/DoubleLinesEllipsisContainer";

import makeDataSource from "../../../common/logic";
import CategorySettingButton from "../../../common/categorySetting/CategorySettingButton";
import NumberOfCardCell from "../../../common/tableComponent/NumberOfCardCell";
import SlidingMenuForBook from "../../../common/tableComponent/SlidingMenuForBook";
import computeFromNow from "../../../common/logic/computeFromNow";
import CreateBookButton from "../../../common/createBook/CreateBookButton";

const M_StudyBooksTable = ({
  category,
  myBook,
  selectedBooks,
  changeSelectedBooks,
  isFoldedMenu,
  changeFoldedMenu,
}) => {
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [isShowedHiddenBook, setIsShowedHiddenBook] = useState([]);
  const [mounted, setMounted] = useState(false);

  const checkRef = useRef({});

  const movepage = useCallback(function (bookid) {
    localStorage.removeItem("book_id");
    localStorage.setItem("book_id", bookid);
    router.push(`/m/write/${bookid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      width: 45,
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
      width: 95,
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
      title: "??????",
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 18,
      onCell: (record) => ({
        onClick: () => {
          movepage(record._id);
        },
        style: { cursor: "pointer" },
      }),
      render: (_value, _record) => {
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
      title: "?????????",
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 30,
      render: (_value, _record) => {
        const obj = {
          children: (
            <NumberOfCardCell
              value={_value}
              read={_record.read}
              flip={_record.flip}
              general={_record.general}
              common={_record.common}
              subject={_record.subject}
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
      title: "????????????",
      key: "timeStudy",
      dataIndex: "timeStudy",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 35,
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
    {
      key: "seqInCategory",
      dataIndex: "seqInCategory",
      className: "TableLastColumn",
      align: "right",
      width: 15,
      render: (value, _record, index) => {
        const obj = {
          children: (
            <SlidingMenuForBook
              record={_record}
              isFoldedMenu={isFoldedMenu}
              changeFoldedMenu={changeFoldedMenu}
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
          <div className="ForMobilePageMainTitle">?????????</div>
          <CreateBookButton
            category={category}
            addNewCategoryIdOnExpandedRowKeys={
              addNewCategoryIdOnExpandedRowKeys
            }
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
export default M_StudyBooksTable;

const StyledCard = styled(Card)`
  /* ?????? ?????? ????????? */

  & .ant-card-body {
    padding: 0px 8px 12px 8px;
    & * {
      font-size: 1rem;
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
