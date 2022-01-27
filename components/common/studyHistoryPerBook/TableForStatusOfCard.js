import { memo } from "react";

const TableForStatusOfCard = ({ hold, yet, completed, ing }) => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] bg-slate-100">Total</th>
        <th className="text-[1rem] bg-slate-100">학습전</th>
        <th className="text-[1rem] bg-slate-100">학습중</th>
        <th className="text-[1rem] bg-slate-100">보류</th>
        <th className="text-[1rem] bg-slate-100">완료</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {hold + yet + ing + completed}
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {yet}
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {ing}
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          {hold}
        </td>
        <td className="text-[1rem] py-[4px] text-center">{completed}</td>
      </tr>
    </tbody>
  </table>
);

export default memo(TableForStatusOfCard);
