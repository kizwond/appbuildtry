const {calculateNextLevelAndNeedStudyTime} = require('./FlipContainerSub2.js')

const calculateKnowCase = (selection, current_card_info_index, timer, levelConfigs) => {  
  
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  if (card_details_session[current_card_info_index].studyStatus.recentStudyResult == 'diffi5'){
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(timer);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 1;    
  } else {
    if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
      card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
    } // null이면 첫 학습이므로 상관없음
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  }

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = 'ing';
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  
  card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.recentStudyHour = new Date(timer);
  card_details_session[current_card_info_index].studyStatus.totalStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStudyHour) + timer);
  console.log('card_details_session[current_card_info_index].studyStatus.totalStudyTimes', card_details_session[current_card_info_index].studyStatus.totalStudyTimes)
  card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  card_details_session[current_card_info_index].studyStatus.studyTimesInSession += 1;
  
  
  let {levelCurrent, recentKnowTime,currentLevElapsedTime, currentLevStudyTimes}=card_details_session[current_card_info_index].studyStatus
  let {newLevel, needStudyTime} = calculateNextLevelAndNeedStudyTime(levelCurrent, recentKnowTime,currentLevElapsedTime, currentLevStudyTimes, levelConfigs)  
  console.log('정상적으로 생성됐나?', newLevel, needStudyTime)  
  card_details_session[current_card_info_index].studyStatus.levelCurrent = newLevel
  card_details_session[current_card_info_index].studyStatus.recentKnowTime = now
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null;
  
  return card_details_session;
};

const calculateNormalStudy = (interval, selection, current_card_info_index, timer) => {
  console.log('냐하하하하', current_card_info_index)
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  if (card_details_session[current_card_info_index].studyStatus.recentStudyResult == 'diffi5'){
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(timer);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 1;    
  } else {
    if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
      card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
    } // null이면 첫 학습이므로 상관없음
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  }

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
    
  const needStudyTime = new Date(Date.now() + interval * 60000)  
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null;

  return card_details_session;
};



const calculatePassMoveFinish = (selection, current_card_info_index, timer) => {
  console.log('냐하하하하', current_card_info_index)
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);

  return card_details_session;
};



const calculateHoldCompleted = (selection, current_card_info_index, timer) => {
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = selection;
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);

  if (selection == 'completed'){
    // 레벨을 바꿔줄 필요가 있습니다. 없나요?
  }
  
  return card_details_session;
};

const calculateRestore = (selection, current_card_info_index, timer) => {
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = 'ing';
  
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  
  card_details_session[current_card_info_index].studyStatus.needStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = now;
  
  return card_details_session;
};


exports.calculateStudyStatus = (interval, selection, current_card_info_index, timer, levelConfigs) => {  
  console.log('selection', selection)
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
    case "completed":
      card_details_session = calculateHoldCompleted(selection, current_card_info_index, timer);
    case "restore":
      card_details_session = calculateRestore(selection, current_card_info_index, timer);
      break;
    case "pass":
    case "move":
    case "finish":
        card_details_session = calculatePassMoveFinish(selection, current_card_info_index, timer);
      break;
  }

  return card_details_session;
};
