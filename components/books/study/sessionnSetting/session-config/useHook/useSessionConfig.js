import React, { useState, useCallback } from "react";

export default function useSessionConfig() {
  const [mode, setMode] = useState("exam");

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

  const changeMode = useCallback((mode) => {
    setMode(mode);
  }, []);

  const changeReadNeedStudyTimeCondition = useCallback((condition) => {
    setReadNeedStudyTimeCondition(condition);
  }, []);
  const changeFlipNeedStudyTimeCondition = useCallback((condition) => {
    setFlipNeedStudyTimeCondition(condition);
  }, []);
  const changeExamNeedStudyTimeCondition = useCallback((condition) => {
    setExamNeedStudyTimeCondition(condition);
  }, []);

  const changeReadNeedStudyTimeRange = useCallback((range) => {
    setReadNeedStudyTimeRange(range);
  }, []);
  const changeFlipNeedStudyTimeRange = useCallback((range) => {
    setFlipNeedStudyTimeRange(range);
  }, []);
  const changeExamNeedStudyTimeRange = useCallback((range) => {
    setExamNeedStudyTimeRange(range);
  }, []);

  const changeReadSortOption = useCallback((sortOption) => {
    setReadSortOption(sortOption);
  }, []);
  const changeFlipSortOption = useCallback((sortOption) => {
    setFlipSortOption(sortOption);
  }, []);
  const changeExamSortOption = useCallback((sortOption) => {
    setExamSortOption(sortOption);
  }, []);

  const changeReadUseCardType = useCallback((useCardType) => {
    setReadUseCardType(useCardType);
  }, []);
  const changeFlipUseCardType = useCallback((useCardType) => {
    setFlipUseCardType(useCardType);
  }, []);
  const changeExamUseCardType = useCallback((useCardType) => {
    setExamUseCardType(useCardType);
  }, []);

  const changeReadUseStatus = useCallback((useStatus) => {
    setReadUseStatus(useStatus);
  }, []);
  const changeFlipUseStatus = useCallback((useStatus) => {
    setFlipUseStatus(useStatus);
  }, []);
  const changeExamUseStatus = useCallback((useStatus) => {
    setExamUseStatus(useStatus);
  }, []);

  const changeReadNumStartCards = useCallback((NumStartCards) => {
    setReadNumStartCards(NumStartCards);
  }, []);
  const changeFlipNumStartCards = useCallback((NumStartCards) => {
    setFlipNumStartCards(NumStartCards);
  }, []);
  const changeExamNumStartCards = useCallback((NumStartCards) => {
    setExamNumStartCards(NumStartCards);
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

  const readDetailedOption = {
    sortOption: readSortOption,
    useCardtype: readUseCardType,
    useStatus: readUseStatus,
    needStudyTimeCondition: readNeedStudyTimeCondition,
    needStudyTimeRange: readNeedStudyTimeRange,
    numStartCards: readNumStartCards,
  };
  const changeReadProps = {
    changeSortOption: changeReadSortOption,
    changeNeedStudyTimeRange: changeReadNeedStudyTimeRange,
    changeNeedStudyTimeCondition: changeReadNeedStudyTimeCondition,
    changeUseCardType: changeReadUseCardType,
    changeUseStatus: changeReadUseStatus,
    changeNumStartCards: changeReadNumStartCards,
  };
  const flipDetailedOption = {
    sortOption: flipSortOption,
    useCardtype: flipUseCardType,
    useStatus: flipUseStatus,
    needStudyTimeCondition: flipNeedStudyTimeCondition,
    needStudyTimeRange: flipNeedStudyTimeRange,
    numStartCards: flipNumStartCards,
  };
  const changeFlipProps = {
    changeSortOption: changeFlipSortOption,
    changeNeedStudyTimeRange: changeFlipNeedStudyTimeRange,
    changeNeedStudyTimeCondition: changeFlipNeedStudyTimeCondition,
    changeUseCardType: changeFlipUseCardType,
    changeUseStatus: changeFlipUseStatus,
    changeNumStartCards: changeFlipNumStartCards,
  };
  const examDetailedOption = {
    sortOption: examSortOption,
    useCardtype: examUseCardType,
    useStatus: examUseStatus,
    needStudyTimeCondition: examNeedStudyTimeCondition,
    needStudyTimeRange: examNeedStudyTimeRange,
    numStartCards: examNumStartCards,
  };
  const changeExamProps = {
    changeSortOption: changeExamSortOption,
    changeNeedStudyTimeRange: changeExamNeedStudyTimeRange,
    changeNeedStudyTimeCondition: changeExamNeedStudyTimeCondition,
    changeUseCardType: changeExamUseCardType,
    changeUseStatus: changeExamUseStatus,
    changeNumStartCards: changeExamNumStartCards,
  };

  const modeOption = {
    readDetailedOption,
    changeReadProps,
    flipDetailedOption,
    changeFlipProps,
    examDetailedOption,
    changeExamProps,
  };

  const updateData = useCallback((received_data) => {
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

    setMode(sessionconfigs.studyMode);
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
  }, []);

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

  const changeAdvancedFilter = {
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
  };

  const sessionConfig =
    mode === "read"
      ? { studyMode: "read", detailedOption: readDetailedOption, advancedFilter }
      : mode === "flip"
      ? { studyMode: "flip", detailedOption: flipDetailedOption, advancedFilter }
      : mode === "exam"
      ? { studyMode: "exam", detailedOption: examDetailedOption, advancedFilter }
      : new Error("Unhandled studyConfig Mode");

  return {
    // 모드
    mode,
    changeMode,
    // 모드 옵션
    modeOption,
    // 고급설정
    advancedFilter,
    changeAdvancedFilter,
    // useQuery 업데이트용
    updateData,
    // useMutaion Variables
    sessionConfig,
  };
}
