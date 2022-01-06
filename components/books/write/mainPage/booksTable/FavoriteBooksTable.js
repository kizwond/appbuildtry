/* eslint-disable react/display-name */
import { useEffect, useState, forwardRef } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Table, Card, Space, Drawer, Popover } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import HideOrShowButton from "../../../common/HideOrShowButton";
import MoveToBookSetting from "../../../common/MoveToBookSetting";
import FavoriteBook from "../../../common/FavoriteBook";
import FavoriteBookOrderButton from "../../../common/FavoriteBookOrderButton";
import {
  StyledFlexAlignCenter,
  StyledFlexAllCenterDimension100Percent,
  StyledFlexSpaceBetween,
} from "../../../../common/styledComponent/page";
import DoubleLinesEllipsisContainer from "../../../../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledBookTypeDiv } from "../../../../common/styledComponent/buttons";
import { StyledBookSettingBarDrawer } from "../../../../common/styledComponent/antd/StyledBookSettingBarDrawer";
import WriteHistoryGraphBarComponent from "./WriteHistoryGraphBarComponent";
import NumberOfCardCell from "../../../common/tableComponent/NumberOfCardCell";
import SlidingMenuForBook from "../../../common/tableComponent/SlidingMenuForBook";

const FavoriteBooksTable = forwardRef(
  ({ category, myBook, isFoldedMenu, changeFoldedMenu }, ref) => {
    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(true);

    const router = useRouter();

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) {
      return null;
    }

    function movepage(bookid) {
      localStorage.removeItem("book_id");
      localStorage.setItem("book_id", bookid);
      router.push(`/books/write/${bookid}`);
    }

    const writeLikedBooksList = myBook.filter(
      (_book) => _book.mybook_info.isWriteLike
    );
    const sortedBook = writeLikedBooksList.sort(
      (book_A, book_B) =>
        book_A.mybook_info.seqInWriteLike - book_B.mybook_info.seqInWriteLike
    );
    const dataSource = sortedBook.map((_book, _index) => {
      return {
        ..._book.mybook_info,
        ..._book.stats?.numCards,
        ..._book.stats?.recent,
        ..._book.stats?.overall,
        studyHistory: _book.stats?.studyHistory,
        writeHistory: _book.stats?.writeHistory,
        categoryName: category.mybookcates.find(
          (_cate) => _cate._id === _book.mybook_info.mybookcate_id
        ).name,
        isFirstBook: _index === 0,
        isLastBook: writeLikedBooksList.length === _index + 1,
        key: _book._id,
        _id: _book._id,
        aboveAndBelowBooks: {
          aboveBook: {
            mybook_id: sortedBook[_index - 1] && sortedBook[_index - 1]._id,
            seqInWriteLike:
              sortedBook[_index - 1] &&
              sortedBook[_index - 1].mybook_info.seqInWriteLike,
          },
          belowBook: {
            mybook_id: sortedBook[_index + 1] && sortedBook[_index + 1]._id,
            seqInWriteLike:
              sortedBook[_index + 1] &&
              sortedBook[_index + 1].mybook_info.seqInWriteLike,
          },
        },
      };
    });

    const columns = [
      {
        title: "카테고리",
        key: "categoryName",
        className: "TableFirstColumn",
        align: "center",
        width: 50,
        dataIndex: "categoryName",
        render: (_value, _record) => (
          <DoubleLinesEllipsisContainer>{_value}</DoubleLinesEllipsisContainer>
        ),
      },
      {
        title: "책 제목",
        key: "title",
        dataIndex: "title",
        className: "TableMiddleColumn",
        align: "center",
        width: 95,
        render: (value, _record, index) => (
          <StyledFlexAlignCenter
            onClick={() => {
              movepage(_record._id);
            }}
            style={{ cursor: "pointer" }}
          >
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
        align: "center",
        dataIndex: "total",
        className: "TableMiddleColumn TableCardCounterColumn",
        align: "center",
        ellipsis: true,
        width: 26,
        render: (_value, _record) => (
          <NumberOfCardCell
            value={_value}
            read={_record.read}
            flip={_record.flip}
            isPc
          />
        ),
      },
      {
        title: "최근생성일",
        key: "writeHistory",
        dataIndex: "writeHistory",
        className: "TableMiddleColumn TextAlignCenterColumn",
        align: "center",
        width: 45,
        render: (_value, _record) => (
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
      },
      {
        title: "카드생성이력",
        key: "writeHistory",
        dataIndex: "writeHistory",
        className: "TableMiddleColumn TextAlignCenterColumn",
        align: "center",
        width: 60,
        render: (_value, _record) => {
          return <WriteHistoryGraphBarComponent _record={_record} />;
        },
      },
      {
        className: "TableLastColumn",
        align: "right",
        width: 20,
        render: (value, _record) => (
          <SlidingMenuForBook
            record={_record}
            isFoldedMenu={isFoldedMenu}
            changeFoldedMenu={changeFoldedMenu}
            isPc
            favorite
            tableType="write"
          />
        ),
      },
    ];

    return (
      <StyledCard
        isvisible={toString(visible)}
        bordered={false}
        size="small"
        title={
          <Space onClick={() => setVisible((_prev) => !_prev)}>
            <div className="ForPcPageMainTitle">즐겨찾기</div>
            <DoubleRightOutlined rotate={visible ? 270 : 90} />
          </Space>
        }
      >
        {visible && dataSource.length > 0 && (
          <Table
            dataSource={dataSource}
            tableLayout="fixed"
            columns={columns}
            size="small"
            pagination={false}
            rowClassName={(record, index) =>
              index % 2 !== 0 ? "EvenNumberRow" : "OddNumberRow"
            }
          />
        )}
      </StyledCard>
    );
  }
);

export default FavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */

  & .ant-card-body {
    padding: ${(props) =>
      props.isvisible === "true" ? "0 0 12px 0" : "0 0 0px 0 !important"};
    & * {
      font-size: 13px;
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
