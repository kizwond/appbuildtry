/* eslint-disable react/display-name */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "moment";

import { Table, Button, Card, Space, Drawer } from "antd";
import {
  DollarCircleFilled,
  DoubleLeftOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";

import WriteHistoryGraphBarComponent /*--------*/ from "./WriteHistoryGraphBarComponent";

import HideOrShowButton /*---------------------*/ from "../../common/HideOrShowButton";
import MoveToBookSetting /*--------------------*/ from "../../common/MoveToBookSetting";
import FavoriteBook /*-------------------------*/ from "../../common/FavoriteBook";
import FavoriteBookOrderButton /*--------------*/ from "../../common/FavoriteBookOrderButton";

import DoubleLinesEllipsisContainer /*---------*/ from "../../../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledFlexAllCenterDimension100Percent } from "../../../common/styledComponent/page";

const FavoriteBooksTable = ({ category, myBook }) => {
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();
  const [visible, setVisible] = useState(true);

  const router = useRouter();

  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);

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
      className: "TableGroupingColumn",
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
      className: "TableFirstColumn",
      align: "center",
      width: 95,
      render: (value, _record, index) => (
        <div
          onClick={() => {
            movepage(_record._id);
          }}
          style={{ cursor: "pointer" }}
        >
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <DollarCircleFilled style={{ marginRight: "3px", color: "aqua" }} />
            {value}
          </div>
        </div>
      ),
    },
    {
      title: "카드수",
      key: "total",
      align: "center",
      dataIndex: "total",
      className: "TableMiddleColumn",
      ellipsis: true,
      width: 70,
      render: (_value, _record) => (
        <StyledFlexAllCenterDimension100Percent>
          {_value}
        </StyledFlexAllCenterDimension100Percent>
      ),
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

        return <div>{_value === null ? "-" : DateString}</div>;
      },
    },
    {
      title: "카드생성이력",
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "TableMiddleColumn",
      width: 60,
      render: (_value, _record) => (
        <WriteHistoryGraphBarComponent _record={_record} />
      ),
    },
    {
      key: "seqInCategory",
      dataIndex: "seqInCategory",
      className: "TableLastColumn",
      align: "right",
      width: 35,
      render: (value, _record, index) => (
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
              changeFoldedMenu(`favorite${_record._id}`);
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
            className="BookDrawerMenu"
            placement="right"
            width={"250px"}
            closable={false}
            mask={false}
            visible={`favorite${_record._id}` === isFoldedMenu}
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
              <FavoriteBookOrderButton h _record={_record} tableType="write" />{" "}
              |
              <FavoriteBook
                record={_record}
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
                changeFoldedMenu("");
              }}
            >
              <DoubleRightOutlined />
            </div>
          </Drawer>
        </div>
      ),
    },
  ];

  return (
    <StyledCard
      bordered={false}
      size="small"
      title={
        <div>
          <span
            style={{
              marginRight: "30px",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
          >
            즐겨찾기
          </span>
          {dataSource.length > 0 && (
            <Button onClick={() => setVisible((_prev) => !_prev)} size="small">
              {visible ? "접기" : "펼치기"}
            </Button>
          )}
        </div>
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
};

export default FavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  & .ant-card-body * {
    font-size: 1rem;
  }

  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  /* 개별 책 펼치기  */
  & .ant-drawer-content {
    overflow: hidden;
    background-color: #2fbf40;
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
