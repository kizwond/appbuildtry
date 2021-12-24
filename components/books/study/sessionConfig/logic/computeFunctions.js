import _ from "lodash";

export const computeNumberOfCardsPerBook = ({ indexsets, cardsets }) => {
  console.time("a");

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
        totalNumberOfFromTomorrowCardsOnStudyStage:
          card.studyStatus.statusCurrent === "ing" &&
          card.studyStatus.needStudyTimes >= todayMidnight
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
        title: "현재 책 기준",
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

  console.timeEnd("a");

  return normalizationBooksData;
};

export const computeNumberOfAllFilteredCards = ({
  cardsets,
  checkedKeys,
  sessionConfig,
}) => {
  console.log({ cardsets, checkedKeys, sessionConfig });
  const {
    detailedOption: {
      needStudyTimeCondition,
      needStudyTimeRange,
      numStartCards,
      sortOption,
      useCardtype,
      useStatus,
    },
  } = sessionConfig;

  console.log({
    needStudyTimeCondition,
    needStudyTimeRange,
    numStartCards,
    useCardtype,
    useStatus,
  });

  const flattenCards = cardsets
    .flatMap((cardset) => cardset.cards)
    .filter(
      (card) =>
        useCardtype.includes(card.card_info.cardtype) &&
        useStatus.includes(card.studyStatus.statusCurrent)
    );

  console.log(flattenCards.length);
  flattenCards && flattenCards.length > 0 && console.log(flattenCards[0]);
};
