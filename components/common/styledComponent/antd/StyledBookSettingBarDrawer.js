import { Drawer } from "antd";
import styled from "styled-components";

export const StyledBookSettingBarDrawer = styled(Drawer)`
  & .ant-drawer-content {
    background-color: ${(props) => {
      const bgColor =
        props.booktype === "my"
          ? "#74ffc3"
          : props.booktype === "buy"
          ? "#74bfff"
          : console.log(new Error("책 타입 잘못 설정됨"));
      return bgColor;
    }};
    overflow: hidden;
    background-clip: padding-box;
    border: 0;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
`;
