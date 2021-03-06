import { memo } from "react";

const BoxForSummaryOfMainPage = ({ title, content }) => (
  <div className="flex flex-col gap-[2px]">
    <div className="text-base text-center font-[600] border border-gray-200  bg-slate-100">
      {title}
    </div>
    <div className="text-base text-center font-[600] text-[1.16667rem] h-[40px] py-[10px] border border-gray-200">
      {content}
    </div>
  </div>
);

export default memo(BoxForSummaryOfMainPage);
