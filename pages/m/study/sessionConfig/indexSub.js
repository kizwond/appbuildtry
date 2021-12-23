import _ from "lodash";

export const getNumCardsbyIndex = async ({indexsets, cardsets, sessionConfig}) => {  
  console.log('test', sessionConfig)
  const jindexsets =_.cloneDeep(indexsets)

  for (let i=0; i<jindexsets.length; i++){
    for (let j=0; j<jindexsets[i].indexes.length; j++){      
      const cardsetPosition = cardsets.findIndex(cardset => cardset.cardset_info.index_id == jindexsets[i].indexes[j]._id)      

      const currentTime = new Date();      
      let todayMidnight = new Date();
      todayMidnight.setDate(todayMidnight.getDate() + 1);
      todayMidnight.setHours(0, 0, 0, 0);

      for (let k=0; k<cardsets[cardsetPosition].cards.length; k++){        
        if (!["flip", "read"].includes(cardsets[cardsetPosition].cards[k].card_info.cardtype)) {break};                          
        const status = cardsets[cardsetPosition].cards[k].studyStatus.statusCurrent;
        const cardtype = cardsets[cardsetPosition].cards[k].card_info.cardtype;
        const needStudyTime = cardsets[cardsetPosition].cards[k].studyStatus.needStudyTime;

        // 카드수를 셉니다.
        if (['yet', 'hold', 'completed'].includes(status)) {
          jindexsets[i].indexes[j].numCards.total.averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total[status] += 1;

          jindexsets[i].indexes[j].numCards[cardtype].averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype][status] += 1;
        } else if (['ing'].includes(status)){
          jindexsets[i].indexes[j].numCards.total.averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total.ingTotal += 1;
          if (needStudyTime < currentTime) {jindexsets[i].indexes[j].numCards.total.ingUntilNow += 1;}
          if (needStudyTime < todayMidnight) {jindexsets[i].indexes[j].numCards.total.ingUntilToday += 1;}            
          if (needStudyTime >= todayMidnight) {jindexsets[i].indexes[j].numCards.total.ingAfterTomorrow += 1;}
          
          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].ingTotal += 1;          
          if (needStudyTime < currentTime) {jindexsets[i].indexes[j].numCards[cardtype].ingUntilNow += 1;}
          if (needStudyTime < todayMidnight) {jindexsets[i].indexes[j].numCards[cardtype].ingUntilToday += 1;}
          if (needStudyTime >= todayMidnight) {jindexsets[i].indexes[j].numCards[cardtype].ingAfterTomorrow += 1;}          
        }
      }      
      for (const cardtype of ["total", "read", "flip"]) {
        if(jindexsets[i].indexes[j].numCards[cardtype].total != 0){
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel /=jindexsets[i].indexes[j].numCards[cardtype].total;
        }
      }
    }
  }
  console.log('종료', jindexsets)
  return jindexsets
}


export const getNumCardsAppliedAdvancedFilter = async ({indexsets, cardsets, sessionConfig}) => {

  const jindexsets =_.cloneDeep(indexsets)

  for (let i=0; i<jindexsets.length; i++){
    for (let j=0; j<jindexsets[i].indexes.length; j++){
      const {advancedFilter} = sessionConfig
      const cardsetPosition = cardsets.findIndex(cardset => cardset.cardset_info.index_id == jindexsets[i].indexes[j]._id)      

      const currentTime = new Date();      
      let todayMidnight = new Date();
      todayMidnight.setDate(todayMidnight.getDate() + 1);
      todayMidnight.setHours(0, 0, 0, 0);

      for (let k=0; k<cardsets[cardsetPosition].cards.length; k++){        
        if (!["flip", "read"].includes(cardsets[cardsetPosition].cards[k].card_info.cardtype)) {break};                   
        // if (sessionConfig.)


        if (advancedFilter == null) {
          if ((advancedFilter.userFlag.onOff = "on")) {
            if (!advancedFilter.userFlag.value.includes(cardsets[cardsetPosition].cards[k].content.userFlag.value)) {break;}
          }
          if ((advancedFilter.makerFlag.onOff = "on")) {
            if (!advancedFilter.makerFlag.value.includes(cardsets[cardsetPosition].cards[k].content.makerFlag)) {break;}
          }
          if ((advancedFilter.recentStudyTime.onOff = "on")) {
            const timePosition = (cardsets[cardsetPosition].cards[k].studyStatus.recentStudyTime-todayMidnight)/24/3600
            if (timePosition <advancedFilter.recentStudyTime.value[0] || timePosition > advancedFilter.recentStudyTime.value[1]){break;}            
          }
          if ((advancedFilter.level.onOff = "on")) {  
            const levelCurrent = cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent          
            if (levelCurrent <advancedFilter.level.value[0] || timePosition > levelCurrent.level.value[1]){break;}            
          }
          if ((advancedFilter.studyTimes.onOff = "on")) {  
            const totalStudyTimes = cardsets[cardsetPosition].cards[k].studyStatus.totalStudyTimes          
            if (totalStudyTimes <advancedFilter.studyTimes.value[0] || totalStudyTimes > levelCurrent.studyTimes.value[1]){break;}            
          }
          if ((advancedFilter.recentDifficulty.onOff = "on")) {
            if (!advancedFilter.recentDifficulty.value.includes(cardsets[cardsetPosition].cards[k].studyStatus.recentStudyResult)) {break;}
          }
          if ((advancedFilter.examResult.onOff = "on")) {
            if (!advancedFilter.examResult.value.includes(cardsets[cardsetPosition].cards[k].studyStatus.recentExamResult)) {break;}
          }
        }

        const status = cardsets[cardsetPosition].cards[k].studyStatus.statusCurrent;
        const cardtype = cardsets[cardsetPosition].cards[k].card_info.cardtype;
        const needStudyTime = cardsets[cardsetPosition].cards[k].studyStatus.needStudyTime;

        // 카드수를 셉니다.
        if (['yet', 'hold', 'completed'].includes(status)) {
          jindexsets[i].indexes[j].numCards.total.averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total[status] += 1;

          jindexsets[i].indexes[j].numCards[cardtype].averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype][status] += 1;
        } else if (['ing'].includes(status)){
          jindexsets[i].indexes[j].numCards.total.averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards.total.total += 1;
          jindexsets[i].indexes[j].numCards.total.ingTotal += 1;
          if (needStudyTime < current_time) {jindexsets[i].indexes[j].numCards.total.ingUntilNow += 1;}
          if (needStudyTime < todayMidnight) {jindexsets[i].indexes[j].numCards.total.ingUntilToday += 1;}            
          if (needStudyTime >= todayMidnight) {jindexsets[i].indexes[j].numCards.total.ingAfterTomorrow += 1;}
          
          jindexsets[i].indexes[j].numCards[cardtype].total += 1;
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel += cardsets[cardsetPosition].cards[k].studyStatus.levelCurrent;
          jindexsets[i].indexes[j].numCards[cardtype].ingTotal += 1;          
          if (needStudyTime < current_time) {jindexsets[i].indexes[j].numCards[cardtype].ingUntilNow += 1;}
          if (needStudyTime < todayMidnight) {jindexsets[i].indexes[j].numCards[cardtype].ingUntilToday += 1;}
          if (needStudyTime >= todayMidnight) {jindexsets[i].indexes[j].numCards[cardtype].ingAfterTomorrow += 1;}          
        }
      }      
      for (const cardtype of ["total", "read", "flip"]) {
        if(jindexsets[i].indexes[j].numCards[cardtype].total != 0){
          jindexsets[i].indexes[j].numCards[cardtype].averageLevel /=jindexsets[i].indexes[j].numCards[cardtype].total;
        }
      }
    }
  }
  console.log('종료', jindexsets)
  return jindexsets
}