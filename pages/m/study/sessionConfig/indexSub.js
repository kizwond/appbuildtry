export const getNumCardsbyIndex = async ({
  mybooks,
  indexsets,
  cardsets,
  sessionconfig,
}) => {
  console.log({
    indexsets,
    cardsets,
    sessionconfig,
  });
  // const indexset = await Indexset.findOne({
  //   "indexset_info.mybook_id": args.forGetNumCardsbyIndex.mybook_id,
  //   "indexset_info.user_id": req.user_id,
  // });
  // const index_ids = indexset.indexes.map((index) => index._id);
  // const cardsets = await Cardset.find({ "cardset_info.index_id": index_ids });
  // const advancedFilter = args.forGetNumCardsbyIndex.advancedFilter;
  // const current_time = new Date();
  // let todayMidnight = new Date();
  // todayMidnight.setDate(todayMidnight.getDate() + 1);
  // todayMidnight.setHours(0, 0, 0, 0);
  // for (i = 0; i < cardsets.length; i++) {
  //   const index_id = cardsets[i].cardset_info.index_id.toString();
  //   const index_order = indexset.indexes.findIndex(
  //     (index) => index._id == index_id
  //   );
  //   // console.log('index_order',index_order)
  //   for (j = 0; j < cardsets[i].cards.length; j++) {
  //     if (["flip", "read"].includes(cardsets[i].cards[j].card_info.cardtype)) {
  //       break;
  //     }
  //     if (advancedFilter != null) {
  //       if ((advancedFilter.userFlag.onOff = "on")) {
  //         if (
  //           !advancedFilter.userFlag.value.includes(
  //             cardsets[i].cards[j].contents.userFlag
  //           )
  //         ) {
  //           break;
  //         }
  //         if (
  //           ![0, 1, 3, 5].includes(cardsets[i].cards[j].content.userFlag.value)
  //         ) {
  //           break;
  //         }
  //       }
  //       if ((advancedFilter.makerFlag.onOff = "on")) {
  //         if (![1, 2, 3].includes(cardsets[i].cards[j].contents.makerFlag)) {
  //           break;
  //         }
  //       }
  //       if ((advancedFilter.makerFlag.onOff = "on")) {
  //         if (![1, 2, 3].includes(cardsets[i].cards[j].contents.makerFlag)) {
  //           break;
  //         }
  //       }
  //       if ((advancedFilter.makerFlag.onOff = "on")) {
  //         if (![1, 2, 3].includes(cardsets[i].cards[j].contents.makerFlag)) {
  //           break;
  //         }
  //       }
  //       if ((advancedFilter.makerFlag.onOff = "on")) {
  //         if (![1, 2, 3].includes(cardsets[i].cards[j].contents.makerFlag)) {
  //           break;
  //         }
  //       }
  //     }
  //     const status = cardsets[i].cards[j].studyStatus.statusCurrent;
  //     const cardtype = cardsets[i].cards[j].card_info.cardtype;
  //     const needStudyTime = cardsets[i].cards[j].studyStatus.needStudyTime;
  //     // 카드수를 셉니다.
  //     if (status == "ing") {
  //       indexset.indexes[index_order].numCards.total.total += 1;
  //       indexset.indexes[index_order].numCards.total.progress +=
  //         indexset.indexes[index_order].numCards[cardtype].progress;
  //       indexset.indexes[index_order].numCards.total[status] += 1;
  //       indexset.indexes[index_order].numCards[cardtype].ing.total += 1;
  //       indexset.indexes[index_order].numCards[cardtype].ing.progress +=
  //         indexset.indexes[index_order].numCards[cardtype].progress;
  //       if (needStudyTime < current_time) {
  //         indexset.indexes[index_order].numCards[cardtype].ing.untilNow += 1;
  //       }
  //       if (needStudyTime < todayMidnight) {
  //         indexset.indexes[index_order].numCards[cardtype].ing.untilToday += 1;
  //       }
  //       if (needStudyTime >= todayMidnight) {
  //         indexset.indexes[index_order].numCards[
  //           cardtype
  //         ].ing.afterTomorrow += 1;
  //       }
  //     } else {
  //       indexset.indexes[index_order].numCards.total.total += 1;
  //       indexset.indexes[index_order].numCards.total.progress +=
  //         indexset.indexes[index_order].numCards[cardtype].progress;
  //       indexset.indexes[index_order].numCards.total[status] += 1;
  //       indexset.indexes[index_order].numCards[cardtype].total += 1;
  //       indexset.indexes[index_order].numCards[cardtype].progress +=
  //         indexset.indexes[index_order].numCards[cardtype].progress;
  //       indexset.indexes[index_order].numCards[cardtype][status] += 1;
  //     }
  //   }
  //   for (const cardtype of ["total", "read", "flip"]) {
  //     indexset.indexes[index_order].numCards[cardtype].progress /=
  //       indexset.indexes[index_order].numCards[cardtype].total;
  //   }
  // }
  // return { indexsets: [indexset] };
};
