import { DatePicker } from "antd";
import styled from "styled-components";

const StyledDatePicker = (props) => {
  const panelRender = (panelNode) => <StylePanel>{panelNode}</StylePanel>;

  return <StyledWapper panelRender={panelRender} {...props} />;
};

export default StyledDatePicker;

const StyledWapper = styled(DatePicker.RangePicker)`
  & .ant-picker-input > input {
    font-size: 0.7rem;
  }
  & .ant-picker-range-separator {
    padding: 0 4px;
  }
  & .anticon-swap-right > svg {
    font-size: 14px;
  }
  & .ant-picker.ant-picker-range.ant-picker-small {
    max-width: 140px;
  }
`;

const StylePanel = styled.div`
  .ant-picker-panel {
    &:last-child {
      width: 0;
      .ant-picker-header {
        position: absolute;
        right: 0;
        .ant-picker-header-prev-btn,
        .ant-picker-header-view {
          visibility: hidden;
        }
      }

      .ant-picker-body {
        display: none;
      }

      @media (min-width: 768px) {
        width: 280px !important;
        .ant-picker-header {
          position: relative;
          .ant-picker-header-prev-btn,
          .ant-picker-header-view {
            visibility: initial;
          }
        }

        .ant-picker-body {
          display: block;
        }
      }
    }
  }
`;
