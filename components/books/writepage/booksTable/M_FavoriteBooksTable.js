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
  StyledFlexSpaceBetween,
  StyledTwoLinesEllipsis,
} from "../../../common/styledComponent/page";
import CategorySettingButton from "../categorySetting/CategorySettingButton";
import CreateBookButton from "../createBook/CreateBookButton";
import DoubleLinesEllipsisContainer from "../../../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledBookTypeDiv } from "../../../common/styledComponent/buttons";

const FavoriteBooksTable = forwardRef(
  (
    {
      category,
      myBook,
      isPopupSomething,
      chagePopup,
      activedTable,
      changeActivedTable,
    },
    ref
  ) => {
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
        width: 85,
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
        width: 33,
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
                  justifyContent: "flex-end",
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
        title: "카드생성이력",
        key: "writeHistory",
        dataIndex: "writeHistory",
        className: "TableMiddleColumn",
        align: "center",
        width: 75,
        render: (_value, _record) => {
          const now = new Date();

          const today = moment(now).format("YYYYMMDD");
          const todayCards = _record.writeHistory?.filter(
            (_arr) => _arr.date === today
          )[0];
          const todayCreatedCards = todayCards ? todayCards.numCreatedCards : 0;

          const yesterday = moment(now).subtract(1, "days").format("YYYYMMDD");
          const yesterdayCards = _record.writeHistory?.filter(
            (_arr) => _arr.date === yesterday
          )[0];
          const yesterdayCreatedCards = yesterdayCards
            ? yesterdayCards.numCreatedCards
            : 0;

          const theDayBeforeYesterday = moment(now)
            .subtract(1, "days")
            .format("YYYYMMDD");
          const theDayBeforeYesterdayCards = _record.writeHistory?.filter(
            (_arr) => _arr.date === theDayBeforeYesterday
          )[0];
          const theDayBeforeYesterdayCreatedCards = theDayBeforeYesterdayCards
            ? theDayBeforeYesterdayCards.numCreatedCards
            : 0;

          return (
            <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
              <div>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <div className="singleBar">
                    <div className="graphBar">
                      <div
                        className="AchivedCard"
                        style={{
                          height:
                            theDayBeforeYesterdayCreatedCards >= 100
                              ? "100%"
                              : `${theDayBeforeYesterdayCreatedCards}%`,
                        }}
                      >
                        <span className="CardCounter">
                          {theDayBeforeYesterdayCreatedCards === 0
                            ? "-"
                            : theDayBeforeYesterdayCreatedCards}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div
                        className="AchivedCard"
                        style={{
                          height:
                            yesterdayCreatedCards >= 100
                              ? "100%"
                              : `${yesterdayCreatedCards}%`,
                        }}
                      >
                        <span className="CardCounter">
                          {yesterdayCreatedCards === 0
                            ? "-"
                            : yesterdayCreatedCards}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="singleBar">
                    <div className="graphBar">
                      <div
                        className="AchivedCard"
                        style={{
                          height:
                            todayCreatedCards >= 100
                              ? "100%"
                              : `${todayCreatedCards}%`,
                        }}
                      >
                        <span className="CardCounter">
                          {todayCreatedCards === 0 ? "-" : todayCreatedCards}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 1,
                    borderBottom: "1px solid #c5c6c7",
                  }}
                ></div>
              </div>
            </div>
          );
        },
      },
      {
        // title: "이동",
        key: "seqInCategory",
        dataIndex: "seqInCategory",
        className: "TableLastColumn",
        align: "right",
        width: 25,
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
                changeFoldedMenu(_record._id);
                changeActivedTable("favoriteTable");
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
              visible={
                activedTable === "favoriteTable" && _record._id === isFoldedMenu
              }
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
                <FavoriteBookOrderButton _record={_record} tableType="write" />{" "}
                |
                <FavoriteBook
                  record={_record}
                  changeActivedTable={changeActivedTable}
                  changeFoldedMenu={changeFoldedMenu}
                  tableType="write"
                />{" "}
                |
                <HideOrShowButton
                  record={_record}
                  isPopupSomething={isPopupSomething}
                  chagePopup={chagePopup}
                />{" "}
                |
                <MoveToBookSetting
                  mybook_id={_record._id}
                  title={_record.title}
                  isPopupSomething={isPopupSomething}
                  chagePopup={chagePopup}
                />
              </Space>
              <div
                className="PushCustomCircleButton"
                onClick={() => {
                  changeFoldedMenu("");
                  changeActivedTable("");
                }}
              >
                <DoubleRightOutlined />
              </div>
            </Drawer>
          </div>
        ),
      },
      // {
      //   // title: "상설",
      //   className: "TableLastColumn",
      //   align: "center",
      //   width: 25,
      //   render: (value, _record) => (
      //     <div>
      //       <MoveToBookSetting mybook_id={_record._id} title={_record.title} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
      //     </div>
      //   ),
      // },
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

  & .HandleOnOffShow > span {
    font-size: 0.7rem;
  }

  & .singleBar {
    width: 18px;
    margin-left: 3px;
    margin-right: 3px;
  }
  & .graphBar {
    position: relative;
    height: 20px;
    background: rgba(237, 238, 233, 0);
  }

  & .AchivedCard {
    position: absolute;
    bottom: 0;
    width: 18px;
    background: #e1e1e1;
    display: flex;
    justify-content: center;
  }

  & .CardCounter {
    position: absolute;
    font-size: 0.6rem;
    bottom: 3px;
    display: block;
    color: #707070;
  }
`;
