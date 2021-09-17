import React, { Component, useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";
import { GetLevelConfig, UpdateResults } from "../../../../../graphql/query/session";
import Timer from "./Timer";
import { Avatar, Menu, Dropdown, Modal, Popover, Select, Button } from "antd";
import { UserOutlined, DownOutlined, FlagFilled, SettingOutlined, LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import ProgressBar from "./ProgressBar";
import { GetCardTypeSetByMybookIds } from "../../../../../graphql/query/cardtype";

class Container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      start: 0,
      time_total: 0,
      isOn_total: false,
      start_total: 0,
      average_completed: 0,
      clickCount: 0,
      flag: "white",
      pageStatus: "normal",
      cardlist_studying: [],
      contents: [],
      backContents: [],
      contentsList: [],
      getKnowTime: "",
      confirmOn: "ask",
    };
    this.keyCount = 0;
    this.getKey = this.getKey.bind(this);
  }
  getKey() {
    return this.keyCount++;
  }
  startTimer = () => {
    this.setState({
      isOn: true,
      time: this.state.time,
      start: Date.now() - this.state.time,
    });
    this.timer = setInterval(
      () =>
        this.setState({
          time: Date.now() - this.state.start,
        }),
      1
    );
  };

  startTimerTotal = () => {
    this.setState({
      isOn_total: true,
      time_total: this.state.time_total,
      start_total: Date.now() - this.state.time_total,
    });
    this.timer_total = setInterval(
      () =>
        this.setState({
          time_total: Date.now() - this.state.start_total,
        }),
      1
    );
  };
  stopTimerTotal = () => {
    this.setState({ isOn_total: false });
    clearInterval(this.timer_total);
    clearInterval(this.timer);
  };

  startTimerResume = () => {
    this.startTimer();
    this.startTimerTotal();
  };

  resetTimer = () => {
    this.setState({ time: 0, start: 0 }, function () {
      this.startTimer();
      this.startTimerTotal();
    });
  };

  render() {
    return (
      <>
        <CardContainer
          startTimer={this.startTimer}
          startTimerTotal={this.startTimerTotal}
          stopTimerTotal={this.stopTimerTotal}
          startTimerResume={this.startTimerResume}
          time={this.state.time}
          isOn={this.state.isOn}
          start={this.state.start}
          time_total={this.state.time_total}
          isOn_total={this.state.isOn_total}
          start_total={this.state.start_total}
          timer={this.state.time}
          cardListStudying={this.props.cardListStudying}
          sessionScope={this.props.sessionScope}
        />
      </>
    );
  }
}

const CardContainer = ({
  start_total,
  isOn_total,
  time_total,
  start,
  isOn,
  startTimer,
  startTimerTotal,
  stopTimerTotal,
  startTimerResume,
  time,
  timer,
  cardListStudying,
  sessionScope,
}) => {
  const [cards, setCards] = useState();
  const [levelconfigs, setLevelconfigs] = useState();
  const [diffis, setDiffis] = useState();
  const [face1Contents, setFace1Contents] = useState("");
  const [face2Contents, setFace2Contents] = useState("");
  const [cardTypes, setCardTypes] = useState();
  const [getData, { loading, error, data }] = useLazyQuery(GetContents, {
    onCompleted: onCompletedGetContents,
  });

  const [getLevelConfig, { loading: loading1, error: error1, data: data1 }] = useLazyQuery(GetLevelConfig, {
    onCompleted: onCompletedGetLevelConfig,
  });

  const [cardtypeset_getbymybookids, { loading: loading2, error: error2, data: data2 }] = useLazyQuery(GetCardTypeSetByMybookIds, {
    onCompleted: onCompletedGetCardSet,
  });

  function onCompletedGetCardSet() {
    const cardTypes_temp = data2.cardtypeset_getbymybookids.cardtypesets.map((item) => {
      return item.cardtypes;
    });
    const array_final = []
    cardTypes_temp.map((item) => {
      item.map((cardtype) => array_final.push(cardtype));
    });
    console.log(array_final);
    setCardTypes(array_final)
  }

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
      cardtypeset_getbymybookids({ variables: { mybook_ids: value } });
    }
  }, [cardListStudying, getData, sessionScope, getLevelConfig, cardtypeset_getbymybookids]);

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
      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      
      const current_card = cards[card_seq];
      // console.log(current_card)
      const current_card_id = cards[card_seq]._id
      const current_card_info = card_details_session.filter(item=>item.contents.mycontents_id === current_card_id)
      // console.log(current_card_info)
      const current_card_cardtype_id = current_card_info[0].card_info.cardtype_id;
      // console.log(current_card_cardtype_id)
      if(cardTypes) {
        const current_card_style = cardTypes.filter(item=> item._id === current_card_cardtype_id)
        // console.log(current_card_style)
  
        const face_style = current_card_style[0].face_style
  
        var face_background_color = face_style[0].background_color;
  
        var face_border_top_bordertype = face_style[0].border.top.bordertype;
        var face_border_top_color = face_style[0].border.top.color;
        var face_border_top_thickness = face_style[0].border.top.thickness;
  
        const face_inner_padding_top = face_style[0].inner_padding.top;
        const face_inner_padding_bottom = face_style[0].inner_padding.bottom;
        const face_inner_padding_left = face_style[0].inner_padding.left;
        const face_inner_padding_right = face_style[0].inner_padding.right;
  
        const face_outer_margin_top = face_style[0].outer_margin.top;
        const face_outer_margin_bottom = face_style[0].outer_margin.bottom;
        const face_outer_margin_left = face_style[0].outer_margin.left;
        const face_outer_margin_right = face_style[0].outer_margin.right;
        // console.log("here111111111111111111111111")
      }
      

      const face1 = current_card.face1.map((item) => (
        <>
          <div id="face1">{item}</div>
        </>
      ));
      const face2 = current_card.face2.map((item) => (
        <>
          <div>{item}</div>
        </>
      ));
      var face1_contents = <div style={{backgroundColor:face_background_color, border:`${face_border_top_thickness}px ${face_border_top_bordertype} ${face_border_top_color}`}}>{face1}</div>;
      var face2_contents = <div>{face2}</div>;
      setFace1Contents(face1_contents);
      setFace2Contents(face2_contents);
    }
    if (levelconfigs) {
      const card_seq = sessionStorage.getItem("card_seq");
      const current_card_book_id = cardListStudying[card_seq].card_info.mybook_id;
      const current_card_id = cardListStudying[card_seq].contents.mycontents_id;
      const current_card_levelconfig = levelconfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);
      const levelconfig_option = current_card_levelconfig[0].restudy.option;
      const diffi1 = levelconfig_option.diffi1;
      const diffi2 = levelconfig_option.diffi2;
      const diffi3 = levelconfig_option.diffi3;
      const diffi4 = levelconfig_option.diffi4;
      const diffi5 = levelconfig_option.diffi5;
      const diffi = [];
      diffi.push(diffi1, diffi2, diffi3, diffi4, diffi5);
      const useDiffi = diffi.filter((item) => item.on_off === "on");
      const diffiButtons = useDiffi.map((item) => (
        <>
          <button onClick={() => onDiffClickHandler(item.period, item.name, current_card_id, timer)}>{item.nick}</button>
        </>
      ));
      setDiffis(diffiButtons);
    }
  }, [cards, levelconfigs, cardListStudying, onDiffClickHandler, timer]);

  const milliseconds = (h, m, s) => (h * 60 * 60 + m * 60 + s) * 1000;

  const onDiffClickHandler = useCallback(
    async (interval, diffi, current_card_id, timer) => {
      if (diffi === "diffi5") {
        console.log(timer);
        sessionKnowHandler(interval, diffi, current_card_id, timer);
      } else {
        console.log(timer);
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
          // setTimer(0);
        }
      }
    },
    [cardShow, finishStudy, sessionKnowHandler]
  );

  const finishStudy = useCallback(async () => {
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
  }, [sessionupdateresults]);

  useEffect(() => {
    cardShow();
  }, [cardShow]);

  const [session_updateResults] = useMutation(UpdateResults, { onCompleted: showdataposition });

  function showdataposition(data) {
    console.log("data", data);
  }

  const sessionupdateresults = useCallback(
    async (cardlist_to_send, sessionId) => {
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
    },
    [session_updateResults]
  );

  const updateResults = () => {
    console.log("update results fired!!");
    // const result = sessionStorage.getItem("result")
    // sessionupdateresults(result);
  };

  const sessionKnowHandler = useCallback(
    (interval, diffi, current_card_id, timer) => {
      console.log("diffi5 clicked!!!");
      console.log("timer:", timer);
      if (timer > 10000) {
        timer = timer / 1000;
      } else {
        timer = 10000 / 1000;
      }
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

      if (card_details_session[current_card_info_index].studyStatus.recentKnowTime === null) {
        //첫 know 처리
        const a_r = -0.275;
        const b_r = 1.1242;
        const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
        const h_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyHour;
        const h_e = card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime;
        const s = current_card_levelconfig[0].restudy.levelchangeSensitivity;
        const l_prev = card_details_session[current_card_info_index].studyStatus.levelCurrent;
        const r_restudy = current_card_levelconfig[0].restudy.restudyRatio;
        const r_0 = a_r * Math.log(n_s * Math.log(h_s)) + b_r;
        const w_firstknow = 20;
        const t_now = Date.parse(now) / 1000;
        // const l_theo = Math.log((Math.log(0.8) * h_e) / (5400 * Math.log(r_0))) / Math.log(2) + 1;
        console.log(timer, n_s, h_s);
        var l_apply = s * w_firstknow * (1 / (n_s * Math.log(h_s)));
        var t_next = t_now + ((5400 * Math.pow(2, l_apply - 1)) / Math.log(0.8)) * Math.log(r_restudy);
        var t_next_to_date = new Date(t_next * 1000);
        console.log(l_apply);
        console.log("첫 know 처리 ", t_next_to_date);
        //첫 know 처리
      } else {
        //복습주기 로직
        const a_r = -0.275;
        const b_r = 1.1242;
        const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
        const h_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyHour;
        const h_e = card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime;
        const s = current_card_levelconfig[0].restudy.levelchangeSensitivity;
        const l_prev = card_details_session[current_card_info_index].studyStatus.levelCurrent;
        const r_restudy = current_card_levelconfig[0].restudy.restudyRatio;
        const t_now = Date.parse(now) / 1000;
        const r_0 = a_r * Math.log(n_s * Math.log(h_s)) + b_r;
        const l_theo = Math.log((Math.log(0.8) * h_e) / (5400 * Math.log(r_0))) / Math.log(2) + 1;
        var l_apply = l_prev + s * (l_theo - l_prev);
        var t_next = t_now + ((5400 * Math.pow(2, l_apply - 1)) / Math.log(0.8)) * Math.log(r_restudy);
        console.log("복습주기 로직", t_next);
        //복습주기 로직
      }

      card_details_session[current_card_info_index].studyStatus.levelOriginal = card_details_session[current_card_info_index].studyStatus.levelCurrent;
      card_details_session[current_card_info_index].studyStatus.levelCurrent = l_apply;
      card_details_session[current_card_info_index].studyStatus.needStudyTime = new Date(t_next * 1000);
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
      card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = null;
      card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = null;
      card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 0;
      sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));
    },
    [levelconfigs]
  );
  const speakText = () => {
    if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
      alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }

    window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

    const text = document.getElementById("face1");
    console.log(text);
    const speechMsg = new SpeechSynthesisUtterance();
    speechMsg.rate = 1; // 속도: 0.1 ~ 10
    speechMsg.pitch = 1; // 음높이: 0 ~ 2
    speechMsg.lang = "en";
    speechMsg.text = text.innerHTML;

    // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
    window.speechSynthesis.speak(speechMsg);
  };
  return (
    <>
      <div style={style_study_layout_container}>
        <div style={style_study_layout_top}>
          <ul style={style_study_layout_top_left}>
            <li style={{ marginRight: "10px" }}>
              <Avatar size="large" icon={<UserOutlined />} />
            </li>

            <li style={{ width: "320px", display: "flex", alignItems: "center", marginBottom: "3px" }}>
              <span style={{ marginRight: "10px", width: "40px", fontSize: "11px" }}>완료율</span>
              <ProgressBar bgcolor={"#32c41e"} completed={100} />
            </li>

            <li>
              <Button onClick={() => console.log("카드추가 click!!")} style={{ height: "45px", borderRadius: "10px" }}>
                학습카드추가
              </Button>
            </li>
          </ul>
          <div style={clickCount}>click count 자리</div>
          <div style={style_study_layout_top_right}>
            <Timer
              startTimer={startTimer}
              startTimerTotal={startTimerTotal}
              stopTimerTotal={stopTimerTotal}
              startTimerResume={startTimerResume}
              time={time}
              isOn={isOn}
              start={start}
              time_total={time_total}
              isOn_total={isOn_total}
              start_total={start_total}
            />
          </div>
        </div>
        <div style={style_study_layout_bottom}>
          <div style={{ width: "200px", textAlign: "right", display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
            <div></div>
            <div
              // onMouseOver={this.onMouseOver}
              // onMouseOut={this.onMouseOut}
              style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "30px", height: "672px", textAlign: "center" }}
            >
              <FlagFilled style={{ cursor: "pointer", fontSize: "15px", color: `white`, marginBottom: "20px" }} />
              <div
                id="user_flag"
                style={{ visibility: "hidden", display: "flex", flexDirection: "column", width: "30px", height: "100%", textAlign: "center", border: "1px dashed lightgrey" }}
              >
                {/* <FlagFilled onClick={() => this.userFlagChange("flag_1")} style={{ cursor: "pointer", fontSize: "15px", color: "red" }} />
                <FlagFilled onClick={() => this.userFlagChange("flag_2")} style={{ cursor: "pointer", fontSize: "15px", color: "orange" }} />
                <FlagFilled onClick={() => this.userFlagChange("flag_3")} style={{ cursor: "pointer", fontSize: "15px", color: "yellow" }} />
                <FlagFilled onClick={() => this.userFlagChange("flag_4")} style={{ cursor: "pointer", fontSize: "15px", color: "green" }} />
                <FlagFilled onClick={() => this.userFlagChange("flag_5")} style={{ cursor: "pointer", fontSize: "15px", color: "blue" }} /> */}
              </div>
            </div>
          </div>

          <div style={{ width: "1000px", border: "1px solid lightgrey", borderRadius: "10px" }}>
            <div style={contentsDisplay}>
              <div style={{ position: "relative", height: "50%", width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>{face1Contents}</div>
              </div>
              <div style={{ position: "relative", height: "50%", width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>{face2Contents}</div>
              </div>
            </div>
            <button onClick={speakText}>재생</button>
            <div style={buttonDiv}>
              {/* <Button width="35px" onClick={() => this.onClickInterval("back", 0)} style={{ ...buttonDefault, padding: 0, lineHeight: "13px" }}>
                이전
                <br />
                카드
              </Button> */}
              <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>{diffis}</div>
              {/* <Popover placement="bottomLeft" content={content} trigger="click">
                  <Button size="small" width="35px" style={{ ...buttonDefault, height: "32px" }}>
                    ...
                  </Button>
                </Popover> */}
              {/* <Button size="small" width="35px" onClick={this.shuffleCards} style={{ ...buttonDefault, height: "32px", lineHeight: "13px" }}>
                  카드
                  <br />
                  섞기
                </Button> */}
            </div>
          </div>

          <div style={{ width: "200px" }}>사이드 영역</div>
        </div>
      </div>
    </>
  );
};

export default Container;

const buttonDefault = {
  boxShadow: "1px 1px 1px 0px rgba(128,128,128,1)",
  borderRadius: "5px",
};
const style_study_layout_container = {
  display: "flex",
  flexDirection: "column",
  height: "45px",
};
const style_study_layout_top = {
  display: "flex",
  flexDirection: "row",
  width: "1000px",
  margin: "auto",
};
const style_study_layout_top_left = {
  display: "flex",
  flexDirection: "row",
  width: "50%",
  alignItems: "center",
  justifyContent: "space-between",
  marginRight: "15px",
  listStyle: "none",
};
const style_study_layout_top_right = {
  display: "flex",
  flexDirection: "row",
  width: "40%",
  justifyContent: "space-between",
  border: "1px solid lightgrey",
  borderRadius: "10px",
  backgroundColor: "white",
  padding: 5,
  paddingBottom: 0,
  fontSize: "12px",
};
const style_study_layout_bottom = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  margin: "auto",
  marginTop: "10px",
};
const clickCount = {
  flex: 1,
  border: "1px solid lightgrey",
  marginRight: "10px",
  borderRadius: "10px",
  lineHeight: "45px",
  textAlign: "center",
  // fontSize: "30px",
  backgroundColor: "white",
};
const contentsDisplay = {
  height: "600px",
  backgroundColor: "white",
  padding: "10px",
  borderRadius: "10px 10px 0 0",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
};
const buttonDiv = {
  // width: "100%",
  // display: "flex",
  // flexDirection: "row",
  // justifyContent: "space-between",
  height: "70px",
  alignItems: "center",
  backgroundColor: "#e9e9e9",
  padding: "10px 60px",
  borderRadius: "0 0 10px 10px",
};
