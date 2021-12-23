import _ from "lodash";

function sumOfObjects(Obj1, Obj2) {
  var finalObj = {};
  Object.keys(Obj1).forEach((value) => {
    if (Obj2.hasOwnProperty(value)) {
      finalObj[value] = Obj1[value] + Obj2[value];
    }
  });

  return finalObj;
}

const currentTime = new Date();
let todayMidnight = new Date();
todayMidnight.setDate(todayMidnight.getDate() + 1);
todayMidnight.setHours(0, 0, 0, 0);

export const getNumCardsbyIndex = async ({
  indexsets,
  cardsets,
  sessionConfig,
}) => {
  const jindexsets = _.cloneDeep(indexsets);

  for (let i = 0; i < jindexsets.length; i++) {
    for (let j = 0; j < jindexsets[i].indexes.length; j++) {
      const cardsetPosition = cardsets.findIndex(
        (cardset) =>
          cardset.cardset_info.index_id == jindexsets[i].indexes[j]._id
      );

      console.log(cardsetPosition);
      const currentTime = new Date();
      let todayMidnight = new Date();
      todayMidnight.setDate(todayMidnight.getDate() + 1);
      todayMidnight.setHours(0, 0, 0, 0);

      for (let k = 0; k < cardsets[cardsetPosition].cards.length; k++) {
        if (
          !["flip", "read"].includes(
            cardsets[cardsetPosition].cards[k].card_info.cardtype
          )
        ) {
          break;
        }
        const status =
          cardsets[cardsetPosition].cards[k].studyStatus.statusCurrent;
        const cardtype = cardsets[cardsetPosition].cards[k].card_info.cardtype;
        const needStudyTime =
          cardsets[cardsetPosition].cards[k].studyStatus.needStudyTime;

        // 카드수를 셉니다.
        if (["yet", "hold", "completed"].includes(status)) {
          jindexsets[i].indexes[j].numCards.total.averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total[status] += 1;

          jindexsets[i].indexes[j].numCards[cardtype].averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype][status] += 1;
        } else if (["ing"].includes(status)) {
          jindexsets[i].indexes[j].numCards.total.averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total.ingTotal += 1;
          if (needStudyTime < currentTime) {
            jindexsets[i].indexes[j].numCards.total.ingUntilNow += 1;
          }
          if (needStudyTime < todayMidnight) {
            jindexsets[i].indexes[j].numCards.total.ingUntilToday += 1;
          }
          if (needStudyTime >= todayMidnight) {
            jindexsets[i].indexes[j].numCards.total.ingAfterTomorrow += 1;
          }

          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].ingTotal += 1;
          if (needStudyTime < currentTime) {
            jindexsets[i].indexes[j].numCards[cardtype].ingUntilNow += 1;
          }
          if (needStudyTime < todayMidnight) {
            jindexsets[i].indexes[j].numCards[cardtype].ingUntilToday += 1;
          }
          if (needStudyTime >= todayMidnight) {
            jindexsets[i].indexes[j].numCards[cardtype].ingAfterTomorrow += 1;
          }
        }
      }
      for (const cardtype of ["total", "read", "flip"]) {
        if (jindexsets[i].indexes[j].numCards[cardtype].total != 0) {
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel /=
            jindexsets[i].indexes[j].numCards[cardtype].total;
        }
      }
    }
  }
  console.log("종료", jindexsets);

  return jindexsets;
};

export const getNumCardsAppliedAdvancedFilter = async ({
  indexsets,
  cardsets,
  sessionConfig,
}) => {
  const jindexsets = _.cloneDeep(indexsets);

  for (let i = 0; i < jindexsets.length; i++) {
    for (let j = 0; j < jindexsets[i].indexes.length; j++) {
      const { advancedFilter } = sessionConfig;
      const cardsetPosition = cardsets.findIndex(
        (cardset) =>
          cardset.cardset_info.index_id == jindexsets[i].indexes[j]._id
      );

      const currentTime = new Date();
      let todayMidnight = new Date();
      todayMidnight.setDate(todayMidnight.getDate() + 1);
      todayMidnight.setHours(0, 0, 0, 0);

      const { studyMode } = sessionConfig;

      for (let k = 0; k < cardsets[cardsetPosition].cards.length; k++) {
        if (
          !sessionConfig[studyMode].useCardtype.includes(
            cardsets[cardsetPosition].cards[k].card_info.cardtype
          )
        ) {
          break;
        }

        const { needStudyTime } =
          cardsets[cardsetPosition].cards[k].studyStatus;
        if (sessionConfig[studyMode].needStudyTimeCondition == "unitlNow") {
          if (needStudyTime > currentTime) {
            break;
          }
        }
        if (sessionConfig[studyMode].needStudyTimeCondition == "unitlToday") {
          if (needStudyTime > todayMidnight) {
            break;
          }
        }
        if (sessionConfig[studyMode].needStudyTimeCondition == "custom") {
          const needStudyTimePosition =
            (needStudyTime - todayMidnight) / 24 / 3600;
          if (
            needStudyTimePosition <
              sessionConfig[studyMode].needStudyTimeRange[0] ||
            needStudyTimePosition >
              sessionConfig[studyMode].needStudyTimeRange[1]
          ) {
            break;
          }
        }

        if (advancedFilter.onOff == "on") {
          if ((advancedFilter.userFlag.onOff = "on")) {
            if (
              !advancedFilter.userFlag.value.includes(
                cardsets[cardsetPosition].cards[k].content.userFlag.value
              )
            ) {
              break;
            }
          }
          if ((advancedFilter.makerFlag.onOff = "on")) {
            if (
              !advancedFilter.makerFlag.value.includes(
                cardsets[cardsetPosition].cards[k].content.makerFlag
              )
            ) {
              break;
            }
          }
          if ((advancedFilter.recentStudyTime.onOff = "on")) {
            const timePosition =
              (cardsets[cardsetPosition].cards[k].studyStatus.recentStudyTime -
                todayMidnight) /
              24 /
              3600;
            if (
              timePosition < advancedFilter.recentStudyTime.value[0] ||
              timePosition > advancedFilter.recentStudyTime.value[1]
            ) {
              break;
            }
          }
          if ((advancedFilter.level.onOff = "on")) {
            const levelCurrent =
              cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
            if (
              levelCurrent < advancedFilter.level.value[0] ||
              levelCurrent > levelCurrent.level.value[1]
            ) {
              break;
            }
          }
          if ((advancedFilter.studyTimes.onOff = "on")) {
            const totalStudyTimes =
              cardsets[cardsetPosition].cards[k].studyStatus.totalStudyTimes;
            if (
              totalStudyTimes < advancedFilter.studyTimes.value[0] ||
              totalStudyTimes > levelCurrent.studyTimes.value[1]
            ) {
              break;
            }
          }
          if ((advancedFilter.recentDifficulty.onOff = "on")) {
            if (
              !advancedFilter.recentDifficulty.value.includes(
                cardsets[cardsetPosition].cards[k].studyStatus.recentStudyResult
              )
            ) {
              break;
            }
          }
          if ((advancedFilter.examResult.onOff = "on")) {
            if (
              !advancedFilter.examResult.value.includes(
                cardsets[cardsetPosition].cards[k].studyStatus.recentExamResult
              )
            ) {
              break;
            }
          }
        }

        const status =
          cardsets[cardsetPosition].cards[k].studyStatus.statusCurrent;
        const cardtype = cardsets[cardsetPosition].cards[k].card_info.cardtype;

        // 카드수를 셉니다.
        if (["yet", "hold", "completed"].includes(status)) {
          jindexsets[i].indexes[j].numCards.total.averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total[status] += 1;

          jindexsets[i].indexes[j].numCards[cardtype].averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype][status] += 1;
        } else if (["ing"].includes(status)) {
          jindexsets[i].indexes[j].numCards.total.averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total.ingTotal += 1;
          if (needStudyTime < currentTime) {
            jindexsets[i].indexes[j].numCards.total.ingUntilNow += 1;
          }
          if (needStudyTime < todayMidnight) {
            jindexsets[i].indexes[j].numCards.total.ingUntilToday += 1;
          }
          if (needStudyTime >= todayMidnight) {
            jindexsets[i].indexes[j].numCards.total.ingAfterTomorrow += 1;
          }

          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel +=
            cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].ingTotal += 1;
          if (needStudyTime < currentTime) {
            jindexsets[i].indexes[j].numCards[cardtype].ingUntilNow += 1;
          }
          if (needStudyTime < todayMidnight) {
            jindexsets[i].indexes[j].numCards[cardtype].ingUntilToday += 1;
          }
          if (needStudyTime >= todayMidnight) {
            jindexsets[i].indexes[j].numCards[cardtype].ingAfterTomorrow += 1;
          }
        }
      }
      for (const cardtype of ["total", "read", "flip"]) {
        if (jindexsets[i].indexes[j].numCards[cardtype].total != 0) {
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel /=
            jindexsets[i].indexes[j].numCards[cardtype].total;
        }
      }
    }
  }

  console.log("종료", jindexsets);
  return jindexsets;
};

export const computeNumberOfCardsPerBook = async ({
  indexsets,
  cardsets,
  sessionConfig,
  selectedBook,
  selectedIndex,
}) => {
  console.log({
    indexsets,
    cardsets,
    sessionConfig,
    selectedBook,
    selectedIndex,
  });

  // 카드 배열 생성 뒤 뒤집기, 읽기 카드만 필터
  // 필터해야하는 부분은 다 여기서 처리하면 될 것 같다. - 아직 테스트 안됨
  const flattenCards = cardsets
    .flatMap((cardset) => cardset.cards)
    .filter((card) => ["flip", "read"].includes(card.card_info.cardtype));

  const normalizationBooksData = {};

  indexsets.forEach((indexSet) => {
    // normalizationBooksData에 책 아이디를 키로 설정하여 프로퍼티 생성
    normalizationBooksData[indexSet.indexset_info.mybook_id] =
      indexSet.indexes.map((index) => ({
        title: index.name,
        id: index._id,
        levelForTableData: index.level,
        //  map 과 reduce 활용하여 카드 배열을  다음 키와 값을 가진 프로퍼티로 변환 (카드종류: 합계)
        ...flattenCards
          .filter((card) => card.card_info.index_id === index._id)
          .map((card) => ({
            totalNumberOfAllCards: 1,
            totalNumberOfYetCards:
              card.studyStatus.statusCurrent === "yet" ? 1 : 0,
            totalNumberOfHoldCards:
              card.studyStatus.statusCurrent === "hold" ? 1 : 0,
            totalNumberOfCompletedCards:
              card.studyStatus.statusCurrent === "Completed" ? 1 : 0,
            totalLevelOfAllCards: card.studyStatus.levelCurrent,
            totalNumberOfAllCardsOnStudyStage:
              card.studyStatus.statusCurrent === "ing" ? 1 : 0,
            totalNumberOfUntilNowCardsOnStudyStage:
              card.studyStatus.statusCurrent === "ing" &&
              card.studyStatus.needStudyTimes < currentTime
                ? 1
                : 0,
            totalNumberOfUntilTodayCardsOnStudyStage:
              card.studyStatus.statusCurrent === "ing" &&
              card.studyStatus.needStudyTimes < todayMidnight
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
          }),
      }));
  });

  console.log({ normalizationBooksData });
};
