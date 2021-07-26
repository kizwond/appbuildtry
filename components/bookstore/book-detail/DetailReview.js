import { Rate } from "antd";
import styled from "styled-components";
import { CaretDownFilled, CaretUpFilled, StarFilled } from "@ant-design/icons";
import { useCallback, useState } from "react";

const DetailReview = () => {
  const [visibleGraph, setVisibleGraph] = useState(false);

  const onToggleVisibleGraph = useCallback(() => {
    setVisibleGraph((prev) => !prev);
  }, []);

  return (
    <DetailReviewWrapper>
      <StarScoreStaticWrapper>
        <AverageBoxWrapper>
          <ScoreCell>
            <StarScoreWrapper>
              <BuyerScoreTitle>구매자 별점</BuyerScoreTitle>
              <StarScore>
                <Rate disabled allowHalf defaultValue={2.5} />
              </StarScore>
            </StarScoreWrapper>
            <AverageScore>2.5</AverageScore>
          </ScoreCell>
          <ScoreCell>
            <ScoreCounter>
              <BoldSpan>14</BoldSpan>
              명이 평가함
            </ScoreCounter>
            <GraphViewForReview>
              <GraphViewButton
                onClick={() => {
                  setVisibleGraph(!visibleGraph);
                }}
              >
                별점 분포 보기
                {!visibleGraph ? <CaretDownFilled /> : <CaretUpFilled />}
              </GraphViewButton>
              <ScoreGraphWrapper className={!visibleGraph ? "invisible" : "visible"} onClick={onToggleVisibleGraph}>
                <ScoreGraph>
                  <ScoreGraphItem>
                    <StarFilled />5
                    <ScoreBarBG>
                      <ScoreBar width="20%"></ScoreBar>
                    </ScoreBarBG>
                  </ScoreGraphItem>
                  <ScoreGraphItem>
                    <StarFilled />4
                    <ScoreBarBG>
                      <ScoreBar width="10%"></ScoreBar>
                    </ScoreBarBG>
                  </ScoreGraphItem>
                  <ScoreGraphItem>
                    <StarFilled />3
                    <ScoreBarBG>
                      <ScoreBar width="50%"></ScoreBar>
                    </ScoreBarBG>
                  </ScoreGraphItem>
                  <ScoreGraphItem>
                    <StarFilled />2
                    <ScoreBarBG>
                      <ScoreBar width="15%"></ScoreBar>
                    </ScoreBarBG>
                  </ScoreGraphItem>
                  <ScoreGraphItem>
                    <StarFilled />1
                    <ScoreBarBG>
                      <ScoreBar width="5%"></ScoreBar>
                    </ScoreBarBG>
                  </ScoreGraphItem>
                </ScoreGraph>
              </ScoreGraphWrapper>
            </GraphViewForReview>
          </ScoreCell>
        </AverageBoxWrapper>
      </StarScoreStaticWrapper>
    </DetailReviewWrapper>
  );
};

export default DetailReview;

const DetailReviewWrapper = styled.div`
  border-top: 1px solid #e6e8eb;
`;

const StarScoreStaticWrapper = styled.div`
  margin: 0 auto;
  padding: 7px 15px;
`;

const AverageBoxWrapper = styled.div`
  padding: 16px 0;
  display: table;
  width: 100%;
`;

const ScoreCell = styled.div`
  display: table-cell;
  vertical-align: middle;

  &:last-child {
    text-align: right;
  }
`;

const StarScoreWrapper = styled.div`
  display: inline-block;
  width: 70px;
`;

const BuyerScoreTitle = styled.h4`
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: #808991;
`;

const StarScore = styled.div`
  & .ant-rate {
    font-size: 14px;
  }

  & .ant-rate-star {
    margin-right: 0;
  }
`;

const AverageScore = styled.p`
  margin: 0 0 0 10px;
  padding: 0;
  display: inline-block;
  vertical-align: 18%;
  font-size: 35px;
  color: #212529;
  font-weight: 700;
`;

const ScoreCounter = styled.div`
  font-size: 13px;
  color: #b8bfc4;
  padding: 0 3px 6px 0;
`;

const BoldSpan = styled.span`
  font-weight: bold;
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
