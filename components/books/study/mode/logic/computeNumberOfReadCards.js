import _ from "lodash";

export const computeNumberOfAllFilteredCards = async ({ sessionConfig }) => {
  const { detailedOption, advancedFilter } = sessionConfig;

  const cardsets = JSON.parse(sessionStorage.getItem("cardListStudyingOrigin"));
  const {
    onOff: AF_onOff,
    // 총 8개필터
    cardMaker: { onOff: cardMakerOnOff, value: cardMakerValue },
    userFlag: { onOff: userFlagOnOff, value: userFlagValue },
    makerFlag: { onOff: makerFlagOnOff, value: makerFlagValue },
    studyTool: { onOff: studyToolOnOff, value: studyToolValue },
    level: { onOff: levelOnOff, value: levelValue },
    examResult: { onOff: examResultOnOff, value: examResultValue },
    recentDifficulty: {
      onOff: recentDifficultyOnOff,
      value: recentDifficultyValue,
    },
    recentStudyTime: {
      onOff: recentStudyTimeOnOff,
      value: recentStudyTimeValue,
    },
    studyTimes: { onOff: studyTimesOnOff, value: studyTimesValue },
  } = advancedFilter;

  const currentTime = new Date();
  let todayMidnight = new Date();
  todayMidnight.setDate(todayMidnight.getDate() + 1);
  todayMidnight.setHours(0, 0, 0, 0);

  const { needStudyTimeCondition, needStudyTimeRange, useCardtype, useStatus } =
    detailedOption;

  const flattenCards = cardsets.filter((card, i) => {
    const isFreePassCards = ["general, share, subject"].includes(
      card.card_info.cardtype
    );

    const conditionOfCardType = useCardtype.includes(card.card_info.cardtype); //읽기 뒤집기 카드만 선택됨
    const conditionOfCardStatus = (() => {
      if (!useStatus.includes("ing")) {
        return useStatus.includes(card.studyStatus.statusCurrent);
      }
      if (useStatus.includes("ing")) {
        if (needStudyTimeCondition === "all") {
          return useStatus.includes(card.studyStatus.statusCurrent);
        }
        if (needStudyTimeCondition === "untilNow") {
          return (
            ["yet", "compled", "hold"].includes(
              card.studyStatus.statusCurrent
            ) || Date.parse(card.studyStatus.needStudyTime) < currentTime
          );
        }
        if (needStudyTimeCondition === "untilToday") {
          return (
            ["yet", "compled", "hold"].includes(
              card.studyStatus.statusCurrent
            ) || Date.parse(card.studyStatus.needStudyTime) < todayMidnight
          );
        }
        if (needStudyTimeCondition === "custom") {
          if (card.studyStatus.needStudyTime === null) {
            return (
              ["yet", "compled", "hold"].includes(
                card.studyStatus.statusCurrent
              ) || false
            );
          }
          const needStudyTimePosition =
            (Date.parse(card.studyStatus.needStudyTime) - todayMidnight) /
            24 /
            3600000;

          return (
            ["yet", "compled", "hold"].includes(
              card.studyStatus.statusCurrent
            ) ||
            (needStudyTimePosition > needStudyTimeRange[0] - 1 &&
              needStudyTimePosition < needStudyTimeRange[1])
          );
        }
      }
    })();

    // 고급필터 off 상황이면 모든 카드 true, on 상황에는 개별 필터들 and 조합

    const userFlagFilter =
      userFlagOnOff === "off" || userFlagValue.includes(card.content.userFlag);

    const makerFlagFilter =
      makerFlagOnOff === "off" ||
      makerFlagValue.includes(card.content.makerFlag.value);

    let fromDate = new Date();
    fromDate.setDate(fromDate.getDate() + recentStudyTimeValue[0]);
    fromDate.setHours(0, 0, 0, 0);
    const numberOfFromDate = fromDate.getTime();
    let endDate = new Date();
    endDate.setDate(endDate.getDate() + recentStudyTimeValue[1] + 1); //자정까지기 때문에 +1
    endDate.setHours(0, 0, 0, 0);
    const numberOfEndDate = endDate.getTime();
    const recentStudyTime = new Date(card.studyStatus.recentStudyTime);
    const numberOfRecentStudyTime = recentStudyTime.getTime();
    const recentStudyTimeFilter =
      recentStudyTimeOnOff === "off" ||
      (numberOfFromDate <= numberOfRecentStudyTime &&
        numberOfRecentStudyTime <= numberOfEndDate);
    const levelFilter =
      levelOnOff === "off" ||
      (levelValue[0] <= card.studyStatus.levelCurrent &&
        card.studyStatus.levelCurrent <= levelValue[1]);

    const studyTimesFilter =
      studyTimesOnOff === "off" ||
      (studyTimesValue[0] <= card.studyStatus.totalStudyTimes &&
        card.studyStatus.totalStudyTimes <= studyTimesValue[1]);

    const [
      nonCurrentStudyRatioOnOff,
      currentStudyRatioOnOff,
      startOfStudyRatioRange,
      endOfStudyRatioRange,
    ] = recentDifficultyValue;

    const recentDifficultyFilter =
      recentDifficultyOnOff === "off" ||
      (nonCurrentStudyRatioOnOff === "on"
        ? card.studyStatus.recentStudyRatio === null
        : false) ||
      (currentStudyRatioOnOff === "on"
        ? card.studyStatus.recentStudyRatio &&
          startOfStudyRatioRange <= card.studyStatus.recentStudyRatio &&
          card.studyStatus.recentStudyRatio <= endOfStudyRatioRange
        : false);

    const examResultFilter =
      examResultOnOff === "off" ||
      examResultValue.includes(card.studyStatus.recentExamResult);

    const cardAppliedHiddenContent = card.content.hidden.length > 0;
    const cardAppliedUnderlineContent = card.content.underline.length > 0;
    const cardAppliedHighlightContent = card.content.highlight.length > 0;
    const studyToolFilter =
      studyToolOnOff === "off" ||
      (studyToolValue.includes("none")
        ? !cardAppliedHiddenContent &&
          !cardAppliedUnderlineContent &&
          !cardAppliedHighlightContent
        : false) ||
      (studyToolValue.includes("hidden") ? cardAppliedHiddenContent : false) ||
      (studyToolValue.includes("underline")
        ? cardAppliedUnderlineContent
        : false) ||
      (studyToolValue.includes("hightlight")
        ? cardAppliedHighlightContent
        : false);

    const cardMakerFilter =
      cardMakerOnOff === "off" ||
      cardMakerValue.includes(card.content.location);

    const isAdaptedAdvancedFilter =
      AF_onOff === "off" ||
      (userFlagFilter &&
        makerFlagFilter &&
        recentStudyTimeFilter &&
        levelFilter &&
        studyTimesFilter &&
        recentDifficultyFilter &&
        examResultFilter &&
        studyToolFilter &&
        cardMakerFilter);

    return (
      isFreePassCards ||
      (conditionOfCardType &&
        useStatus.includes(card.studyStatus.statusCurrent) &&
        conditionOfCardStatus & isAdaptedAdvancedFilter)
    );
  });

  return flattenCards;
};
