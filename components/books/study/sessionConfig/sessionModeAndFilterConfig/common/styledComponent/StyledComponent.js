import styled from "styled-components";

export const StyledFilteMenuWrapper = styled.div`
  padding: 0px 6px 0px 6px;
`;

export const StyledDivConfigRow = styled.div`
  display: flex;
  flex-direction: ${(props) => (props.isPc === true ? "column" : "row")};
  padding-bottom: 5px;
  flex-wrap: nowrap;
  & > div:nth-child(1):not(.FilterSubTitleCol) {
    flex: none;
    width: ${(props) => (props.isPc === true ? "158px" : "148px")};
  }
  & > div.FilterSubTitleCol {
    flex: none;
    width: ${(props) => (props.isPc === true ? "153px" : "143px")};
    margin-top: 3px;
  }
  & > div:nth-child(2) {
    flex: auto;
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

  & .ConfigTitle {
    font-weight: 500;
    font-size: ${({ isPc }) => (isPc ? "15px" : "1.16667rem")};
  }
`;

export const StyledDivConfigCol = styled.div`
  display: flex;
  flex-wrap: nowrap;
  & .ConfigTitle {
    font-weight: 500;
    font-size: 1.16667rem;
  }
`;

export const StyledDivConfigColStartCards = styled(StyledDivConfigCol)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  & .TitleSwitchButton {
    right: 8px;
  }
  & .SubTitleSwitchButton {
    right: 8px;
  }
`;

export const StyledDivConfigMenuWrapper = styled.div`
  padding: 2px 3px 2px 0;
`;

export const StyledSpanConfigTitle = styled(({ onOff, children, ...rest }) => (
  <span {...rest}>{children}</span>
))`
  color: ${({ onOff }) => (onOff ? "black" : "#0000003f")};
  margin-right: 10px;
  font-size: ${({ isPc }) =>
    isPc ? "15px !important" : "1.16667rem !important"};
  font-weight: 500;
`;

export const StyledSpanFilterSubTitle = styled(
  ({ onOff, children, ...rest }) => <span {...rest}>{children}</span>
)`
  color: ${({ onOff }) => (onOff ? "black" : "#0000003f")};
  margin-right: 10px;
  font-weight: 550;
`;
