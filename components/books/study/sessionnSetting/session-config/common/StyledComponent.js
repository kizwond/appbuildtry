import styled from "styled-components";

export const StyledFilteMenuWrapper = styled.div`
  padding: 0px 8px 0px 10px;
`;

export const StyledDivConfigRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1):not(.FilterSubTitleCol) {
    flex: none;
    width: 115px;
  }
  & > div.FilterSubTitleCol {
    flex: none;
    width: 140px;
    margin-top: 3px;
  }
  & > div:nth-child(2) {
    flex: auto;
  }

  @media screen and (min-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    & > div:nth-child(2) {
      flex: auto;
      width: 100%;
    }
  }
  @media screen and (max-width: 540px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    & > div:nth-child(2) {
      flex: none;
      width: 100%;
    }
  }

  & .ConifgTitle {
    font-size: 0.9rem;
    font-weight: 700;
  }
`;

export const StyledDivConfigCol = styled.div`
  display: flex;
  flex-wrap: nowrap;
  & .ConifgTitle {
    font-size: 0.8rem;
    font-weight: 700;
  }
  & .ant-picker-input > input {
    font-size: 10px;
  }
  & .anticon-swap-right > svg {
    font-size: 14px;
  }
  & .ant-picker.ant-picker-range.ant-picker-small {
    max-width: 140px;
  }
`;

export const StyledDivConfigColStartCards = styled(StyledDivConfigCol)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & .TitleSwitchButton {
    right: 15px;
  }
  & .SubTitleSwitchButton {
    right: 10px;
  }
`;

export const StyledDivConfigMenuWrapper = styled.div`
  margin: 3px 3px 0 3px;
`;

export const StyledSpanConfigTitle = styled(({ onOff, children, ...rest }) => <span {...rest}>{children}</span>)`
  color: ${({ onOff }) => (onOff ? "black" : "#0000003f")};
  margin-right: 10px;
  font-size: 0.9rem !important;
  font-weight: 700;
`;

export const StyledSpanFilterSubTitle = styled(({ onOff, children, ...rest }) => <span {...rest}>{children}</span>)`
  color: ${({ onOff }) => (onOff ? "black" : "#0000003f")};
  margin-right: 10px;
  font-weight: 550;
  font-size: 0.8rem;
  @media screen and (max-width: 765px) {
    font-size: 0.85rem;
  }
  @media screen and (max-width: 620px) {
    font-size: 0.9rem;
  }
`;
