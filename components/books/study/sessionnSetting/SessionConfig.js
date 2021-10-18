import React, { useState, useCallback } from "react";
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

const SessionConfig = ({ submitCreateSessionConfigToServer, book_ids, onToggleIsAFilter, onChangeAFCardList, AFCardList, advancedFilteredCheckedIndexes, onChangeIndexesOfAFCardList }) => {
  const [counterForButtonClick, setCounterForButtonClick] = useState(0);

  const [mode, setMode] = useState("exam");

  // flip 모드설정
  const [flipNeedStudyTimeCondition, setFlipNeedStudyTimeCondition] = useState("");
  const [flipNeedStudyTimeRange, setFlipNeedStudyTimeRange] = useState([]);
  const [flipNumStartCards, setFlipNumStartCards] = useState([]);
  const [flipSortOption, setFlipSortOption] = useState("");
  const [flipUseCardType, setFlipUseCardType] = useState([]);
  const [flipUseStatus, setFlipUseStatus] = useState([]);
  // read 모드설정
  const [readNeedStudyTimeCondition, setReadNeedStudyTimeCondition] = useState("");
  const [readNeedStudyTimeRange, setReadNeedStudyTimeRange] = useState([]);
  const [readNumStartCards, setReadNumStartCards] = useState([]);
  const [readSortOption, setReadSortOption] = useState("");
  const [readUseCardType, setReadUseCardType] = useState([]);
  const [readUseStatus, setReadUseStatus] = useState([]);
  // exam 모드설정
  const [examNeedStudyTimeCondition, setExamNeedStudyTimeCondition] = useState("");
  const [examNeedStudyTimeRange, setExamNeedStudyTimeRange] = useState([]);
  const [examNumStartCards, setExamNumStartCards] = useState([]);
  const [examSortOption, setExamSortOption] = useState("");
  const [examUseCardType, setExamUseCardType] = useState([]);
  const [examUseStatus, setExamUseStatus] = useState([]);
  // 고급필터
  const [advancedFilterOnOff, setAdvancedFilterOnOff] = useState("");
  const [cardMakerOnOff, setCardMakerOnOff] = useState("");
  const [cardMaker, setCardMaker] = useState([]);
  const [examResultOnOff, setExamResultOnOff] = useState("");
  const [examResult, setExamResult] = useState([]);
  const [levelOnOff, setLevelOnOff] = useState("");
  const [level, setLevel] = useState([]);
  const [makerFlagOnOff, setMakerFlagOnOff] = useState("");
  const [makerFlag, setMakerFlag] = useState([]);
  const [recentDifficultyOnOff, setRecentDifficultyOnOff] = useState("");
  const [recentDifficulty, setRecentDifficulty] = useState([]);
  const [recentStudyTimeOnOff, setRecentStudyTimeOnOff] = useState("");
  const [recentStudyTime, setRecentStudyTime] = useState([]);
  const [studyTimesOnOff, setStudyTimesOnOff] = useState("");
  const [studyTimes, setStudyTimes] = useState([]);
  const [userFlagOnOff, setUserFlagOnOff] = useState("");
  const [userFlag, setUserFlag] = useState([]);

  const { data, loading, error } = useQuery(GET_SESSTION_CONFIG, {
    variables: {
      mybook_ids: book_ids,
    },
    onCompleted: (received_data) => {
      if (received_data.session_getSessionConfig.status === "200") {
        const sessionconfigs = received_data.session_getSessionConfig.sessionConfigs[0];
        const {
          cardMaker, //
          examResult,
          level,
          onOff,
          recentDifficulty,
          recentStudyTime,
          studyTimes,
          userFlag,
          makerFlag,
        } = sessionconfigs.advancedFilter;
        console.log({ received_data });
        setMode(received_data.session_getSessionConfig.sessionConfigs[0].studyMode);
        //고급필터
        setAdvancedFilterOnOff(onOff);
        setCardMakerOnOff(cardMaker.onOff);
        setCardMaker(cardMaker.value);
        setExamResultOnOff(examResult.onOff);
        setExamResult(examResult.value);
        setLevelOnOff(level.onOff);
        setLevel(level.value);
        setMakerFlagOnOff(makerFlag.onOff);
        setMakerFlag(makerFlag.value);
        setRecentDifficultyOnOff(recentDifficulty.onOff);
        setRecentDifficulty(recentDifficulty.value);
        setRecentStudyTimeOnOff(recentStudyTime.onOff);
        setRecentStudyTime(recentStudyTime.value);
        setStudyTimesOnOff(studyTimes.onOff);
        setStudyTimes(studyTimes.value);
        setUserFlagOnOff(userFlag.onOff);
        setUserFlag(userFlag.value);

        // 아래부터 state 쪼개기 작업
        if (sessionconfigs.flip) {
          const { needStudyTimeCondition, needStudyTimeRange, numStartCards, sortOption, useCardtype, useStatus } = sessionconfigs.flip;
          const copyNumStartCards = { ...numStartCards };
          delete copyNumStartCards.__typename;
          setFlipNeedStudyTimeCondition(needStudyTimeCondition);
          setFlipNeedStudyTimeRange(needStudyTimeRange);
          setFlipNumStartCards(copyNumStartCards);
          setFlipSortOption(sortOption);
          setFlipUseCardType(useCardtype);
          setFlipUseStatus(useStatus);
        }
        if (sessionconfigs.read) {
          const { needStudyTimeCondition, needStudyTimeRange, numStartCards, sortOption, useCardtype, useStatus } = sessionconfigs.read;
          const copyNumStartCards = { ...numStartCards };
          delete copyNumStartCards.__typename;
          setReadNeedStudyTimeCondition(needStudyTimeCondition);
          setReadNeedStudyTimeRange(needStudyTimeRange);
          setReadNumStartCards(copyNumStartCards);
          setReadSortOption(sortOption);
          setReadUseCardType(useCardtype);
          setReadUseStatus(useStatus);
        }
        if (sessionconfigs.exam) {
          const { needStudyTimeCondition, needStudyTimeRange, numStartCards, sortOption, useCardtype, useStatus } = sessionconfigs.exam;
          const copyNumStartCards = { ...numStartCards };
          delete copyNumStartCards.__typename;
          setExamNeedStudyTimeCondition(needStudyTimeCondition);
          setExamNeedStudyTimeRange(needStudyTimeRange);
          setExamNumStartCards(copyNumStartCards);
          setExamSortOption(sortOption);
          setExamUseCardType(useCardtype);
          setExamUseStatus(useStatus);
        }
      } else if (received_data.session_getSessionConfig.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const changeNeedStudyTimeCondition = useCallback((mode, condition) => {
    switch (mode) {
      case "read":
        setReadNeedStudyTimeCondition(condition);
        break;
      case "flip":
        setFlipNeedStudyTimeCondition(condition);
        break;
      case "exam":
        setExamNeedStudyTimeCondition(condition);
        break;
      default:
        console.log("NeedStudyCondition Error");
        break;
    }
  }, []);
  const changeNeedStudyTimeRange = useCallback((mode, range) => {
    switch (mode) {
      case "read":
        setReadNeedStudyTimeRange(range);
        break;
      case "flip":
        setFlipNeedStudyTimeRange(range);
        break;
      case "exam":
        setExamNeedStudyTimeRange(range);
        break;
      default:
        console.log("NeedStudyTimeRange Error");
        break;
    }
  }, []);
  const changeSortOption = useCallback((mode, sortOption) => {
    switch (mode) {
      case "read":
        setReadSortOption(sortOption);
        break;
      case "flip":
        setFlipSortOption(sortOption);
        break;
      case "exam":
        setExamSortOption(sortOption);
        break;
      default:
        console.log("SortOption Error");
        break;
    }
  }, []);
  const changeUseCardType = useCallback((mode, useCardType) => {
    switch (mode) {
      case "read":
        setReadUseCardType(useCardType);
        break;
      case "flip":
        setFlipUseCardType(useCardType);
        break;
      case "exam":
        setExamUseCardType(useCardType);
        break;
      default:
        console.log("UseCardType Error");
        break;
    }
  }, []);
  const changeUseStatus = useCallback((mode, useStatus) => {
    switch (mode) {
      case "read":
        setReadUseStatus(useStatus);
        break;
      case "flip":
        setFlipUseStatus(useStatus);
        break;
      case "exam":
        setExamUseStatus(useStatus);
        break;
      default:
        console.log("UseStatus Error");
        break;
    }
  }, []);
  const changeNumStartCards = useCallback((mode, NumStartCards) => {
    switch (mode) {
      case "read":
        setReadNumStartCards(NumStartCards);
        break;
      case "flip":
        setFlipNumStartCards(NumStartCards);
        break;
      case "exam":
        setExamNumStartCards(NumStartCards);
        break;
      default:
        console.log("NumStartCards Error");
        break;
    }
  }, []);

  const changeUserFlag = useCallback((_userFlag) => {
    setUserFlag(_userFlag);
  }, []);
  const changeUserFlagOnOff = useCallback((_onOff) => {
    setUserFlagOnOff(_onOff);
  }, []);
  const changeMakerFlag = useCallback((_makerFlag) => {
    setMakerFlag(_makerFlag);
  }, []);
  const changeMakerFlagOnOff = useCallback((_onOff) => {
    setMakerFlagOnOff(_onOff);
  }, []);
  const changeExamResult = useCallback((_examResult) => {
    setExamResult(_examResult);
  }, []);
  const changeExamResultOnOff = useCallback((_onOff) => {
    setExamResultOnOff(_onOff);
  }, []);
  const changeRecentDifficulty = useCallback((_recentDifficulty) => {
    setRecentDifficulty(_recentDifficulty);
  }, []);
  const changeRecentDifficultyOnOff = useCallback((_onOff) => {
    setRecentDifficultyOnOff(_onOff);
  }, []);
  const changeRecentStudyTime = useCallback((_recentStudyTime) => {
    setRecentStudyTime(_recentStudyTime);
  }, []);
  const changeRecentStudyTimeOnOff = useCallback((_onOff) => {
    setRecentStudyTimeOnOff(_onOff);
  }, []);
  const changeLevel = useCallback((_level) => {
    setLevel(_level);
  }, []);
  const changeLevelOnOff = useCallback((_onOff) => {
    setLevelOnOff(_onOff);
  }, []);
  const changeStudyTimes = useCallback((_studyTimes) => {
    setStudyTimes(_studyTimes);
  }, []);
  const changeStudyTimesOnOff = useCallback((_onOff) => {
    setStudyTimesOnOff(_onOff);
  }, []);

  const onChangeAFButtonClick = () => {
    setCounterForButtonClick((prev) => prev + 1);
  };

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

  if (!error && !loading) {
    return (
      <Card size="small" bordered={false}>
        <Row>
          <Col span={12}>
            <Typography.Title level={4}>세션 설정</Typography.Title>
          </Col>
          <Col span={12}>
            <Button
              block
              style={{
                background: "green",
                minWidth: "100px",
                color: "white",
                fontSize: "13px",
                fontWeight: "700",
              }}
              onClick={onSubmit}
            >
              세션 시작
            </Button>
          </Col>
        </Row>
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "1rem",
          }}
        >
          <Button type={mode === "read" ? "primary" : "default"} onClick={() => setMode("read")}>
            읽기모드
          </Button>
          <Button type={mode === "flip" ? "primary" : "default"} onClick={() => setMode("flip")}>
            뒤집기모드
          </Button>
          <Button type={mode === "exam" ? "primary" : "default"} onClick={() => setMode("exam")}>
            시험모드
          </Button>
        </div>

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
                    setAdvancedFilterOnOff("on");
                    if (counterForButtonClick > 0) {
                      onToggleIsAFilter(true);
                    }
                  } else {
                    setAdvancedFilterOnOff("off");
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
      </Card>
    );
  }
  return <></>;
};

export default SessionConfig;

const StyledDivConfigWrapper = styled.div`
  border: 1px solid lightgray;
  padding: 5px;
  margin-top: 10px;
  background-color: white;
  border-radius: 5px;
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
