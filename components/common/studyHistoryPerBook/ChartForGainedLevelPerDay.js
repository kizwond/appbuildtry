import _ from "lodash";
import moment from "moment";
import styled from "styled-components";

const ChartForGainedLevelPerDay = ({ data }) => {
  const maxLevel = _.max(
    data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory.map(
      ({ level: { completed, nonCompleted } }) =>
        Math.floor(completed * 1000 + nonCompleted * 1000) / 1000
    )
  );
  _;
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
          {_(data.mybook_getMybookByMybookIDs.mybooks[0].stats.studyHistory)
            .takeRight(15)
            .reverse()
            .map(({ level: { completed, nonCompleted }, date }, index, arr) => {
              const totalLevel =
                Math.floor(completed * 1000 + nonCompleted * 1000) / 1000;
              const barHeightPercentage =
                Math.round((totalLevel / maxLevel) * 100) + "%";
              const incompletedLevel = Math.round(nonCompleted * 1000) / 1000;
              const percentageOfIncompleted =
                Math.round((incompletedLevel / totalLevel) * 100) + "%";
              const completedLevel = Math.round(completed * 1000) / 1000;
              const percentageOfCompleted =
                Math.round((completedLevel / totalLevel) * 100) + "%";
              return {
                date: moment(date).format("M월D일"),
                totalLevel,
                barHeightPercentage,
                incompletedLevel,
                percentageOfIncompleted,
                completedLevel,
                percentageOfCompleted,
              };
            })
            .map(
              ({
                date,
                totalLevel,
                barHeightPercentage,
                incompletedLevel,
                percentageOfIncompleted,
                completedLevel,
                percentageOfCompleted,
              }) => (
                <li
                  key={date}
                  className="relative table-cell align-bottom min-w-[48px] max-w-[48px] px-1"
                >
                  <StyledBar
                    total={totalLevel}
                    barHeightPercentage={barHeightPercentage}
                    date={date}
                    percentageOfIncompleted={percentageOfIncompleted}
                    percentageOfCompleted={percentageOfCompleted}
                  >
                    <div className="incompleted bg-yellow-500 text-[10px] text-gray-50 flex items-center justify-center">
                      {incompletedLevel}
                    </div>
                    <div className="completed bg-blue-500 h-[30%] text-[10px] text-gray-50 flex items-center justify-center">
                      {completedLevel}
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

export default ChartForGainedLevelPerDay;

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