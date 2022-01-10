import { Tabs } from "antd";
import styled from "styled-components";

export const StyledAntTabs = styled(Tabs)`
  &.ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab {
    margin-left: 6px;
  }

  &.ant-tabs-card > .ant-tabs-nav {
    &::before {
      border-bottom: 1px solid #9bcfff;
    }
    .ant-tabs-nav-wrap > .ant-tabs-nav-list {
      width: ${({ width }) => (width && "100%") || null};
      .ant-tabs-tab {
        width: ${({ width }) => width || null};
      }
    }

    .ant-tabs-tab {
      padding: 4px;
      border-bottom: none;
      &::before {
        position: absolute;
        width: 106%;
        bottom: 0;
        right: 0;
        left: -1px;
        content: "";
        border-bottom: 1px solid #9bcfff;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .ant-tabs-tab-btn {
        font-size: ${({ is_pc }) => (is_pc === "true" ? "15px" : "1.16667rem")};
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
        width: 100%;
      }
    }

    .ant-tabs-tab-active {
      border: 1px solid #9bcfff;
      border-bottom: none;
      &::before {
        position: absolute;
        width: 100%;
        bottom: 0;
        right: 0;
        left: 0;
        content: "";
        border-bottom: 1px solid white;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
    }
  }

  /* 탭 콘텐츠 부분 css */
  .ant-tabs-tabpane.ant-tabs-tabpane-active > .SessionTabContentWrapper {
    border: 1px solid #9bcfff;
    border-top: none;
    padding: 5px;
    overflow-y: auto;
    height: ${({ is_pc }) =>
      is_pc === "true" ? "calc(100vh - 184px)" : "auto"};
  }

  .ant-tabs-tabpane.ant-tabs-tabpane-active
    > .SessionTabContentWrapper::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    background-color: #f5f5f5;
  }

  .ant-tabs-tabpane.ant-tabs-tabpane-active
    > .SessionTabContentWrapper::-webkit-scrollbar {
    width: 6px;
    background-color: #f5f5f5;
  }

  .ant-tabs-tabpane.ant-tabs-tabpane-active
    > .SessionTabContentWrapper::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #acacac;
  }
`;
