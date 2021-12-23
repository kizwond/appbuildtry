export default function summaryAll(cardsList, checkedKeys) {
  function sumOfObjects(Obj1, Obj2) {
    var finalObj = {};
    Object.keys(Obj1).forEach((value) => {
      if (Obj2.hasOwnProperty(value)) {
        finalObj[value] = Obj1[value] + Obj2[value];
      }
    });

    return finalObj;
  }
  const flattenSelectedIndexes = cardsList
    .map((card) =>
      card.session_getNumCardsbyIndex.indexsets[0].indexes //
        .filter((index) =>
          card.session_getNumCardsbyIndex.indexsets[0].indexset_info
            .checkedIndex
            ? card.session_getNumCardsbyIndex.indexsets[0].indexset_info.checkedIndex.includes(
                index._id
              )
            : checkedKeys[
                card.session_getNumCardsbyIndex.indexsets[0].indexset_info
                  .mybook_id
              ].includes(index._id)
        )
    )
    .flat();
  const summary = flattenSelectedIndexes
    .map((item) => ({
      levelAverage_for_total_card: item.numCards.total.averageLevel,
      total_cards_number_for_total_card: item.numCards.total.total,
      yet_cards_number_for_total_card: item.numCards.total.yet,
      total_on_study_cards_number_for_total_card: item.numCards.total.ingTotal,
      until_today_on_study_cards_number_for_total_card:
        item.numCards.total.ingUntilToday,
      until_now_on_study_cards_number_for_total_card:
        item.numCards.total.ingUntilNow,
      from_tomorrow_on_study_cards_number_for_total_card:
        item.numCards.total.ingAfterTomorrow,
      completed_cards_number_for_total_card: item.numCards.total.completed,
      holding_cards_number_for_total_card: item.numCards.total.hold,
    }))
    .reduce(sumOfObjects, {
      levelAverage_for_total_card: 0,
      total_cards_number_for_total_card: 0,
      yet_cards_number_for_total_card: 0,
      total_on_study_cards_number_for_total_card: 0,
      until_today_on_study_cards_number_for_total_card: 0,
      until_now_on_study_cards_number_for_total_card: 0,
      from_tomorrow_on_study_cards_number_for_total_card: 0,
      completed_cards_number_for_total_card: 0,
      holding_cards_number_for_total_card: 0,
    });

  return {
    ...summary,
    levelAverage_for_total_card:
      summary.levelAverage_for_total_card / flattenSelectedIndexes.length || 0,
  };
}
