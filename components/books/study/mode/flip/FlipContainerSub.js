const {calculateNeedStudyTime} = require('./FlipContainerSub2.js')

const calculatePassMoveFinish = (interval, selection, current_card_info_index, timer) => {

  const now = new Date();
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  
  //학습정보 업데이트
  card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  
  // card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  // card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  // card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  
  // if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
  //   card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
  // }
  // card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer);
  // card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  
  // const needStudyTime = new Date(Date.now() + interval * 60000)
  // card_details_session[current_card_info_index].studyStatus.levelCurrent
  // card_details_session[current_card_info_index].studyStatus.recentKnowTime
  // card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  // card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = needStudyTime;
  
  // card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  // card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
  
  // card_details_session[current_card_info_index].studyStatus.studyTimesInSession += 1;  
  return card_details_session;
};

const calculateNormalStudy = (interval, selection, current_card_info_index, timer) => {
  
  const now = new Date();  
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  
  //학습정보 업데이트
  card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);

  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  
  card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  
  if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
  }
  card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer);
  card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  
  const needStudyTime = new Date(Date.now() + interval * 60000)
  card_details_session[current_card_info_index].studyStatus.levelCurrent
  card_details_session[current_card_info_index].studyStatus.recentKnowTime
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = needStudyTime;
  
  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
  
  card_details_session[current_card_info_index].studyStatus.studyTimesInSession += 1;

  return card_details_session;
};

const calculateKnowCase = (selection, current_card_info_index, timer, levelConfigs) => {  
  // if (timer > 10000) {
  //   timer = timer / 1000;
  // } else {
  //   timer = 10000 / 1000;
  // }
  const now = new Date();
  // const now_mili_convert = Date.parse(now);
  const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
  console.log("card_details_session", card_details_session);

  card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);

  card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;  
  card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  
  card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  card_details_session[current_card_info_index].studyStatus.totalStudyTimes += 1;
  
  if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date(new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime);
  }
  card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer);
  card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes += 1;
  
  const {recentKnowTime,currentLevElapsedTime, currentLevStudyTimes}=card_details_session[current_card_info_index].studyStatus
  const {levelCurrent, needStudyTime} = calculateNeedStudyTime(recentKnowTime,currentLevElapsedTime, currentLevStudyTimes, levelConfigs)  
  console.log('정상적으로 생성됐나?', levelCurrent, needStudyTime)
  card_details_session[current_card_info_index].studyStatus.levelCurrent = levelCurrent
  card_details_session[current_card_info_index].studyStatus.recentKnowTime = now
  card_details_session[current_card_info_index].studyStatus.needStudyTime = needStudyTime;
  card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null;
  // 일단 커런트레벨 관련 변수를 리셋해보자
  card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = new Date(0)
  card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(0)
  card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 0
  // 리셋 완료
  
  card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
  
  card_details_session[current_card_info_index].studyStatus.studyTimesInSession += 1;





  // if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
  //   console.log(now_mili_convert);
  //   console.log(Date.parse(card_details_session[current_card_info_index].studyStatus.recentKnowTime));
  //   card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = new Date(
  //     now_mili_convert - Date.parse(card_details_session[current_card_info_index].studyStatus.recentKnowTime)
  //   );
  // } else {
  //   card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = null;
  // }
  // if (card_details_session[current_card_info_index].studyStatus.currentLevStudyHour !== null) {
  //   card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(
  //     Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer
  //   );
  // }

  // card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes + 1;

  // if (card_details_session[current_card_info_index].studyStatus.recentKnowTime === null) {
  //   //첫 know 처리
  //   const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
  //   const h_s = Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour / 1000);
  //   const s = levelConfigs.restudy.levelchangeSensitivity;
  //   const r_restudy = levelConfigs.restudy.restudyRatio;
  //   const w_firstknow = 20;
  //   const t_now = Date.parse(now) / 1000;
  //   console.log(timer, n_s, h_s);
  //   var l_apply = s * w_firstknow * (1 / (n_s * Math.log(h_s)));
  //   var t_next = t_now + ((5400 * Math.pow(2, l_apply - 1)) / Math.log(0.8)) * Math.log(r_restudy);
  //   var t_next_to_date = new Date(t_next * 1000);
  //   console.log("t_next : ", t_next);
  //   console.log("l_apply : ", l_apply);
  //   console.log("첫 know 처리 ", t_next_to_date);
  //   //첫 know 처리
  // } else {
  //   //복습주기 로직
  //   const a_r = -0.275;
  //   const b_r = 1.1242;
  //   const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
  //   const h_s = Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour / 1000);
  //   const h_e = Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime / 1000);
  //   const s = levelConfigs.restudy.levelchangeSensitivity;
  //   const l_prev = card_details_session[current_card_info_index].studyStatus.levelCurrent;
  //   const r_restudy = levelConfigs.restudy.restudyRatio;
  //   const t_now = Date.parse(now) / 1000;
  //   const r_0 = a_r * Math.log(n_s * Math.log(h_s)) + b_r;
  //   const l_theo = Math.log((Math.log(0.8) * h_e) / (5400 * Math.log(r_0))) / Math.log(2) + 1;
  //   var l_apply = l_prev + s * (l_theo - l_prev);
  //   var t_next = t_now + ((5400 * Math.pow(2, l_apply - 1)) / Math.log(0.8)) * Math.log(r_restudy);
  //   console.log("복습주기 로직", t_next);
  //   //복습주기 로직
  // }

  // card_details_session[current_card_info_index].studyStatus.levelOriginal = card_details_session[current_card_info_index].studyStatus.levelCurrent;
  // card_details_session[current_card_info_index].studyStatus.levelCurrent = Number(l_apply.toFixed());
  // card_details_session[current_card_info_index].studyStatus.needStudyTime = new Date(t_next * 1000);
  // card_details_session[current_card_info_index].studyStatus.recentKnowTime = now;
  // card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
  // card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
  // card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
  // card_details_session[current_card_info_index].studyStatus.recentStudyResult = selection;
  // card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
  // // card_details_session[current_card_info_index].studyStatus.retentionRate =
  // card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  // card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
  // card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
  // card_details_session[current_card_info_index].studyStatus.studyTimesInSession = card_details_session[current_card_info_index].studyStatus.studyTimesInSession + 1;
  // if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
  //   card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
  // } else {
  //   card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer);
  // }
  // card_details_session[current_card_info_index].studyStatus.totalStudyTimes = card_details_session[current_card_info_index].studyStatus.totalStudyTimes + 1;

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
