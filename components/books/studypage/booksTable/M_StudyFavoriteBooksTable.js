/* eslint-disable react/display-name */
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "moment";

import { Table, Button, Card, Space, Drawer, Checkbox, Progress, Popover } from "antd";
import { DollarCircleFilled, DoubleLeftOutlined, DoubleRightOutlined, OrderedListOutlined } from "@ant-design/icons";

import HideOrShowButton from "../../common/HideOrShowButton";
import MoveToBookSetting from "../../common/MoveToBookSetting";
import FavoriteBook from "../../common/FavoriteBook";
import FavoriteBookOrderButton from "../../writepage/booksTable/FavoriteBookOrderButton";
import CategorySettingButton from "../../writepage/categorySetting/CategorySettingButton";
import { StyledFlexAlignCenter, StyledFlexSpaceBetween } from "../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../common/styledComponent/buttons";
import DoubleLinesEllipsisContainer from "../../../common/styledComponent/DoubleLinesEllipsisContainer";

const M_StudyFavoriteBooksTable = forwardRef(({ category, myBook, isPopupSomething, chagePopup, activedTable, changeActivedTable, selectedBooks, changeSelectedBooks }, ref) => {
  const [mounted, setMounted] = useState(false);
  const [isFoldedMenu, setIsFoldedMenu] = useState();
  const [visible, setVisible] = useState(true);
  const checkRef = useRef({});

  const changeFoldedMenu = useCallback((_id) => {
    setIsFoldedMenu(_id);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const likedBooksList = myBook.filter((_book) => _book.mybook_info.isStudyLike);
  const sortedBook = likedBooksList.sort((book_A, book_B) => book_A.mybook_info.seqInStudyLike - book_B.mybook_info.seqInStudyLike);
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
      isLastBook: likedBooksList.length === _index + 1,
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
      title: "카테고리",
      key: "categoryName",
      className: "Row-First-Left",
      align: "center",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) => <DoubleLinesEllipsisContainer>{_value}</DoubleLinesEllipsisContainer>,
    },
    {
      title: "책 제목",
      key: "title",
      dataIndex: "title",
      className: "TitleCol",
      align: "center",
      width: 85,
      render: (value, _record, index) => {
        const isSelected = selectedBooks.filter((_book) => _book.book_id === _record._id).length > 0;

        return (
          <div
            onClick={() => {
              checkRef.current[_record.key].props.onChange();
            }}
            style={{ cursor: "pointer", display: "flex" }}
          >
            <StyledFlexAlignCenter>
              <Checkbox
                ref={(ref) => (checkRef.current[_record.key] = ref)}
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
              <StyledBookTypeDiv booktype={_record.type}>{_record.type === "my" ? null : "$"}</StyledBookTypeDiv>
            </StyledFlexAlignCenter>
            <DoubleLinesEllipsisContainer>{value}</DoubleLinesEllipsisContainer>
          </div>
        );
      },
    },
    {
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "normal",
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
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", cursor: "pointer", width: "100%" }}>{_value}</div>
          </Popover>
        </div>
      ),
    },

    {
      title: "진도율",
      key: "timeModify",
      dataIndex: "timeModify",
      className: "normal",
      align: "center",
      width: 75,
      render: (_value, _record) => (
        <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
          {/* 카드 레벨 총합 = acculevel, 총 카드 갯수 = total, 진도율 = 총 카드 갯수 / 카드 레벨 총합 */}
          {_record.total === 0 ? "-" : <Progress percent={_record.accuLevel / _record.total} trailColor="#bbbbbb" />}
        </div>
      ),
    },
    {
      // title: "이동",
      key: "seqInCategory",
      dataIndex: "seqInCategory",
      className: "normal",
      align: "right",
      width: 25,
      render: (value, _record, index) => (
        <div
          style={{
            position: "relative",
            zIndex: 1000 - index,
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
                height: "4.2rem",
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
            style={{ position: "absolute", textAlign: "initial", height: "4.2rem" }}
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
      // title: "설정",
      className: "Row-Last-One",
      align: "center",
      width: 25,
      render: (value, _record) => (
        <div>
          <MoveToBookSetting mybook_id={_record._id} title={_record.title} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
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
            <span style={{ marginRight: "10px", fontSize: "1rem", fontWeight: "bold" }}>즐겨찾기</span>
            <DoubleRightOutlined rotate={visible ? 270 : 90} />
          </div>
          <div>
            <CategorySettingButton category={category} ref={ref} />
          </div>
        </StyledFlexSpaceBetween>
      }
    >
      {visible && dataSource.length > 0 && (
        <Table dataSource={dataSource} tableLayout="fixed" columns={columns} size="small" pagination={false} rowClassName={(record, index) => (index % 2 !== 0 ? "EvenNumberRow" : "OddNumberRow")} />
      )}
    </StyledCard>
  );
});

export default M_StudyFavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  & * {
    font-size: 0.8rem;
  }

  & .ant-card-body {
    padding: ${(props) => (props.isvisible === "true" ? "0px 12px 12px 12px" : "0px 12px 0px 12px !important")};
  }
  & .ant-table-container * {
    font-size: 1rem;
  }

  & .ant-table-thead .categoryCol {
    border-bottom: 1px solid #f0f0f0;
  }

  & .ant-table-tbody > tr > td {
    border-bottom: none;
  }

  /* 체크박스 오른쪽 여백 */
  & .ant-checkbox-wrapper {
    margin-right: 3px;
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

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }

  & .FirstBookCustom > .anticon-arrow-up > svg,
  & .LastBookCustom > .anticon-arrow-down > svg {
    color: #4d4d4d;
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

  & .ant-table-tbody > tr > td.Row-Last-One {
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
