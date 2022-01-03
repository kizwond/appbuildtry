/* eslint-disable react/display-name */
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import moment from "moment";

import { Table, Card, Space, Drawer, Checkbox, Popover } from "antd";
import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";

import HideOrShowButton from "../../../common/HideOrShowButton";
import MoveToBookSetting from "../../../common/MoveToBookSetting";
import FavoriteBook from "../../../common/FavoriteBook";
import FavoriteBookOrderButton from "../../../common/FavoriteBookOrderButton";
import {
  StyledFlexAlignCenter,
  StyledFlexAllCenter,
  StyledFlexAllCenterDimension100Percent,
  StyledFlexSpaceBetween,
} from "../../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../../common/styledComponent/buttons";
import DoubleLinesEllipsisContainer from "../../../../common/styledComponent/DoubleLinesEllipsisContainer";
import { StyledProgress } from "../../../../common/styledComponent/StyledProgress";
import { StyledBookSettingBarDrawer } from "../../../../common/styledComponent/antd/StyledBookSettingBarDrawer";

const M_StudyFavoriteBooksTable = ({
  category,
  myBook,
  selectedBooks,
  changeSelectedBooks,
  isFoldedMenu,
  changeFoldedMenu,
}) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);
  const checkRef = useRef({});

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const likedBooksList = myBook.filter(
    (_book) => _book.mybook_info.isStudyLike
  );
  const sortedBook = likedBooksList.sort(
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
      isLastBook: likedBooksList.length === _index + 1,
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
      render: (value, _record, index) => {
        const isSelected =
          selectedBooks.filter((_book) => _book.book_id === _record._id)
            .length > 0;

        return (
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
            <DoubleLinesEllipsisContainer>{value}</DoubleLinesEllipsisContainer>
          </div>
        );
      },
    },
    {
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
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
      title: "최근학습일",
      key: "timeStudy",
      dataIndex: "timeStudy",
      align: "center",
      className: "TableMiddleColumn",
      width: 45,
      render: (_value, _record) => {
        const newDate = new Date(Number(_value));
        const DateString = moment(newDate).format("YY.MM.DD");
        return (
          <StyledFlexAllCenter>
            {_value === null ? "-" : DateString}
          </StyledFlexAllCenter>
        );
      },
    },
    {
      title: "진도율",
      key: "timeModify",
      dataIndex: "timeModify",
      className: "TableMiddleColumn TextAlignCenterColumn",
      align: "center",
      width: 60,
      render: (_value, _record) => (
        <div>
          {/* 카드 레벨 총합 = acculevel, 총 카드 갯수 = total, 진도율 = 총 카드 갯수 / 카드 레벨 총합 */}
          {_record.total === 0 ? (
            "-"
          ) : (
            <StyledProgress
              booktype={_record.type}
              percent={_record.accuLevel / _record.total}
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
      width: 20,
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
                isPc
              />{" "}
              |
              <FavoriteBook
                record={_record}
                changeFoldedMenu={changeFoldedMenu}
                tableType="study"
                isPc
              />{" "}
              |
              <HideOrShowButton
                record={_record}
                changeFoldedMenu={changeFoldedMenu}
                isPc
              />{" "}
              |
              <MoveToBookSetting mybook_id={_record._id} isPc />
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
      isvisible={visible ? "true" : "false"}
      bordered={false}
      size="small"
      title={
        <Space onClick={() => setVisible((_prev) => !_prev)}>
          <div className="ForPageMainTitle">즐겨찾기</div>
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
};
export default M_StudyFavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */

  & .ant-card-body {
    padding: ${(props) =>
      props.isvisible === "true" ? "0 0 12px 0" : "0 !important"};
    & * {
      font-size: 1rem;
    }
  }

  /* 체크박스 오른쪽 여백 */
  & .ant-checkbox-wrapper {
    margin-right: 3px;
  }

  /* 카테고리 펼치기 아이콘 오른쪽 마진 조절 */
  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  & .PullCustomCircleButton:hover {
    background-color: #a9a9a9;
  }
`;
