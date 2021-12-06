/* eslint-disable react/display-name */
import { useCallback, useEffect, useState, forwardRef } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "moment";

import { Table, Card, Space, Drawer, Popover } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import HideOrShowButton from "../../common/HideOrShowButton";
import MoveToBookSetting from "../../common/MoveToBookSetting";
import FavoriteBook from "../../common/FavoriteBook";
import FavoriteBookOrderButton from "./FavoriteBookOrderButton";
import {
  StyledFlexAlignCenter,
  StyledFlexAllCenterDimension100Percent,
  StyledFlexSpaceBetween,
  StyledTwoLinesEllipsis,
} from "../../../common/styledComponent/page";
import CategorySettingButton from "../categorySetting/CategorySettingButton";
import CreateBookButton from "../createBook/CreateBookButton";
import DoubleLinesEllipsisContainer from "../../../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledBookTypeDiv } from "../../../common/styledComponent/buttons";
import { StyledBookSettingBarDrawer } from "../../../common/styledComponent/antd/StyledBookSettingBarDrawer";
import WriteHistoryGraphBarComponent from "./WriteHistoryGraphBarComponent";

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
      router.push(`/m/write/${bookid}`);
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
      },

      {
        title: "카드생성이력",
        key: "writeHistory",
        dataIndex: "writeHistory",
        className: "TableMiddleColumn TextAlignCenterColumn",
        align: "center",
        width: 60,
        render: (_value, _record) => (
          <WriteHistoryGraphBarComponent _record={_record} />
        ),
      },
      {
        // title: "이동",
        key: "seqInCategory",
        dataIndex: "seqInCategory",
        className: "TableLastColumn",
        align: "right",
        width: 20,
        render: (value, _record) => (
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

            <StyledBookSettingBarDrawer
              booktype={_record.type}
              destroyOnClose={true}
              className="BookDrawerMenu"
              placement="right"
              width={"250px"}
              closable={false}
              mask={false}
              visible={`favorite${_record._id}` === isFoldedMenu}
              getContainer={false}
            >
              <Space size={3}>
                <FavoriteBookOrderButton
                  _record={_record}
                  changeFoldedMenu={changeFoldedMenu}
                  tableType="write"
                />{" "}
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
            </StyledBookSettingBarDrawer>
          </div>
        ),
      },
    ];

    return (
      <StyledCard
        isvisible={toString(visible)}
        bordered={false}
        size="small"
        title={
          <StyledFlexSpaceBetween>
            <div onClick={() => setVisible((_prev) => !_prev)}>
              <span
                style={{
                  marginRight: "10px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                }}
              >
                즐겨찾기
              </span>
              <DoubleRightOutlined rotate={visible ? 270 : 90} />
            </div>
            <div>
              <Space>
                <CreateBookButton category={category} />
                <CategorySettingButton category={category} ref={ref} />
              </Space>
            </div>
          </StyledFlexSpaceBetween>
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
  & * {
    font-size: 1rem;
  }

  & .ant-card-body {
    padding: ${(props) =>
      props.isvisible === "true"
        ? "0px 8px 12px 8px"
        : "0px 8px 0px 8px !important"};
  }

  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }

  & .HandleOnOffShow > span {
    font-size: 0.7rem;
  }
`;
