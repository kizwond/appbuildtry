import { Rate } from "antd";
import React from "react";
import styled from "styled-components";

const DetailReview = () => {
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
          <ScoreCell></ScoreCell>
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

  &::last-child {
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
  margin-top: 5px;

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
