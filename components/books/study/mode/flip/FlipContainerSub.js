const {calculateNextLevelAndNeedStudyTime} = require('./FlipContainerSub2.js')

const calculateKnowCase = (selection, current_card_info_index, timer, levelConfigs) => {  
  
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = 'ing';
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  
  card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.recentStudyHour = new Date(timer);
  card_details_session[current_card_info_index].studyStatus.totalStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStudyHour) + timer);
  card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  card_details_session[current_card_info_index].studyStatus.studyTimesInSession += 1;
  
  if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
  }
  card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer);
  card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  
  let {levelCurrent, recentKnowTime,currentLevElapsedTime, currentLevStudyTimes}=card_details_session[current_card_info_index].studyStatus
  let {newLevel, needStudyTime} = calculateNextLevelAndNeedStudyTime(levelCurrent, recentKnowTime,currentLevElapsedTime, currentLevStudyTimes, levelConfigs)  
  console.log('정상적으로 생성됐나?', newLevel, needStudyTime)  
  card_details_session[current_card_info_index].studyStatus.levelCurrent = newLevel
  card_details_session[current_card_info_index].studyStatus.recentKnowTime = now
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null;

  // 일단 커런트레벨 관련 변수를 리셋해보자
  card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = new Date(0)
  card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(0)
  card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 0
  // 리셋 완료
  
  return card_details_session;
};

const calculateNormalStudy = (interval, selection, current_card_info_index, timer) => {
  
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = 'ing';
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  
  card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.recentStudyHour = new Date(timer);
  card_details_session[current_card_info_index].studyStatus.totalStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStudyHour) + timer);
  card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  card_details_session[current_card_info_index].studyStatus.studyTimesInSession += 1;
  
  if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
  }
  card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer);
  card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
    
  const needStudyTime = new Date(Date.now() + interval * 60000)  
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null;

  return card_details_session;
};



const calculatePassMoveFinish = (interval, selection, current_card_info_index, timer) => {

  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);

  return card_details_session;
};



const calculateHoldCompletedRestore = (selection, current_card_info_index, timer) => {
  const now = new Date();

  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  //학습정보 업데이트
  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = selection;
  card_details_session[current_card_info_index].studyStatus.needStudyTime = null;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
  if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
    card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
  } else {
    card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  }

  return card_details_session;
};

// const calculatePassMoveFinish = (selection, current_card_info_index, timer) => {
//   const now = new Date();

//   const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

//   //학습정보 업데이트
//   card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
//   card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
//   card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
//   if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
//     card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
//   } else {
//     card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
//   }

//   return card_details_session;
// };
exports.calculateStudyStatus = (interval, selection, current_card_info_index, timer, levelConfigs) => {  
  switch (selection) {
    case "diffi1":
    case "diffi2":
    case "diffi3":
    case "diffi4":
      card_details_session = calculateNormalStudy(interval, selection, current_card_info_index, timer);
      break;
    case "diffi5":
      card_details_session = calculateKnowCase(selection, current_card_info_index, timer, levelConfigs);
      break;
    case "hold":
      card_details_session = calculateHoldCompletedRestore(selection, current_card_info_index, timer);
      break;
    case "completed":
      card_details_session = calculateHoldCompletedRestore(selection, current_card_info_index, timer);
      break;
    case "restore":
      card_details_session = calculateHoldCompletedRestore(selection, current_card_info_index, timer);
      break;
    case "pass":
        card_details_session = calculatePassMoveFinish(selection, current_card_info_index, timer);
      break;
    case "move":
        card_details_session = calculatePassMoveFinish(selection, current_card_info_index, timer);
      break;
    case "finish":
        card_details_session = calculatePassMoveFinish(selection, current_card_info_index, timer);
      break;
  }

  return card_details_session;
};
