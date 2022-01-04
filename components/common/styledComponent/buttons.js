import styled from "styled-components";

export const StyledBookTypeDiv = styled.div`
  width: 4px;
  height: 3rem;
  display: inline-block;
  border-radius: 100px;
  margin-right: 3px;
  background-color: ${(props) => {
    const bgColor =
      props.booktype === "my"
        ? "#4dadfe"
        : props.booktype === "buy"
        ? "#ff6f56"
        : console.log(new Error("책 타입 잘못 설정됨"));
    return bgColor;
  }};
`;

export const StyledButtonForMainPage = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ is_pc }) => (is_pc === "true" ? "54px" : "4.167rem")};
  height: ${({ is_pc }) => (is_pc === "true" ? "22px" : "1.7rem")};
  background-color: lightgray;
  border-radius: ${({ is_pc }) => (is_pc === "true" ? "11px" : "0.9rem")};
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #3aa0ff;
  }
  &:active {
    background-color: #3aa0ff;
  }

  & > .anticon.anticon-form.IconForButton > svg,
  & > .anticon.anticon-plus.IconForButton > svg,
  & > .anticon.anticon-ordered-list.IconForButton > svg {
    color: gray;
    font-size: ${({ is_pc }) => (is_pc === "true" ? "17px" : "1.333rem")};
  }
  &:active > .anticon.anticon-form.IconForButton,
  &:hover > .anticon.anticon-form.IconForButton > svg,
  &:active > .anticon.anticon-plus.IconForButton,
  &:hover > .anticon.anticon-plus.IconForButton > svg,
  &:active > .anticon.anticon-ordered-list.IconForButton > svg,
  &:hover > .anticon.anticon-ordered-list.IconForButton > svg {
    color: #0058aa;
  }
`;
