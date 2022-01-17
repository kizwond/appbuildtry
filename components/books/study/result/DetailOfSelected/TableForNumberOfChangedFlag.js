import { Fragment, memo } from "react";

const TableForNumberOfChangedFlag = ({ changedFlag }) => {
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
            플래그
          </th>
          <th className="text-[1rem] font-normal bg-slate-100">flag0</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag1</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag2</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag3</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag4</th>
          <th className="text-[1rem] font-normal bg-slate-100">flag5</th>
        </tr>
      </thead>
      <tbody>
        {["flag0", "flag1", "flag2", "flag3", "flag4", "flag5"].map(
          (preFlag) => (
            <tr
              key={preFlag}
              className="border-b border-collapse border-b-gray-200"
            >
              <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
                {preFlag}
              </td>
              {["flag0", "flag1", "flag2", "flag3", "flag4", "flag5"].map(
                (afterFlag) => (
                  <Fragment key={`afterFlag:${afterFlag}`}>
                    {afterFlag === preFlag ? (
                      <td className="text-[1rem] font-normal text-stone-500 bg-zinc-300 border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                        {Boolean(Number(changedFlag[preFlag][afterFlag])) &&
                          changedFlag[preFlag][afterFlag]}
                      </td>
                    ) : (
                      <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center last:border-r-0">
                        {Boolean(Number(changedFlag[preFlag][afterFlag])) &&
                          changedFlag[preFlag][afterFlag]}
                      </td>
                    )}
                  </Fragment>
                )
              )}
            </tr>
          )
        )}
      </tbody>
    </table>
  );
};

export default memo(TableForNumberOfChangedFlag);
