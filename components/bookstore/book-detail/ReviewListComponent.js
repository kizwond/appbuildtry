import React from "react";
import styled from "styled-components";
import { Rate } from "../../../node_modules/antd/lib/index";

const ReviewListComponent = () => {
  return (
    <ReviewListArea>
      <ReviewList>
        <ReviewListItem>
          <ReviewHead>
            <ReviewerID>jooka</ReviewerID>
            <StarScoreWrapper>
              <StarScore>
                <Rate disabled allowHalf defaultValue={2.5} />
              </StarScore>
            </StarScoreWrapper>
          </ReviewHead>
          <ReviewBody>
            <p className="Folded">
              리뷰 영역
              <br />
              리뷰 영역
              <br />
              리뷰 영역
              <br />
              리뷰 영역
              <br />
              리뷰 영역
              <br />
              리뷰 영역
              <br />
              리뷰 영역
            </p>
            <button>펼쳐보기</button>
          </ReviewBody>
          <ReviewBottom>
            <div>댓글 (3) || 댓글 달기</div>
            <div>
              {" "}
              4명에게 도움이 됐어요 <button>useful</button>
            </div>
          </ReviewBottom>
          {true && <div>댓글영역</div>}
        </ReviewListItem>
        <ReviewForm>
          <div>
            <ReviewTextarea name="content" title="리뷰입력" placeholder="리뷰 작성시 광고 및 욕설, 비속어나 타인을 비방하는 문구를 사용하시면 비공개될 수 있습니다." />
          </div>
          <SubmitButtonWrapper>
            <SubmitButton type="submit">리뷰 남기기</SubmitButton>
          </SubmitButtonWrapper>
        </ReviewForm>
      </ReviewList>
    </ReviewListArea>
  );
};

export default ReviewListComponent;

const ReviewListArea = styled.div`
  background: #f7fafc;
  border-top: 1px solid #e5e8eb;
  padding: 8px 0;
`;

const ReviewList = styled.ul`
  margin: 0 auto;
  padding: 7px 15px;
  list-style: none;
`;

const ReviewListItem = styled.li`
  border-bottom: 1px solid #d1d5d9;
`;

const ReviewHead = styled.div`
  display: flex;
`;

const ReviewerID = styled.h4`
  margin: 0;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
`;
const StarScoreWrapper = styled.div`
  margin-left: 10px;
  display: inline-block;
  width: 70px;
`;
const StarScore = styled.div`
  & .ant-rate {
    font-size: 14px;
  }

  & .ant-rate-star {
    margin-right: 0;
  }
`;

const ReviewBody = styled.div`
  padding: 3px 0px 3px 0px;

  & p {
    padding: 0;
    margin: 0;
    color: #303538;
    line-height: 1.5em;
    font-size: 15px !important;
    word-break: keep-all;
    word-wrap: break-word;
    max-height: 999999px;
  }
  & .Folded {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
    word-break: keep-all;
    white-space: normal;
    max-height: 800px;
  }
`;

const ReviewBottom = styled.div`
  display: flex;
  justify-content: space-between;
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
