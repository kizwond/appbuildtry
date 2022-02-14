import _ from "lodash";
import moment from "moment";
import { memo } from "react";
import styled from "styled-components";

const ChartForStudiedCardsPerDay = ({ book }) => {
  const maxStudiedTimes =
    book &&
    _.max(
      book.stats.studyHistory.map(
        ({ numCardsByStatus: { ing, hold, yet, completed } }) =>
          completed + ing + hold + yet
      )
    );

  return (
    <div>
      <div className="flex items-center w-full gap-6">
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-yellow-500"></div>
          <div className="text-[12px]">미완료카드</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-12 h-3 bg-blue-500"></div>
          <div className="text-[12px]">완료카드</div>
        </div>
      </div>
      <div className="w-full overflow-x-auto overflow-y-hidden">
        <ul className="table h-[140px] py-5">
          {book &&
            _(book.stats.studyHistory)
              .takeRight(15)
              .reverse()
              .map(
                ({ numCardsByStatus: { ing, hold, yet, completed }, date }) => {
                  const totalStudiedTimes = completed + ing + hold + yet;
                  const barHeightPercentage = !!maxStudiedTimes
                    ? Math.round((totalStudiedTimes / maxStudiedTimes) * 100) +
                      "%"
                    : "0%";
                  const incompletedTimes = ing + hold + yet;
                  const percentageOfIncompleted = !!totalStudiedTimes
                    ? Math.round((incompletedTimes / totalStudiedTimes) * 100) +
                      "%"
                    : "0%";
                  const completedTimes = completed;
                  const percentageOfCompleted = !!totalStudiedTimes
                    ? Math.round((completedTimes / totalStudiedTimes) * 100) +
                      "%"
                    : "0%";

                  return {
                    date: moment(date).format("M월D일"),
                    totalStudiedTimes,
                    barHeightPercentage,
                    incompletedTimes,
                    percentageOfIncompleted,
                    completedTimes,
                    percentageOfCompleted,
                  };
                }
              )
              .map(
                (
                  {
                    date,
                    totalStudiedTimes,
                    barHeightPercentage,
                    incompletedTimes,
                    percentageOfIncompleted,
                    completedTimes,
                    percentageOfCompleted,
                  },
                  index
                ) => (
                  <li
                    key={date + index}
                    className="relative table-cell align-bottom min-w-[48px] max-w-[48px] px-1"
                  >
                    <StyledBar
                      total={totalStudiedTimes}
                      barHeightPercentage={barHeightPercentage}
                      date={date}
                      percentageOfIncompleted={percentageOfIncompleted}
                      percentageOfCompleted={percentageOfCompleted}
                    >
                      <div className="incompleted bg-yellow-500 text-[10px] text-gray-50 flex items-center justify-center">
                        {incompletedTimes}
                      </div>
                      <div className="completed bg-blue-500 h-[30%] text-[10px] text-gray-50 flex items-center justify-center">
                        {completedTimes}
                      </div>
                    </StyledBar>
                  </li>
                )
              )
              .value()}
        </ul>
      </div>
    </div>
  );
};

export default ChartForStudiedCardsPerDay;

const StyledBar = styled.div`
  height: ${(props) => props.barHeightPercentage};
  &:before {
    content: "${(props) => props.date}";
    display: block;
    position: absolute;
    font-size: 10px;
    text-align: center;
    word-wrap: break-word;
    top: 100%;
    left: 0;
    right: 0;
  }
  &:after {
    content: "${(props) => props.total}";
    display: block;
    position: absolute;
    font-size: 10px;
    text-align: center;
    word-wrap: break-word;
    bottom: ${(props) => props.barHeightPercentage};
    left: 0;
    right: 0;
  }

  .incompleted {
    height: ${(props) => props.percentageOfIncompleted};
  }
  .completed {
    height: ${(props) => props.percentageOfCompleted};
  }
`;
