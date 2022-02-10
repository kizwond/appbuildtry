import React from "react";
import { Checkbox, Table } from "antd";
import styled from "styled-components";
import { StyledProgress } from "../../../common/styledComponent/StyledProgress";
import {
  StyledFlexAlignCenter,
  StyledFlexAllCenter,
  StyledFlexAllCenterDirectionColumn,
  StyledTwoLinesEllipsis,
} from "../../../common/styledComponent/page";
import { getAllChildrenKeys } from "../../../common/logic/getAllChildrenKeysForTable";
import { useMemo } from "react";

const IndexTree = ({
  onCheckIndexesCheckedKeys,
  checkedKeys,
  selectedbookId,
  bookData,
  isPc,
}) => {
  const scrolProperty = useMemo(
    () =>
      isPc
        ? null
        : {
            scroll: { x: 720 },
          },
    [isPc]
  );

  const handleCheckbox = (record) => {
    return {
      onClick: () => {
        const allChildrenKeys = getAllChildrenKeys(bookData, "key", record.key);

        if (checkedKeys?.includes(record.key)) {
          onCheckIndexesCheckedKeys(
            checkedKeys.filter((key) => !allChildrenKeys.includes(key)),
            selectedbookId
          );
        }
        if (!checkedKeys?.includes(record.key)) {
          onCheckIndexesCheckedKeys(
            [...checkedKeys, ...allChildrenKeys],
            selectedbookId
          );
        }
      },
      style: { cursor: "pointer" },
    };
  };

  return (
    <Table
      sticky
      columns={[
        {
          title: "목차",
          dataIndex: "title",
          key: "title",
          width: 120,
          className: "TableRowTitle",
          fixed: true,
          align: "center",
          onCell: handleCheckbox,
          render: function ForTitle(v, record) {
            return <StyledTwoLinesEllipsis>{v}</StyledTwoLinesEllipsis>;
          },
        },
        {
          dataIndex: "key",
          key: "key",
          width: 25,
          fixed: true,
          align: "center",
          onCell: handleCheckbox,
          render: function ForCheckbox(v, record) {
            return (
              <>
                {!(
                  record.key === "SummaryForAllBooks" ||
                  record.key === "SummaryForBook"
                ) && <Checkbox checked={checkedKeys?.includes(record.key)} />}
              </>
            );
          },
        },
        // {
        //   title: "평균 레벨",
        //   dataIndex: "totalLevelOfAllCards",
        //   key: "totalLevelOfAllCards",
        //   width: 56,
        //   align: "center",
        //   onCell: handleCheckbox,
        //   render: function ForProgress(level, { totalNumberOfAllCards }) {
        //     return (
        //       <>
        //         <StyledProgress
        //           booktype="any"
        //           percent={
        //             totalNumberOfAllCards === 0
        //               ? 0
        //               : (level / totalNumberOfAllCards).toFixed(2)
        //           }
        //         />
        //       </>
        //     );
        //   },
        // },
        {
          title: (
            <StyledFlexAllCenterDirectionColumn>
              <div>학습용</div>
              <div>카드</div>
            </StyledFlexAllCenterDirectionColumn>
          ),
          dataIndex: "totalNumberOfAllCards",
          key: "totalNumberOfAllCards",
          align: "center",
          width: 40,
        },
        {
          title: (
            <StyledFlexAllCenterDirectionColumn>
              <div>학습완료</div>
              <div>(완료율)</div>
            </StyledFlexAllCenterDirectionColumn>
          ),
          dataIndex: "totalNumberOfCompletedCards",
          key: "totalNumberOfCompletedCards",
          align: "center",
          width: 50,
          render: function displayName(_value, _record) {
            const isParentZero = _record.totalNumberOfAllCards === 0;
            const completedRate =
              new String(
                Math.floor(100 * (_value / _record.totalNumberOfAllCards))
              ) + " %";

            return isParentZero ? (
              <StyledFlexAllCenter>-</StyledFlexAllCenter>
            ) : (
              <StyledFlexAllCenterDirectionColumn>
                <div>{_value}</div>
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
          key: "totalNumberOfCompletedCards",
          dataIndex: "totalNumberOfCompletedCards",
          className: "TableMiddleColumn TableCardCounterColumn",
          align: "center",
          width: 50,
          render: function displayName(_value, _record, _index) {
            const isParentZero = _record.totalNumberOfAllCards - _value === 0;
            const levelAverageForNotCompletedCard = Math.floor(
              100 *
                (_record.totalLevelOfAllCards /
                  (_record.totalNumberOfAllCards - _value))
            );

            return isParentZero ? (
              <StyledFlexAllCenter>-</StyledFlexAllCenter>
            ) : (
              <StyledFlexAllCenterDirectionColumn>
                <div>{_record.totalNumberOfAllCards - _value}</div>
                <div>({levelAverageForNotCompletedCard})</div>
              </StyledFlexAllCenterDirectionColumn>
            );
          },
        },

        {
          title: "학습전",
          dataIndex: "totalNumberOfYetCards",
          key: "totalNumberOfYetCards",
          align: "center",
          width: 40,
        },
        {
          title: "학습중",
          children: [
            {
              title: "합계",
              dataIndex: "totalNumberOfAllCardsOnStudyStage",
              key: "totalNumberOfAllCardsOnStudyStage",
              align: "center",
              width: 42,
            },
            {
              title: "현재이전",
              dataIndex: "totalNumberOfUntilNowCardsOnStudyStage",
              key: "totalNumberOfUntilNowCardsOnStudyStage",
              align: "center",
              width: 42,
            },
            {
              title: "오늘이전",
              dataIndex: "totalNumberOfUntilTodayCardsOnStudyStage",
              key: "totalNumberOfUntilTodayCardsOnStudyStage",
              align: "center",
              width: 42,
            },
            {
              title: "내일이후",
              dataIndex: "totalNumberOfFromTomorrowCardsOnStudyStage",
              key: "totalNumberOfFromTomorrowCardsOnStudyStage",
              align: "center",
              width: 42,
            },
          ],
        },
        {
          title: "보류",
          dataIndex: "totalNumberOfHoldCards",
          key: "totalNumberOfHoldCards",
          align: "center",
          width: 40,
        },
      ]}
      dataSource={bookData}
      rowClassName={(record) =>
        record.key === "selectedIndexCardsInfo"
          ? "SelectedIndexCardsInfo"
          : null
      }
      expandable={{
        indentSize: 10,
      }}
      size="small"
      // scroll={{ x: isPc ? null : 720 }}
      {...scrolProperty}
      pagination={false}
      title={() => (
        <StyledDivTitle>
          <div className="FirstRow">
            <div className="TableMainTitle">목차 정보</div>
          </div>
          <div className="SecondRow">
            <div className="HelpDescription">
              * 카드 개수는 학습 카드(읽기 카드와 뒤집기 카드)의 개수만
              표시됩니다.
            </div>
            <div className="HelpDescription">
              * 학습중 카드는 복습 필요 시점 기준으로 개수를 확인하실 수
              있습니다.
            </div>
            <div className="HelpDescription">
              * 오늘이전 복습 필요 카드는 현재 이전 복습 필요 카드를 포함합니다.
            </div>
          </div>
        </StyledDivTitle>
      )}
    />
  );
};

export default IndexTree;

const StyledDivTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & .FirstRow {
    min-width: 100px;
  }
  & .SecondRow {
    width: 100%;
    /* margin-left: 10px; */
  }
  & .TableMainTitle {
    font-weight: 500;
    font-size: 1.16667rem;
  }
  & .HelpDescription {
    font-size: 10px;
    color: darkgray;
  }
`;
