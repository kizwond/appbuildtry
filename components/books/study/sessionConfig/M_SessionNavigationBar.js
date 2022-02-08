import { memo, useMemo } from "react";
import { Button, message } from "antd";
import styled from "styled-components";

const M_SessionNavigationBar = ({
  activatedComponent,
  changeActivatedComponent,
  numberOfFilteredCards,
}) => {
  const hanlderForNaviButton = (e) => {
    changeActivatedComponent(e.target.dataset.component);
  };

  return (
    <StyledDiv>
      <StyledSessionNavigationBar>
        <div className="FlexWrapper">
          <NavigationButton
            className="NavigationButton GoToIndex"
            activated={activatedComponent}
            type="button"
            data-component="index"
            onClick={hanlderForNaviButton}
          >
            목차 선택
          </NavigationButton>
          <NavigationButton
            className="NavigationButton GoToSession"
            activated={activatedComponent}
            type="button"
            data-component="config"
            onClick={hanlderForNaviButton}
          >
            학습 방식 선택
          </NavigationButton>
        </div>
      </StyledSessionNavigationBar>
      <div className="SummaryForNumberOfAllBooksCards">
        학습 시작 예정 카드는{" "}
        <span className="NumberOfCards">{numberOfFilteredCards}장</span> 입니다.
      </div>
    </StyledDiv>
  );
};

export default memo(M_SessionNavigationBar);

const StyledSessionNavigationBar = styled.div`
  margin: 8px;
  max-width: 450px;
  .FlexWrapper {
    display: flex;
    justify-content: space-evenly;
    padding-right: 20px;
    .NextStageButton {
      height: 2rem;
      display: flex;
      align-items: center;
      font-weight: 450;
      margin-left: 5px;
      & > span {
        font-size: 1.16667rem;
      }
    }
  }
`;
const NavigationButton = styled.div`
  width: 100%;
  /* min-width: 70px; */
  height: 2rem;
  position: relative;
  background: #efedfc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 450;
  cursor: pointer;

  &:hover {
    background: #dfa4a4;
  }
  &:before {
    content: "";
    position: absolute;
    right: -1rem;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 1rem solid #efedfc;
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
  }
  &:hover:before {
    border-left: 1rem solid #dfa4a4;
  }

  &.GoToIndex {
    font-size: 1.16667rem;
    z-index: 2;
    background: ${(props) =>
      props.activated === "index" ? "#322a64" : "#efedfc"};
    color: ${(props) => (props.activated === "index" ? "white" : "black")};
  }
  &.GoToIndex:before {
    border-left: ${(props) =>
      props.activated === "index"
        ? "1rem solid #322a64"
        : "1rem solid #efedfc"};
  }

  &.GoToSession {
    font-size: 1.16667rem;
    z-index: 1;
    background: ${(props) =>
      props.activated === "config" ? "#322a64" : "#efedfc"};
    color: ${(props) => (props.activated === "config" ? "white" : "black")};
    left: 5px;
  }
  &.GoToSession:before {
    border-left: ${(props) =>
      props.activated === "config"
        ? "1rem solid #322a64"
        : "1rem solid #efedfc"};
  }
  &.GoToSession:after {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    height: 0;
    border-left: 1rem solid white;
    border-top: 1rem solid transparent;
    border-bottom: 1rem solid transparent;
  }
`;

const StyledDiv = styled.div`
  .SummaryForNumberOfAllBooksCards {
    margin: 8px;
    padding: 4px;
    border: 1px dashed #9bcfff;
    background-color: #9bffff;
    font-size: 1.16667rem;
    & .NumberOfCards {
      font-size: 1.16667rem;
      font-weight: 600;
    }
  }
`;
