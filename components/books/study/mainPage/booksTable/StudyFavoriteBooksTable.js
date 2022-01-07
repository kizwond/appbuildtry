/* eslint-disable react/display-name */
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { Table, Card, Space, Checkbox } from "antd";
import { DoubleRightOutlined, EditOutlined } from "@ant-design/icons";

import {
  StyledFlexAlignCenter,
  StyledFlexAllCenter,
  StyledFlexAllCenterDirectionColumn,
} from "../../../../common/styledComponent/page";
import { StyledBookTypeDiv } from "../../../../common/styledComponent/buttons";
import DoubleLinesEllipsisContainer from "../../../../common/styledComponent/DoubleLinesEllipsisContainer";
import NumberOfCardCell from "../../../common/tableComponent/NumberOfCardCell";
import SlidingMenuForBook from "../../../common/tableComponent/SlidingMenuForBook";
import computeFromNow from "../../../common/logic/computeFromNow";

const M_StudyFavoriteBooksTable = ({
  category,
  myBook,
  selectedBooks,
  changeSelectedBooks,
  isFoldedMenu,
  changeFoldedMenu,
}) => {
  const router = useRouter();
  const movepage = useCallback(function (bookid) {
    localStorage.removeItem("book_id");
    localStorage.setItem("book_id", bookid);
    router.push(`/books/write/${bookid}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      width: 70,
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
      width: 140,
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
      title: null,
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 20,
      onCell: (record) => ({
        onClick: () => {
          movepage(record._id);
        },
        style: { cursor: "pointer" },
      }),
      render: (_value, _record) => (
        <StyledFlexAllCenter>
          <EditOutlined />
        </StyledFlexAllCenter>
      ),
    },
    {
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>총</div>
          <div>카드수</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record, _index) => (
        <NumberOfCardCell
          value={_value}
          read={_record.read}
          flip={_record.flip}
          general={_record.general}
          common={_record.common}
          subject={_record.subject}
          isPc
        />
      ),
    },

    {
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>학습용</div>
          <div>카드수</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "flip",
      dataIndex: "flip",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record) => (
        <StyledFlexAllCenter>{_value + _record.read}</StyledFlexAllCenter>
      ),
    },
    {
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>학습완료</div>
          <div>(완료율)</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "flip",
      dataIndex: "flip",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record, _index) => {
        const isParentZero = _value + _record.read === 0;
        const completedRate =
          new String(
            Math.floor(100 * (_record.numCompleted / (_value + _record.read)))
          ) + " %";

        return isParentZero ? (
          <StyledFlexAllCenter>-</StyledFlexAllCenter>
        ) : (
          <StyledFlexAllCenterDirectionColumn>
            <div>{_record.numCompleted}</div>
            <div>({completedRate})</div>
          </StyledFlexAllCenterDirectionColumn>
        );
      },
    },
    {
      title: (
        <StyledFlexAllCenterDirectionColumn>
          <div>학습미완료</div>
          <div>(평균레벨)</div>
        </StyledFlexAllCenterDirectionColumn>
      ),
      key: "flip",
      dataIndex: "flip",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 45,
      render: (_value, _record, _index) => {
        const isParentZero = _value + _record.read - _record.numCompleted === 0;
        const levelAverageForNotCompletedCard = Math.floor(
          100 *
            (_record.accuLevel / (_value + _record.read - _record.numCompleted))
        );

        return isParentZero ? (
          <StyledFlexAllCenter>-</StyledFlexAllCenter>
        ) : (
          <StyledFlexAllCenterDirectionColumn>
            <div>{_value + _record.read - _record.numCompleted}</div>
            <div>({levelAverageForNotCompletedCard})</div>
          </StyledFlexAllCenterDirectionColumn>
        );
      },
    },

    {
      title: "최근학습일",
      key: "timeStudy",
      dataIndex: "timeStudy",
      align: "center",
      className: "TableMiddleColumn",
      width: 45,
      render: (_value, _record) => {
        const dateString = computeFromNow(_value);
        return (
          <StyledFlexAllCenter>
            {_value === null ? "-" : dateString}
          </StyledFlexAllCenter>
        );
      },
    },
    {
      key: "seqInCategory",
      dataIndex: "seqInCategory",
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
          tableType="study"
        />
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
};
export default M_StudyFavoriteBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */

  & .ant-card-body {
    padding: ${(props) =>
      props.isvisible === "true" ? "0 0 12px 0" : "0 !important"};
    & * {
      font-size: 13px;
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
