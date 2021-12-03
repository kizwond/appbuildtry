import { Drawer } from "antd";
import styled from "styled-components";

export const StyledBookSettingBarDrawer = styled(Drawer)`
  &.ant-drawer.ant-drawer-right.BookDrawerMenu {
    position: absolute;
    text-align: initial;
    height: 3rem;
    top: 0.6rem;
  }
  & .ant-drawer-content {
    background-color: ${(props) => {
      const bgColor =
        props.booktype === "my"
          ? "#ff6f56"
          : props.booktype === "buy"
          ? "#4dadfe"
          : console.log(new Error("책 타입 잘못 설정됨"));
      return bgColor;
    }};
    overflow: hidden;
    background-clip: padding-box;
    border: 0;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
  &.ant-drawer.ant-drawer-right.BookDrawerMenu .ant-drawer-content-wrapper {
    transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1),
      box-shadow 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    box-shadow: unset;
  }
  & .ant-drawer-body {
    padding: unset;
    flex-grow: unset;
    overflow: hidden;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  & .ant-drawer-wrapper-body {
    display: block;
  }
`;
