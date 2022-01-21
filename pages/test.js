import React from "react";

const TableForMentorSessionHistory = () => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] font-normal bg-slate-100 w-[15%]">시작일</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[30%]">
          학습모드
        </th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[31%]">시간</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[24%]"></th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200  text-center">
          12/30
        </td>
        <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center">
          뒤집기(혼합)
        </td>
        <td className="text-[1rem] font-normal border-r border-collapse border-r-gray-200 text-center">
          17:18 ~ 03:20
        </td>
        <td className="text-[1rem] font-normal text-center">
          <a>자세히보기</a>
        </td>
      </tr>
    </tbody>
  </table>
);

const TableForRankedCards = () => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] font-normal bg-slate-100 w-[10%]">순위</th>
        <th className="text-[1rem] font-normal bg-slate-100">앞면</th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[20%]">
          {
            // contentType === "changedLevel"
            true ? "학습시간" : "학습횟수"
          }
        </th>
        <th className="text-[1rem] font-normal bg-slate-100 w-[13%]"></th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
          1
        </td>
        <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
          동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세
        </td>
        <td className="text-[1rem] py-[4px] font-normal text-center">
          00:01:30
        </td>
        <td className="text-[1rem] py-[4px] font-normal border-r border-collapse border-r-gray-200 text-center">
          →
        </td>
      </tr>
    </tbody>
  </table>
);

// TODO 전체 퍼센티지 80%부터 100%까지 높이 똑같음 수정해야함
const ChartForStudiedCardsPerDay = () => (
  <div>
    <div className="flex items-center w-full gap-6">
      <div className="flex items-center gap-2">
        <div className="w-12 h-3 bg-red-500"></div>
        <div className="text-[12px]">미완료카드</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-12 h-3 bg-blue-500"></div>
        <div className="text-[12px]">완료카드</div>
      </div>
    </div>
    <div className="flex gap-2 overflow-x-scroll">
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[70%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[90%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[100%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[100%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>

      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[60%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[24%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[80%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[56%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[12%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
      <div className="min-w-[45px] h-[140px] flex flex-col-reverse">
        <div className="text-[10px] text-center">1월16일</div>
        <div className="h-[12%]">
          <div className="bg-red-500 h-[70%] text-[10px] flex items-center justify-center">
            12
          </div>
          <div className="bg-blue-500 h-[30%] text-[10px] flex items-center justify-center">
            6
          </div>
        </div>
        <div className="text-[10px] text-center">111</div>
      </div>
    </div>
  </div>
);

const Test = () => {
  return (
    <div className="p-3">
      <div className="mb-4">
        최근 일주일 학습 실적
        <TableForMentorSessionHistory />
      </div>
      <div className="mb-4">
        최근 일주일 학습 실적
        <ChartForStudiedCardsPerDay />
      </div>
      <div className="mb-4">
        학습 시간 많은 카드
        <TableForRankedCards />
      </div>
    </div>
  );
};

export default Test;
