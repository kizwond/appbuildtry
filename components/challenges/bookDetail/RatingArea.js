import { Button, Form, Input, Rate } from "antd";
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
      <ReviewForm
        onFinish={(v) => {
          if (v.reviewText) {
            console.log(v);
          }
        }}
      >
        <Form.Item name="reviewText">
          <Input.TextArea placeholder="리뷰 작성시 광고 및 욕설, 비속어나 타인을 비방하는 문구를 사용하시면 비공개될 수 있습니다." />
        </Form.Item>
        <Form.Item className="">
          <Button htmlType="submit" block type="primary" size="large">
            리뷰 남기기
          </Button>
        </Form.Item>
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

const ReviewForm = styled(Form)`
  margin: 0;
  padding: 0 15px 30px 15px;
  & .ant-form-item {
    margin-bottom: 8px;
  }
`;
