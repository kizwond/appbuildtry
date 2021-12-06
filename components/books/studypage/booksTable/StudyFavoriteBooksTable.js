/* eslint-disable react/display-name */
import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import moment from "../../../../node_modules/moment/moment";

import { Table, Button, Card, Space, Drawer, Checkbox, Progress } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import HideOrShowButton from "../../common/HideOrShowButton";
import MoveToBookSetting from "../../common/MoveToBookSetting";
import FavoriteBook from "../../common/FavoriteBook";
import FavoriteBookOrderButton from "../../writepage/booksTable/FavoriteBookOrderButton";
import DoubleLinesEllipsisContainer from "../../../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledBookTypeDiv } from "../../../common/styledComponent/buttons";
import { StyledProgress } from "../../../common/styledComponent/antd/StyledProgress";
import { StyledBookSettingBarDrawer } from "../../../common/styledComponent/antd/StyledBookSettingBarDrawer";
import { StyledFlexAllCenterDimension100Percent } from "../../../common/styledComponent/page";

const StudyFavoriteBooksTable = ({
  category,
  myBook,
  selectedBooks,
  changeSelectedBooks,
}) => {
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

  const studyLikedBooksList = myBook.filter(
    (_book) => _book.mybook_info.isStudyLike
  );
  const sortedBook = studyLikedBooksList.sort(
    (book_A, book_B) =>
      book_A.mybook_info.seqInStudyLike - book_B.mybook_info.seqInStudyLike
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
      isLastBook: studyLikedBooksList.length === _index + 1,
      key: _book._id,
      _id: _book._id,
      aboveAndBelowBooks: {
        aboveBook: {
          mybook_id: sortedBook[_index - 1] && sortedBook[_index - 1]._id,
          seqInStudyLike:
            sortedBook[_index - 1] &&
            sortedBook[_index - 1].mybook_info.seqInStudyLike,
        },
        belowBook: {
          mybook_id: sortedBook[_index + 1] && sortedBook[_index + 1]._id,
          seqInStudyLike:
            sortedBook[_index + 1] &&
            sortedBook[_index + 1].mybook_info.seqInStudyLike,
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
      render: (value, _record, index) => {
        const isSelected =
          selectedBooks.filter((_book) => _book.book_id === _record._id)
            .length > 0;

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
              <div>
                <StyledBookTypeDiv booktype={_record.type} />
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
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            카드 수
          </div>
          <div
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            (읽기/뒤집기)
          </div>
        </>
      ),
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
      title: "진도율",
      key: "timeModify",
      align: "center",
      dataIndex: "timeModify",
      className: "TableMiddleColumn",
      width: 60,
      render: (_value, _record) => (
        <div style={{ paddingLeft: "5px", paddingRight: "5px" }}>
          {/* 카드 레벨 총합 = acculevel, 총 카드 갯수 = total, 진도율 = 총 카드 갯수 / 카드 레벨 총합 */}
          {_record.total === 0 ? (
            "-"
          ) : (
            <StyledProgress
              percent={_record.accuLevel / _record.total}
              trailColor="#bbbbbb"
              strokeWidth={13}
            />
          )}
        </div>
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
                tableType="study"
                changeFoldedMenu={changeFoldedMenu}
              />{" "}
              |
              <FavoriteBook
                record={_record}
                changeFoldedMenu={changeFoldedMenu}
                tableType="study"
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
          <Button onClick={() => setVisible((_prev) => !_prev)} size="small">
            {visible ? "접기" : "펼치기"}
          </Button>
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

export default StudyFavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  & * {
    font-size: 0.8rem;
  }

  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
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
