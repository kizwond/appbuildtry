/* eslint-disable react/display-name */
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "../../../../node_modules/moment/moment";

import { Table, Button, Card, Space, Drawer, Checkbox, Progress } from "antd";
import { DollarCircleFilled, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import HideOrShowButton from "../../common/HideOrShowButton";
import MoveToBookSetting from "../../common/MoveToBookSetting";
import FavoriteBook from "../../common/FavoriteBook";
import FavoriteBookOrderButton from "../../writepage/booksTable/FavoriteBookOrderButton";

const StudyFavoriteBooksTable = ({ category, myBook, handleToGetMyBook, isPopupSomething, chagePopup, activedTable, changeActivedTable, selectedBooks, changeSelectedBooks }) => {
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();
  const [visible, setVisible] = useState(true);

  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);
  console.log("마운트 윗 코드");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  console.log("마운트 아래 코드");

  const studyLikedBooksList = myBook.filter((_book) => _book.mybook_info.isStudyLike);
  const sortedBook = studyLikedBooksList.sort((book_A, book_B) => book_A.mybook_info.seqInStudyLike - book_B.mybook_info.seqInStudyLike);
  const dataSource = sortedBook.map((_book, _index) => {
    return {
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      ..._book.stats?.overall,
      studyHistory: _book.stats?.studyHistory,
      writeHistory: _book.stats?.writeHistory,
      categoryName: category.mybookcates.find((_cate) => _cate._id === _book.mybook_info.mybookcate_id).name,
      isFirstBook: _index === 0,
      isLastBook: studyLikedBooksList.length === _index + 1,
      key: _book._id,
      _id: _book._id,
      aboveAndBelowBooks: {
        aboveBook: {
          mybook_id: sortedBook[_index - 1] && sortedBook[_index - 1]._id,
          seqInStudyLike: sortedBook[_index - 1] && sortedBook[_index - 1].mybook_info.seqInStudyLike,
        },
        belowBook: {
          mybook_id: sortedBook[_index + 1] && sortedBook[_index + 1]._id,
          seqInStudyLike: sortedBook[_index + 1] && sortedBook[_index + 1].mybook_info.seqInStudyLike,
        },
      },
    };
  });

  const columns = [
    {
      title: <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>카테고리</div>,
      key: "categoryName",
      className: "Row-First-Left",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) => <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{_value}</div>,
    },
    {
      title: <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>책 제목</div>,
      key: "title",
      dataIndex: "title",
      className: "TitleCol",
      width: 85,
      render: (value, _record, index) => {
        const isSelected = selectedBooks.filter((_book) => _book.book_id === _record._id).length > 0;

        return (
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Space>
              <Checkbox
                checked={isSelected}
                onChange={() => {
                  if (isSelected) {
                    changeSelectedBooks(selectedBooks.filter((_book) => _book.book_id !== _record._id));
                  }
                  if (!isSelected) {
                    changeSelectedBooks([...selectedBooks, { book_id: _record._id, book_title: _record.title }]);
                  }
                }}
              />
              <div>
                <StyledBookTypeDiv booktype={_record.type}>{_record.type === "my" ? null : "$"}</StyledBookTypeDiv>
                {value}
              </div>
            </Space>
          </div>
        );
      },
    },
    {
      title: (
        <>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>카드 수</div>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>(읽기/뒤집기)</div>
        </>
      ),
      key: "total",
      align: "center",
      dataIndex: "total",
      className: "normal",
      ellipsis: true,
      width: 70,
      render: (_value, _record) => <div>{`(${_record.read}/${_record.flip})`}</div>,
    },
    {
      title: <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>수정일</div>,
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "normal",
      width: 45,
      render: (_value, _record) => {
        const newDate = new Date(Number(_value));
        const DateString = moment(newDate).format("YY.MM.DD");

        return <div>{_value === null ? "-" : DateString}</div>;
      },
    },
    {
      title: (
        <>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>최근 3일간</div>
          <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>카드생성</div>
        </>
      ),
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "normal",
      width: 75,
      render: (_value, _record) => (
        <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
          {/* 카드 레벨 총합 = acculevel, 총 카드 갯수 = total, 진도율 = 총 카드 갯수 / 카드 레벨 총합 */}
          {_record.total === 0 ? "-" : <Progress percent={_record.accuLevel / _record.total} trailColor="#bbbbbb" />}
        </div>
      ),
    },
    {
      title: "이동",
      key: "seq_in_category",
      dataIndex: "seq_in_category",
      className: "normal",
      align: "right",
      width: 35,
      render: (value, _record, index) => (
        <div
          style={{
            position: "relative",
            zIndex: 2,
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
                height: "30px",
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
            width={"210px"}
            closable={false}
            mask={false}
            visible={activedTable === "favoriteTable" && _record._id === isFoldedMenu}
            getContainer={false}
            style={{ position: "absolute", textAlign: "initial", height: "30px", top: "2px" }}
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
              <FavoriteBookOrderButton _record={_record} tableType="study" /> |
              <FavoriteBook record={_record} changeActivedTable={changeActivedTable} changeFoldedMenu={changeFoldedMenu} tableType="study" />
              |
              <HideOrShowButton record={_record} />
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
    {
      title: "설정",
      align: "center",
      className: "Row-Last-One",
      width: 35,
      render: (value, _record, index) => (
        <div>
          <MoveToBookSetting mybook_id={_record._id} title={_record.title} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
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
          <span style={{ marginRight: "30px", fontSize: "1rem", fontWeight: "bold" }}>즐겨찾기</span>
          <Button onClick={() => setVisible((_prev) => !_prev)} size="small">
            {visible ? "접기" : "펼치기"}
          </Button>
        </div>
      }
    >
      {visible && dataSource.length > 0 && (
        <Table dataSource={dataSource} tableLayout="fixed" columns={columns} size="small" pagination={false} rowClassName={(record, index) => (index % 2 !== 0 ? "EvenNumberRow" : "OddNumberRow")} />
      )}
    </StyledCard>
  );
};

export default StudyFavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  & * {
    font-size: 0.8rem;
  }

  /* & .ant-table-thead .categoryCol::before {
    display: none;
  } */

  & .ant-table-thead .categoryCol {
    border-bottom: 1px solid #f0f0f0;
  }

  & .ant-table-tbody > tr > td {
    border-bottom: none;
    font-size: 1rem;
  }

  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  /* 개별 책 펼치기  */
  & .ant-drawer-content {
    overflow: hidden;
    background-color: #6c757d;
    background-clip: padding-box;
    border: 0;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }

  & .PushCustomCircleButton {
    width: 44px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #212529;
  }
  & .PushCustomCircleButton:hover {
    background-color: #a9a9a9;
  }
  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }

  & .FirstBookCustom > .anticon-arrow-up > svg,
  & .LastBookCustom > .anticon-arrow-down > svg {
    color: #4d4d4d;
  }

  /* 아이콘 크기 및 색상 - 부모 div Hover시 동작 포함 */
  & .anticon-double-right > svg {
    font-size: 18px;
    color: #a3a3a3;
  }
  & .PushCustomCircleButton:hover > .anticon-double-right > svg {
    font-size: 18px;
    color: #fff;
  }

  & .anticon-double-left > svg {
    font-size: 18px;
    color: #a3a3a3;
  }
  & .PullCustomCircleButton:hover > .anticon-double-left > svg {
    color: #fff;
  }

  & .anticon-arrow-down > svg {
    font-size: 16px;
    color: #dee2e6;
  }

  & .anticon-arrow-up > svg {
    font-size: 16px;
    color: #dee2e6;
  }

  & .anticon-star > svg {
    font-size: 16px;
  }

  & .anticon-eye > svg {
    font-size: 16px;
    color: #dee2e6;
  }

  & .anticon-eye-invisible > svg {
    font-size: 16px;
    color: #dee2e6;
  }

  & .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding: 0;
  }

  & .ant-table table {
    border-collapse: collapse;
    background-color: white;
    overflow: hidden;
  }

  & .categoryCol {
    border-bottom: none;
  }

  & .Row-Last-One {
    position: relative;
    z-index: 5000;
    background-color: white !important;
  }

  & .HandleOnOffShow > span {
    font-size: 0.7rem;
  }

  & .EvenNumberRow > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 4.2rem;

    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .EvenNumberRow > .TitleCol > div {
    background-color: #f5f5f5;
    height: 4.2rem;
    display: flex;
    align-items: center;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .EvenNumberRow > .normal > div,
  & .EvenNumberRow > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 4.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .EvenNumberRow > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .EvenNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .OddNumberRow > .Row-First-Left > div {
    background-color: #fff;
    height: 4.2rem;
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .OddNumberRow > .TitleCol > div {
    background-color: #fff;
    height: 4.2rem;
    display: flex;
    align-items: center;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .OddNumberRow > .normal > div,
  & .OddNumberRow > .Row-Last-One > div {
    background-color: #fff;
    height: 4.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .OddNumberRow > .normal > div.BookOrder {
    color: #fff;
  }

  & .OddNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const StyledBookTypeDiv = styled.div`
  width: 10px;
  height: 30px;
  color: white;
  display: inline-block;
  border-radius: 3px;
  margin: 0 4px;
  line-height: 30px;
  background-color: ${(props) => {
    const bgColor = props.booktype === "my" ? "#74ffc3" : props.booktype === "buy" ? "#74bfff" : console.log(new Error("책 타입 잘못 설정됨"));
    return bgColor;
  }};
`;
