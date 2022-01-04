import { Drawer } from "antd";
import styled from "styled-components";

export const StyledBookSettingBarDrawer = styled(Drawer)`
  &.ant-drawer.ant-drawer-right.BookDrawerMenu {
    position: absolute;
    text-align: initial;
    height: 3rem;
    top: 0.6rem;
    overflow: hidden;
  }
  & .ant-drawer-content {
    background-color: ${(props) => {
      const bgColor =
        props.booktype === "my"
          ? "#4dadfe"
          : props.booktype === "buy"
          ? "#ff6f56"
          : console.log(new Error("책 타입 잘못 설정됨"));
      return bgColor;
    }};
    background-clip: padding-box;
    border: 0;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  & .ant-drawer-body {
    padding: unset;
    flex-grow: unset;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  & .ant-drawer-wrapper-body {
    display: block;
  }
`;
