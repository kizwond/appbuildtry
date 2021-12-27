import { memo, useMemo } from "react";
import { Button, message } from "antd";
import styled from "styled-components";

const M_SessionNavigationBar = ({
  activatedComponent,
  changeActivatedComponent,
  submitCreateSessionConfigToServer,
  numberOfFilteredCards,
}) => {
  const arrowButtonNode = useMemo(() => {
    const hanlderForNaviButton = (e) => {
      changeActivatedComponent(e.target.dataset.component);
    };
    return (
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
    );
  }, [activatedComponent, changeActivatedComponent]);

  const antdButtonNode = useMemo(() => {
    const hanlderForAntdNaviButton = () => {
      activatedComponent === "index"
        ? changeActivatedComponent("config")
        : changeActivatedComponent("index");
    };
    return (
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
          onClick={() => {
            if (numberOfFilteredCards > 0) {
              submitCreateSessionConfigToServer();
            } else {
              message.error("선택하신 카드가 없습니다.", 0.7);
            }
          }}
        >
          시작
        </Button>
      </div>
    );
  }, [
    activatedComponent,
    changeActivatedComponent,
    submitCreateSessionConfigToServer,
    numberOfFilteredCards,
  ]);

  return (
    <div>
      <StyledSessionNavigationBar>
        {arrowButtonNode}
        {antdButtonNode}
      </StyledSessionNavigationBar>
      <StyledDiv>
        학습 시작 예정 카드는 <b>{numberOfFilteredCards}</b>장 입니다.
      </StyledDiv>
    </div>
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
      font-weight: 450;
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
  margin: 8px;
`;
