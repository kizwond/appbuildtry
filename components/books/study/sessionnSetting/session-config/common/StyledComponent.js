import styled from "styled-components";

export const StyledFilteMenuWrapper = styled.div`
  padding: 3px 15px;
`;

export const StyledDivConfigRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1):not(.FilterSubTitleCol) {
    flex: none;
    width: 110px;
  }
  & > div.FilterSubTitleCol {
    flex: none;
    width: 120px;
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
`;

export const StyledDivConfigCol = styled.div`
  /* display: flex;
flex-direction: column; */
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
  & .ConifgTitle {
    color: ${(props) => (props.onOff ? "black" : "#0000003f")};
    margin-right: 10px;
  }
  & .FilterSubTitle {
    color: ${(props) => (props.onOff ? "black" : "#0000003f")};
    margin-right: 10px;
    font-weight: 550;
    font-size: 0.7rem;
  }
  & .TitleSwitchButton {
    right: 25px;
  }
  & .SubTitleSwitchButton {
    right: 10px;
  }
`;
