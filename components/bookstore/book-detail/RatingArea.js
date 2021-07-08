import { Rate } from "antd";
import { useState } from "react";
import styled from "styled-components";

const desc = ["terrible", "bad", "normal", "good", "wonderful"];

const RatingArea = () => {
  const [value, setValue] = useState(1);
  const handleChange = (_value) => {
    setValue(_value);
  };

  return (
    <RevieWrapper>
      <StarRateInputWrapper>
        <StarRateTip>이 책을 평가해주세요!</StarRateTip>
        <StarRateInputArea>
          <Rate tooltips={desc} onChange={handleChange} value={value} />
        </StarRateInputArea>
      </StarRateInputWrapper>
      <ReviewForm>
        <div>
          <ReviewTextarea name="content" title="리뷰입력" placeholder="리뷰 작성시 광고 및 욕설, 비속어나 타인을 비방하는 문구를 사용하시면 비공개될 수 있습니다." />
        </div>
        <SubmitButtonWrapper>
          <SubmitButton type="submit">리뷰 남기기</SubmitButton>
        </SubmitButtonWrapper>
      </ReviewForm>
    </RevieWrapper>
  );
};

export default RatingArea;

const RevieWrapper = styled.div`
  border-top: 1px solid #d1d5d9;
  box-sizing: border-box !important;
  text-align: center;
  background: #f3f4f5;
`;

const StarRateInputWrapper = styled.div`
  position: relative;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
`;

const StarRateTip = styled.div`
  position: relative;
  padding: 18px 10px 0 10px;
  min-height: 34px;
  font-size: 15px;
  letter-spacing: -0.03em;
  font-weight: 700;
  color: #9ea7ad;
  margin-top: 8px;
`;

const StarRateInputArea = styled.div`
  width: 315px;
  margin: 0 auto;
  font-size: 0px;
  text-align: center;
  user-select: none;
  padding: 0 0 15px 0;
  & .ant-rate {
    font-size: 36px;
  }

  & .ant-rate-star-first,
  & .ant-rate-star-second {
    color: #afacac;
  }
  & .ant-rate-star-half .ant-rate-star-first,
  .ant-rate-star-full .ant-rate-star-second {
    color: orange;
  }
  & .anticon {
    vertical-align: baseline;
  }
`;

const ReviewForm = styled.div`
  margin: 0;
  padding: 0 15px 30px 15px;
`;

const ReviewTextarea = styled.textarea`
  width: 100%;
  box-shadow: none;
  border: 2px solid #d1d5d9;
  border-radius: 5px;
  box-sizing: border-box !important;
  padding: 7px 7px;
  background: #fff;
  resize: vertical;
  height: 7em;
  -webkit-appearance: none;
  color: #a7b1bb;
  font-size: 14px;
  line-height: 1.5em;
  font-weight: 400;
  vertical-align: middle;
  outline: 0;
`;

const SubmitButtonWrapper = styled.div`
  margin-top: 16px;
`;

const SubmitButton = styled.div`
  font-family: ridi-roboto, Helvetica Neue, Apple SD Gothic Neo, "나눔고딕", Nanum Gothic, "돋움", arial, Dotum, Tahoma, Geneva, sans-serif;
  letter-spacing: -0.03em;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  -webkit-tap-highlight-color: transparent;
  appearance: none;
  border: 0;
  box-shadow: none;
  outline: 0;
  text-decoration: none;
  box-sizing: border-box;
  border-radius: 4px;
  font-weight: 700;
  display: inline-block;
  text-align: center;
  cursor: pointer;
  line-height: 1em;
  vertical-align: baseline;
  -webkit-transition: background 0.2s, color 0.2s;
  transition: background 0.2s, color 0.2s;
  color: #fff;
  background: #1f8ce6;
  border: 1px solid #0077d9;
  box-shadow: 0 1px 1px 0 rgb(31 140 230 / 30%);
  font-size: 12px;
  padding: 8px 18px;
  width: 100%;
  font-size: 15px;
  padding: 15px 0;
`;
