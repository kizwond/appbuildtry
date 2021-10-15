import React, { useState, useCallback } from "react";
import { useQuery } from "@apollo/client";
import { Switch, InputNumber, Card, Col, Row, Button, Typography } from "antd";
import { GET_SESSTION_CONFIG } from "../../../../graphql/query/studySessionSetting";
import ColFormItem from "./ColFormItem";
import produce from "immer";
import SwichComponent from "./SwichComponent";
import { Input, Space, Tag } from "../../../../node_modules/antd/lib/index";
import moment from "../../../../node_modules/moment/moment";
import GetFilteredIndexButton from "./GetFilteredIndexButton";
import styled from "styled-components";
import { onChangeArrayValuesForSwitch } from "./functionTool";
import SortOptionTag from "./session-config/SortOptionTag";
import UseCardTypesTag from "./session-config/UseCardTypesTag";
import UseStatusTag from "./session-config/UseStatusTag";
import StudyTimeCondition from "./session-config/StudyTimeCondition";
import StyledDatePicker from "./session-config/StyledDatePicker";
import NumStartCards from "./session-config/NumStartCards";
import FlagTags from "./session-config/FlagTags";
import SubTitleSwitch from "./session-config/common/SubTitleSwitch";
import FilterSubMenu from "./session-config/common/FilterSubMenu";

const SessionConfig = ({ submitCreateSessionConfigToServer, book_ids, onToggleIsAFilter, onChangeAFCardList, AFCardList, advancedFilteredCheckedIndexes, onChangeIndexesOfAFCardList }) => {
  const [counterForButtonClick, setCounterForButtonClick] = useState(0);

  const [mode, setMode] = useState("exam");
  const [sessionConfig, setSessionConfig] = useState({});

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
        setSessionConfig(received_data.session_getSessionConfig.sessionConfigs[0]);
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

  const onChangeValueAnother = (...args) => {
    const length = args.length;
    if (length == 5) {
      const newData = produce(args[1], (draft) => {
        draft[args[2]][args[3]][args[4]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 4) {
      const newData = produce(args[1], (draft) => {
        draft[args[2]][args[3]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 3) {
      const newData = produce(args[1], (draft) => {
        draft[args[2]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 2) {
      setSessionConfig(args[0]);
    } else if (length == 1) {
      setSessionConfig(args[0]);
    }
  };

  const onChangeArrayValueForAdvancedFilter = (checked, name, value) => {
    if (checked) {
      const newData = produce(sessionConfig, (draft) => {
        draft.advancedFilter[name].value.push(value);
      });
      console.log(`현재 ${value} 스위치 ${!checked} 상태에서 다음 데이터로 변경`, newData.advancedFilter[name].value);
      setSessionConfig(newData);
    } else if (!checked) {
      const newData = produce(sessionConfig, (draft) => {
        draft.advancedFilter[name].value = draft.advancedFilter[name].value.filter((item) => item != value);
      });
      console.log(`현재 ${value} 스위치 ${!checked} 상태에서 다음 데이터로 변경`, newData.advancedFilter[name].value);
      setSessionConfig(newData);
    }
  };

  const onChangeAFButtonClick = () => {
    setCounterForButtonClick((prev) => prev + 1);
  };
  const isOnNumStartCards = sessionConfig[mode]?.numStartCards?.onOff == "on";
  const isOnAdvancedFilter = sessionConfig?.advancedFilter?.onOff == "on";
  const isOnUserFlag = sessionConfig?.advancedFilter?.userFlag.onOff == "on";
  const isOnMakerFlag = sessionConfig?.advancedFilter?.makerFlag.onOff == "on";
  const isOnRecentStudyTime = sessionConfig?.advancedFilter?.recentStudyTime.onOff == "on";
  const isOnLevelFilter = sessionConfig?.advancedFilter?.level.onOff == "on";
  const isOnStudyTimesFilter = sessionConfig?.advancedFilter?.studyTimes.onOff == "on";
  const isOnRecentDifficultyFilter = sessionConfig?.advancedFilter?.recentDifficulty.onOff == "on";
  const isOnExamResultFilter = sessionConfig?.advancedFilter?.examResult.onOff == "on";
  const selectedStudyStatus = sessionConfig[mode]?.useStatus;
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
              onClick={() => submitCreateSessionConfigToServer(sessionConfig, mode)}
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
            <StyledDivConfigCol>
              <span className="ConifgTitle">보기 순서</span>
            </StyledDivConfigCol>
            <StyledDivConfigCol>
              <SortOptionTag mode={mode} changeSortOption={changeSortOption} selected={[readSortOption, flipSortOption, examSortOption]} />
            </StyledDivConfigCol>
          </StyledDivConfigRow>

          <StyledDivConfigRow>
            <StyledDivConfigCol>
              <span className="ConifgTitle">카드종류</span>
            </StyledDivConfigCol>
            <StyledDivConfigCol>
              <UseCardTypesTag mode={mode} changeUseCardType={changeUseCardType} selected={[readUseCardType, flipUseCardType, examUseCardType]} />
            </StyledDivConfigCol>
          </StyledDivConfigRow>

          <StyledDivConfigRow>
            <StyledDivConfigCol>
              <span className="ConifgTitle">카드상태</span>
            </StyledDivConfigCol>
            <StyledDivConfigCol>
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
            </StyledDivConfigCol>
          </StyledDivConfigRow>

          <StyledDivConfigRow>
            <StyledDivConfigColStartCards
              onOff={mode === "read" ? readNumStartCards.onOff === "on" : mode === "flip" ? flipNumStartCards.onOff === "on" : mode === "exam" ? examNumStartCards.onOff === "on" : new Error("잘못된 모드")}
            >
              <span className="ConifgTitle">학습량</span>
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
            <StyledDivConfigCol>
              <NumStartCards mode={mode} selected={[readNumStartCards, flipNumStartCards, examNumStartCards]} changeNumStartCards={changeNumStartCards} />
            </StyledDivConfigCol>
          </StyledDivConfigRow>
          {/* <div
          style={{
            border: isOnAdvancedFilter ? "1px solid lightgrey" : "none",
            backgroundColor: isOnAdvancedFilter ? "#FFE4D3" : "#FFF",
            borderRadius: "5px",
            padding: "5px",
          }}
        > */}
          <StyledDivTitleRow>
            <StyledDivConfigColStartCards onOff={advancedFilterOnOff === "on"}>
              <span className="ConifgTitle">고급필터</span>
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
              <StyledDivConfigCol>
                <GetFilteredIndexButton
                  book_ids={book_ids}
                  advancedFilter={sessionConfig.advancedFilter}
                  onChangeAFCardList={onChangeAFCardList}
                  AFCardList={AFCardList}
                  onToggleIsAFilter={onToggleIsAFilter}
                  advancedFilteredCheckedIndexes={advancedFilteredCheckedIndexes}
                  onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
                  onChangeAFButtonClick={onChangeAFButtonClick}
                />
              </StyledDivConfigCol>
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
                <StyledDatePicker
                  disabled={recentStudyTimeOnOff === "off"}
                  placeholder={["시작", "종료"]}
                  format="MM-DD"
                  value={[recentStudyTime[0] == 0 ? moment() : moment().add(recentStudyTime[0], "days"), recentStudyTime[1] == 0 ? moment() : moment().add(recentStudyTime[1], "days")]}
                  onChange={(date, dateString) => {
                    const now = new Date();
                    const year = now.getFullYear();
                    const month = now.getMonth() + 1;
                    const day = now.getDate();
                    const today = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

                    const startYear = date[0]._d.getFullYear();
                    const selectedStartDate = moment(`${startYear}-${dateString[0]}`, "YYYY-MM-DD");
                    const differenceFromStart = moment.duration(selectedStartDate.diff(today)).asDays();
                    console.log({ differenceFromStart });
                    const endYear = date[1]._d.getFullYear();
                    const selectedEndDate = moment(`${endYear}-${dateString[1]}`, "YYYY-MM-DD");
                    const differenceFromEnd = moment.duration(selectedEndDate.diff(today)).asDays();
                    console.log({ differenceFromEnd });

                    changeRecentStudyTime([differenceFromStart, differenceFromEnd]);
                  }}
                  size="small"
                />
              </FilterSubMenu>
              <FilterSubMenu title="카드 레벨" changeOnOff={changeLevelOnOff} onOff={levelOnOff}>
                <Space>
                  <InputNumber
                    disabled={levelOnOff === "off"}
                    size="small"
                    min={1}
                    max={level[1] == null ? null : level[1] - 1}
                    value={level[0]}
                    formatter={(value) => `${value} level`}
                    parser={(value) => value.replace(" level", "")}
                    onChange={(value) => {
                      const newRange = [value, level[1]];
                      changeLevel(newRange);
                    }}
                  />
                  ~
                  <InputNumber
                    disabled={levelOnOff === "off"}
                    size="small"
                    min={level[0] == null ? null : level[0] + 1}
                    max={10}
                    value={level[1]}
                    formatter={(value) => `${value} level`}
                    parser={(value) => value.replace(" level", "")}
                    onChange={(value) => {
                      const newRange = [level[0], value];
                      changeLevel(newRange);
                    }}
                  />
                </Space>
              </FilterSubMenu>
              <FilterSubMenu title="학습 횟수" changeOnOff={changeStudyTimesOnOff} onOff={studyTimesOnOff}>
                <Space>
                  <InputNumber
                    disabled={studyTimesOnOff === "off"}
                    size="small"
                    min={0}
                    max={studyTimes[1] == null ? 99 : studyTimes[1] - 1}
                    value={studyTimes[0]}
                    formatter={(value) => `${value} 회`}
                    parser={(value) => value.replace(" 회", "")}
                    onChange={(value) => {
                      const newRange = [value, studyTimes[1]];
                      changeStudyTimes(newRange);
                    }}
                  />
                  ~
                  <InputNumber
                    disabled={studyTimesOnOff === "off"}
                    size="small"
                    min={studyTimes[1] == null ? 2 : studyTimes[0] + 1}
                    max={100}
                    value={studyTimes[1]}
                    formatter={(value) => `${value} 회`}
                    parser={(value) => value.replace(" 회", "")}
                    onChange={(value) => {
                      const newRange = [studyTimes[0], value];
                      changeStudyTimes(newRange);
                    }}
                  />
                </Space>
              </FilterSubMenu>

              <FilterSubMenu title="최근 선택 난이도" changeOnOff={changeRecentDifficultyOnOff} onOff={recentDifficultyOnOff}>
                <FlagTags menu="recentDifficulty" array={recentDifficulty} onOff={recentDifficultyOnOff === "on"} setState={changeRecentDifficulty} />
              </FilterSubMenu>
              <FilterSubMenu title="최근 시험 결과" changeOnOff={changeExamResultOnOff} onOff={examResultOnOff}>
                <FlagTags menu="examResult" array={examResult} onOff={examResultOnOff === "on"} setState={changeExamResult} />
              </FilterSubMenu>
            </>
          )}
          {/* </div> */}
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
  /* & > div {
    margin-bottom: 5px;
  } */
  & > div:last-child {
    margin-bottom: 0px;
  }
  & .ant-tag {
    margin: 3px;
    line-height: 16px;
  }
`;
const StyledDivConfigRow = styled.div`
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
const StyledDivTitleRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1) {
    flex: none;
    width: 110px;
  }
  & > div:nth-child(2) {
    flex: auto;
  }
`;

const StyledDivConfigCol = styled.div`
  /* display: flex;
  flex-direction: column; */
  & .ConifgTitle {
    font-size: 0.9rem;
    font-weight: 700;
  }
`;

const StyledDivConfigColStartCards = styled(StyledDivConfigCol)`
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

const StyledDivToggleStudying = styled.div`
  background-color: #e6f7ff;
  padding: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;
