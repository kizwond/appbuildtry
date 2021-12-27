import styled from "styled-components";

export const StyledProgress = styled.div`
  width: 100%;
  height: 1.4rem;
  background-color: #e5e5e5;
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 100px;

  &:before {
    content: "${(props) => props.percent}";
    text-align: left;
    height: 1.4rem;
    width: 50%;
    line-height: 1.4rem;
    font-size: 0.7rem;
    position: absolute;
    left: 10%;
    color: #020202;
    z-index: 1;
  }
  &:after {
    content: "";
    height: 1.4rem;
    width: ${(props) => (props.percent > 100 ? 100 : props.percent)}%;
    background-color: ${(props) => {
      const bgColor =
        props.booktype === "any"
          ? "#4dadfe"
          : props.booktype === "my"
          ? "#4dadfe"
          : props.booktype === "buy"
          ? "#ff6f56"
          : console.log(new Error("책 타입 잘못 설정됨"));
      return bgColor;
    }};
    border-radius: 100px;
    position: absolute;
    left: 0;
    z-index: 0;
  }
`;
