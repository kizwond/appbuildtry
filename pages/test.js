import moment from "moment";
import React from "react";
import styled from "styled-components";

const TableForMentorSessionHistory = () => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] bg-slate-100 w-[15%]">시작일</th>
        <th className="text-[1rem] bg-slate-100 w-[30%]">학습모드</th>
        <th className="text-[1rem] bg-slate-100 w-[31%]">시간</th>
        <th className="text-[1rem] bg-slate-100 w-[24%]"></th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] border-r border-collapse border-r-gray-200  text-center">
          12/30
        </td>
        <td className="text-[1rem] border-r border-collapse border-r-gray-200 text-center">
          뒤집기(혼합)
        </td>
        <td className="text-[1rem] border-r border-collapse border-r-gray-200 text-center">
          17:18 ~ 03:20
        </td>
        <td className="text-[1rem] text-center">
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
        <th className="text-[1rem] bg-slate-100 w-[10%]">순위</th>
        <th className="text-[1rem] bg-slate-100">앞면</th>
        <th className="text-[1rem] bg-slate-100 w-[20%]">
          {
            // contentType === "changedLevel"
            true ? "학습시간" : "학습횟수"
          }
        </th>
        <th className="text-[1rem] bg-slate-100 w-[13%]"></th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          1
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-left px-[8px] truncate">
          동해물과 백두산이 마르고 닳도록 하느님이 보우하사 우리나라 만세
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          00:01:30
        </td>
        <td className="text-[1rem] py-[4px] text-center">→</td>
      </tr>
    </tbody>
  </table>
);

const TableForStatusOfCard = () => (
  <table className="w-full table-fixed">
    <thead>
      <tr className="border-collapse border-y border-y-gray-200">
        <th className="text-[1rem] bg-slate-100]">종류</th>
        <th className="text-[1rem] bg-slate-100">투입카드</th>
        <th className="text-[1rem] bg-slate-100">학습전</th>
        <th className="text-[1rem] bg-slate-100">학습중</th>
        <th className="text-[1rem] bg-slate-100">보류</th>
        <th className="text-[1rem] bg-slate-100">완료</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-collapse border-b-gray-200">
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          total
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          100
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          50
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          50
        </td>
        <td className="text-[1rem] py-[4px] border-r border-collapse border-r-gray-200 text-center">
          50
        </td>
        <td className="text-[1rem] py-[4px] text-center">30</td>
      </tr>
    </tbody>
    <div className="text-[1.2rem] w-26 flex items-center justify-center">
      <div className="flex justify-end w-full item-center">
        {false && "ㅇㅇ"}
      </div>
      <div className="flex-none w-[70px] flex item-center justify-center">
        {"세션 설정"}
      </div>
      <div className="flex w-full item-center">{true && "ㅇㅇ"}</div>
    </div>
  </table>
);

// TODO 전체 퍼센티지 80%부터 100%까지 높이 똑같음 수정해야함
const ChartForStudiedCardsPerDay = () => (
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
    <div className="w-full overflow-x-scroll overflow-y-hidden">
      <ul className="table h-[140px] mt-7">
        {[
          1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1,
          2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2,
          1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 2,
        ]
          .map((item, index) => {
            const total = Math.floor(Math.random() * 101);
            const incompleted = Math.floor(Math.random() * 101);
            const completed = 100 - incompleted;

            return {
              date: moment().add(index, "days").format("M월D일"),
              total,
              incompleted,
              completed,
            };
          })
          .map(({ date, total, incompleted, completed }, i) => (
            <li
              key={date}
              className="relative table-cell align-bottom min-w-[48px] px-1"
            >
              <StyledBar
                total={total}
                date={date}
                rate={total}
                completed={completed}
                incompleted={incompleted}
              >
                <div className="incompleted bg-yellow-500 text-[10px] text-gray-50 flex items-center justify-center">
                  {incompleted}
                </div>
                <div className="completed bg-blue-500 h-[30%] text-[10px] text-gray-50 flex items-center justify-center">
                  {completed}
                </div>
              </StyledBar>
            </li>
          ))}
      </ul>
    </div>
  </div>
);

const LineChartForClickedTimePerDay = () => (
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
  </div>
);

const StyledBar = styled.div`
  height: ${(props) => props.total}%;
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
    bottom: ${(props) => props.total}%;
    left: 0;
    right: 0;
  }

  .incompleted {
    height: ${(props) => props.incompleted}%;
  }
  .completed {
    height: ${(props) => props.completed}%;
  }
`;

const Test = () => {
  return (
    <div className="p-3">
      <div className="mb-4">
        최근 일주일 학습 실적
        <TableForMentorSessionHistory />
      </div>
      <div className="mb-4">
        총 학습 카드 개수
        <ChartForStudiedCardsPerDay />
      </div>
      <div className="mb-4">
        총 획득 레벨
        <ChartForStudiedCardsPerDay />
      </div>
      <div className="mb-4">
        학습 시간 많은 카드
        <TableForRankedCards />
      </div>
      <div className="mb-4">
        카드 상태
        <TableForStatusOfCard />
      </div>
      <div className="mb-4">
        카드 상태
        <LineChartForClickedTimePerDay />
      </div>
    </div>
  );
};

export default Test;
