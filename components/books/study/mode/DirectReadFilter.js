import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Button, Drawer } from "antd";
import { DiffOutlined } from "@ant-design/icons";

import M_ModeSessionConfig from "../sessionConfig/sessionModeAndFilterConfig/modeConfig/M_ModeSessionConfig";
import M_AdvancedFilter from "../sessionConfig/sessionModeAndFilterConfig/advancedFilter/M_AdvancedFilter";
import { computeNumberOfAllFilteredCards } from "./logic/computeNumberOfReadCards";

const RightDrawer = ({ setBottomVisible }) => {
  const [visible, setVisible] = useState(false);

  // read 모드설정
  const [studyTimeCondition, setNeedStudyTimeCondition] = useState("all");
  const [studyTimeRange, setNeedStudyTimeRange] = useState([0, 1]);
  const [numStartCards, setNumStartCards] = useState({
    onOff: "off",
    yet: 50,
    ing: 50,
    hold: 0,
    completed: 0,
  });

  const [useCardType, setUseCardType] = useState(["read", "flip"]);
  const [useStatus, setUseStatus] = useState([
    "yet",
    "ing",
    "hold",
    "completed",
  ]);

  // 고급필터
  const [advancedFilterOnOff, setAdvancedFilterOnOff] = useState("off");
  const [cardMakerOnOff, setCardMakerOnOff] = useState("off");
  const [cardMaker, setCardMaker] = useState(["my", "buy"]);
  const [studyToolOnOff, setStudyToolOnOff] = useState("off");
  const [studyTool, setStudyTool] = useState([
    "none",
    "hidden",
    "underline",
    "highlight",
  ]);
  const [examResultOnOff, setExamResultOnOff] = useState("off");
  const [examResult, setExamResult] = useState(["none", "right", "wrong"]);
  const [levelOnOff, setLevelOnOff] = useState("off");
  const [level, setLevel] = useState([0, 100]);
  const [userFlagOnOff, setUserFlagOnOff] = useState("off");
  const [userFlag, setUserFlag] = useState([0, 1, 2, 3, 4, 5]);
  const [makerFlagOnOff, setMakerFlagOnOff] = useState("off");
  const [makerFlag, setMakerFlag] = useState([0, 1, 2, 3, 4, 5]);

  const [recentDifficultyOnOff, setRecentDifficultyOnOff] = useState("off");
  const [nonCurrentStudyRatioOnOff, setNonCurrentStudyRatioOnOff] =
    useState("on");
  const [currentStudyRatioOnOff, setCurrentStudyRatioOnOff] = useState("on");
  const [startOfStudyRatioRange, setStartOfStudyRatioRange] = useState("0");
  const [endOfStudyRatioRange, setEndOfStudyRatioRange] = useState("100");

  const [recentStudyTimeOnOff, setRecentStudyTimeOnOff] = useState("off");
  const [recentStudyTime, setRecentStudyTime] = useState([-3, 0]);
  const [studyTimesOnOff, setStudyTimesOnOff] = useState("off");
  const [studyTimes, setStudyTimes] = useState([0, 100]);

  const changeNeedStudyTimeCondition = useCallback((condition) => {
    setNeedStudyTimeCondition(condition);
  }, []);

  const changeNeedStudyTimeRange = useCallback((range) => {
    setNeedStudyTimeRange(range);
  }, []);

  const changeUseCardType = useCallback((useCardType) => {
    setUseCardType(useCardType);
  }, []);

  const changeUseStatus = useCallback((useStatus) => {
    setUseStatus(useStatus);
  }, []);

  const changeNumStartCards = useCallback((NumStartCards) => {
    setNumStartCards(NumStartCards);
  }, []);

  // 고급설정
  const changeAdvancedFilterOnOff = useCallback((_onOff) => {
    setAdvancedFilterOnOff(_onOff);
  }, []);
  const changeUserFlag = useCallback((_userFlag) => {
    setUserFlag(_userFlag);
  }, []);
  const changeUserFlagOnOff = useCallback((_onOff) => {
    setUserFlagOnOff(_onOff);
  }, []);
  const changeCardMaker = useCallback((_cardMaker) => {
    setCardMaker(_cardMaker);
  }, []);
  const changeCardMakerOnOff = useCallback((_onOff) => {
    setCardMakerOnOff(_onOff);
  }, []);
  const changeStudyTool = useCallback((_studyTool) => {
    setStudyTool(_studyTool);
  }, []);
  const changeStudyToolOnOff = useCallback((_onOff) => {
    setStudyToolOnOff(_onOff);
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

  const changeStartOfStudyRatioRange = useCallback(
    (_startOfStudyRatioRange) => {
      setStartOfStudyRatioRange(_startOfStudyRatioRange);
    },
    []
  );
  const changeEndOfStudyRatioRange = useCallback((_endOfStudyRatioRange) => {
    setEndOfStudyRatioRange(_endOfStudyRatioRange);
  }, []);
  const changeNonCurrentStudyRatioOnOff = useCallback(
    (_nonCurrentStudyRatioOnOff) => {
      setNonCurrentStudyRatioOnOff(_nonCurrentStudyRatioOnOff);
    },
    []
  );
  const changeCurrentStudyRatioOnOff = useCallback(
    (_currentStudyRatioOnOff) => {
      setCurrentStudyRatioOnOff(_currentStudyRatioOnOff);
    },
    []
  );

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

  const detailedOption = {
    useCardtype: useCardType,
    useStatus: useStatus,
    needStudyTimeCondition: studyTimeCondition,
    needStudyTimeRange: studyTimeRange,
    numStartCards: numStartCards,
  };
  const changeDetailOption = {
    changeNeedStudyTimeRange: changeNeedStudyTimeRange,
    changeNeedStudyTimeCondition: changeNeedStudyTimeCondition,
    changeUseCardType: changeUseCardType,
    changeUseStatus: changeUseStatus,
    changeNumStartCards: changeNumStartCards,
  };

  const advancedFilter = {
    onOff: advancedFilterOnOff,
    cardMaker: {
      onOff: cardMakerOnOff,
      value: cardMaker,
    },
    studyTool: {
      onOff: studyToolOnOff,
      value: studyTool,
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
      value: [
        nonCurrentStudyRatioOnOff,
        currentStudyRatioOnOff,
        startOfStudyRatioRange,
        endOfStudyRatioRange,
      ],
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

  const changeAdvancedFilter = {
    changeAdvancedFilterOnOff,
    changeUserFlag,
    changeUserFlagOnOff,
    changeCardMaker,
    changeCardMakerOnOff,
    changeStudyTool,
    changeStudyToolOnOff,
    changeMakerFlag,
    changeMakerFlagOnOff,
    changeExamResult,
    changeExamResultOnOff,

    changeRecentDifficultyOnOff,
    changeStartOfStudyRatioRange,
    changeEndOfStudyRatioRange,
    changeNonCurrentStudyRatioOnOff,
    changeCurrentStudyRatioOnOff,

    changeRecentStudyTime,
    changeRecentStudyTimeOnOff,
    changeLevel,
    changeLevelOnOff,
    changeStudyTimes,
    changeStudyTimesOnOff,
  };

  const sessionConfig = {
    detailedOption,
    advancedFilter,
  };

  const showDrawer = () => {
    setVisible(true);
    setBottomVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div
        onClick={showDrawer}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DiffOutlined style={{ fontSize: "1.5rem" }} />
        필터설정
      </div>
      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>
              필터설정
            </span>
          </>
        }
        placement="right"
        closable
        onClose={onClose}
        visible={visible}
        mask={true}
        width={"100%"}
        style={{ zIndex: 1031 }}
      >
        <div style={{ padding: "0px 10px 0px 10px" }}>
          <M_ModeSessionConfig
            detailedOption={detailedOption}
            changeProps={changeDetailOption}
            isPc={false}
            isReadMode={true}
          />
          <M_AdvancedFilter
            changeAdvancedFilter={changeAdvancedFilter}
            advancedFilter={advancedFilter}
            isPc={false}
          />
          <Button
            onClick={async () => {
              console.time("카드필터계산");
              const cards = await computeNumberOfAllFilteredCards({
                sessionConfig,
              });
              console.timeEnd("카드필터계산");
              console.log({ cards });
            }}
          >
            적용하기
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default RightDrawer;
