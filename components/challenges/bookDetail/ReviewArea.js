import { Rate } from "antd";
import styled from "styled-components";
import { CaretDownFilled, CaretUpFilled, StarFilled } from "@ant-design/icons";
import { useCallback, useState } from "react";

const ReviewArea = () => {
  const [visibleGraph, setVisibleGraph] = useState(false);

  const onToggleVisibleGraph = useCallback(() => {
    setVisibleGraph((prev) => !prev);
  }, []);

  return (
    <div className="">
      <div className="px-2 mb-1 text-lg font-bold border-b border-b-slate-500 ">
        평점
      </div>
      <div className="px-2">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <div className="inline-block w-[70px]">
              <div className="text-[13px] text-[#73777a]">구매자 별점</div>
              <StarScore>
                <Rate disabled allowHalf defaultValue={2.5} />
              </StarScore>
            </div>
            <div className="ml-2 p-0 inline-block text-[40px] text-[#1b1e20] font-bold">
              2.5
            </div>
          </div>
          <div className="text-right">
            <div className="text-[13px] text-[#73777a]">
              <b>14</b>
              명이 평가함
            </div>
            <GraphViewForReview>
              <button
                className={`appearance-none bg-none text-[13px] font-semibold text-zinc-500`}
                onClick={() => {
                  setVisibleGraph(!visibleGraph);
                }}
              >
                별점 분포 보기
                {!visibleGraph ? <CaretDownFilled /> : <CaretUpFilled />}
              </button>
              <div
                className={`absolute right-0 top-[20px] z-10 h-0 overflow-hidden transition rounded-md ${
                  visibleGraph ? "h-[125px] shadow-sm" : ""
                }`}
                onClick={onToggleVisibleGraph}
              >
                <ul className="w-[116px] h-[125px] p-[10px] text-center bg-white border border-gray-700 rounded-md box-border">
                  <li className="mt-[3px] first-of-type:mt-0 text-zinc-500 text-[12px] font-bold flex items-center">
                    <StarFilled />5
                    <span className="inline-block w-full h-[8px] bg-gray-200 ml-[4px] shadow-inner">
                      <ScoreBar width="57%"></ScoreBar>
                    </span>
                  </li>
                  <li className="mt-[3px] first-of-type:mt-0 text-zinc-500 text-[12px] font-bold flex items-center">
                    <StarFilled />4
                    <span className="inline-block w-full h-[8px] bg-gray-200 ml-[4px] shadow-inner">
                      <ScoreBar width="21%"></ScoreBar>
                    </span>
                  </li>
                  <li className="mt-[3px] first-of-type:mt-0 text-zinc-500 text-[12px] font-bold flex items-center">
                    <StarFilled />3
                    <span className="inline-block w-full h-[8px] bg-gray-200 ml-[4px] shadow-inner">
                      <ScoreBar width="10%"></ScoreBar>
                    </span>
                  </li>
                  <li className="mt-[3px] first-of-type:mt-0 text-zinc-500 text-[12px] font-bold flex items-center">
                    <StarFilled />2
                    <span className="inline-block w-full h-[8px] bg-gray-200 ml-[4px] shadow-inner">
                      <ScoreBar width="8%"></ScoreBar>
                    </span>
                  </li>
                  <li className="mt-[3px] first-of-type:mt-0 text-zinc-500 text-[12px] font-bold flex items-center">
                    <StarFilled />1
                    <span className="inline-block w-full h-[8px] bg-gray-200 ml-[4px] shadow-inner">
                      <ScoreBar width="4%"></ScoreBar>
                    </span>
                  </li>
                </ul>
              </div>
            </GraphViewForReview>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewArea;

const StarScore = styled.div`
  & .ant-rate {
    font-size: 14px;
  }

  & .ant-rate-star {
    margin-right: 0;
  }
`;

const GraphViewForReview = styled.div`
  display: inline-block;
  position: relative;
`;

const GraphViewButton = styled.button`
  -webkit-appearance: none;
  background: 0 0;
  border: none;
  box-shadow: none;
  font-size: 13px;
  font-weight: 600;
  color: #808991;
  & + .visible {
    height: 125px;
    box-shadow: 0 6px 12px 0 rgb(129 138 146 / 20%);
  }
`;

const ScoreGraphWrapper = styled.div`
  position: absolute;
  right: 0;
  top: 20px;
  z-index: 3;
  height: 0;
  overflow: hidden;
  -webkit-transition: height 0.2s, border-width 0.2s;
  transition: height 0.2s, border-width 0.2s;
  border-radius: 5px;
`;

const ScoreGraph = styled.ul`
  width: 116px;
  height: 125px;
  padding: 10px 0;
  text-align: center;
  background: #fff;
  border: 2px solid #808991;
  border-radius: 5px;
  box-sizing: border-box !important;
`;

const ScoreGraphItem = styled.li`
  margin-top: 3px;
  color: #808991;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.08em;
  &:first-child {
    margin-top: 0;
  }

  & .anticon-star {
    font-size: 10px;
  }
`;

const ScoreBarBG = styled.span`
  display: inline-block;
  width: 60px;
  height: 8px;
  background: #e8edf3;
  margin-left: 4px;
  box-shadow: inset 0 1px 1px 0 rgb(0 0 0 / 10%);
`;

const ScoreBar = styled.span`
  display: block;
  width: ${(props) => props.width || 0};
  height: 8px;
  background: #738096;
  background: -webkit-gradient(linear, 0 0, 0 100%, from(#9daab5), to(#718392));
  background: -webkit-linear-gradient(top, #9daab5, #718392);
  background: -ms-linear-gradient(top, #9daab5, #718392);
  background: -o-linear-gradient(top, #9daab5, #718392);
  background: linear-gradient(to bottom, #9daab5, #718392);
`;
