import styled from "styled-components";

export const StyledBookTypeDiv = styled.div`
  width: 3px;
  height: 3rem;
  color: white;
  display: inline-block;
  border-radius: 3px;
  margin-right: 3px;
  line-height: 30px;
  background-color: ${(props) => {
    const bgColor =
      props.booktype === "my"
        ? "#ff6f56"
        : props.booktype === "buy"
        ? "#4dadfe"
        : console.log(new Error("책 타입 잘못 설정됨"));
    return bgColor;
  }};
`;
