import styled from "styled-components";

export const StyledBookTypeDiv = styled.div`
  width: 10px;
  height: 30px;
  color: white;
  display: inline-block;
  border-radius: 3px;
  margin: 0 4px;
  line-height: 30px;
  background-color: ${(props) => {
    const bgColor = props.booktype === "my" ? "#74ffc3" : props.booktype === "buy" ? "#74bfff" : console.log(new Error("책 타입 잘못 설정됨"));
    return bgColor;
  }};
`;
