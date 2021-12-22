import styled from "styled-components";

export const StyledFilteMenuWrapper = styled.div`
  padding: 0px 6px 0px 6px;
`;

export const StyledDivConfigRow = styled.div`
  display: flex;
  padding-bottom: 5px;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1):not(.FilterSubTitleCol) {
    flex: none;
    width: 104px;
  }
  & > div.FilterSubTitleCol {
    flex: none;
    width: 140px;
    margin-top: 3px;
  }
  & > div:nth-child(2) {
    flex: auto;
  }

  /* @media screen and (min-width: 992px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    & > div:nth-child(2) {
      flex: auto;
      width: 100%;
    }
  } */
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
    font-size: 1.16667rem;
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
  font-size: 1.16667rem !important;
  font-weight: 500;
`;

export const StyledSpanFilterSubTitle = styled(
  ({ onOff, children, ...rest }) => <span {...rest}>{children}</span>
)`
  color: ${({ onOff }) => (onOff ? "black" : "#0000003f")};
  margin-right: 10px;
  font-weight: 550;
`;
