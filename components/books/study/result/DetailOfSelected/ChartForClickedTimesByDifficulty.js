import { memo } from "react";
import styled from "styled-components";

const ChartForClickedTimesByDifficulty = ({ clickedTimesByDifficulty }) => {
  const removedTotalInclicked = { ...clickedTimesByDifficulty };
  delete removedTotalInclicked.total;
  const maxNumber = Math.max(...Object.values(removedTotalInclicked));
  const difficulties = [
    { title: "난이도[0-20]", value: "diffi1", color: "bg-orange-400" },
    { title: "난이도[20-40]", value: "diffi2", color: "bg-emerald-400" },
    { title: "난이도[40-60]", value: "diffi3", color: "bg-yellow-400" },
    { title: "난이도[60-80]", value: "diffi4", color: "bg-rose-400" },
    { title: "난이도[80-90]", value: "diffi5", color: "bg-cyan-400" },
    { title: "난이도[90-100]", value: "diffi6", color: "bg-indigo-400" },
    // { title: "보류", value: "hold", color: "bg-gray-400" },
    // { title: "완료", value: "completed", color: "bg-green-400" },
    { title: "기타", value: "etc", color: "bg-lime-400" },
  ];
  return (
    <div className="w-full pr-[25px]">
      <table className="w-full h-full">
        <tbody>
          {difficulties.map(({ title, color, value }) => {
            const percentage =
              maxNumber === 0
                ? 0
                : Math.round(
                    (clickedTimesByDifficulty[value] / maxNumber) * 100
                  );
            return (
              <tr key={title}>
                <td className="w-[105px] text-[1rem] border-r border-r-slate-400">
                  <div className="flex justify-end pr-[8px]">{title}</div>
                </td>
                <td>
                  <StyledChartBar
                    className={`h-[70%] ${color} relative`}
                    percentage={percentage}
                  >
                    {percentage === 0 ? null : (
                      <div className="text-[10px] absolute w-[9px] right-[-10px]">
                        <div>{clickedTimesByDifficulty[value]}</div>
                      </div>
                    )}
                  </StyledChartBar>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default memo(ChartForClickedTimesByDifficulty);

const StyledChartBar = styled.div`
  width: ${({ percentage }) => percentage}%;
`;
