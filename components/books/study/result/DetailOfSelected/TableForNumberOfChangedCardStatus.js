import { Fragment, memo } from "react";

const TableForNumberOfChangedCardStatus = ({
  changedCardStatus,
  numberOfCards,
  more,
}) => {
  const getTotalNumber = (keyName) =>
    changedCardStatus.completed[keyName] +
    changedCardStatus.yet[keyName] +
    changedCardStatus.hold[keyName] +
    changedCardStatus.ing[keyName];

  const totalOfYet = getTotalNumber("yet");
  const totalOfIng = getTotalNumber("ing");
  const totalOfHold = getTotalNumber("hold");
  const totalOfCompleted = getTotalNumber("completed");

  const totalNumberOfInserted =
    numberOfCards.completed.inserted +
    numberOfCards.yet.inserted +
    numberOfCards.hold.inserted +
    numberOfCards.ing.inserted;

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
            기존 상태
          </th>
          <th className="text-[1rem] font-normal bg-slate-100">투입카드</th>
          <th className="text-[1rem] font-normal bg-slate-100">학습전</th>
          <th className="text-[1rem] font-normal bg-slate-100">학습중</th>
          <th className="text-[1rem] font-normal bg-slate-100">보류</th>
          <th className="text-[1rem] font-normal bg-slate-100">완료</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-collapse border-b-gray-200">
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200  text-center">
            Total
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalNumberOfInserted}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfYet}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfIng}
          </td>
          <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
            {totalOfHold}
          </td>
          <td className="text-[1rem] py-[4px] font-normal text-center">
            {totalOfCompleted}
          </td>
        </tr>
        {more &&
          ["yet", "ing", "hold", "completed"].map((preStatus) => (
            <tr
              key={preStatus}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {preStatus === "yet"
                  ? "학습전"
                  : preStatus === "ing"
                  ? "학습중"
                  : preStatus === "hold"
                  ? "보류"
                  : preStatus === "completed"
                  ? "완료"
                  : "오류"}
              </td>
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {numberOfCards[preStatus].inserted}
              </td>
              {["yet", "ing", "hold", "completed"].map((afterStatus) => (
                <Fragment key={`afterStatus:${afterStatus}`}>
                  {afterStatus === preStatus ? (
                    <td className="text-[1rem] font-normal text-stone-500 bg-zinc-300 border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                      {numberOfCards[preStatus].inserted -
                        Object.values(changedCardStatus[preStatus]).reduce(
                          (a, b) => a + b,
                          0
                        )}
                    </td>
                  ) : (
                    <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                      {changedCardStatus[preStatus][afterStatus]}
                    </td>
                  )}
                </Fragment>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default memo(TableForNumberOfChangedCardStatus);
