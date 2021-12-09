/* eslint-disable react/display-name */
import { useCallback, useEffect, useRef, useState } from "react";

import styled from "styled-components";
import { Table, Card, Popover, Button } from "antd";

import {
  StyledFlexAlignCenter,
  StyledFlexSpaceBetween,
} from "../common/styledComponent/page";
import DoubleLinesEllipsisContainer from "../common/styledComponent/DoubleLinesEllipsisContainer";

import M_RequestMentoringCard from "../../components/mentoring/M_RequestMetoringCard";
import { StyledBookTypeDiv } from "../common/styledComponent/buttons";

const M_Mentoring_BooksTable = ({
  bookData,
  loading,
  error,
  deviceDimensions,
}) => {
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [cardHeight, setCardHeight] = useState(0);
  const cardRef = useRef();

  const resetExpandedRowKeys = useCallback(() => {
    setExpandedRowKeys([]);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tableheight = cardRef.current.clientHeight;
      if (expandedRowKeys.length > 0) {
        setCardHeight(`${tableheight + deviceDimensions.height - 385}px`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedRowKeys]);

  if (error) <div>에러</div>;
  if (loading) <div>에러</div>;

  const myBook2 = bookData && bookData.mybook_getMybookByUserID.mybooks;

  const dataSource =
    myBook2 &&
    bookData.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0].mybookcates
      .map((_cate, _categoryIndex) => {
        const { name, seq } = _cate;
        const _categoryBooksList = myBook2.filter(
          (_book) => _cate._id === _book.mybook_info.mybookcate_id
        );
        if (_categoryBooksList.length === 0) {
          return null;
        }

        const categoryBooksList = _categoryBooksList.sort(
          (a, b) => a.mybook_info.seqInCategory - b.mybook_info.seqInCategory
        );

        const data = categoryBooksList.map((_book, _index) => ({
          ..._book.mybook_info,
          ..._book.stats?.numCards,
          relationship: _index === 0 ? "parent" : "children",
          classType:
            _index + 1 === categoryBooksList.length && _index % 2 === 0
              ? "last-odd-book"
              : _index + 1 === categoryBooksList.length && _index % 2 !== 0
              ? "last-even-book"
              : _index % 2 !== 0
              ? "even-book"
              : "odd-book",
          categoryOrder: seq,
          categoryName: name,
          isLastBook: categoryBooksList.length === _index + 1,
          key: _book._id,
          _id: _book._id,
        }));
        return data;
      })
      .filter((cate) => cate !== null)
      .flat();

  const columns = [
    {
      title: "카테고리",
      key: "categoryName",
      className: "TableGroupingColumn",
      align: "center",
      width: 60,
      dataIndex: "categoryName",
      render: (_value, _record) =>
        _record.relationship === "parent" ? (
          <DoubleLinesEllipsisContainer style={{ marginLeft: "2px" }}>
            {_value}
          </DoubleLinesEllipsisContainer>
        ) : null,
    },
    {
      title: "책 제목",
      key: "title",
      dataIndex: "title",
      className: "TableFirstColumn",
      align: "center",
      width: 95,
      render: (value, _record, index) => (
        <StyledFlexAlignCenter>
          <StyledFlexAlignCenter>
            <StyledBookTypeDiv booktype={_record.type} />
          </StyledFlexAlignCenter>
          <DoubleLinesEllipsisContainer>{value}</DoubleLinesEllipsisContainer>
        </StyledFlexAlignCenter>
      ),
    },
    {
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn",
      align: "center",
      ellipsis: true,
      width: 60,
      render: (_value, _record) => (
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
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {_value}
            </div>
          </Popover>
        </div>
      ),
    },

    {
      title: "멘토링 요청",
      key: "_id",
      dataIndex: "_id",
      className: "TableLastColumn",
      align: "center",
      width: 75,
      render: (value, _record, index) => (
        <div id={`requestMentoring:${_record._id}`}>
          {expandedRowKeys.includes(value) ? null : (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setExpandedRowKeys([value]);
              }}
            >
              멘토링 요청
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <StyledCard
      bordered={false}
      size="small"
      cardheight={cardHeight}
      bodyStyle={{ padding: "0", paddingTop: "8px" }}
    >
      {
        <div ref={cardRef}>
          <Table
            dataSource={dataSource}
            loading={loading}
            rowKey={(record) => record.key}
            columns={columns}
            size="small"
            pagination={false}
            rowClassName={(record, index) =>
              record.classType === "last-odd-book"
                ? "LastOddNumberRow"
                : record.classType === "last-even-book"
                ? "LastEvenNumberRow"
                : record.classType === "even-book"
                ? "EvenNumberRow"
                : "OddNumberRow"
            }
            expandable={{
              expandIcon: () => null,
              columnWidth: 0,
              expandedRowKeys,
              expandedRowRender: (_record, _index) => (
                <M_RequestMentoringCard
                  resetExpandedRowKeys={resetExpandedRowKeys}
                  mybook_id={_record._id}
                  mybookTitle={_record.title}
                  cardVisible={expandedRowKeys.includes(_record._id)}
                />
              ),
            }}
          />
        </div>
      }
    </StyledCard>
  );
};

export default M_Mentoring_BooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */

  & .ant-card-body * {
    font-size: 1rem;
  }

  min-width: 355px;
  height: ${(props) => props.cardheight || "auto"};
  padding: 0 3px;

  & .ant-input.ant-input-sm {
    height: 22px;
  }
`;
