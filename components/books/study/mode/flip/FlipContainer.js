import React, { Component, useState, useEffect, useCallback } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";
import { GetLevelConfig, UpdateResults } from "../../../../../graphql/query/session";
import Timer from "./Timer";
import { Avatar, Menu, Dropdown, Modal, Popover, Space, Button } from "antd";
import ProgressBar from "./ProgressBar";
import { GetCardTypeSetByMybookIds } from "../../../../../graphql/query/cardtype";
import {
  ControlOutlined,
  DashOutlined,
  FormOutlined,
  DeleteOutlined,
  FlagFilled,
  HeartFilled,
  StarFilled,
  CheckCircleFilled,
  PlusOutlined,
  MenuFoldOutlined,
  StepForwardOutlined,
  StepBackwardOutlined,
  SwapRightOutlined,
  StopOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {calculateStat} from "./FlipContainerSub"


const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const FlipContainer = ({ cardListStudying, contentsList, sessionScope, levelConfigs, cardTypeSets }) => {
  const router = useRouter();
  const [session_updateResults] = useMutation(UpdateResults, { onCompleted: showdataposition });
  function showdataposition(data) {
    console.log("data", data);
    if (data.session_updateResults.status === "200") {
      router.push("/m/study");
    }
  }

  const sessionupdateresults = useCallback(
    async (cardlist_to_send, sessionId) => {
      try {
        console.log(sessionId);
        console.log(cardlist_to_send);
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

  return (
    <>
      <Container
        sessionupdateresults={sessionupdateresults}
        cardListStudying={cardListStudying}
        contentsList={contentsList}
        sessionScope={sessionScope}
        levelConfigs={levelConfigs}
        cardTypeSets={cardTypeSets}
      />
    </>
  );
};

export default FlipContainer;

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
      getKnowTime: "",
      confirmOn: "ask",
      cardSeq: 0,
      originCardSeq: 0,
      onBackMode: false,
      popoverClicked: false,
      backModeSeq: 0,
      firstBackModeSeq: 0,
      restore: false,
      backModeRestore: false,
    };
    this.keyCount = 0;
    this.getKey = this.getKey.bind(this);
  }
  getKey() {
    return this.keyCount++;
  }

  //타이머 설정
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

  //타이머 설정 끝

  milliseconds = (h, m, s) => (h * 60 * 60 + m * 60 + s) * 1000;

  handleClickPopover = (visible) => {
    this.setState({
      popoverClicked: visible,
    });
  };

  Diffi5Handler = (diffi, current_card_id, timer) => {
    console.log("diffi5 clicked!!!");
    console.log("timer:", timer);
    if (timer > 10000) {
      timer = timer / 1000;
    } else {
      timer = 10000 / 1000;
    }
    const now = new Date();
    const now_mili_convert = Date.parse(now);
    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info_index = card_details_session.findIndex((item) => item.content.mycontent_id === current_card_id);
    const current_card_book_id = card_details_session[current_card_info_index].card_info.mybook_id;
    const current_card_levelconfig = this.props.levelConfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);

    if (card_details_session[current_card_info_index].studyStatus.recentKnowTime !== null) {
      console.log(now_mili_convert);
      console.log(Date.parse(card_details_session[current_card_info_index].studyStatus.recentKnowTime));
      card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = new Date(
        now_mili_convert - Date.parse(card_details_session[current_card_info_index].studyStatus.recentKnowTime)
      );
    } else {
      card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = null;
    }     
    if (card_details_session[current_card_info_index].studyStatus.currentLevStudyHour !== null) {
      card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = new Date(
        Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour) + timer
      );
    }

    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes + 1;

    if (card_details_session[current_card_info_index].studyStatus.recentKnowTime === null) {
      //첫 know 처리
      const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
      const h_s = Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour / 1000);
      const s = current_card_levelconfig[0].restudy.levelchangeSensitivity;
      const r_restudy = current_card_levelconfig[0].restudy.restudyRatio;
      const w_firstknow = 20;
      const t_now = Date.parse(now) / 1000;
      console.log(timer, n_s, h_s);
      var l_apply = s * w_firstknow * (1 / (n_s * Math.log(h_s)));
      var t_next = t_now + ((5400 * Math.pow(2, l_apply - 1)) / Math.log(0.8)) * Math.log(r_restudy);
      var t_next_to_date = new Date(t_next * 1000);
      console.log("t_next : ", t_next);
      console.log("l_apply : ", l_apply);
      console.log("첫 know 처리 ", t_next_to_date);
      //첫 know 처리
    } else {
      //복습주기 로직
      const a_r = -0.275;
      const b_r = 1.1242;
      const n_s = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes;
      const h_s = Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevStudyHour / 1000);
      const h_e = Date.parse(card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime / 1000);
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
    card_details_session[current_card_info_index].studyStatus.levelCurrent = Number(l_apply.toFixed());
    card_details_session[current_card_info_index].studyStatus.needStudyTime = new Date(t_next * 1000);
    card_details_session[current_card_info_index].studyStatus.recentKnowTime = now;
    card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
    card_details_session[current_card_info_index].studyStatus.recentSelection = diffi;
    card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
    card_details_session[current_card_info_index].studyStatus.recentStudyResult = diffi;
    card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
    // card_details_session[current_card_info_index].studyStatus.retentionRate =
    card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
    card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
    card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
    card_details_session[current_card_info_index].studyStatus.studyTimesInSession = card_details_session[current_card_info_index].studyStatus.studyTimesInSession + 1;
    if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
      card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
    } else {
      card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(
        Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer
      );
    }
    card_details_session[current_card_info_index].studyStatus.totalStudyTimes = card_details_session[current_card_info_index].studyStatus.totalStudyTimes + 1;

    console.log(card_details_session);

    //서버에 보내기 위한 학습정보 리스트 생성
    this.generateStudyStatus(card_details_session, current_card_info_index);
    //업데이트된 학습정보 세션스토리지에 다시 저장
    card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime = null;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = null;
    card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = 0;
    card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = null;
    //recent know time 여기서 리셋
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //여기다가 새로운 시퀀스 정보를 가공해야함.
    this.generateCardSeq(card_details_session, now, current_card_id);
  };

  onDiffClickHandler = (interval, diffi, current_card_id, timer) => {
    console.log("난이도 선택하셨네요~");
    calculateStat("diffi1")
    console.log("해당카드 난이도평가", interval, diffi, current_card_id, timer);
    if (diffi === "diffi5") {
      console.log("알겠음 클릭함.");
      this.Diffi5Handler(diffi, current_card_id, timer);
    } else {
      console.log(timer);
      const now = new Date();
      const now_mili_convert = Date.parse(now);
      const result = this.milliseconds(0, interval, 0);
      const need_review_time = now_mili_convert + result;
      const review_date = new Date(need_review_time);
      console.log(interval);

      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      console.log("card_details_session", card_details_session);

      const current_card_info_index = card_details_session.findIndex((item) => item.content.mycontent_id === current_card_id);
      console.log(current_card_info_index);

      //학습정보 업데이트
      if (card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime !== null) {
        card_details_session[current_card_info_index].studyStatus.currentLevElapsedTime += new Date() - card_details_session[current_card_info_index].studyStatus.recentKnowTime;
      }
      card_details_session[current_card_info_index].studyStatus.currentLevStudyHour = null;
      card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes = card_details_session[current_card_info_index].studyStatus.currentLevStudyTimes + 1;
      card_details_session[current_card_info_index].studyStatus.needStudyTime = review_date;
      card_details_session[current_card_info_index].studyStatus.needStudyTimeTmp = review_date;
      card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
      card_details_session[current_card_info_index].studyStatus.recentSelection = diffi;
      card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
      card_details_session[current_card_info_index].studyStatus.recentStudyResult = diffi;
      card_details_session[current_card_info_index].studyStatus.recentStudyTime = now;
      card_details_session[current_card_info_index].studyStatus.statusPrev = card_details_session[current_card_info_index].studyStatus.statusCurrent;
      card_details_session[current_card_info_index].studyStatus.statusCurrent = "ing";
      card_details_session[current_card_info_index].studyStatus.studyTimesInSession = card_details_session[current_card_info_index].studyStatus.studyTimesInSession + 1;
      if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
        card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
      } else {
        card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(
          Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer
        );
      }
      card_details_session[current_card_info_index].studyStatus.totalStudyTimes = card_details_session[current_card_info_index].studyStatus.totalStudyTimes + 1;

      //업데이트된 학습정보 세션스토리지에 다시 저장
      sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

      //서버에 보내기 위한 학습정보 리스트 생성
      this.generateStudyStatus(card_details_session, current_card_info_index);

      //여기다가 새로운 시퀀스 정보를 가공해야함.
      this.generateCardSeq(card_details_session, now, current_card_id);

      //남은카드랑 이래저래 해서 학습이 종료되었는지...
      const card_seq = sessionStorage.getItem("card_seq");
      if (card_details_session.length - 1 == Number(card_seq)) {
        this.finishStudy();
      } else {
        console.log(card_details_session.length - 1, "======", Number(card_seq));
        console.log("아직 안끝");
        // this.setTimer(0);
      }
    }
  };

  //상황에따른 새로운 카드 시쿼스 생성
  generateCardSeq = (card_details_session, now, current_card_id) => {
    const reviewExist_data = card_details_session.filter((item) => {
      if (item.studyStatus.needStudyTimeTmp !== null) {
        if (new Date(item.studyStatus.needStudyTimeTmp) < now) {
          return item;
        }
      }
    });
    console.log("복습해야 하는 카드", reviewExist_data);
    if (reviewExist_data.length > 0) {
      reviewExist_data.sort(function (a, b) {
        return a.studyStatus.needStudyTimeTmp > b.studyStatus.needStudyTimeTmp ? 1 : a.studyStatus.needStudyTimeTmp < b.studyStatus.needStudyTimeTmp ? -1 : 0;
      });
      const earlist_id = reviewExist_data[0]._id;
      const shouldBeSeq = card_details_session.findIndex((item) => item._id == earlist_id);
      sessionStorage.setItem("card_seq", shouldBeSeq);
    } else {
      const origin_seq = sessionStorage.getItem("origin_seq");
      sessionStorage.setItem("origin_seq", Number(origin_seq) + 1);
      sessionStorage.setItem("card_seq", Number(origin_seq) + 1);
    }

    //study log 생성
    const current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info);
    const currentCardId = current_card_info[0]._id;
    const studyLogCardIds = JSON.parse(sessionStorage.getItem("studyLogCardIds"));
    if (studyLogCardIds === null) {
      sessionStorage.setItem("studyLogCardIds", JSON.stringify([currentCardId]));
    } else {
      const cardIds = studyLogCardIds.concat(currentCardId);
      sessionStorage.setItem("studyLogCardIds", JSON.stringify(cardIds));
    }
    this.setState({
      restore: false,
    });
    this.stopTimerTotal();
    this.resetTimer();
  };

  // 이전카드 보기
  onClickBeforeCard = () => {
    if (this.state.onBackMode === false) {
      const studyLogCardIds = JSON.parse(sessionStorage.getItem("studyLogCardIds"));
      if (studyLogCardIds === null) {
        alert("이전 카드가 없습니다.");
      } else {
        this.setState({
          onBackMode: true,
        });
        const origin_seq = sessionStorage.getItem("origin_seq");
        this.setState({
          firstBackModeSeq: Number(origin_seq),
        });
        const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
        const lastCardId = studyLogCardIds.slice(-1);
        console.log(lastCardId[0]);
        const backModeSeq = studyLogCardIds.findIndex((item) => item === lastCardId[0]);
        console.log(backModeSeq);
        this.setState({
          backModeSeq: backModeSeq,
        });

        const shouldBeSeq = card_details_session.findIndex((item) => item._id === lastCardId[0]);
        console.log(shouldBeSeq);

        const beforeBackModeCard = card_details_session[origin_seq];
        console.log(beforeBackModeCard);
        this.generateBackPassModeStudyStatus(beforeBackModeCard._id, "move");
        sessionStorage.setItem("card_seq", shouldBeSeq);
      }
    } else {
      this.setState({
        backModeRestore: false,
      });
      const currentBackSeq = this.state.backModeSeq;
      console.log(currentBackSeq);
      const studyLogCardIds = JSON.parse(sessionStorage.getItem("studyLogCardIds"));
      const shouldBeBackModeDataId = studyLogCardIds[currentBackSeq - 1];
      const currentBeBackModeDataId = studyLogCardIds[currentBackSeq];

      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      const shouldBeSeq = card_details_session.findIndex((item) => item._id === shouldBeBackModeDataId);
      console.log(shouldBeSeq);
      if (shouldBeSeq === -1) {
        alert("이전카드 더이상 없어요~");
      } else {
        this.setState((prevState) => ({
          backModeSeq: prevState.backModeSeq - 1,
        }));
        this.generateBackPassModeStudyStatus(currentBeBackModeDataId, "move");
        sessionStorage.setItem("card_seq", shouldBeSeq);
      }
    }
  };

  // 백모드에서 앞으로가기
  onClickNextCardInBackMode = () => {
    const currentBackSeq = this.state.backModeSeq;
    console.log(currentBackSeq);
    const studyLogCardIds = JSON.parse(sessionStorage.getItem("studyLogCardIds"));
    const shouldBeBackModeDataId = studyLogCardIds[currentBackSeq + 1];
    const currentBackModeDataId = studyLogCardIds[currentBackSeq];

    console.log("이거랑", currentBackSeq + 1);
    console.log("저거랑", this.state.firstBackModeSeq);
    if (currentBackSeq + 1 === this.state.firstBackModeSeq) {
      const origin_seq = sessionStorage.getItem("origin_seq");
      sessionStorage.setItem("card_seq", origin_seq);
      this.setState({
        onBackMode: false,
      });
    } else {
      this.setState((prevState) => ({
        backModeSeq: prevState.backModeSeq + 1,
      }));
      this.setState({
        backModeRestore: false,
      });

      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      const shouldBeSeq = card_details_session.findIndex((item) => item._id === shouldBeBackModeDataId);
      console.log(shouldBeSeq);
      this.generateBackPassModeStudyStatus(currentBackModeDataId, "move");
      sessionStorage.setItem("card_seq", shouldBeSeq);
    }
  };

  // 백모드에서 학습정보 생성
  generateBackPassModeStudyStatus = (current_card_id, selection) => {
    const timer = this.state.time;
    const now = new Date();

    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    console.log("card_details_session", card_details_session);

    const current_card_info_index = card_details_session.findIndex((item) => item._id === current_card_id);
    console.log(current_card_info_index);

    //학습정보 업데이트
    card_details_session[current_card_info_index].studyStatus.recentSelectTime = now;
    card_details_session[current_card_info_index].studyStatus.recentSelection = selection;
    card_details_session[current_card_info_index].studyStatus.recentStayHour = new Date(timer);
    if (card_details_session[current_card_info_index].studyStatus.totalStayHour == null) {
      card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(timer);
    } else {
      card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(
        Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer
      );
    }

    //업데이트된 학습정보 세션스토리지에 다시 저장
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //서버에 보내기 위한 학습정보 리스트 생성
    this.generateStudyStatus(card_details_session, current_card_info_index);

    this.stopTimerTotal();
    this.resetTimer();
  };

  onClickGoBackToOrigin = () => {
    const currentBackSeq = this.state.backModeSeq;
    console.log(currentBackSeq);
    const studyLogCardIds = JSON.parse(sessionStorage.getItem("studyLogCardIds"));
    const shouldBeBackModeDataId = studyLogCardIds[currentBackSeq];
    this.generateBackPassModeStudyStatus(shouldBeBackModeDataId, "move");
    const origin_seq = sessionStorage.getItem("origin_seq");
    sessionStorage.setItem("card_seq", origin_seq);
    this.setState({
      onBackMode: false,
    });
    this.setState({
      backModeRestore: false,
    });
  };

  onClickPassHandler = (current_card_id) => {
    console.log(current_card_id);
    const now = new Date();
    this.setState({
      popoverClicked: false,
    });
    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info);
    const currentCardId = current_card_info[0]._id;

    this.generateBackPassModeStudyStatus(currentCardId, "pass");

    this.generateCardSeq(card_details_session, now, current_card_id);
  };

  onClickSuspendHandler = (current_card_id, from) => {
    console.log(current_card_id);
    const now = new Date();
    this.setState({
      popoverClicked: false,
    });
    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info);
    const currentCardId = current_card_info[0]._id;

    this.generateHoldCompletedRestoretudyStatus(currentCardId, "hold");
    if (from === "back") {
      this.setState({
        backModeRestore: false,
      });
      console.log("여기다가 뭔 짓을 해야하는데....");
      //back모드에서 보류를 눌렀어. 그러면 학습 데이터는 넘어가는거고
      //화면은 그대로잖아. 시간은 리셋 되었고, 그러면 더보기 버튼에 내용이 바뀌어야 해.
      // 그럴려면
    } else {
      this.generateCardSeq(card_details_session, now, current_card_id);
    }
  };

  generateHoldCompletedRestoretudyStatus = (current_card_id, selection) => {
    const timer = this.state.time;
    const now = new Date();

    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    console.log("card_details_session", card_details_session);

    const current_card_info_index = card_details_session.findIndex((item) => item._id === current_card_id);
    console.log(current_card_info_index);

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
      card_details_session[current_card_info_index].studyStatus.totalStayHour = new Date(
        Date.parse(card_details_session[current_card_info_index].studyStatus.totalStayHour) + timer
      );
    }

    //업데이트된 학습정보 세션스토리지에 다시 저장
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //서버에 보내기 위한 학습정보 리스트 생성
    this.generateStudyStatus(card_details_session, current_card_info_index);

    this.stopTimerTotal();
    this.resetTimer();
  };

  onClickCompletedHandler = (current_card_id, from) => {
    console.log(current_card_id);
    const now = new Date();
    this.setState({
      popoverClicked: false,
    });
    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info);
    const currentCardId = current_card_info[0]._id;

    this.generateHoldCompletedRestoretudyStatus(currentCardId, "completed");
    if (from === "back") {
      this.setState({
        backModeRestore: false,
      });
      console.log("여기다가 뭔 짓을 해야하는데....");
      //back모드에서 보류를 눌렀어. 그러면 학습 데이터는 넘어가는거고
      //화면은 그대로잖아. 시간은 리셋 되었고, 그러면 더보기 버튼에 내용이 바뀌어야 해.
      // 그럴려면
    } else {
      this.generateCardSeq(card_details_session, now, current_card_id);
    }
  };

  onClickRestoreHandler = (current_card_id, from) => {
    console.log(current_card_id);
    const now = new Date();
    this.setState({
      popoverClicked: false,
    });
    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info);
    const currentCardId = current_card_info[0]._id;

    this.generateHoldCompletedRestoretudyStatus(currentCardId, "restore");
    if (from === "back") {
      console.log(from);
      this.setState({
        backModeRestore: true,
      });
    } else {
      this.setState({
        restore: true,
      });
    }

    // this.generateCardSeq(card_details_session, now, current_card_id);
  };
  speakText = () => {
    if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
      alert("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }

    window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

    const text = document.getElementById("face2_row1");
    const speechMsg = new SpeechSynthesisUtterance();
    speechMsg.rate = 1; // 속도: 0.1 ~ 10
    speechMsg.pitch = 1; // 음높이: 0 ~ 2
    speechMsg.lang = "en";
    speechMsg.text = text.innerHTML;

    // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
    window.speechSynthesis.speak(speechMsg);
  };

  //서버에 보내기 위한 학습정보생성
  generateStudyStatus = (card_details_session, current_card_info_index) => {
    const updateThis = card_details_session[current_card_info_index];
    const getUpdateThis = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
    if (getUpdateThis) {
      var finalUpdate = getUpdateThis.concat(updateThis);
    } else {
      finalUpdate = [updateThis];
    }
    sessionStorage.setItem("cardlist_to_send", JSON.stringify(finalUpdate));
  };
  generateOnFinishStudyStatus = () => {
    const card_seq = sessionStorage.getItem("card_seq");

    const timer = this.state.time;
    const now = new Date();

    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    console.log("card_details_session", card_details_session);

    //학습정보 업데이트
    card_details_session[card_seq].studyStatus.recentSelectTime = now;
    card_details_session[card_seq].studyStatus.recentSelection = "finish";
    card_details_session[card_seq].studyStatus.recentStayHour = new Date(timer);
    if (card_details_session[card_seq].studyStatus.totalStayHour == null) {
      card_details_session[card_seq].studyStatus.totalStayHour = new Date(timer);
    } else {
      card_details_session[card_seq].studyStatus.totalStayHour = new Date(Date.parse(card_details_session[card_seq].studyStatus.totalStayHour) + timer);
    }

    //업데이트된 학습정보 세션스토리지에 다시 저장
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //서버에 보내기 위한 학습정보 리스트 생성
    this.generateStudyStatus(card_details_session, card_seq);
  };
  finishStudy = () => {
    console.log("finishStudy Clicked!!!");
    this.generateOnFinishStudyStatus();
    // alert("공부끝!!! 학습데이터를 서버로 전송합니다.");
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
        delete v.card_info.time_created;
      });
      cardlist_to_send.forEach(function (v) {
        delete v._id;
      });
      cardlist_to_send.forEach(function (v) {
        delete v.content;
      });
      cardlist_to_send.forEach(function (v) {
        delete v.studyStatus.__typename;
      });

      console.log("cardlist_to_send : ", cardlist_to_send);
      console.log("sessionId : ", sessionId);
      this.props.sessionupdateresults(cardlist_to_send, sessionId);
    } else {
      console.log("공부끝");
    }
  };
  componentDidMount() {
    const cardlist_to_send = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
    if (cardlist_to_send) {
      var clickCount = cardlist_to_send.length;
      this.setState({
        clickCount,
      });
    } else {
      var clickCount = 0;
      this.setState({
        clickCount,
      });
    }
  }
  render() {
    if (this.props.levelConfigs) {
      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      const currentSeq = Number(sessionStorage.getItem("card_seq"));
      const statusCurrent = card_details_session[currentSeq].studyStatus.statusCurrent;
      
      const current_card_book_id = card_details_session[currentSeq].card_info.mybook_id;
      const current_card_id = card_details_session[currentSeq].content.mycontent_id;
      const current_card_levelconfig = this.props.levelConfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);
      const levelconfig_option = current_card_levelconfig[0].restudy.option;
      const diffi1 = levelconfig_option.diffi1;
      const diffi2 = levelconfig_option.diffi2;
      const diffi3 = levelconfig_option.diffi3;
      const diffi4 = levelconfig_option.diffi4;
      const diffi5 = levelconfig_option.diffi5;
      const diffi = [];
      diffi.push(diffi1, diffi2, diffi3, diffi4, diffi5);
      const useDiffi = diffi.filter((item) => item.on_off === "on");

      if (statusCurrent === "completed" || statusCurrent === "hold") {
        var diffiButtons = (
          <>
            <Button icon={<RollbackOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickRestoreHandler(current_card_id)} type="primary">
              복원
            </Button>
            <Button icon={<SwapRightOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickPassHandler(current_card_id)} type="primary">
              통과
            </Button>
          </>
        );
      } else {
        var diffiButtons = useDiffi.map((item, index) => (
          <>
            <Button
              key={`diffiButton_${item.name}`}
              size="small"
              type="primary"
              style={{ fontSize: "0.8rem", borderRadius: "3px" }}
              onClick={() => this.onDiffClickHandler(item.period, item.name, current_card_id, this.state.time)}
            >
              {item.nick}
            </Button>
          </>
        ));
      }
      var restoreDiffiButtons = useDiffi.map((item, index) => (
        <>
          <Button
            key={`diffiButton_${item.name}`}
            size="small"
            type="primary"
            style={{ fontSize: "0.8rem", borderRadius: "3px" }}
            onClick={() => this.onDiffClickHandler(item.period, item.name, current_card_id, this.state.time)}
          >
            {item.nick}
          </Button>
        </>
      ));

      const backModeMoreMenuContents = (
        <Space>
          {statusCurrent === "completed" || statusCurrent === "hold" ? (
            <>
              <Button icon={<RollbackOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickRestoreHandler(current_card_id, "back")} type="primary">
                복원
              </Button>
            </>
          ) : (
            <>
              <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickSuspendHandler(current_card_id, "back")} type="primary">
                보류
              </Button>
              <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickCompletedHandler(current_card_id, "back")} type="primary">
                졸업
              </Button>
            </>
          )}

          <Button icon={<CheckCircleOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.finishStudy} type="primary">
            학습종료
          </Button>
        </Space>
      );

      const restoreBackModeMoreMenuContents = (
        <Space>
          <>
            <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickSuspendHandler(current_card_id, "back")} type="primary">
              보류
            </Button>
            <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickCompletedHandler(current_card_id, "back")} type="primary">
              졸업
            </Button>
          </>

          <Button icon={<CheckCircleOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.finishStudy} type="primary">
            학습종료
          </Button>
        </Space>
      );
      var goBackToCurrent = (
        <>
          <Button size="small" type="primary" style={{ fontSize: "0.8rem" }} onClick={this.onClickGoBackToOrigin}>
            원위치에서 학습 이어하기
          </Button>
          <Popover visible={this.state.popoverClicked} onVisibleChange={this.handleClickPopover} placement="left" content={backModeMoreMenuContents} trigger="click">
            <Button icon={<DashOutlined />} size="small" style={{ fontSize: "1rem" }} type="secondary" />
          </Popover>
        </>
      );

      var restoreModeGoBackToCurrent = (
        <>
          <Button size="small" type="primary" style={{ fontSize: "0.8rem" }} onClick={this.onClickGoBackToOrigin}>
            원위치에서 학습 이어하기
          </Button>
          <Popover visible={this.state.popoverClicked} onVisibleChange={this.handleClickPopover} placement="left" content={restoreBackModeMoreMenuContents} trigger="click">
            <Button icon={<DashOutlined />} size="small" style={{ fontSize: "1rem" }} type="secondary" />
          </Popover>
        </>
      );

      const moreMenuContents = (
        <Space>
          <Button icon={<SwapRightOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickPassHandler(current_card_id)} type="primary">
            통과
          </Button>
          <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickSuspendHandler(current_card_id)} type="primary">
            보류
          </Button>
          <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickCompletedHandler(current_card_id)} type="primary">
            졸업
          </Button>
          <Button icon={<CheckCircleOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.finishStudy} type="primary">
            학습종료
          </Button>
        </Space>
      );
      var moreMenu = (
        <>
          <Popover visible={this.state.popoverClicked} onVisibleChange={this.handleClickPopover} placement="left" content={moreMenuContents} trigger="click">
            <Button icon={<DashOutlined />} size="small" style={{ fontSize: "1rem" }} type="secondary" />
          </Popover>
        </>
      );
    }

    if (this.props.cardTypeSets.length > 0) {
      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      var makerFlagContent = card_details_session.map((content) => {
        const currentSeq = Number(sessionStorage.getItem("card_seq"));
        // console.log("카드에 스타일 입히기 시작", cardTypeSets);
        //   console.log(content);
        const cardTypeSets = this.props.cardTypeSets;
        const contentsList = this.props.contentsList;

        const current_card_style_set = cardTypeSets.filter((item) => item._id === content.card_info.cardtypeset_id);

        // console.log(current_card_style_set);

        const makerFlagStyle = current_card_style_set[0].makerFlag_style;
        // console.log(row_font);
        // console.log(content);
        // console.log(contentsList);
        const show_contents = contentsList.map((content_value, index) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);

            const figure_shape = makerFlagStyle.figure_style.shape;
            const figure_size = makerFlagStyle.figure_style.size;
            const figure_color = makerFlagStyle.figure_style.color;

            const comment_font_bold = makerFlagStyle.comment_font.bold;
            const comment_font_color = makerFlagStyle.comment_font.color;
            const comment_font_font = makerFlagStyle.comment_font.font;
            const comment_font_italic = makerFlagStyle.comment_font.italic;
            const comment_font_size = makerFlagStyle.comment_font.size;
            const comment_font_underline = makerFlagStyle.comment_font.underline;

            const star_shape = <StarFilled style={{ color: figure_color }} />;
            const heart_shape = <HeartFilled style={{ color: figure_color }} />;
            const circle_shape = <CheckCircleFilled style={{ color: figure_color }} />;
            if (content.content.makerFlag.value === 1) {
              if (figure_shape === "star") {
                var ratings = star_shape;
              } else if (figure_shape === "heart") {
                var ratings = heart_shape;
              } else if (figure_shape === "circle") {
                var ratings = circle_shape;
              }
            } else if (content.content.makerFlag.value === 2) {
              if (figure_shape === "star") {
                var ratings = (
                  <>
                    {star_shape}
                    {star_shape}
                  </>
                );
              } else if (figure_shape === "heart") {
                var ratings = (
                  <>
                    {heart_shape}
                    {heart_shape}
                  </>
                );
              } else if (figure_shape === "circle") {
                var ratings = (
                  <>
                    {circle_shape}
                    {circle_shape}
                  </>
                );
              }
            } else if (content.content.makerFlag.value === 3) {
              if (figure_shape === "star") {
                var ratings = (
                  <>
                    {star_shape}
                    {star_shape}
                    {star_shape}
                  </>
                );
              } else if (figure_shape === "heart") {
                var ratings = (
                  <>
                    {heart_shape}
                    {heart_shape}
                    {heart_shape}
                  </>
                );
              } else if (figure_shape === "circle") {
                var ratings = (
                  <>
                    {circle_shape}
                    {circle_shape}
                    {circle_shape}
                  </>
                );
              }
            } else if (content.content.makerFlag.value === 4) {
              if (figure_shape === "star") {
                var ratings = (
                  <>
                    {star_shape}
                    {star_shape}
                    {star_shape}
                    {star_shape}
                  </>
                );
              } else if (figure_shape === "heart") {
                var ratings = (
                  <>
                    {heart_shape}
                    {heart_shape}
                    {heart_shape}
                    {heart_shape}
                  </>
                );
              } else if (figure_shape === "circle") {
                var ratings = (
                  <>
                    {circle_shape}
                    {circle_shape}
                    {circle_shape}
                    {circle_shape}
                  </>
                );
              }
            } else if (content.content.makerFlag.value === 5) {
              if (figure_shape === "star") {
                var ratings = (
                  <>
                    {star_shape}
                    {star_shape}
                    {star_shape}
                    {star_shape}
                    {star_shape}
                  </>
                );
              } else if (figure_shape === "heart") {
                var ratings = (
                  <>
                    {heart_shape}
                    {heart_shape}
                    {heart_shape}
                    {heart_shape}
                    {heart_shape}
                  </>
                );
              } else if (figure_shape === "circle") {
                var ratings = (
                  <>
                    {circle_shape}
                    {circle_shape}
                    {circle_shape}
                    {circle_shape}
                    {circle_shape}
                  </>
                );
              }
            } else {
              var ratings = <></>;
            }

            if (content.content.makerFlag.comment) {
              var comment = content.content.makerFlag.comment;
            } else {
              comment = "";
            }

            const flagArea = (
              <>
                <div
                  style={{
                    display: "inline-flex",
                    backgroundColor: makerFlagStyle.row_style.background.color,
                    marginTop: makerFlagStyle.row_style.outer_margin.top,
                    marginBottom: makerFlagStyle.row_style.outer_margin.bottom,
                    marginLeft: makerFlagStyle.row_style.outer_margin.left,
                    marginRight: makerFlagStyle.row_style.outer_margin.right,
                    paddingTop: makerFlagStyle.row_style.inner_padding.top,
                    paddingBottom: makerFlagStyle.row_style.inner_padding.bottom,
                    paddingLeft: makerFlagStyle.row_style.inner_padding.left,
                    paddingRight: makerFlagStyle.row_style.inner_padding.right,
                    borderTop: `${makerFlagStyle.row_style.border.top.thickness}px ${makerFlagStyle.row_style.border.top.bordertype} ${makerFlagStyle.row_style.border.top.color}`,
                    borderBottom: `${makerFlagStyle.row_style.border.bottom.thickness}px ${makerFlagStyle.row_style.border.bottom.bordertype} ${makerFlagStyle.row_style.border.bottom.color}`,
                    borderLeft: `${makerFlagStyle.row_style.border.left.thickness}px ${makerFlagStyle.row_style.border.left.bordertype} ${makerFlagStyle.row_style.border.left.color}`,
                    borderRight: `${makerFlagStyle.row_style.border.right.thickness}px ${makerFlagStyle.row_style.border.right.bordertype} ${makerFlagStyle.row_style.border.right.color}`,
                  }}
                >
                  <span style={{ display: "inline-block", marginRight: "5px", fontSize: `${figure_size}px` }}>{ratings}</span>
                  <span
                    style={{
                      color: comment_font_color,
                      fontFamily: `${
                        comment_font_font === "고딕"
                          ? `NanumGothic`
                          : comment_font_font === "명조"
                          ? `NanumMyeongjo`
                          : comment_font_font === "바탕"
                          ? `Gowun Batang, sans-serif`
                          : comment_font_font === "돋움"
                          ? `Gowun Dodum, sans-serif`
                          : ""
                      } `,
                      fontStyle: `${comment_font_italic === "on" ? "italic" : "normal"}`,
                      fontSize: `${comment_font_size}px`,
                      textDecoration: `${comment_font_underline === "on" ? "underline" : "none"}`,
                      fontWeight: `${comment_font_bold === "on" ? 700 : 400}`,
                    }}
                  >
                    {comment}
                  </span>
                </div>
              </>
            );

            return <>{content.content.makerFlag.value !== null && flagArea}</>;
          }
        });
        return show_contents;
      });
      var face1Contents = card_details_session.map((content) => {
        const currentSeq = Number(sessionStorage.getItem("card_seq"));
        // console.log("카드에 스타일 입히기 시작", cardTypeSets);
        //   console.log(content);
        const cardTypeSets = this.props.cardTypeSets;
        const contentsList = this.props.contentsList;
        // const FroalaEditorView = this.props.FroalaEditorView;

        const current_card_style_set = cardTypeSets.filter((item) => item._id === content.card_info.cardtypeset_id);

        // console.log(current_card_style_set);
        const current_card_style = current_card_style_set[0].cardtypes.filter((item) => item._id === content.card_info.cardtype_id);
        // console.log(current_card_style);
        const face_style = current_card_style[0].face_style;
        const row_style = current_card_style[0].row_style;
        const row_font = current_card_style[0].row_font;
        const makerFlagStyle = current_card_style_set[0].makerFlag_style;
        const flipAlignOption = current_card_style[0].flipAlignOption;
        const alignHorizontal = flipAlignOption.alignHorizontal;
        const alignVertical = flipAlignOption.alignVertical;

        // console.log(row_font);
        // console.log(content);
        // console.log(contentsList);
        const show_contents = contentsList.map((content_value, index) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);
            return (
              <>
                {content.card_info.cardtype === "read" && (
                  <>
                    <div style={{ padding: 5, width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          height: "calc(50vh - 120px)",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                        }}
                      >
                        {/* 페이스 스타일 영역 */}
                        <div
                          style={{
                            backgroundColor: face_style[0].background.color,
                            marginTop: face_style[0].outer_margin.top,
                            marginBottom: face_style[0].outer_margin.bottom,
                            marginLeft: face_style[0].outer_margin.left,
                            marginRight: face_style[0].outer_margin.right,
                            paddingTop: face_style[0].inner_padding.top,
                            paddingBottom: face_style[0].inner_padding.bottom,
                            paddingLeft: face_style[0].inner_padding.left,
                            paddingRight: face_style[0].inner_padding.right,
                            borderTop: `${face_style[0].border.top.thickness}px ${face_style[0].border.top.bordertype} ${face_style[0].border.top.color}`,
                            borderBottom: `${face_style[0].border.bottom.thickness}px ${face_style[0].border.bottom.bordertype} ${face_style[0].border.bottom.color}`,
                            borderLeft: `${face_style[0].border.left.thickness}px ${face_style[0].border.left.bordertype} ${face_style[0].border.left.color}`,
                            borderRight: `${face_style[0].border.right.thickness}px ${face_style[0].border.right.bordertype} ${face_style[0].border.right.color}`,
                          }}
                        >
                          {content_value.face1.map((item, index) => (
                            <>
                              <div
                                key={`face1_row${index + 1}`}
                                id={`face1_row${index + 1}`}
                                style={{
                                  backgroundColor: row_style.face1[index].background.color,
                                  marginTop: row_style.face1[index].outer_margin.top,
                                  marginBottom: row_style.face1[index].outer_margin.bottom,
                                  marginLeft: row_style.face1[index].outer_margin.left,
                                  marginRight: row_style.face1[index].outer_margin.right,
                                  paddingTop: row_style.face1[index].inner_padding.top,
                                  paddingBottom: row_style.face1[index].inner_padding.bottom,
                                  paddingLeft: row_style.face1[index].inner_padding.left,
                                  paddingRight: row_style.face1[index].inner_padding.right,
                                  borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                                  borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                                  borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                                  borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                                  textAlign: row_font.face1[index].align,
                                  fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                                  color: row_font.face1[index].color,
                                  fontFamily: `${
                                    row_font.face1[index].font === "고딕"
                                      ? `NanumGothic`
                                      : row_font.face1[index].font === "명조"
                                      ? `NanumMyeongjo`
                                      : row_font.face1[index].font === "바탕"
                                      ? `Gowun Batang, sans-serif`
                                      : row_font.face1[index].font === "돋움"
                                      ? `Gowun Dodum, sans-serif`
                                      : ""
                                  } `,
                                  fontStyle: `${row_font.face1[index].italic === "on" ? "italic" : "normal"}`,
                                  fontSize: row_font.face1[index].size,
                                  textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                                }}
                              >
                                <FroalaEditorView model={item} />
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {content.card_info.cardtype === "general" && (
                  <>
                    <div style={{ padding: 5, width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          height: "calc(50vh - 130px)",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                        }}
                      >
                        {/* 페이스 스타일 영역 */}
                        <div
                          style={{
                            backgroundColor: face_style[0].background.color,
                            marginTop: face_style[0].outer_margin.top,
                            marginBottom: face_style[0].outer_margin.bottom,
                            marginLeft: face_style[0].outer_margin.left,
                            marginRight: face_style[0].outer_margin.right,
                            paddingTop: face_style[0].inner_padding.top,
                            paddingBottom: face_style[0].inner_padding.bottom,
                            paddingLeft: face_style[0].inner_padding.left,
                            paddingRight: face_style[0].inner_padding.right,
                            borderTop: `${face_style[0].border.top.thickness}px ${face_style[0].border.top.bordertype} ${face_style[0].border.top.color}`,
                            borderBottom: `${face_style[0].border.bottom.thickness}px ${face_style[0].border.bottom.bordertype} ${face_style[0].border.bottom.color}`,
                            borderLeft: `${face_style[0].border.left.thickness}px ${face_style[0].border.left.bordertype} ${face_style[0].border.left.color}`,
                            borderRight: `${face_style[0].border.right.thickness}px ${face_style[0].border.right.bordertype} ${face_style[0].border.right.color}`,
                          }}
                        >
                          {content_value.face1.map((item, index) => (
                            <>
                              <div
                                key={`face1_row${index + 1}`}
                                style={{
                                  backgroundColor: row_style.face1[index].background.color,
                                  marginTop: row_style.face1[index].outer_margin.top,
                                  marginBottom: row_style.face1[index].outer_margin.bottom,
                                  marginLeft: row_style.face1[index].outer_margin.left,
                                  marginRight: row_style.face1[index].outer_margin.right,
                                  paddingTop: row_style.face1[index].inner_padding.top,
                                  paddingBottom: row_style.face1[index].inner_padding.bottom,
                                  paddingLeft: row_style.face1[index].inner_padding.left,
                                  paddingRight: row_style.face1[index].inner_padding.right,
                                  borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                                  borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                                  borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                                  borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                                  textAlign: row_font.face1[index].align,
                                  fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                                  color: row_font.face1[index].color,
                                  fontFamily: `${
                                    row_font.face1[index].font === "고딕"
                                      ? `NanumGothic`
                                      : row_font.face1[index].font === "명조"
                                      ? `NanumMyeongjo`
                                      : row_font.face1[index].font === "바탕"
                                      ? `Gowun Batang, sans-serif`
                                      : row_font.face1[index].font === "돋움"
                                      ? `Gowun Dodum, sans-serif`
                                      : ""
                                  } `,
                                  fontStyle: `${row_font.face1[index].italic === "on" ? "italic" : "normal"}`,
                                  fontSize: row_font.face1[index].size,
                                  textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                                }}
                              >
                                <FroalaEditorView model={item} />
                              </div>
                            </>
                          ))}
                        </div>
                      </div>{" "}
                    </div>
                  </>
                )}
                {content.card_info.cardtype === "flip" && (
                  <>
                    <div style={{ padding: 5, width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          height: "calc(50vh - 130px)",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: face_style[1].background.color,
                            marginTop: face_style[1].outer_margin.top,
                            marginBottom: face_style[1].outer_margin.bottom,
                            marginLeft: face_style[1].outer_margin.left,
                            marginRight: face_style[1].outer_margin.right,
                            paddingTop: face_style[1].inner_padding.top,
                            paddingBottom: face_style[1].inner_padding.bottom,
                            paddingLeft: face_style[1].inner_padding.left,
                            paddingRight: face_style[1].inner_padding.right,
                            borderTop: `${face_style[1].border.top.thickness}px ${face_style[1].border.top.bordertype} ${face_style[1].border.top.color}`,
                            borderBottom: `${face_style[1].border.bottom.thickness}px ${face_style[1].border.bottom.bordertype} ${face_style[1].border.bottom.color}`,
                            borderLeft: `${face_style[1].border.left.thickness}px ${face_style[1].border.left.bordertype} ${face_style[1].border.left.color}`,
                            borderRight: `${face_style[1].border.right.thickness}px ${face_style[1].border.right.bordertype} ${face_style[1].border.right.color}`,
                          }}
                        >
                          {content_value.face1.map((item, index) => (
                            <>
                              <div
                                key={`face1_row${index + 1}`}
                                style={{
                                  backgroundColor: row_style.face1[index].background.color,
                                  marginTop: row_style.face1[index].outer_margin.top,
                                  marginBottom: row_style.face1[index].outer_margin.bottom,
                                  marginLeft: row_style.face1[index].outer_margin.left,
                                  marginRight: row_style.face1[index].outer_margin.right,
                                  paddingTop: row_style.face1[index].inner_padding.top,
                                  paddingBottom: row_style.face1[index].inner_padding.bottom,
                                  paddingLeft: row_style.face1[index].inner_padding.left,
                                  paddingRight: row_style.face1[index].inner_padding.right,
                                  borderTop: `${row_style.face1[index].border.top.thickness}px ${row_style.face1[index].border.top.bordertype} ${row_style.face1[index].border.top.color}`,
                                  borderBottom: `${row_style.face1[index].border.bottom.thickness}px ${row_style.face1[index].border.bottom.bordertype} ${row_style.face1[index].border.bottom.color}`,
                                  borderLeft: `${row_style.face1[index].border.left.thickness}px ${row_style.face1[index].border.left.bordertype} ${row_style.face1[index].border.left.color}`,
                                  borderRight: `${row_style.face1[index].border.right.thickness}px ${row_style.face1[index].border.right.bordertype} ${row_style.face1[index].border.right.color}`,
                                  textAlign: row_font.face1[index].align,
                                  fontWeight: `${row_font.face1[index].bold === "on" ? 700 : 400}`,
                                  color: row_font.face1[index].color,
                                  fontFamily: `${
                                    row_font.face1[index].font === "고딕"
                                      ? `NanumGothic`
                                      : row_font.face1[index].font === "명조"
                                      ? `NanumMyeongjo`
                                      : row_font.face1[index].font === "바탕"
                                      ? `Gowun Batang, sans-serif`
                                      : row_font.face1[index].font === "돋움"
                                      ? `Gowun Dodum, sans-serif`
                                      : ""
                                  } `,
                                  fontSize: row_font.face1[index].size,
                                  textDecoration: `${row_font.face1[index].underline === "on" ? "underline" : "none"}`,
                                }}
                              >
                                <FroalaEditorView model={item} />
                              </div>
                            </>
                          ))}
                          {content_value.selection &&
                            content_value.selection.length > 0 &&
                            content_value.selection.map((item, index) => (
                              <>
                                <div
                                  key={`selection${index + 1}`}
                                  style={{
                                    backgroundColor: row_style.face1[row_style.face1.length - 1].background.color,
                                    marginTop: row_style.face1[row_style.face1.length - 1].outer_margin.top,
                                    marginBottom: row_style.face1[row_style.face1.length - 1].outer_margin.bottom,
                                    marginLeft: row_style.face1[row_style.face1.length - 1].outer_margin.left,
                                    marginRight: row_style.face1[row_style.face1.length - 1].outer_margin.right,
                                    paddingTop: row_style.face1[row_style.face1.length - 1].inner_padding.top,
                                    paddingBottom: row_style.face1[row_style.face1.length - 1].inner_padding.bottom,
                                    paddingLeft: row_style.face1[row_style.face1.length - 1].inner_padding.left,
                                    paddingRight: row_style.face1[row_style.face1.length - 1].inner_padding.right,
                                    borderTop: `${row_style.face1[row_style.face1.length - 1].border.top.thickness}px ${
                                      row_style.face1[row_style.face1.length - 1].border.top.bordertype
                                    } ${row_style.face1[row_style.face1.length - 1].border.top.color}`,
                                    borderBottom: `${row_style.face1[row_style.face1.length - 1].border.bottom.thickness}px ${
                                      row_style.face1[row_style.face1.length - 1].border.bottom.bordertype
                                    } ${row_style.face1[row_style.face1.length - 1].border.bottom.color}`,
                                    borderLeft: `${row_style.face1[row_style.face1.length - 1].border.left.thickness}px ${
                                      row_style.face1[row_style.face1.length - 1].border.left.bordertype
                                    } ${row_style.face1[row_style.face1.length - 1].border.left.color}`,
                                    borderRight: `${row_style.face1[row_style.face1.length - 1].border.right.thickness}px ${
                                      row_style.face1[row_style.face1.length - 1].border.right.bordertype
                                    } ${row_style.face1[row_style.face1.length - 1].border.right.color}`,
                                    textAlign: row_font.face1[row_font.face1.length - 1].align,
                                    fontWeight: `${row_font.face1[row_font.face1.length - 1].bold === "on" ? 700 : 400}`,
                                    color: row_font.face1[row_font.face1.length - 1].color,
                                    fontFamily: `${
                                      row_font.face1[row_font.face1.length - 1].font === "고딕"
                                        ? `NanumGothic`
                                        : row_font.face1[row_font.face1.length - 1].font === "명조"
                                        ? `NanumMyeongjo`
                                        : row_font.face1[row_font.face1.length - 1].font === "바탕"
                                        ? `Gowun Batang, sans-serif`
                                        : row_font.face1[row_font.face1.length - 1].font === "돋움"
                                        ? `Gowun Dodum, sans-serif`
                                        : ""
                                    } `,
                                    fontSize: row_font.face1[row_font.face1.length - 1].size,
                                    textDecoration: `${row_font.face1[row_font.face1.length - 1].underline === "on" ? "underline" : "none"}`,
                                  }}
                                >
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <span>
                                      {index === 0 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➀</span>
                                        </>
                                      )}
                                      {index === 1 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➁</span>
                                        </>
                                      )}
                                      {index === 2 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➂</span>
                                        </>
                                      )}
                                      {index === 3 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➃</span>
                                        </>
                                      )}
                                      {index === 4 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>➄</span>
                                        </>
                                      )}
                                    </span>
                                    <FroalaEditorView model={item} />
                                  </div>
                                </div>
                              </>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            );
          }
        });
        return show_contents;
      });
      var face2Contents = card_details_session.map((content) => {
        const currentSeq = Number(sessionStorage.getItem("card_seq"));
        // console.log("카드에 스타일 입히기 시작", cardTypeSets);
        //   console.log(content);
        const cardTypeSets = this.props.cardTypeSets;
        const contentsList = this.props.contentsList;
        // const FroalaEditorView = this.props.FroalaEditorView;

        const current_card_style_set = cardTypeSets.filter((item) => item._id === content.card_info.cardtypeset_id);

        // console.log(current_card_style_set);
        const current_card_style = current_card_style_set[0].cardtypes.filter((item) => item._id === content.card_info.cardtype_id);
        //   console.log(current_card_style);
        const face_style = current_card_style[0].face_style;
        const row_style = current_card_style[0].row_style;
        const row_font = current_card_style[0].row_font;
        const makerFlagStyle = current_card_style_set[0].makerFlag_style;
        const flipAlignOption = current_card_style[0].flipAlignOption;
        const alignHorizontal = flipAlignOption.alignHorizontal;
        const alignVertical = flipAlignOption.alignVertical;
        // console.log(row_font);
        // console.log(content);
        // console.log(contentsList);
        const show_contents = contentsList.map((content_value, index) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);
            return (
              <>
                {content.card_info.cardtype === "flip" && (
                  <>
                    <div style={{ padding: 5, width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          height: "calc(50vh - 130px)",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                        }}
                      >
                        {/* 페이스2 스타일 영역 */}
                        <div
                          style={{
                            backgroundColor: face_style[2].background.color,
                            marginTop: face_style[2].outer_margin.top,
                            marginBottom: face_style[2].outer_margin.bottom,
                            marginLeft: face_style[2].outer_margin.left,
                            marginRight: face_style[2].outer_margin.right,
                            paddingTop: face_style[2].inner_padding.top,
                            paddingBottom: face_style[2].inner_padding.bottom,
                            paddingLeft: face_style[2].inner_padding.left,
                            paddingRight: face_style[2].inner_padding.right,
                            borderTop: `${face_style[2].border.top.thickness}px ${face_style[2].border.top.bordertype} ${face_style[2].border.top.color}`,
                            borderBottom: `${face_style[2].border.bottom.thickness}px ${face_style[2].border.bottom.bordertype} ${face_style[2].border.bottom.color}`,
                            borderLeft: `${face_style[2].border.left.thickness}px ${face_style[2].border.left.bordertype} ${face_style[2].border.left.color}`,
                            borderRight: `${face_style[2].border.right.thickness}px ${face_style[2].border.right.bordertype} ${face_style[2].border.right.color}`,
                          }}
                        >
                          {content_value.selection !== null &&
                            content_value.face2.map((item, index) => (
                              <>
                                <div
                                  key={`face2_row${index + 1}`}
                                  id={`face2_row${index + 1}`}
                                  style={{
                                    backgroundColor: row_style.face2[index].background.color,
                                    marginTop: row_style.face2[index].outer_margin.top,
                                    marginBottom: row_style.face2[index].outer_margin.bottom,
                                    marginLeft: row_style.face2[index].outer_margin.left,
                                    marginRight: row_style.face2[index].outer_margin.right,
                                    paddingTop: row_style.face2[index].inner_padding.top,
                                    paddingBottom: row_style.face2[index].inner_padding.bottom,
                                    paddingLeft: row_style.face2[index].inner_padding.left,
                                    paddingRight: row_style.face2[index].inner_padding.right,
                                    borderTop: `${row_style.face2[index].border.top.thickness}px ${row_style.face2[index].border.top.bordertype} ${row_style.face2[index].border.top.color}`,
                                    borderBottom: `${row_style.face2[index].border.bottom.thickness}px ${row_style.face2[index].border.bottom.bordertype} ${row_style.face2[index].border.bottom.color}`,
                                    borderLeft: `${row_style.face2[index].border.left.thickness}px ${row_style.face2[index].border.left.bordertype} ${row_style.face2[index].border.left.color}`,
                                    borderRight: `${row_style.face2[index].border.right.thickness}px ${row_style.face2[index].border.right.bordertype} ${row_style.face2[index].border.right.color}`,
                                    textAlign: row_font.face2[index].align,
                                    fontWeight: `${row_font.face2[index].bold === "on" ? 700 : 400}`,
                                    color: row_font.face2[index].color,
                                    fontFamily: `${
                                      row_font.face2[index].font === "고딕"
                                        ? `NanumGothic`
                                        : row_font.face2[index].font === "명조"
                                        ? `NanumMyeongjo`
                                        : row_font.face2[index].font === "바탕"
                                        ? `Gowun Batang, sans-serif`
                                        : row_font.face2[index].font === "돋움"
                                        ? `Gowun Dodum, sans-serif`
                                        : ""
                                    } `,
                                    fontStyle: `${row_font.face2[index].italic === "on" ? "italic" : "normal"}`,
                                    fontSize: row_font.face2[index].size,
                                    textDecoration: `${row_font.face2[index].underline === "on" ? "underline" : "none"}`,
                                  }}
                                >
                                  {item === "1" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➀</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "2" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➁</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "3" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➂</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "4" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➃</span>
                                      </div>
                                    </>
                                  )}
                                  {item === "5" && (
                                    <>
                                      <div style={{ display: "flex", alignItems: "center" }}>
                                        <span style={{ marginRight: "5px", fontSize: "1rem" }}>정답 : </span>
                                        <span style={{ fontSize: "1.5rem" }}>➄</span>
                                      </div>
                                    </>
                                  )}

                                  {index !== 0 && <FroalaEditorView model={item} />}
                                </div>
                              </>
                            ))}

                          {(content_value.selection === null || content_value.selection.length === 0) &&
                            content_value.face2.map((item, index) => (
                              <>
                                <div
                                  key={`face2_row${index + 1}`}
                                  id={`face2_row${index + 1}`}
                                  style={{
                                    backgroundColor: row_style.face2[index].background.color,
                                    marginTop: row_style.face2[index].outer_margin.top,
                                    marginBottom: row_style.face2[index].outer_margin.bottom,
                                    marginLeft: row_style.face2[index].outer_margin.left,
                                    marginRight: row_style.face2[index].outer_margin.right,
                                    paddingTop: row_style.face2[index].inner_padding.top,
                                    paddingBottom: row_style.face2[index].inner_padding.bottom,
                                    paddingLeft: row_style.face2[index].inner_padding.left,
                                    paddingRight: row_style.face2[index].inner_padding.right,
                                    borderTop: `${row_style.face2[index].border.top.thickness}px ${row_style.face2[index].border.top.bordertype} ${row_style.face2[index].border.top.color}`,
                                    borderBottom: `${row_style.face2[index].border.bottom.thickness}px ${row_style.face2[index].border.bottom.bordertype} ${row_style.face2[index].border.bottom.color}`,
                                    borderLeft: `${row_style.face2[index].border.left.thickness}px ${row_style.face2[index].border.left.bordertype} ${row_style.face2[index].border.left.color}`,
                                    borderRight: `${row_style.face2[index].border.right.thickness}px ${row_style.face2[index].border.right.bordertype} ${row_style.face2[index].border.right.color}`,
                                    textAlign: row_font.face2[index].align,
                                    fontWeight: `${row_font.face2[index].bold === "on" ? 700 : 400}`,
                                    color: row_font.face2[index].color,
                                    fontFamily: `${
                                      row_font.face2[index].font === "고딕"
                                        ? `NanumGothic`
                                        : row_font.face2[index].font === "명조"
                                        ? `NanumMyeongjo`
                                        : row_font.face2[index].font === "바탕"
                                        ? `Gowun Batang, sans-serif`
                                        : row_font.face2[index].font === "돋움"
                                        ? `Gowun Dodum, sans-serif`
                                        : ""
                                    } `,
                                    fontStyle: `${row_font.face2[index].italic === "on" ? "italic" : "normal"}`,
                                    fontSize: row_font.face2[index].size,
                                    textDecoration: `${row_font.face2[index].underline === "on" ? "underline" : "none"}`,
                                  }}
                                >
                                  <FroalaEditorView model={item} />
                                </div>
                              </>
                            ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </>
            );
          }
        });
        return show_contents;
      });
    }

    return (
      <>
        <div style={{ height: "100%", display: "flex", flexDirection: "column", marginBottom: "50px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
              <div style={{ width: "50px", fontSize: "1rem", marginRight: "5px" }}>완료율</div>
              <ProgressBar bgcolor={"#32c41e"} completed={100} />
            </div>
            <div style={{ fontSize: "1rem", width: "70px", textAlign: "right" }}>Click : {this.state.clickCount}</div>
          </div>
          <div style={{ display: "flex", marginTop: "5px", justifyContent: "space-between", alignItems: "center" }}>
            <Timer
              startTimer={this.startTimer}
              startTimerTotal={this.startTimerTotal}
              stopTimerTotal={this.stopTimerTotal}
              startTimerResume={this.startTimerResume}
              time={this.state.time}
              time_total={this.state.time_total}
              isOn_total={this.state.isOn_total}
            />
          </div>
          <div style={style_study_layout_bottom}>
            <div style={{ width: "100%", border: "1px solid lightgrey" }}>
              <div style={{ height: "15px", paddingLeft: "5px" }}>{makerFlagContent}</div>
              <div style={contentsDisplay}>
                {face1Contents}
                {face2Contents}
              </div>
            </div>
          </div>
          <div style={{ width: "100%", textAlign: "center", marginBottom: "50px", position: "fixed", bottom: 0, left: 0, zIndex: 3 }}>
            <Space style={{ width: "95%", justifyContent: "space-between", backgroundColor: "#dadada", borderRadius: "4px", padding: 5, border: "1px solid #bcbcbc" }}>
              <Button icon={<StepBackwardOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.onClickBeforeCard} type="secondary" />
              {!this.state.onBackMode && this.state.restore === false && diffiButtons}
              {this.state.restore === true && !this.state.onBackMode && restoreDiffiButtons}
              {!this.state.onBackMode && moreMenu}
              {this.state.onBackMode && !this.state.backModeRestore && goBackToCurrent}
              {this.state.onBackMode && this.state.backModeRestore && restoreModeGoBackToCurrent}
              {this.state.onBackMode && (
                <Button icon={<StepForwardOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.onClickNextCardInBackMode} type="secondary" />
              )}
            </Space>
          </div>
        </div>
      </>
    );
  }
}

const style_study_layout_bottom = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  margin: "auto",
  marginTop: "5px",
  height: "100%",
};
const contentsDisplay = {
  backgroundColor: "white",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
};
