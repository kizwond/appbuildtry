import React, { useState, useCallback, memo } from "react";
import { useQuery } from "@apollo/client";
import { Switch, InputNumber, Card, Col, Row, Button, Typography } from "antd";
import { GET_SESSTION_CONFIG } from "../../../../graphql/query/studySessionSetting";
import GetFilteredIndexButton from "./GetFilteredIndexButton";
import styled from "styled-components";
import SortOptionTag from "./session-config/SortOptionTag";
import UseCardTypesTag from "./session-config/UseCardTypesTag";
import UseStatusTag from "./session-config/UseStatusTag";
import StudyTimeCondition from "./session-config/StudyTimeCondition";
import NumStartCards from "./session-config/NumStartCards";
import FlagTags from "./session-config/FlagTags";
import FilterSubMenu from "./session-config/common/FilterSubMenu";
import RecentStudyTime from "./session-config/RecentStudyTime";
import CardLevel from "./session-config/CardLevel";
import StudyTimes from "./session-config/StudyTimes";
import { StyledDivConfigRow, StyledDivConfigColStartCards, StyledSpanConfigTitle } from "./session-config/common/StyledComponent";
import useSessionConfig from "./session-config/useHook/useSessionConfig";
import { Tabs } from "../../../../node_modules/antd/lib/index";

const SessionConfig = ({ submitCreateSessionConfigToServer, book_ids, onToggleIsAFilter, onChangeAFCardList, AFCardList, advancedFilteredCheckedIndexes, onChangeIndexesOfAFCardList }) => {
  const [counterForButtonClick, setCounterForButtonClick] = useState(0);

  const {
    mode,
    flipNeedStudyTimeCondition,
    flipNeedStudyTimeRange,
    flipNumStartCards,
    flipSortOption,
    flipUseCardType,
    flipUseStatus,
    // read 모드설정
    readNeedStudyTimeCondition,
    readNeedStudyTimeRange,
    readNumStartCards,
    readSortOption,
    readUseCardType,
    readUseStatus,
    // exam 모드설정
    examNeedStudyTimeCondition,
    examNeedStudyTimeRange,
    examNumStartCards,
    examSortOption,
    examUseCardType,
    examUseStatus,
    // 고급필터
    advancedFilterOnOff,
    cardMakerOnOff,
    cardMaker,
    examResultOnOff,
    examResult,
    levelOnOff,
    level,
    makerFlagOnOff,
    makerFlag,
    recentDifficultyOnOff,
    recentDifficulty,
    recentStudyTimeOnOff,
    recentStudyTime,
    studyTimesOnOff,
    studyTimes,
    userFlagOnOff,
    userFlag,

    changeMode,
    // (mode, value) => setState
    changeSortOption,
    changeNeedStudyTimeRange,
    changeNeedStudyTimeCondition,
    changeUseCardType,
    changeUseStatus,
    changeNumStartCards,
    // 고급필터 setState
    changeAdvancedFilterOnOff,
    changeUserFlag,
    changeUserFlagOnOff,
    changeCardMaker,
    changeCardMakerOnOff,
    changeMakerFlag,
    changeMakerFlagOnOff,
    changeExamResult,
    changeExamResultOnOff,
    changeRecentDifficulty,
    changeRecentDifficultyOnOff,
    changeRecentStudyTime,
    changeRecentStudyTimeOnOff,
    changeLevel,
    changeLevelOnOff,
    changeStudyTimes,
    changeStudyTimesOnOff,
    onChangeAFButtonClick,
    // useMutation에서 받은 데이터 업데이트
    updateData,
  } = useSessionConfig();

  const { data, loading, error } = useQuery(GET_SESSTION_CONFIG, {
    variables: {
      mybook_ids: book_ids,
    },
    onCompleted: (received_data) => {
      if (received_data.session_getSessionConfig.status === "200") {
        console.log({ received_data });
        updateData(received_data);
      } else if (received_data.session_getSessionConfig.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const advancedFilter = {
    onOff: advancedFilterOnOff,
    cardMaker: {
      onOff: cardMakerOnOff,
      value: cardMaker,
    },
    examResult: {
      onOff: examResultOnOff,
      value: examResult,
    },
    level: {
      onOff: levelOnOff,
      value: level,
    },
    makerFlag: {
      onOff: makerFlagOnOff,
      value: makerFlag,
    },
    userFlag: {
      onOff: userFlagOnOff,
      value: userFlag,
    },
    recentDifficulty: {
      onOff: recentDifficultyOnOff,
      value: recentDifficulty,
    },
    recentStudyTime: {
      onOff: recentStudyTimeOnOff,
      value: recentStudyTime,
    },
    studyTimes: {
      onOff: studyTimesOnOff,
      value: studyTimes,
    },
  };

  const onSubmit = () => {
    const readDetailedOption = {
      sortOption: readSortOption,
      useCardtype: readUseCardType,
      useStatus: readUseStatus,
      needStudyTimeCondition: readNeedStudyTimeCondition,
      needStudyTimeRange: readNeedStudyTimeRange,
      numStartCards: readNumStartCards,
    };
    const flipDetailedOption = {
      sortOption: flipSortOption,
      useCardtype: flipUseCardType,
      useStatus: flipUseStatus,
      needStudyTimeCondition: flipNeedStudyTimeCondition,
      needStudyTimeRange: flipNeedStudyTimeRange,
      numStartCards: flipNumStartCards,
    };
    const examDetailedOption = {
      sortOption: examSortOption,
      useCardtype: examUseCardType,
      useStatus: examUseStatus,
      needStudyTimeCondition: examNeedStudyTimeCondition,
      needStudyTimeRange: examNeedStudyTimeRange,
      numStartCards: examNumStartCards,
    };

    const sessionConfig =
      mode === "read"
        ? { studyMode: "read", detailedOption: readDetailedOption, advancedFilter }
        : mode === "flip"
        ? { studyMode: "flip", detailedOption: flipDetailedOption, advancedFilter }
        : mode === "exam"
        ? { studyMode: "exam", detailedOption: examDetailedOption, advancedFilter }
        : new Error("Unhandled studyConfig Mode");
    submitCreateSessionConfigToServer(sessionConfig);
  };

  const content = (
    <StyledDivConfigWrapper>
      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">보기 순서</span>
        </div>
        <div>
          <SortOptionTag mode={mode} changeSortOption={changeSortOption} selected={[readSortOption, flipSortOption, examSortOption]} />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">카드종류</span>
        </div>
        <div>
          <UseCardTypesTag mode={mode} changeUseCardType={changeUseCardType} selected={[readUseCardType, flipUseCardType, examUseCardType]} />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">카드상태</span>
        </div>
        <div>
          <div>
            <UseStatusTag mode={mode} changeUseStatus={changeUseStatus} selected={[readUseStatus, flipUseStatus, examUseStatus]} />
          </div>
          {(mode === "read" ? readUseStatus.includes("ing") : mode === "flip" ? flipUseStatus.includes("ing") : mode === "exam" ? examUseStatus.includes("ing") : null) && (
            <StyledDivToggleStudying>
              <StudyTimeCondition
                mode={mode}
                selected={[readNeedStudyTimeCondition, flipNeedStudyTimeCondition, examNeedStudyTimeCondition]}
                changeNeedStudyTimeCondition={changeNeedStudyTimeCondition}
                changeNeedStudyTimeRange={changeNeedStudyTimeRange}
                selectedRange={[readNeedStudyTimeRange, flipNeedStudyTimeRange, examNeedStudyTimeRange]}
              />
            </StyledDivToggleStudying>
          )}
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <StyledDivConfigColStartCards>
          <StyledSpanConfigTitle
            onOff={mode === "read" ? readNumStartCards.onOff === "on" : mode === "flip" ? flipNumStartCards.onOff === "on" : mode === "exam" ? examNumStartCards.onOff === "on" : new Error("잘못된 모드")}
          >
            학습량
          </StyledSpanConfigTitle>
          <Switch
            className="TitleSwitchButton"
            size="small"
            checked={mode === "read" ? readNumStartCards.onOff === "on" : mode === "flip" ? flipNumStartCards.onOff === "on" : mode === "exam" ? examNumStartCards.onOff === "on" : new Error("잘못된 모드")}
            onChange={(checked) => {
              const selectedNumCard = mode === "read" ? readNumStartCards : mode === "flip" ? flipNumStartCards : mode === "exam" ? examNumStartCards : new Error("잘못된 모드");
              if (checked) {
                const copyNumStartCards = { ...selectedNumCard, onOff: "on" };
                changeNumStartCards(mode, copyNumStartCards);
              } else {
                const copyNumStartCards = { ...selectedNumCard, onOff: "off" };
                changeNumStartCards(mode, copyNumStartCards);
              }
            }}
          />
        </StyledDivConfigColStartCards>
        <div>
          <NumStartCards mode={mode} selected={[readNumStartCards, flipNumStartCards, examNumStartCards]} changeNumStartCards={changeNumStartCards} />
        </div>
      </StyledDivConfigRow>

      <StyledDivTitleRow>
        <StyledDivConfigColStartCards>
          <StyledSpanConfigTitle onOff={advancedFilterOnOff === "on"}>고급필터</StyledSpanConfigTitle>
          <Switch
            className="TitleSwitchButton"
            size="small"
            checked={advancedFilterOnOff === "on" ? true : advancedFilterOnOff === "off" ? false : new Error("고급필터 스위치 에러")}
            onChange={(checked) => {
              if (checked) {
                changeAdvancedFilterOnOff("on");
                if (counterForButtonClick > 0) {
                  onToggleIsAFilter(true);
                }
              } else {
                changeAdvancedFilterOnOff("off");
                onToggleIsAFilter(false);
              }
            }}
          />
        </StyledDivConfigColStartCards>
        {advancedFilterOnOff === "on" && (
          <div>
            <GetFilteredIndexButton
              book_ids={book_ids}
              advancedFilter={advancedFilter}
              onChangeAFCardList={onChangeAFCardList}
              AFCardList={AFCardList}
              onToggleIsAFilter={onToggleIsAFilter}
              advancedFilteredCheckedIndexes={advancedFilteredCheckedIndexes}
              onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
              onChangeAFButtonClick={onChangeAFButtonClick}
            />
          </div>
        )}
      </StyledDivTitleRow>
      {advancedFilterOnOff === "on" && (
        <>
          <FilterSubMenu title="사용자 플래그" changeOnOff={changeUserFlagOnOff} onOff={userFlagOnOff}>
            <FlagTags menu="flags" array={userFlag} onOff={userFlagOnOff === "on"} setState={changeUserFlag} />
          </FilterSubMenu>
          <FilterSubMenu title="제작자 플래그" changeOnOff={changeMakerFlagOnOff} onOff={makerFlagOnOff}>
            <FlagTags menu="flags" array={makerFlag} onOff={makerFlagOnOff === "on"} setState={changeMakerFlag} />
          </FilterSubMenu>
          <FilterSubMenu title="최근 학습 시점" changeOnOff={changeRecentStudyTimeOnOff} onOff={recentStudyTimeOnOff}>
            <RecentStudyTime onOff={recentStudyTimeOnOff} recentStudyTime={recentStudyTime} changeRecentStudyTime={changeRecentStudyTime} />
          </FilterSubMenu>
          <FilterSubMenu title="카드 레벨" changeOnOff={changeLevelOnOff} onOff={levelOnOff}>
            <CardLevel onOff={levelOnOff} level={level} changeLevel={changeLevel} />
          </FilterSubMenu>
          <FilterSubMenu title="학습 횟수" changeOnOff={changeStudyTimesOnOff} onOff={studyTimesOnOff}>
            <StudyTimes onOff={studyTimesOnOff} studyTimes={studyTimes} changeStudyTimes={changeStudyTimes} />
          </FilterSubMenu>

          <FilterSubMenu title="최근 선택 난이도" changeOnOff={changeRecentDifficultyOnOff} onOff={recentDifficultyOnOff}>
            <FlagTags menu="recentDifficulty" array={recentDifficulty} onOff={recentDifficultyOnOff === "on"} setState={changeRecentDifficulty} />
          </FilterSubMenu>
          <FilterSubMenu title="최근 시험 결과" changeOnOff={changeExamResultOnOff} onOff={examResultOnOff}>
            <FlagTags menu="examResult" array={examResult} onOff={examResultOnOff === "on"} setState={changeExamResult} />
          </FilterSubMenu>
        </>
      )}
    </StyledDivConfigWrapper>
  );
  if (!error && !loading) {
    return (
      <div>
        {/* <Row>
          <Col xs={0} sm={0} md={0} lg={18} xl={18} xxl={18}>
            <Typography.Title level={4}>세션 설정</Typography.Title>
          </Col>
          <Col sxs={0} sm={0} md={0} lg={6} xl={6} xxl={6}>
            <Button
              block
              style={{
                background: "green",
                color: "white",
                fontWeight: "700",
              }}
              onClick={onSubmit}
            >
              시작
            </Button>
          </Col>
        </Row> */}

        <Tabs activeKey={mode} type="card" size="small" onTabClick={(key) => changeMode(key)} tabBarStyle={{ margin: 0 }}>
          <Tabs.TabPane tab="읽기모드" key="read">
            {content}
          </Tabs.TabPane>
          <Tabs.TabPane tab="뒤집기모드" key="flip">
            {content}
          </Tabs.TabPane>
          <Tabs.TabPane tab="시험모드" key="exam">
            {content}
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
  return <></>;
};

export default memo(SessionConfig);

const StyledDivConfigWrapper = styled.div`
  border: 1px solid #f0f0f0;
  border-top: none;
  padding: 5px;
  background-color: white;
  display: flex;
  flex-direction: column;

  & > div:last-child {
    margin-bottom: 0px;
  }
  & .ant-tag {
    margin: 3px 3px 0 3px;
    line-height: 16px;
  }
`;

const StyledDivTitleRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1) {
    flex: none;
    width: 115px;
  }
  & > div:nth-child(2) {
    flex: auto;
  }
`;

const StyledDivToggleStudying = styled.div`
  background-color: #e6f7ff;
  padding: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;
