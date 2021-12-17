import { memo, useMemo } from "react";
import { Button } from "antd";
import styled from "styled-components";

const M_SessionNavigationBar = ({
  activatedComponent,
  changeActivatedComponent,
  submitCreateSessionConfigToServer,
}) => {
  const hanlderForNaviButton = (e) => {
    changeActivatedComponent(e.target.dataset.component);
  };
  const hanlderForAntdNaviButton = () => {
    activatedComponent === "index"
      ? changeActivatedComponent("config")
      : changeActivatedComponent("index");
  };

  const arrowButtonNode = useMemo(
    () => (
      <div className="FlexWrapper">
        <NavigationButton
          className="NavigationButton GoToIndex"
          activated={activatedComponent}
          type="button"
          data-component="index"
          onClick={hanlderForNaviButton}
        >
          목차 설정
        </NavigationButton>
        <NavigationButton
          className="NavigationButton GoToSession"
          activated={activatedComponent}
          type="button"
          data-component="config"
          onClick={hanlderForNaviButton}
        >
          세션 설정
        </NavigationButton>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activatedComponent]
  );

  const antdButtonNode = useMemo(
    () => (
      <div className="FlexWrapper">
        <Button
          className="NextStageButton"
          block
          size="small"
          onClick={hanlderForAntdNaviButton}
        >
          {activatedComponent === "index" ? "다음" : "이전"}
        </Button>
        <Button
          className={
            activatedComponent === "config"
              ? "NextStageButton GreenLight"
              : "NextStageButton"
          }
          block
          disabled={activatedComponent === "index"}
          size="small"
          onClick={submitCreateSessionConfigToServer}
        >
          시작
        </Button>
      </div>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activatedComponent]
  );

  return (
    <StyledSessionNavigationBar>
      {arrowButtonNode}
      {antdButtonNode}
    </StyledSessionNavigationBar>
  );
};

export default memo(M_SessionNavigationBar);

const StyledSessionNavigationBar = styled.div`
  margin: 8px;
  display: flex;
  justify-content: space-between;
  .FlexWrapper {
    display: flex;
    .NextStageButton {
      height: 2rem;
      display: flex;
      align-items: center;
      font-weight: 600;
      margin-left: 5px;
      & > span {
        font-size: 1.16667rem;
      }
      &.GreenLight {
        background-color: green;
        color: #fff;
      }
    }
  }
`;
const NavigationButton = styled.div`
  width: 8.333rem;
  min-width: 70px;
  height: 2rem;
  position: relative;
  background: #efedfc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.16667rem;
  font-weight: 700;
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
