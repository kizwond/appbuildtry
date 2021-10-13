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

const menuTitleColSize = 3;
const menuColSize = 21;
const menuColDivider = 6;

const breakPoint = {
  menuTitleCol: {
    xs: 24,
    sm: 4,
    md: 3,
    lg: 24,
    xl: 24,
    xxl: 24,
  },
  menuCol: {
    xs: 24,
    sm: 20,
    md: 21,
    lg: 24,
    xl: 24,
    xxl: 24,
  },
};

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

  const { data, loading, error } = useQuery(GET_SESSTION_CONFIG, {
    variables: {
      mybook_ids: book_ids,
    },
    onCompleted: (received_data) => {
      if (received_data.session_getSessionConfig.status === "200") {
        const sessionconfigs = received_data.session_getSessionConfig.sessionConfigs[0];
        console.log({ received_data });
        setMode(received_data.session_getSessionConfig.sessionConfigs[0].studyMode);
        setSessionConfig(received_data.session_getSessionConfig.sessionConfigs[0]);

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
        console.log("UseCardType Error");
        break;
    }
  }, []);

  const onChangeValue = useCallback(
    (...args) => {
      const length = args.length;
      if (length == 4) {
        const newData = produce(sessionConfig, (draft) => {
          draft[mode][args[1]][args[2]][args[3]] = args[0];
        });
        setSessionConfig(newData);
      } else if (length == 3) {
        const newData = produce(sessionConfig, (draft) => {
          draft[mode][args[1]][args[2]] = args[0];
        });
        setSessionConfig(newData);
      } else if (length == 2) {
        const newData = produce(sessionConfig, (draft) => {
          draft[mode][args[1]] = args[0];
        });
        setSessionConfig(newData);
      } else if (length == 1) {
        setSessionConfig(args[0]);
      }
    },
    [sessionConfig, mode]
  );

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
                <>
                  <div
                    style={{
                      background: "#e6f7ff",
                      paddingTop: "5px",
                      paddingBottom: "5px",
                      paddingLeft: "5px",
                      paddingRight: "5px",
                      borderTopRightRadius: "5px",
                      borderBottomLeftRadius: "5px",
                      borderBottomRightRadius: "5px",
                    }}
                  >
                    <StudyTimeCondition
                      mode={mode}
                      selected={[readNeedStudyTimeCondition, flipNeedStudyTimeCondition, examNeedStudyTimeCondition]}
                      changeNeedStudyTimeCondition={changeNeedStudyTimeCondition}
                      changeNeedStudyTimeRange={changeNeedStudyTimeRange}
                      selectedRange={[readNeedStudyTimeRange, flipNeedStudyTimeRange, examNeedStudyTimeRange]}
                    />
                  </div>
                </>
              )}
            </StyledDivConfigCol>
          </StyledDivConfigRow>

          <Row align="top" gutter={8}>
            <Col {...breakPoint.menuTitleCol}>
              <StyledSpanMenuTitle
                style={{
                  color: isOnNumStartCards ? "black" : "#0000003f",
                  marginRight: "10px",
                }}
              >
                학습량
              </StyledSpanMenuTitle>

              <Switch
                size="small"
                checked={isOnNumStartCards}
                onChange={(checked) => {
                  if (checked) {
                    onChangeValue("on", "numStartCards", "onOff");
                  } else {
                    onChangeValue("off", "numStartCards", "onOff");
                  }
                }}
              />
            </Col>
            <Col {...breakPoint.menuCol}>
              <Tag.CheckableTag checked size="small">
                <span style={{ marginRight: "4px" }}>미학습</span>
                <InputNumber
                  disabled={!isOnNumStartCards}
                  min={0}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.yet}
                  onChange={(value) => {
                    onChangeValue(value, "numStartCards", "yet");
                  }}
                />
              </Tag.CheckableTag>
              <Tag.CheckableTag checked>
                학습중
                <InputNumber
                  disabled={!isOnNumStartCards}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.ing}
                  onChange={(value) => {
                    onChangeValue(value, "numStartCards", "ing");
                  }}
                />
              </Tag.CheckableTag>

              <Tag.CheckableTag checked>
                학습완료
                <InputNumber
                  disabled={!isOnNumStartCards}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.completed}
                  onChange={(value) => {
                    onChangeValue(value, "numStartCards", "completed");
                  }}
                />
              </Tag.CheckableTag>
              <Tag.CheckableTag checked>
                학습보류
                <InputNumber
                  disabled={!isOnNumStartCards}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.hold}
                  onChange={(value) => {
                    onChangeValue(value, "numStartCards", "hold");
                  }}
                />
              </Tag.CheckableTag>
            </Col>
          </Row>
        </StyledDivConfigWrapper>
        <div
          style={{
            border: isOnAdvancedFilter ? "1px solid lightgrey" : "none",
            backgroundColor: isOnAdvancedFilter ? "#FFE4D3" : "#FFF",
            borderRadius: "5px",
            padding: "5px",
          }}
        >
          <Row align="top" gutter={8} style={{ marginBottom: "4px" }}>
            <Col span={menuTitleColSize}>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: isOnAdvancedFilter ? "700" : "400",
                  color: isOnAdvancedFilter ? "black" : "#0000003f",
                }}
              >
                고급필터
              </span>
            </Col>
            <Col span={3}>
              <Switch
                size="small"
                checked={isOnAdvancedFilter}
                onChange={(checked) => {
                  if (checked) {
                    onChangeValueAnother("on", sessionConfig, "advancedFilter", "onOff");
                    if (counterForButtonClick > 0) {
                      onToggleIsAFilter(true);
                    }
                  } else {
                    onChangeValueAnother("off", sessionConfig, "advancedFilter", "onOff");
                    onToggleIsAFilter(false);
                  }
                }}
              />
            </Col>
            {isOnAdvancedFilter && (
              <Col>
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
              </Col>
            )}
          </Row>
          {isOnAdvancedFilter && (
            <>
              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      사용자 플래그 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnUserFlag}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother("on", sessionConfig, "advancedFilter", "userFlag", "onOff");
                            } else {
                              onChangeValueAnother("off", sessionConfig, "advancedFilter", "userFlag", "onOff");
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnUserFlag ? (
                            <>
                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(0)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "userFlag", 0);
                                }}
                              >
                                플래그 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(1)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "userFlag", 1);
                                }}
                              >
                                플래그1
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(2)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "userFlag", 2);
                                }}
                              >
                                플래그2
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(3)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "userFlag", 3);
                                }}
                              >
                                플래그3
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(4)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "userFlag", 4);
                                }}
                              >
                                플래그4
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(5)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "userFlag", 5);
                                }}
                              >
                                플래그5
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={sessionConfig.advancedFilter.userFlag.value.includes(0) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그 없음
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.userFlag.value.includes(1) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그1
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.userFlag.value.includes(2) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그2
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.userFlag.value.includes(3) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그3
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.userFlag.value.includes(4) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그4
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.userFlag.value.includes(5) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그5
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      제작자 플래그 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnMakerFlag}
                          onChange={(checked) => {
                            if (checked) {
                              // const newData = produce(sessionConfig, (draft) => {
                              //   draft.advancedFilter.userFlag.onOff = 'on';
                              // });
                              // onChangeValue(newData);
                              onChangeValueAnother("on", sessionConfig, "advancedFilter", "makerFlag", "onOff");
                            } else {
                              onChangeValueAnother("off", sessionConfig, "advancedFilter", "makerFlag", "onOff");
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnMakerFlag ? (
                            <>
                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(0)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "makerFlag", 0);
                                }}
                              >
                                플래그 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(1)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "makerFlag", 1);
                                }}
                              >
                                플래그1
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(2)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "makerFlag", 2);
                                }}
                              >
                                플래그2
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(3)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "makerFlag", 3);
                                }}
                              >
                                플래그3
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(4)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "makerFlag", 4);
                                }}
                              >
                                플래그4
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(5)}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "makerFlag", 5);
                                }}
                              >
                                플래그5
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={sessionConfig.advancedFilter.makerFlag.value.includes(0) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그 없음
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.makerFlag.value.includes(1) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그1
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.makerFlag.value.includes(2) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그2
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.makerFlag.value.includes(3) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그3
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.makerFlag.value.includes(4) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그4
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.makerFlag.value.includes(5) ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                플래그5
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      최근 학습 시점 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnRecentStudyTime}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother("on", sessionConfig, "advancedFilter", "recentStudyTime", "onOff");
                            } else {
                              onChangeValueAnother("off", sessionConfig, "advancedFilter", "recentStudyTime", "onOff");
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          <StyledDatePicker
                            disabled={!isOnRecentStudyTime}
                            format="MM-DD"
                            placeholder={["시작", "종료"]}
                            value={
                              sessionConfig?.advancedFilter?.recentStudyTime?.value == null
                                ? null
                                : [
                                    sessionConfig?.advancedFilter?.recentStudyTime?.value[0] == 0 ? moment() : moment().add(sessionConfig?.advancedFilter?.recentStudyTime?.value[0], "days"),

                                    sessionConfig?.advancedFilter?.recentStudyTime?.value[1] == 0 ? moment() : moment().add(sessionConfig?.advancedFilter?.recentStudyTime?.value[1], "days"),
                                  ]
                            }
                            onChange={(date, dateString) => {
                              console.log(date);
                              if (date != null) {
                                const now = new Date();
                                const year = now.getFullYear();
                                const month = now.getMonth() + 1;
                                const day = now.getDate();
                                const today = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");
                                // console.log(today);
                                const startYear = date[0]._d.getFullYear();
                                const startDate = moment(`${startYear}-${dateString[0]}`, "YYYY-MM-DD");
                                const endYear = date[0]._d.getFullYear();
                                const endDate = moment(`${endYear}-${dateString[1]}`, "YYYY-MM-DD");
                                const dif_from_startDate = moment.duration(startDate.diff(today)).asDays();
                                const dif_from_endDate = moment.duration(endDate.diff(today)).asDays();

                                onChangeValueAnother([dif_from_startDate, dif_from_endDate], sessionConfig, "advancedFilter", "recentStudyTime", "value");
                              }
                              if (date == null) {
                                onChangeValueAnother(null, sessionConfig, "advancedFilter", "recentStudyTime", "value");
                              }
                            }}
                            size="small"
                          />
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      카드 레벨 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnLevelFilter}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother("on", sessionConfig, "advancedFilter", "level", "onOff");
                            } else {
                              onChangeValueAnother("off", sessionConfig, "advancedFilter", "level", "onOff");
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          <Space>
                            <InputNumber
                              disabled={!isOnLevelFilter}
                              size="small"
                              min={1}
                              max={sessionConfig.advancedFilter.level.value[1] == null ? null : sessionConfig.advancedFilter.level.value[1] - 1}
                              value={sessionConfig.advancedFilter.level.value[0]}
                              formatter={(value) => `${value} level`}
                              parser={(value) => value.replace(" level", "")}
                              onChange={(value) => {
                                const newRange = [value, sessionConfig.advancedFilter.level.value[1]];
                                onChangeValueAnother(newRange, sessionConfig, "advancedFilter", "level", "value");
                              }}
                            />
                            ~
                            <InputNumber
                              disabled={!isOnLevelFilter}
                              size="small"
                              min={sessionConfig.advancedFilter.level.value[0] == null ? null : sessionConfig.advancedFilter.level.value[0] + 1}
                              max={10}
                              value={sessionConfig.advancedFilter.level.value[1]}
                              formatter={(value) => `${value} level`}
                              parser={(value) => value.replace(" level", "")}
                              onChange={(value) => {
                                const newRange = [sessionConfig.advancedFilter.level.value[0], value];
                                onChangeValueAnother(newRange, sessionConfig, "advancedFilter", "level", "value");
                              }}
                            />
                          </Space>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      학습 횟수 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnStudyTimesFilter}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother("on", sessionConfig, "advancedFilter", "studyTimes", "onOff");
                            } else {
                              onChangeValueAnother("off", sessionConfig, "advancedFilter", "studyTimes", "onOff");
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          <Space>
                            <InputNumber
                              disabled={!isOnStudyTimesFilter}
                              size="small"
                              min={0}
                              max={sessionConfig.advancedFilter.studyTimes.value[1] == null ? 99 : sessionConfig.advancedFilter.studyTimes.value[1] - 1}
                              value={sessionConfig.advancedFilter.studyTimes.value[0]}
                              formatter={(value) => `${value} 회`}
                              parser={(value) => value.replace(" 회", "")}
                              onChange={(value) => {
                                const newRange = [value, sessionConfig.advancedFilter.studyTimes.value[1]];
                                onChangeValueAnother(newRange, sessionConfig, "advancedFilter", "studyTimes", "value");
                              }}
                            />
                            ~
                            <InputNumber
                              disabled={!isOnStudyTimesFilter}
                              size="small"
                              min={sessionConfig.advancedFilter.studyTimes.value[1] == null ? 2 : sessionConfig.advancedFilter.studyTimes.value[0] + 1}
                              max={100}
                              value={sessionConfig.advancedFilter.studyTimes.value[1]}
                              formatter={(value) => `${value} 회`}
                              parser={(value) => value.replace(" 회", "")}
                              onChange={(value) => {
                                const newRange = [sessionConfig.advancedFilter.studyTimes.value[0], value];
                                onChangeValueAnother(newRange, sessionConfig, "advancedFilter", "studyTimes", "value");
                              }}
                            />
                          </Space>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      최근 선택한 난이도 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnRecentDifficultyFilter}
                          onChange={(checked) => {
                            if (checked) {
                              // const newData = produce(sessionConfig, (draft) => {
                              //   draft.advancedFilter.userFlag.onOff = 'on';
                              // });
                              // onChangeValue(newData);
                              onChangeValueAnother("on", sessionConfig, "advancedFilter", "recentDifficulty", "onOff");
                            } else {
                              onChangeValueAnother("off", sessionConfig, "advancedFilter", "recentDifficulty", "onOff");
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnRecentDifficultyFilter ? (
                            <>
                              <Tag.CheckableTag
                                color={isOnRecentDifficultyFilter ? "#f5f5f5" : "#1890ff"}
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes("none")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "recentDifficulty", "none");
                                }}
                              >
                                결과 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={isOnRecentDifficultyFilter ? "#f5f5f5" : "#1890ff"}
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi1")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "recentDifficulty", "diffi1");
                                }}
                              >
                                모름
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={isOnRecentDifficultyFilter ? "#f5f5f5" : "#1890ff"}
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi2")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "recentDifficulty", "diffi2");
                                }}
                              >
                                어려움
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={isOnRecentDifficultyFilter ? "#f5f5f5" : "#1890ff"}
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi3")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "recentDifficulty", "diffi3");
                                }}
                              >
                                애매함
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={!isOnRecentDifficultyFilter ? "#f5f5f5" : "#1890ff"}
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi4")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "recentDifficulty", "diffi4");
                                }}
                              >
                                쉬움
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={isOnRecentDifficultyFilter ? "#f5f5f5" : "#1890ff"}
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi5")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "recentDifficulty", "diffi5");
                                }}
                              >
                                알고있음
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={sessionConfig.advancedFilter.recentDifficulty.value.includes("none") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                결과 없음
                              </Tag>
                              <Tag
                                color={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi1") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                모름
                              </Tag>
                              <Tag
                                color={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi2") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                어려움
                              </Tag>
                              <Tag
                                color={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi3") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                애매함
                              </Tag>
                              <Tag
                                color={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi4") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                쉬움
                              </Tag>
                              <Tag
                                color={sessionConfig.advancedFilter.recentDifficulty.value.includes("diffi5") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                알고있음
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: "600",
                      }}
                    >
                      최근 시험 결과 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnExamResultFilter}
                          onChange={(checked) => {
                            if (checked) {
                              // const newData = produce(sessionConfig, (draft) => {
                              //   draft.advancedFilter.userFlag.onOff = 'on';
                              // });
                              // onChangeValue(newData);
                              onChangeValueAnother("on", sessionConfig, "advancedFilter", "examResult", "onOff");
                            } else {
                              onChangeValueAnother("off", sessionConfig, "advancedFilter", "examResult", "onOff");
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnExamResultFilter ? (
                            <>
                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.examResult.value.includes("none")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "examResult", "none");
                                }}
                              >
                                결과 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.examResult.value.includes("right")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "examResult", "right");
                                }}
                              >
                                맞춘카드
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.examResult.value.includes("wrong")}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(checked, "examResult", "wrong");
                                }}
                              >
                                틀린카드
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={sessionConfig.advancedFilter.examResult.value.includes("none") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                결과 없음
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.examResult.value.includes("right") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                맞춘카드
                              </Tag>

                              <Tag
                                color={sessionConfig.advancedFilter.examResult.value.includes("wrong") ? "#f5f5f5" : "#FFF"}
                                style={{
                                  color: "rgba(0, 0, 0, 0.447)",
                                  border: "1px solid #d9d9d9",
                                }}
                              >
                                틀린카드
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </div>
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
  & > div {
    margin-bottom: 5px;
  }
  & > div:last-child {
    margin-bottom: 0px;
  }
  & .ant-tag {
    margin-right: 4px;
    margin-left: 4px;
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;
const StyledDivConfigRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1) {
    flex: 0 160px;
  }
  & > div {
    width: 100%;
  }

  @media screen and (min-width: 992px) {
    flex-direction: column;
    & > div:nth-child(1) {
      flex: auto;
    }
  }
  @media screen and (max-width: 575px) {
    flex-direction: column;
    & > div:nth-child(1) {
      flex: auto;
    }
  }
`;
const StyledDivConfigCol = styled.div`
  display: flex;
  flex-direction: column;
  & .ConifgTitle {
    font-size: 0.8rem;
    font-weight: 700;
  }
`;

const StyledSpanMenuTitle = styled.span`
  font-size: 0.8rem !important;
  font-weight: 700;
`;
