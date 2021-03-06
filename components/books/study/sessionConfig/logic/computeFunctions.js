import _ from "lodash";

export const computeNumberOfCardsPerBook = ({
  indexsets,
  cardsets,
  bookList,
}) => {
  const currentTime = new Date();
  let todayMidnight = new Date();
  todayMidnight.setDate(todayMidnight.getDate() + 1);
  todayMidnight.setHours(0, 0, 0, 0);
  function sumOfObjects(Obj1, Obj2) {
    var finalObj = {};
    Object.keys(Obj1).forEach((value) => {
      if (Obj2.hasOwnProperty(value)) {
        finalObj[value] = Obj1[value] + Obj2[value];
      }
    });

    return finalObj;
  }

  //  map 과 reduce 활용하여 카드 배열을  다음 키와 값을 가진 프로퍼티로 변환 (카드종류: 합계)
  const getNumberOfCards = (cards) =>
    cards
      .map((card) => ({
        totalNumberOfAllCards: 1,
        totalNumberOfYetCards: card.studyStatus.statusCurrent === "yet" ? 1 : 0,
        totalNumberOfHoldCards:
          card.studyStatus.statusCurrent === "hold" ? 1 : 0,
        totalNumberOfCompletedCards:
          card.studyStatus.statusCurrent === "Completed" ? 1 : 0,
        totalLevelOfAllCards:
          card.studyStatus.statusCurrent === "Completed"
            ? 0
            : card.studyStatus.levelCurrent,
        totalNumberOfAllCardsOnStudyStage:
          card.studyStatus.statusCurrent === "ing" ? 1 : 0,
        totalNumberOfUntilNowCardsOnStudyStage:
          card.studyStatus.statusCurrent === "ing" &&
          Date.parse(card.studyStatus.needStudyTime) < currentTime
            ? 1
            : 0,
        totalNumberOfUntilTodayCardsOnStudyStage:
          card.studyStatus.statusCurrent === "ing" &&
          Date.parse(card.studyStatus.needStudyTime) < todayMidnight
            ? 1
            : 0,
        totalNumberOfFromTomorrowCardsOnStudyStage:
          card.studyStatus.statusCurrent === "ing" &&
          Date.parse(card.studyStatus.needStudyTime) >= todayMidnight
            ? 1
            : 0,
      }))
      .reduce(sumOfObjects, {
        totalNumberOfAllCards: 0,
        totalNumberOfYetCards: 0,
        totalNumberOfHoldCards: 0,
        totalNumberOfCompletedCards: 0,
        totalLevelOfAllCards: 0,
        totalNumberOfAllCardsOnStudyStage: 0,
        totalNumberOfUntilNowCardsOnStudyStage: 0,
        totalNumberOfUntilTodayCardsOnStudyStage: 0,
        totalNumberOfFromTomorrowCardsOnStudyStage: 0,
      });

  // 카드 배열 생성 뒤 뒤집기, 읽기 카드만 필터
  const flattenCards = cardsets
    .flatMap((cardset) => cardset.cards)
    .filter((card) => ["flip", "read"].includes(card.card_info.cardtype));

  //정규화 데이터 만들기 시작
  const normalizationBooksData = {};

  indexsets.forEach((indexSet) => {
    // 목차 카드 정보 구하기 및 트리구조로 변환
    const makeTreeStructure = (arr) => {
      const result = [];
      const levels = [result];

      arr.forEach(
        (
          { _id, level, name } //목차 레벨이 1로 시작하기 때문에 levels[  인덱스번호: (목차레벨 - 1)   ]로 설정해야함
        ) =>
          levels[level - 1].push({
            title: name,
            id: _id,
            key: _id,
            levelForTableData: level,
            ...getNumberOfCards(
              flattenCards.filter((card) => card.card_info.index_id === _id)
            ),
            children: (levels[level] = []),
          })
      );
      result.forEach((a) => {
        if (a.children.length === 0) {
          delete a.children;
        } else {
          a.children.map((a) => {
            if (a.children.length === 0) {
              delete a.children;
            } else {
              a.children.map((a) => {
                if (a.children.length === 0) {
                  delete a.children;
                }
              });
            }
          });
        }
      });
      return result;
    };

    // normalizationBooksData에 책 아이디를 키로 설정하여 프로퍼티 생성
    normalizationBooksData[indexSet.indexset_info.mybook_id] = [
      {
        title: `책 제목: ${
          bookList.find(
            (book) => book.book_id === indexSet.indexset_info.mybook_id
          ).book_title
        }`,
        id: indexSet.indexset_info.mybook_id,
        key: "SummaryForBook",
        ...getNumberOfCards(
          flattenCards.filter(
            (card) =>
              card.card_info.mybook_id === indexSet.indexset_info.mybook_id
          )
        ),
      },
      ...makeTreeStructure(indexSet.indexes),
    ];
  });

  return normalizationBooksData;
};

export const computeNumberOfAllFilteredCards = ({
  cardsets,
  checkedKeys,
  sessionConfig,
}) => {
  const { exam, flip, read, advancedFilter } = sessionConfig;

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

  const detailedOption =
    sessionConfig.studyMode === "exam"
      ? exam
      : sessionConfig.studyMode === "flip"
      ? flip
      : sessionConfig.studyMode === "read"
      ? read
      : new Error("모드가 잘못 설정됨");

  if (detailedOption.sortOption === "") {
    return [];
  }
  const currentTime = new Date();
  let todayMidnight = new Date();
  todayMidnight.setDate(todayMidnight.getDate() + 1);
  todayMidnight.setHours(0, 0, 0, 0);
  const flattenCheckedKeys = Object.keys(checkedKeys).flatMap(
    (key) => checkedKeys[key]
  );

  const { needStudyTimeCondition, needStudyTimeRange, useCardtype, useStatus } =
    detailedOption;

  const flattenCards = cardsets
    .flatMap((cardset) => cardset.cards)
    .filter((card, i) => {
      const conditionOfCheckedIndexes = flattenCheckedKeys.includes(
        card.card_info.index_id
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
        userFlagOnOff === "off" ||
        userFlagValue.includes(card.content.userFlag);

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
        (studyToolValue.includes("hidden")
          ? cardAppliedHiddenContent
          : false) ||
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
        conditionOfCheckedIndexes &&
        conditionOfCardType &&
        useStatus.includes(card.studyStatus.statusCurrent) &&
        conditionOfCardStatus & isAdaptedAdvancedFilter
      );
    });

  return flattenCards;
};

export const sortFilteredCards = ({
  sortOption,
  numberOfFilteredCards,
  studyMode,
}) => {
  const sortedCards = ((numberOfFilteredCards, sortOption) => {
    switch (sortOption) {
      case "standard":
        return numberOfFilteredCards;
      case "time":
        const nonNullCards = numberOfFilteredCards
          .filter((card) => card.studyStatus.needStudyTime !== null)
          .sort((a, b) => {
            let dateA = new Date(a.studyStatus.needStudyTime);
            let dateB = new Date(b.studyStatus.needStudyTime);
            return dateA.getTime() - dateB.getTime();
          });
        const nullCards = numberOfFilteredCards.filter(
          (card) => card.studyStatus.needStudyTime === null
        );
        return [...nonNullCards, ...nullCards];

      case "random":
        const random = _.shuffle(numberOfFilteredCards); // Creates an array of shuffled values, using a version of the Fisher-Yates shuffle. immutable
        return random;

      default:
        throw new Error(`선택한 ${sortOption}정렬 옵션이 없습니다.`);
    }
  })(numberOfFilteredCards, sortOption);

  return sortedCards.map((card, seqInCardlist) => {
    if (studyMode === "flip") {
      return {
        ...card,
        seqInCardlist,
        card_info: {
          ...card.card_info,
          card_id: card._id,
        },
        studyStatus: {
          ...card.studyStatus,
          statusOriginal: card.studyStatus.statusCurrent,
          statusPrev: card.studyStatus.statusCurrent,
          sessionStatusPrev: null,
          sessionStatusCurrent: "notStarted",

          levelOriginal: card.studyStatus.levelCurrent,
          levelPrev: card.studyStatus.levelCurrent,
          levelUpdated: false,

          userFlagOriginal: card.content.userFlag,
          userFlagPrev: card.content.userFlag,

          clickTimesInSession: 0,
          studyTimesInSession: 0,
          studyHourInSession: 0,
          elapsedHourFromLastSession: 0,

          needStudyTimeTmp: null,
          isUpdated: false,
        },
      };
    }
    if (studyMode === "read") {
      return {
        ...card,
        seqInCardlist,
        card_info: {
          ...card.card_info,
          card_id: card._id,
        },
        studyStatus: {
          ...card.studyStatus,
        },
      };
    }
    if (studyMode === "exam") {
      return {
        ...card,
        seqInCardlist,
        card_info: {
          ...card.card_info,
          card_id: card._id,
        },
        studyStatus: {
          ...card.studyStatus,
          recentExamAnswer: null,
          rightAnswer: null,
          isUpdated: false,
        },
      };
    }
  });
};

export const getCardsByNumber = async ({ sortedCards, numStartCards }) => {
  console.log("카드 수량");
  const { yet, ing, hold, completed } = numStartCards;
  const yetCards = sortedCards.filter(
    (card) => card.studyStatus.statusCurrent === "yet"
  );
  const ingCards = sortedCards.filter(
    (card) => card.studyStatus.statusCurrent === "ing"
  );
  const completedCards = sortedCards.filter(
    (card) => card.studyStatus.statusCurrent === "completed"
  );
  const holdCards = sortedCards.filter(
    (card) => card.studyStatus.statusCurrent === "hold"
  );

  const getNumberOfSelectedCardsByStatus = async () => ({
    yet: [...yetCards].length,
    ing: [...ingCards].length,
    completed: [...completedCards].length,
    hold: [...holdCards].length,
  });

  const numberOfSelectedCardsByStatus =
    await getNumberOfSelectedCardsByStatus();

  const yetCardsOnStudyStage = yetCards.splice(0, yet);
  const ingCardsOnStudyStage = ingCards.splice(0, ing);
  const completedCardsOnStudyStage = completedCards.splice(0, completed);
  const holdCardsOnStudyStage = holdCards.splice(0, hold);

  const studyingCards = [
    ...yetCardsOnStudyStage,
    ...ingCardsOnStudyStage,
    ...completedCardsOnStudyStage,
    ...holdCardsOnStudyStage,
  ].sort((a, b) => a.seqInCardlist - b.seqInCardlist);
  const numberOfstudyingCardsByStatus = {
    yet: yetCardsOnStudyStage.length,
    ing: ingCardsOnStudyStage.length,
    completed: completedCardsOnStudyStage.length,
    hold: holdCardsOnStudyStage.length,
  };

  return {
    studyingCards,
    remainedCards: {
      yet: yetCards,
      ing: ingCards,
      completed: completedCards,
      hold: holdCards,
    },
    numberOfstudyingCardsByStatus,
    numberOfSelectedCardsByStatus,
  };
};
