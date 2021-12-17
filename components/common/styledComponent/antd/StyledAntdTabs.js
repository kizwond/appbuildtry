import { Tabs } from "antd";
import styled from "styled-components";

export const StyledAntTabs = styled(Tabs)`
  &.ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab + .ant-tabs-tab {
    margin-left: 6px;
  }

  &.ant-tabs-card > .ant-tabs-nav {
    &::before {
      border-bottom: 1px solid #1890ff;
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
        border-bottom: 1px solid #1890ff;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .ant-tabs-tab-btn {
        font-size: 1.16667rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .ant-tabs-tab-active {
      border: 1px solid #1890ff;
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
    border: 1px solid #1890ff;
    border-top: none;
    padding: 5px;
  }
`;
