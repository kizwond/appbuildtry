/* eslint-disable react/display-name */
import styled from "styled-components";

import { Table, Card, Button, message } from "antd";
import { DollarCircleFilled } from "@ant-design/icons";

import { StyledTwoLinesEllipsis } from "../common/styledComponent/page";
import NumberOfCardCell from "../books/common/tableComponent/NumberOfCardCell";
import { useCallback, useState } from "react";
import M_registerBuyBookDrawer from "./m_registerBuyBookDrawer";

const M_MyBooksTable = ({ bookData, loading, error }) => {
  const [drawerVisibleForRegisterBook, setDrawerVisibleForRegisterBook] =
    useState(false);

  const closeDrawer = useCallback(
    () => setDrawerVisibleForRegisterBook(false),
    []
  );

  const [selectedBookId, setSelectedBookId] = useState("");

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
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) =>
        _record.relationship === "parent" ? (
          <StyledTwoLinesEllipsis
            style={{ marginLeft: "2px", textAlign: "center" }}
          >
            {_value}
          </StyledTwoLinesEllipsis>
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
        <StyledTwoLinesEllipsis>
          <DollarCircleFilled style={{ marginRight: "3px", color: "aqua" }} />
          {value}
        </StyledTwoLinesEllipsis>
      ),
    },
    {
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 26,
      render: (_value, _record) => (
        <NumberOfCardCell
          value={_value}
          read={_record.read}
          flip={_record.flip}
          general={_record.general}
          common={_record.common}
          subject={_record.subject}
        />
      ),
    },

    {
      // title: "상설",
      className: "TableLastColumn",
      align: "center",
      onCell: (_record) => ({
        onClick: () => {
          if (_record.read + _record.flip > 0) {
            setDrawerVisibleForRegisterBook(true);
            setSelectedBookId(_record._id);
          } else {
            message.warning(
              "판매용 책을 등록하시려면 뒤집기 카드나 읽기 카드가 필요합니다",
              1.5
            );
          }
        },
      }),
      width: 60,
      render: (value, _record, index) => (
        <div>
          <Button type="link" size="small">
            판매 신청
          </Button>
        </div>
      ),
    },
  ];

  return (
    <StyledCard bordered={false} size="small">
      {myBook2 && (
        <Table
          dataSource={dataSource}
          tableLayout="fixed"
          loading={loading}
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
        />
      )}
      <M_registerBuyBookDrawer
        mybook_id={selectedBookId}
        visible={drawerVisibleForRegisterBook}
        closeDrawer={closeDrawer}
      />
    </StyledCard>
  );
};

export default M_MyBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */

  & .ant-input.ant-input-sm {
    height: 24px;
  }

  & > .ant-card-body {
    padding: 3px;
  }
`;
