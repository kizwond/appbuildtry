const {calculateNextLevelAndNeedStudyTime, updateSessionResult} = require('./FlipContainerSub2.js')

const calculateKnowCase = (selection, current_card_info_index, timer, levelConfigs) => {  
  console.log('냐하하하하', selection)

  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  
  // 혹시 몰라서 if 문을 썼습니다. 사실 불필요한 if문입니다.
  if (card_details_session[current_card_info_index].studyStatus.recentKnowTime == null){
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedHour = 60000;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = timer;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 1;
  } else {
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedHour += now - new Date(card_details_session[current_card_info_index].studyStatus.recentKnowTime);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour += timer;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  }
  
  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = 'ing';
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour += timer;
  
  card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.recentStudyHour = timer;  
  card_details_session[current_card_info_index].studyStatus.totalStudyHour += timer;
  card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  card_details_session[current_card_info_index].studyStatus.studyHourInSession += timer;
  
  card_details_session[current_card_info_index].studyStatus.clickTimesInSession += 1;
  
  let {levelCurrent, recentKnowTime,currentLevElapsedHour, currentLevStudyTimes}=card_details_session[current_card_info_index].studyStatus
  let {newLevel, needStudyTime} = calculateNextLevelAndNeedStudyTime(levelCurrent, recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs)  
  card_details_session[current_card_info_index].studyStatus.levelCurrent = newLevel
  card_details_session[current_card_info_index].studyStatus.recentKnowTime = now
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null;
  
  card_details_session[current_card_info_index].studyStatus.isUpdated = true;

  const dataForRegression = JSON.parse(sessionStorage.getItem("dataForRegression"));
  dataForRegression.push({
    buybook_id : card_details_session[current_card_info_index].card_info.buybook_id,
    totalStudyTimes : card_details_session[current_card_info_index].studyStatus.totalStudyTimes,
    levelOriginal : card_details_session[current_card_info_index].studyStatus.levelOriginal,
    currentLevStudyTimes  : card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes,
    currentLevStudyHour  : card_details_session[current_card_info_index].studyStatus.currentLevStudyHour,
    currentLevElapsedHour : card_details_session[current_card_info_index].studyStatus.currentLevElapsedHour,
    levelCurrent : card_details_session[current_card_info_index].studyStatus.levelCurrent,
  })
  sessionStorage.setItem("dataForRegression", JSON.stringify(dataForRegression))

  //커런트 관련 변수를 리셋함
  card_details_session[current_card_info_index].studyStatus.currentLevElapsedHour = 0;
  card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = 0;
  card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 0;


  updateSessionResult(card_details_session[current_card_info_index])
  

  return card_details_session;
};

const calculateNormalStudy = (interval, selection, current_card_info_index, timer) => {
  console.log('냐하하하하', selection)
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  if (card_details_session[current_card_info_index].studyStatus.recentKnowTime == null){
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedHour = 60000;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = timer;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 1;
  } else {
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedHour += now - new Date(card_details_session[current_card_info_index].studyStatus.recentKnowTime);
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour += timer;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  }

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = 'ing';
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour +=  timer;
  
  card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.recentStudyHour = timer;
  card_details_session[current_card_info_index].studyStatus.totalStudyHour += timer;
  card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  card_details_session[current_card_info_index].studyStatus.studyHourInSession += timer;
  
  card_details_session[current_card_info_index].studyStatus.clickTimesInSession += 1;

  const needStudyTime = new Date(Date.now() + interval * 60000)  
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = needStudyTime;

  card_details_session[current_card_info_index].studyStatus.isUpdated = true;
  updateSessionResult(card_details_session[current_card_info_index])

  return card_details_session;
};



const calculateHoldCompleted = (selection, current_card_info_index, timer) => {
  console.log('냐하하하하', selection)
  // 기존 레벨은 남겨둔다.
  // 복습 필요시점은 null로 바꿔준다.
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = selection;
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour += timer;

  card_details_session[current_card_info_index].studyStatus.needStudyTime = null
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null

  card_details_session[current_card_info_index].studyStatus.studyHourInSession += timer;

  card_details_session[current_card_info_index].studyStatus.clickTimesInSession += 1;

  card_details_session[current_card_info_index].studyStatus.isUpdated = true;
  updateSessionResult(card_details_session[current_card_info_index])
  console.log("here why?")
  return card_details_session;
};

const calculateRestore = (selection, current_card_info_index, timer) => {
  console.log('냐하하하하', selection)
  // 원복시킬때, 기존의 상태(status, 레벨)로 돌리는 대신
  // 복습 필요시점은 현재로 바꿔준다. (null값일 것임)
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));

  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  if (card_details_session[current_card_info_index].studyStatus.recentStudyResult == null){
    card_details_session[current_card_info_index].studyStatus.statusCurrent = 'yet';
  } else {
    card_details_session[current_card_info_index].studyStatus.statusCurrent = 'ing';    
  }
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour += timer;
  
  card_details_session[current_card_info_index].studyStatus.needStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = now;

  card_details_session[current_card_info_index].studyStatus.studyHourInSession += timer;  

  card_details_session[current_card_info_index].studyStatus.clickTimesInSession += 1;

  card_details_session[current_card_info_index].studyStatus.isUpdated = true;
  updateSessionResult(card_details_session[current_card_info_index])
  
  return card_details_session;
};


const calculatePassMoveFinish = (selection, current_card_info_index, timer) => {
  console.log('냐하하하하', selection)
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour += timer;

  card_details_session[current_card_info_index].studyStatus.studyHourInSession += timer;

  card_details_session[current_card_info_index].studyStatus.isUpdated = true;
  updateSessionResult(card_details_session[current_card_info_index])

  return card_details_session;
};

const estimateLevelAndNeedStudyTime = (selection, current_card_info_index, timer, levelConfigs) => {
  console.log('냐하하하하', selection)

  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  
  const currentLevElapsedHour = card_details_session[current_card_info_index].studyStatus.currentLevElapsedHour + (now - new Date(card_details_session[current_card_info_index].studyStatus.recentKnowTime));
  const currentLevStudyTimes = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes + 1;

  let {levelCurrent, recentKnowTime}=card_details_session[current_card_info_index].studyStatus
  let {needStudyTimeGap} = calculateNextLevelAndNeedStudyTime(levelCurrent, recentKnowTime,currentLevElapsedHour, currentLevStudyTimes, levelConfigs)  

  return {needStudyTimeGap};
};


const modifyToDiffi5 = (selection, current_card_info_index, timer) => {
  console.log('고민되네');
  return
};

const modifyToNormalDiffi = (selection, current_card_info_index, timer) => {
  console.log('고민되네');
  return 
};

exports.calculateStudyStatus = (interval, selection, current_card_info_index, timer, levelConfigs) => {  
  console.log('selection', selection)
  switch (selection) {
    case "diffi5":
      card_details_session = calculateKnowCase(selection, current_card_info_index, timer, levelConfigs);
      break;
    case "diffi1":
    case "diffi2":
    case "diffi3":
    case "diffi4":
      card_details_session = calculateNormalStudy(interval, selection, current_card_info_index, timer);
      break;
    case "hold":
    case "completed":
      card_details_session = calculateHoldCompleted(selection, current_card_info_index, timer);
      break;
    case "restore":
      card_details_session = calculateRestore(selection, current_card_info_index, timer);
      break;
    case "pass":
    case "move":
    case "finish":    
      card_details_session = calculatePassMoveFinish(selection, current_card_info_index, timer);
      break;
    case "prediction":    
      card_details_session = estimateLevelAndNeedStudyTime(selection, current_card_info_index, timer, levelConfigs);
      break;
  }

  return card_details_session;
};
