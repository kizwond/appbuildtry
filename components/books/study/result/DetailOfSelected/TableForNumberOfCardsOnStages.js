import { memo } from "react";

const TableForNumberOfCardsOnStages = ({ numberOfCards, more }) => {
  const getTotalNumber = (keyName) =>
    numberOfCards.completed[keyName] +
    numberOfCards.yet[keyName] +
    numberOfCards.hold[keyName] +
    numberOfCards.ing[keyName];

  const totalOfSelected = getTotalNumber("selected");
  const totalOfInserted = getTotalNumber("inserted");
  const totalOfStarted = getTotalNumber("started");
  const totalOfFinished = getTotalNumber("finished");
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] bg-slate-100 w-[20%]">기존 상태</th>
          <th className="text-[1rem] bg-slate-100">선택</th>
          <th className="text-[1rem] bg-slate-100">투입</th>
          <th className="text-[1rem] bg-slate-100">시작</th>
          <th className="text-[1rem] bg-slate-100">종료</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-collapse border-b-gray-200">
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
            Total
          </td>
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
            {totalOfSelected}
          </td>
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
            {totalOfInserted}
          </td>
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
            {totalOfStarted}
          </td>
          <td className="text-[1rem] py-[4px] text-center">
            {totalOfFinished}
          </td>
        </tr>
        {more &&
          ["yet", "ing", "hold", "completed"].map((status) => (
            <tr
              key={status}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                {status === "yet"
                  ? "학습전"
                  : status === "ing"
                  ? "학습중"
                  : status === "hold"
                  ? "보류"
                  : status === "completed"
                  ? "완료"
                  : "오류"}
              </td>
              <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[status].selected}
              </td>
              <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[status].inserted}
              </td>
              <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[status].started}
              </td>
              <td className="text-[1rem] py-[4px] text-center">
                {numberOfCards[status].finished}
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default memo(TableForNumberOfCardsOnStages);
