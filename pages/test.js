import React from "react";

const test = () => {
  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-collapse border-y border-y-gray-200">
          <th className="text-[1rem] bg-slate-100">목차명</th>
          <th className="text-[1rem] bg-slate-100">이름변경</th>
          <th className="text-[1rem] bg-slate-100">레벨변경</th>
          <th className="text-[1rem] bg-slate-100">삭제</th>
          <th className="text-[1rem] bg-slate-100">추가</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-collapse border-b-gray-200">
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"></td>
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"></td>
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"></td>
          <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center"></td>
          <td className="text-[1rem] py-[4px] text-center"></td>
        </tr>
      </tbody>
    </table>
  );
};

export default test;
