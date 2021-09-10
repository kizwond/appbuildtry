import React, { useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";
import { GetLevelConfig, UpdateResults } from "../../../../../graphql/query/session";
import Timer from "./Timer";

const CardContainer = ({ cardListStudying, sessionScope }) => {
  //timer related
  const [timer, setTimer] = useState(0);
  const [timerTotal, setTimerTotal] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [isActiveTotal, setIsActiveTotal] = useState(false);
  const [isPausedTotal, setIsPausedTotal] = useState(false);

  const increment = useRef(null);
  const incrementTotal = useRef(null);

  const handleStart = useCallback(async () => {
    setIsActive(true);
    setIsPaused(true);
    increment.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
    incrementTotal.current = setInterval(() => {
      setTimerTotal((timerTotal) => timerTotal + 1);
    }, 1000);
  }, []);

  const handlePause = useCallback(async () => {
    clearInterval(increment.current);
    clearInterval(incrementTotal.current);
    setIsPaused(false);
  }, []);

  const handleResume = useCallback(async () => {
    setIsPaused(true);
    handleStart();
  }, [handleStart]);

  const formatTime = () => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const minutes = `${Math.floor(timer / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const formatTimeTotal = () => {
    const getSeconds = `0${timerTotal % 60}`.slice(-2);
    const minutes = `${Math.floor(timerTotal / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(timerTotal / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };
  //timer related END!!!

  const [cards, setCards] = useState();
  const [levelconfigs, setLevelconfigs] = useState();
  const [diffis, setDiffis] = useState();
  const [face1Contents, setFace1Contents] = useState("");
  const [face2Contents, setFace2Contents] = useState("");
  const [getData, { loading, error, data }] = useLazyQuery(GetContents, {
    onCompleted: onCompletedGetContents,
  });

  const [getLevelConfig, { loading: loading1, error: error1, data: data1 }] = useLazyQuery(GetLevelConfig, {
    onCompleted: onCompletedGetLevelConfig,
  });

  useEffect(() => {
    console.log("here---------------------------------------------------");
    console.log(cardListStudying);
    if (cardListStudying) {
      console.log(cardListStudying);

      var value = cardListStudying.map((item) => {
        console.log(item);
        return { location: item.contents.location, mycontents_id: item.contents.mycontents_id, buycontents_id: item.contents.buycontents_id };
      });
      console.log(value);

      getData({ variables: { forGetContents: value } });
    }
    if (sessionScope) {
      console.log(sessionScope);

      var value = sessionScope.map((item) => {
        console.log(item.mybook_id);
        return item.mybook_id;
      });
      console.log(value);

      getLevelConfig({ variables: { mybook_ids: value } });
    }
  }, [cardListStudying, getData, sessionScope, getLevelConfig]);

  function onCompletedGetContents() {
    console.log(data);
    setCards(data.session_getContents.contents);
  }

  function onCompletedGetLevelConfig() {
    console.log("data1", data1);
    setLevelconfigs(data1.levelconfig_getLevelconfigs.levelconfigs);
  }
  const cardShow = useCallback(async () => {
    if (cards) {
      const card_seq = sessionStorage.getItem("card_seq");
      console.log(card_seq);
      console.log(cards);
      const current_card = cards[card_seq];

      const face1 = current_card.face1.map((item) => (
        <>
          <div>{item}</div>
        </>
      ));
      const face2 = current_card.face2.map((item) => (
        <>
          <div>{item}</div>
        </>
      ));
      var face1_contents = <div>{face1}</div>;
      var face2_contents = <div>{face2}</div>;
      setFace1Contents(face1_contents);
      setFace2Contents(face2_contents);
    }
    if (levelconfigs) {
      const card_seq = sessionStorage.getItem("card_seq");
      console.log("sssssssssssssssssssssss", cards);
      const current_card_book_id = cardListStudying[card_seq].card_info.mybook_id;
      const current_card_id = cardListStudying[card_seq].contents.mycontents_id;
      console.log("current_card_book_id------------->", current_card_book_id);
      console.log("levelconfigs", levelconfigs);
      console.log(levelconfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id));
      const current_card_levelconfig = levelconfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);
      const levelconfig_option = current_card_levelconfig[0].restudy.option;
      const diffi1 = levelconfig_option.diffi1;
      const diffi2 = levelconfig_option.diffi2;
      const diffi3 = levelconfig_option.diffi3;
      const diffi4 = levelconfig_option.diffi4;
      const diffi5 = levelconfig_option.diffi5;
      const diffi = [];
      diffi.push(diffi1, diffi2, diffi3, diffi4, diffi5);
      console.log("diffi", diffi);
      const useDiffi = diffi.filter((item) => item.on_off === "on");
      console.log(useDiffi);
      const diffiButtons = useDiffi.map((item) => (
        <>
          <button onClick={() => onDiffClickHandler(item.period, item.name, current_card_id)}>{item.nick}</button>
        </>
      ));
      setDiffis(diffiButtons);
    }
  }, [cards, levelconfigs, cardListStudying, onDiffClickHandler]);

  const milliseconds = (h, m, s) => (h * 60 * 60 + m * 60 + s) * 1000;

  const onDiffClickHandler = useCallback(
    async (interval, diffi, current_card_id) => {
      if (diffi === "diffi5") {
        handlePause()
        sessionKnowHandler(interval, diffi, current_card_id);
      } else {
        const now = new Date();
        const now_mili_convert = Date.parse(now);
        const result = milliseconds(0, interval, 0);
        const need_review_time = now_mili_convert + result;
        const review_date = new Date(need_review_time);
        console.log(interval);
        const card_seq = sessionStorage.getItem("card_seq");
        sessionStorage.setItem("card_seq", Number(card_seq) + 1);
        const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
        console.log("card_details_session", card_details_session);

        const current_card_info_index = card_details_session.findIndex((item) => item.contents.mycontents_id === current_card_id);
        console.log(current_card_info_index);
        //여기에 세션스토리지에 학습결과 저장하는 코드 들어가야함.

        // currentLevElapsedTime; // 지금시간 - recent know time(null이면 null로) recentStudyResult === diffi5 => reset
        // currentLevStudyHour //해당카드 누적 학습시간(diffi5 시 리셋) recentStudyResult === diffi5 => reset
        // currentLevStudyTimes // + 1 recentStudyResult === diffi5 => reset
        // levelCurrent //
        // levelOriginal //
        // needStudyTime //
        // recentExamResult //
        // recentExamTime //
        // recentKnowTime //
        // recentSelectTime // 현재시각
        // recentSelection // diffi
        // recentStayHour // timer
        // recentStudyResult // diffi
        // recentStudyTime //현재시각
        // retentionRate //
        // statusCurrent  // yet => ing
        // statusOriginal  //
        // statusPrev  // ing => hold => ing
        // studyTimesInSession // +1
        // totalExamTimes //
        // totalStayHour // 누적
        // totalStudyTimes // +1
        // userFlagOriginal //
        // userFlagPrev //

        //여기에 세션스토리지에 학습결과 저장하는 코드 들어가야함.

        //학습정보 업데이트
        card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = "";
        card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = "";
        card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes + 1;
        // card_details_session[current_card_info_index].studyStatus.levelCurrent =
        // card_details_session[current_card_info_index].studyStatus.levelOriginal =
        // card_details_session[current_card_info_index].studyStatus.needStudyTime =
        // card_details_session[current_card_info_index].studyStatus.recentExamResult =
        // card_details_session[current_card_info_index].studyStatus.recentExamTime =
        // card_details_session[current_card_info_index].studyStatus.recentKnowTime =
        card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
        card_details_session[current_card_info_index].studyStatus.recentSelection = diffi;
        card_details_session[current_card_info_index].studyStatus.recentStayHour = String(timer);
        card_details_session[current_card_info_index].studyStatus.recentStudyResult = diffi;
        card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
        // card_details_session[current_card_info_index].studyStatus.retentionRate =
        card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
        // card_details_session[current_card_info_index].studyStatus.statusOriginal =
        // card_details_session[current_card_info_index].studyStatus.statusPrev =
        card_details_session[current_card_info_index].studyStatus.studyTimesInSession = card_details_session[current_card_info_index].studyStatus.studyTimesInSession + 1;
        // card_details_session[current_card_info_index].studyStatus.totalExamTimes =
        card_details_session[current_card_info_index].studyStatus.totalStayHour = String(card_details_session[current_card_info_index].studyStatus.totalStayHour + timer);
        card_details_session[current_card_info_index].studyStatus.totalStudyTimes = card_details_session[current_card_info_index].studyStatus.totalStudyTimes + 1;

        console.log(card_details_session);

        //업데이트된 학습정보 세션스토리지에 다시 저장
        sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

        //서버에 보내기 위한 학습정보 리스트 생성
        const updateThis = card_details_session[current_card_info_index];
        const getUpdateThis = JSON.parse(sessionStorage.getItem("cardlist_to_send"));

        if (getUpdateThis) {
          var finalUpdate = getUpdateThis.concat(updateThis);
        } else {
          finalUpdate = [updateThis];
        }

        sessionStorage.setItem("cardlist_to_send", JSON.stringify(finalUpdate));
        const cardlist_to_send = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
        console.log("cardlist_to_send", cardlist_to_send);
        //===================================
        if (card_details_session.length - 1 == Number(card_seq)) {
          console.log("공부끝");
          finishStudy();
        } else {
          console.log(card_details_session.length - 1, "======", Number(card_seq));
          console.log("아직 안끝");
          cardShow();
          setTimer(0);
        }
      }
    },
    [cardShow, timer]
  );

  const finishStudy = async () => {
    alert("학습할 카드가 없습니다. 학습결과 화면으로 이동합니다.");
    const cardlist_to_send = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
    if (cardlist_to_send) {
      console.log("서버에 학습데이타를 전송할 시간이다!!!!");
      sessionStorage.setItem("card_seq", 0);
      const sessionId = sessionStorage.getItem("session_Id");
      cardlist_to_send.forEach(function (v) {
        delete v.__typename;
      });
      cardlist_to_send.forEach(function (v) {
        delete v.card_info.__typename;
      });
      cardlist_to_send.forEach(function (v) {
        delete v.contents.__typename;
      });
      cardlist_to_send.forEach(function (v) {
        delete v.studyStatus.__typename;
      });
      console.log("cardlist_to_send : ", cardlist_to_send);
      console.log("sessionId : ", sessionId);
      console.log(typeof sessionId);
      sessionupdateresults(cardlist_to_send, sessionId);
    } else {
      console.log("공부끝");
    }
  };
  useEffect(() => {
    cardShow();
  }, [cardShow]);

  useEffect(() => {
    handleStart();
  }, [handleStart]);

  const [session_updateResults] = useMutation(UpdateResults, { onCompleted: showdataposition });

  function showdataposition(data) {
    console.log("data", data);
  }

  async function sessionupdateresults(cardlist_to_send, sessionId) {
    try {
      await session_updateResults({
        variables: {
          forUpdateResults: {
            session_id: sessionId,
            studyResults: cardlist_to_send,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const updateResults = () => {
    console.log("update results fired!!");
    // const result = sessionStorage.getItem("result")
    // sessionupdateresults(result);
  };

  const sessionKnowHandler = (interval, diffi, current_card_id) => {
    console.log("diffi5 clicked!!!");
    console.log("timer:",timer)
    const now = new Date();
    const now_mili_convert = Date.parse(now);
    // const result = milliseconds(0, interval, 0);
    // const need_review_time = now_mili_convert + result;
    // const review_date = new Date(need_review_time);
    // console.log(interval);
    const card_seq = sessionStorage.getItem("card_seq");
    sessionStorage.setItem("card_seq", Number(card_seq) + 1);
    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    console.log("card_details_session", card_details_session);
    

    const current_card_info_index = card_details_session.findIndex((item) => item.contents.mycontents_id === current_card_id);
    console.log(current_card_info_index);


    const current_card_book_id = card_details_session[current_card_info_index].card_info.mybook_id;
    const current_card_levelconfig = levelconfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);


    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime =
      (now_mili_convert - Date.parse(card_details_session[current_card_info_index].studyStatus.recentKnowTime)) / 1000;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = card_details_session[current_card_info_index].studyStatus.currentLevStudyHour + timer;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes + 1;

    if(card_details_session[current_card_info_index].studyStatus.recentKnowTime === null){
      //첫 know 처리 
      const a_r = -0.275;
      const b_r = 1.1242;
      const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
      const h_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyHour;
      const h_e = card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime;
      const s = current_card_levelconfig[0].restudy.levelchangeSensitivity;
      const l_prev = card_details_session[current_card_info_index].studyStatus.levelCurrent;
      const r_restudy = current_card_levelconfig[0].restudy.restudyRatio;
      const r_0 = a_r*Math.log(n_s * Math.log(h_s)) + b_r;
      const w_firstknow = 20;
      const t_now =  Date.parse(now)/1000;
      // const l_theo = Math.log((Math.log(0.8) * h_e) / (5400 * Math.log(r_0))) / Math.log(2) + 1;
      console.log(timer, n_s, h_s)
      var l_apply = s*w_firstknow*(1/(n_s*Math.log(h_s)))
      var t_next = t_now + ((5400 * Math.pow(2, l_apply - 1)) / Math.log(0.8)) * Math.log(r_restudy);
      var t_next_to_date = new Date(t_next*1000);
      console.log(l_apply)
      console.log("첫 know 처리 ",t_next_to_date);
      //첫 know 처리 
    } else{
      //복습주기 로직
      const a_r = -0.275;
      const b_r = 1.1242;
      const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
      const h_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyHour;
      const h_e = card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime;
      const s = current_card_levelconfig[0].restudy.levelchangeSensitivity;
      const l_prev = card_details_session[current_card_info_index].studyStatus.levelCurrent;
      const r_restudy = current_card_levelconfig[0].restudy.restudyRatio;
      const t_now =  Date.parse(now)/1000;
      const r_0 = a_r*Math.log(n_s * Math.log(h_s)) + b_r;
      const l_theo = Math.log((Math.log(0.8) * h_e) / (5400 * Math.log(r_0))) / Math.log(2) + 1;
      var l_apply = l_prev + s*(l_theo - l_prev);
      var t_next = t_now + ((5400 * Math.pow(2, l_apply - 1)) / Math.log(0.8)) * Math.log(r_restudy);
      console.log("복습주기 로직",t_next);
      //복습주기 로직
    }
    


    card_details_session[current_card_info_index].studyStatus.levelOriginal = card_details_session[current_card_info_index].studyStatus.levelCurrent;
    card_details_session[current_card_info_index].studyStatus.levelCurrent = l_apply;
    card_details_session[current_card_info_index].studyStatus.needStudyTime = new Date(t_next*1000);
    // card_details_session[current_card_info_index].studyStatus.recentExamResult =
    // card_details_session[current_card_info_index].studyStatus.recentExamTime =
    card_details_session[current_card_info_index].studyStatus.recentKnowTime = now;
    card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
    card_details_session[current_card_info_index].studyStatus.recentSelection = diffi;
    card_details_session[current_card_info_index].studyStatus.recentStayHour = String(timer);
    card_details_session[current_card_info_index].studyStatus.recentStudyResult = diffi;
    card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
    // card_details_session[current_card_info_index].studyStatus.retentionRate =
    card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
    // card_details_session[current_card_info_index].studyStatus.statusOriginal =
    // card_details_session[current_card_info_index].studyStatus.statusPrev =
    card_details_session[current_card_info_index].studyStatus.studyTimesInSession = card_details_session[current_card_info_index].studyStatus.studyTimesInSession + 1;
    // card_details_session[current_card_info_index].studyStatus.totalExamTimes =
    card_details_session[current_card_info_index].studyStatus.totalStayHour = String(card_details_session[current_card_info_index].studyStatus.totalStayHour + timer);
    card_details_session[current_card_info_index].studyStatus.totalStudyTimes = card_details_session[current_card_info_index].studyStatus.totalStudyTimes + 1;

    console.log(card_details_session);

    //서버에 보내기 위한 학습정보 리스트 생성
    const updateThis = card_details_session[current_card_info_index];
    const getUpdateThis = JSON.parse(sessionStorage.getItem("cardlist_to_send"));

    if (getUpdateThis) {
      var finalUpdate = getUpdateThis.concat(updateThis);
    } else {
      finalUpdate = [updateThis];
    }
    sessionStorage.setItem("cardlist_to_send", JSON.stringify(finalUpdate));
    const cardlist_to_send = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
    console.log("cardlist_to_send", cardlist_to_send);
    //업데이트된 학습정보 세션스토리지에 다시 저장
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = null
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = null
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 0
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));
  };

  return (
    <>
      <Timer
        isActive={isActive}
        isPaused={isPaused}
        formatTime={formatTime}
        formatTimeTotal={formatTimeTotal}
        handleStart={handleStart}
        handlePause={handlePause}
        handleResume={handleResume}
      />
      <div style={{ marginTop: "50px", margin: "auto", width: "600px", height: "500px", border: "1px solid grey" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", height: "80%", alignItems: "center", justifyContent: "center" }}>
            <div>face1: {face1Contents}</div>
            <div>face2: {face2Contents}</div>
          </div>
          <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-around" }}>{diffis}</div>
        </div>
      </div>
    </>
  );
};

export default CardContainer;
