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
import { calculateStudyStatus } from "./FlipContainerSub";
import { detect, detectAll } from "tinyld";
import produce from "immer";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const FlipContainer = ({ cardListStudying, contentsList, sessionScope, levelConfigs, cardTypeSets }) => {
  const router = useRouter();
  const [session_updateResults] = useMutation(UpdateResults, { onCompleted: showdataafterupdateresult });
  function showdataafterupdateresult(data) {
    console.log("data", data);
    if (data.session_updateResults.status === "200") {
      router.push("/m/study/result");
    }
  }

  const sessionupdateresults = useCallback(
    async (sessionId, filtered, resultOfSession, resultByBook, createdCards, dataForRegression) => {
      try {
        await session_updateResults({
          variables: {
            forUpdateResults: {
              session_id: sessionId,
              createdCards,
              studyResults: filtered,
              resultOfSession,
              resultByBook: produce(resultByBook, (draft) => {
                draft.forEach((book) => delete book.bookTitle);
              }),
              dataForRegression,
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
      ttsOn: false,
      firstTimeTts: true,
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
    const now = new Date();
    const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info_index = card_details_session_origin.findIndex((item) => item.content.mycontent_id === current_card_id);
    const current_card_book_id = card_details_session_origin[current_card_info_index].card_info.mybook_id;
    const current_card_levelconfig = this.props.levelConfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);

    const card_details_session = calculateStudyStatus(null, diffi, current_card_info_index, timer, current_card_levelconfig[0]);

    console.log(card_details_session);

    //서버에 보내기 위한 학습정보 리스트 생성
    this.generateStudyStatus(card_details_session, current_card_info_index);
    //recent know time 여기서 리셋
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //여기다가 새로운 시퀀스 정보를 가공해야함.
    // this.generateCardSeq(card_details_session, now, current_card_id);
    const card_seq = sessionStorage.getItem("card_seq");
    this.determineStudyFinish(card_details_session, card_seq, current_card_id, now);
  };

  // onDiffClickHandler = (interval, diffi, current_card_id, timer) => {
  //   console.log("난이도 선택하셨네요~");

  //   console.log("해당카드 난이도평가", interval, diffi, current_card_id, timer);
  //   if (diffi === "diffi5") {
  //     console.log("알겠음 클릭함.");
  //     this.Diffi5Handler(diffi, current_card_id, timer);
  //   } else {
  //     const now = new Date();
  //     const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
  //     const current_card_info_index = card_details_session_origin.findIndex((item) => item.content.mycontent_id === current_card_id);
  //     console.log(current_card_info_index);

  //     const card_details_session = calculateStudyStatus(interval, diffi, current_card_info_index, timer);

  //     //업데이트된 학습정보 세션스토리지에 다시 저장
  //     sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

  //     //서버에 보내기 위한 학습정보 리스트 생성
  //     this.generateStudyStatus(card_details_session, current_card_info_index);

  //     //남은카드랑 이래저래 해서 학습이 종료되었는지...
  //     const card_seq = sessionStorage.getItem("card_seq");
  //     this.determineStudyFinish(card_details_session, card_seq, current_card_id, now);
  //   }
  // };

  onDiffClickHandler = (current_card_id, timer, studyRatio) => {
    console.log("난이도 선택하셨네요~");

    const now = new Date();
    const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info_index = card_details_session_origin.findIndex((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info_index);

    const current_card_book_id = card_details_session_origin[current_card_info_index].card_info.mybook_id;
    const current_card_levelconfig = this.props.levelConfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);

    const card_details_session = calculateStudyStatus(null, "difficulty", current_card_info_index, timer, current_card_levelconfig[0], studyRatio);
    // const card_details_session = calculateStudyStatus(interval, diffi, current_card_info_index, timer);

    //업데이트된 학습정보 세션스토리지에 다시 저장
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //서버에 보내기 위한 학습정보 리스트 생성
    this.generateStudyStatus(card_details_session, current_card_info_index);

    //남은카드랑 이래저래 해서 학습이 종료되었는지...
    const card_seq = sessionStorage.getItem("card_seq");
    this.determineStudyFinish(card_details_session, card_seq, current_card_id, now);
  };

  determineStudyFinish = (card_details_session, card_seq, current_card_id, now) => {
    if (card_details_session.length - 1 == Number(card_seq)) {
      console.log("원래는 끝난거!!!");
      this.finishStudy();
    } else {
      console.log(card_details_session.length - 1, "======", Number(card_seq));
      console.log("아직 안끝");
      //여기다가 새로운 시퀀스 정보를 가공해야함.
      this.generateCardSeq(card_details_session, now, current_card_id);

      // this.setTimer(0);
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

    this.setState({
      ttsOn: true,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.contentsList !== prevProps.contentsList) {
      console.log(this.props.contentsList);
      if (this.props.contentsList.length === 0) {
        alert("학습할 카드가 없습니다. 학습메인으로");
        window.location.href = "/m/study";
      }
      if (this.props.contentsList.length > 0) {
        if (this.state.firstTimeTts === true) {
          console.log(this.props.contentsList);
          const show_contents = this.props.contentsList[0];
          console.log(show_contents);
          const face1_tmp = show_contents.face1[0].replace(/<\/?[^>]+(>|$)/g, "");
          if (show_contents.face2[0]) {
            const face2_tmp = show_contents.face2[0].replace(/<\/?[^>]+(>|$)/g, "");
            var face2 = face2_tmp.replace(/\w+\s*(?=\:)\:|[가-힣]+\s*(?=\:)\:/gi, "");
          }

          const face1 = face1_tmp.replace(/\w+\s*(?=\:)\:|[가-힣]+\s*(?=\:)\:/gi, "");

          console.log(face1);
          console.log(face2);
          this.speakTextFirstCard(face1, face2);
          this.setState({
            firstTimeTts: false,
          });
        }
      }
    }
    if (this.state.ttsOn) {
      this.speakText();
      this.setState({
        ttsOn: false,
      });
    }
  }

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

    const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
    console.log("card_details_session", card_details_session);

    const current_card_info_index = card_details_session_origin.findIndex((item) => item._id === current_card_id);
    console.log(current_card_info_index);

    const card_details_session = calculateStudyStatus(null, selection, current_card_info_index, timer);

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

    // this.generateCardSeq(card_details_session, now, current_card_id);
    const card_seq = sessionStorage.getItem("card_seq");
    this.determineStudyFinish(card_details_session, card_seq, current_card_id, now);
  };

  onClickHoldHandler = (current_card_id, from) => {
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
    } else {
      // this.generateCardSeq(card_details_session, now, current_card_id);
      const card_seq = sessionStorage.getItem("card_seq");
      this.determineStudyFinish(card_details_session, card_seq, current_card_id, now);
    }
  };

  generateHoldCompletedRestoretudyStatus = (current_card_id, selection) => {
    const timer = this.state.time;
    const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info_index = card_details_session_origin.findIndex((item) => item._id === current_card_id);
    console.log(current_card_info_index);

    const card_details_session = calculateStudyStatus(null, selection, current_card_info_index, timer);

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
      // this.generateCardSeq(card_details_session, now, current_card_id);
      const card_seq = sessionStorage.getItem("card_seq");
      this.determineStudyFinish(card_details_session, card_seq, current_card_id, now);
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
  speakTextFirstCard = (face1, face2) => {
    console.log("tts");
    if (face2) {
      const hello = async () => this.speakTextFace1(face1);
      hello().then(this.speakTextFace2(face2));
    } else {
      const hello = async () => this.speakTextFace1(face1);
      hello();
    }
  };
  speakText = () => {
    console.log("tts");
    const hello = async () => this.speakTextFace1();
    hello().then(this.speakTextFace2());
  };
  speakTextFace1 = (face1) => {
    if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
      console.log("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }
    if (face1) {
      var text = face1;
    } else {
      const text_tmp = document.getElementById("face1_row1").innerText;
      text = text_tmp.replace(/\w+\s*(?=\:)\:|[가-힣]+\s*(?=\:)\:/gi, "");
    }
    // window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

    console.log(text);
    if (text !== null) {
      const detected = detect(text);
      console.log(detected);

      const speechMsg = new SpeechSynthesisUtterance();
      speechMsg.rate = 1; // 속도: 0.1 ~ 10
      speechMsg.pitch = 1; // 음높이: 0 ~ 2
      speechMsg.lang = detected;
      speechMsg.text = text;

      // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
      window.speechSynthesis.speak(speechMsg);
    }
  };

  speakTextFace2 = (face2) => {
    if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
      console.log("이 브라우저는 음성 합성을 지원하지 않습니다.");
      return;
    }
    if (face2) {
      var text = face2;
    } else {
      const text_id = document.getElementById("face2_row1");
      if (text_id === null) {
        return;
      } else {
        var text_tmp = document.getElementById("face2_row1").innerText;
      }
      text = text_tmp.replace(/\w+\s*(?=\:)\:|[가-힣]+\s*(?=\:)\:/gi, "");
    }
    // window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

    console.log(text);
    if (text !== null) {
      const detected = detect(text);
      console.log(detected);

      const speechMsg = new SpeechSynthesisUtterance();
      speechMsg.rate = 1; // 속도: 0.1 ~ 10
      speechMsg.pitch = 1; // 음높이: 0 ~ 2
      speechMsg.lang = detected;
      speechMsg.text = text;

      // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
      window.speechSynthesis.speak(speechMsg);
    }
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
    const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info_index = sessionStorage.getItem("card_seq");
    const current_card_book_id = card_details_session_origin[current_card_info_index].card_info.mybook_id;
    const current_card_levelconfig = this.props.levelConfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);

    const timer = this.state.time;
    const now = new Date();

    const card_details_session = calculateStudyStatus(null, "finish", current_card_info_index, timer, current_card_levelconfig[0]);

    //업데이트된 학습정보 세션스토리지에 다시 저장
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //서버에 보내기 위한 학습정보 리스트 생성
    this.generateStudyStatus(card_details_session, current_card_info_index);
  };
  finishStudy = () => {
    console.log("finishStudy Clicked!!!");
    this.generateOnFinishStudyStatus();
    // alert("공부끝!!! 학습데이터를 서버로 전송합니다.");
    const cardlist_to_send = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));
    const resultByBook = JSON.parse(sessionStorage.getItem("resultByBook"));
    const createdCards = JSON.parse(sessionStorage.getItem("createdCards"));
    const dataForRegression = JSON.parse(sessionStorage.getItem("dataForRegression"));
    const filtered = cardListStudying.filter((item) => item.studyStatus.isUpdated === true);
    if (filtered) {
      console.log("서버에 학습데이타를 전송할 시간이다!!!!");
      sessionStorage.setItem("card_seq", 0);
      const sessionId = sessionStorage.getItem("session_Id");
      filtered.forEach(function (v) {
        delete v.__typename;
        delete v.studyStatus.userFlagPrev;
        delete v.studyStatus.userFlagOriginal;
        delete v.studyStatus.studyHourInSession;
        delete v.studyStatus.statusPrev;
        delete v.studyStatus.statusOriginal;
        delete v.studyStatus.needStudyTimeTmp;
        delete v.studyStatus.isUpdated;
        delete v.studyStatus.clickTimesInSession;
        delete v.studyStatus.__typename;
        delete v.studyStatus.levelOriginal;
        delete v.content;
        delete v._id;
        delete v.card_info.time_created;
        delete v.card_info.__typename;
        delete v.seqInCardlist;
      });

      // filtered.forEach(function (v) {
      //   delete v.__typename;
      // });
      // filtered.forEach(function (v) {
      //   delete v.card_info.__typename;
      // });
      // filtered.forEach(function (v) {
      //   delete v.card_info.time_created;
      // });
      // filtered.forEach(function (v) {
      //   delete v._id;
      // });
      // filtered.forEach(function (v) {
      //   delete v.content;
      // });
      // filtered.forEach(function (v) {
      //   delete v.studyStatus.__typename;
      // });

      // filtered.forEach(function (v) {
      //   delete v.studyStatus.clickTimesInSession;
      // });
      // filtered.forEach(function (v) {
      //   delete v.studyStatus.isUpdated;
      // });
      // filtered.forEach(function (v) {
      //   delete v.studyStatus.needStudyTimeTmp;
      // });
      // filtered.forEach(function (v) {
      //   delete v.studyStatus.statusOriginal;
      // });
      // filtered.forEach(function (v) {
      //   delete v.studyStatus.statusPrev;
      // });
      // filtered.forEach(function (v) {
      //   delete v.studyStatus.studyHourInSession;
      // });

      // filtered.forEach(function (v) {
      //   delete v.studyStatus.userFlagOriginal;
      // });
      // filtered.forEach(function (v) {
      //   delete v.studyStatus.userFlagPrev;
      // });

      console.log("filtered : ", filtered);
      console.log("sessionId : ", sessionId);
      this.props.sessionupdateresults(sessionId, filtered, resultOfSession, resultByBook, createdCards, dataForRegression);
    } else {
      console.log("공부끝");
    }
  };

  render() {
    if (this.props.levelConfigs) {
      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));
      var sumClicks = resultOfSession.clicks.total;
      const inserted =
        resultOfSession.numCards.completed.inserted + resultOfSession.numCards.hold.inserted + resultOfSession.numCards.ing.inserted + resultOfSession.numCards.yet.inserted;
      const finished =
        resultOfSession.numCards.completed.finished + resultOfSession.numCards.hold.finished + resultOfSession.numCards.ing.finished + resultOfSession.numCards.yet.finished;

      if (finished === 0) {
        var progress = 0;
      } else {
        progress = (finished / inserted) * 100;
      }
      // console.log(inserted,finished)
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
        var diffiButtons = (
          <div
            style={{
              width: "80%",
              display: "flex",
              flexGrow: 1,
              justifyContent: "space-between",
              background: "linear-gradient(270deg, rgba(65,255,0,1) 0%, rgba(232,255,0,1) 50%, rgba(255,0,0,1) 100%)",
            }}
          >
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 2.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 7.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 12.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 17.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 22.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 27.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 32.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 37.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 42.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 47.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 52.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 57.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 62.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 67.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 72.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 77.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 82.5)} style={{ width: "5%" }}></button>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 87.5)} style={{ width: "5%" }}></button>
            <span style={{ width: "3%", backgroundColor: "#dadada" }}></span>
            <button onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 95)} style={{ width: "15%", border: "1px dashed #03c30d" }}></button>
          </div>
        );
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
              <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickHoldHandler(current_card_id, "back")} type="primary">
                보류
              </Button>
              <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickCompletedHandler(current_card_id, "back")} type="primary">
                졸업
              </Button>
            </>
          )}

          {/* <Button icon={<CheckCircleOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.finishStudy} type="primary">
            학습종료
          </Button> */}
        </Space>
      );

      const restoreBackModeMoreMenuContents = (
        <Space>
          <>
            <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickHoldHandler(current_card_id, "back")} type="primary">
              보류
            </Button>
            <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickCompletedHandler(current_card_id, "back")} type="primary">
              졸업
            </Button>
          </>

          {/* <Button icon={<CheckCircleOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.finishStudy} type="primary">
            학습종료
          </Button> */}
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
          <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickHoldHandler(current_card_id)} type="primary">
            보류
          </Button>
          <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickCompletedHandler(current_card_id)} type="primary">
            졸업
          </Button>
          {/* <Button icon={<CheckCircleOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.finishStudy} type="primary">
            학습종료
          </Button> */}
        </Space>
      );
      var moreMenu = (
        <>
          <Popover visible={this.state.popoverClicked} onVisibleChange={this.handleClickPopover} placement="left" content={moreMenuContents} trigger="click">
            <Button icon={<DashOutlined />} size="small" style={{ fontSize: "1rem", marginLeft: "5px" }} type="secondary" />
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
                          ? `Nanum Gothic, sans-serif`
                          : comment_font_font === "명조"
                          ? `Nanum Myeongjo, sans-serif`
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
                                      ? `Nanum Gothic, sans-serif`
                                      : row_font.face1[index].font === "명조"
                                      ? `Nanum Myeongjo, sans-serif`
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
                                      ? `Nanum Gothic, sans-serif`
                                      : row_font.face1[index].font === "명조"
                                      ? `Nanum Myeongjo, sans-serif`
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
                                      ? `Nanum Gothic, sans-serif`
                                      : row_font.face1[index].font === "명조"
                                      ? `Nanum Myeongjo, sans-serif`
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
                                <div id={`face1_row${index + 1}`} style={{ display: "none" }} readOnly>
                                  {item.replace(/<\/?[^>]+(>|$)/g, "")}
                                </div>
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
                                        ? `Nanum Gothic, sans-serif`
                                        : row_font.face1[row_font.face1.length - 1].font === "명조"
                                        ? `Nanum Myeongjo, sans-serif`
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
                            content_value.selection.length > 0 &&
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
                                        ? `Nanum Gothic, sans-serif`
                                        : row_font.face2[index].font === "명조"
                                        ? `Nanum Myeongjo, sans-serif`
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
                                  // id={`face2_row${index + 1}`}
                                  value={item}
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
                                        ? `Nanum Gothic, sans-serif`
                                        : row_font.face2[index].font === "명조"
                                        ? `Nanum Myeongjo, sans-serif`
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
                                  <div id={`face2_row${index + 1}`} style={{ display: "none" }} readOnly>
                                    {item.replace(/<\/?[^>]+(>|$)/g, "")}
                                  </div>
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
            <div style={{ width: "50%", display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
              <div style={{ width: "45px", fontSize: "0.8rem", marginRight: "5px" }}>완료율</div>
              <ProgressBar bgcolor={"#32c41e"} completed={progress} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ lineHeight: "0.8rem", marginBottom: "0px", fontSize: "0.8rem", display: "flex", flexDirection: "column", marginRight: "10px" }}>
                <div>click</div>
                <div>count</div>
              </div>
              <div
                style={{
                  backgroundColor: "#f2f2f2",
                  boxShadow: "inset 2px 2px 3px 0px #cccccc",
                  textAlign: "right",
                  paddingRight: "5px",
                  width: "30px",
                  fontFamily: "Mina, sans-serif",
                  fontSize: "0.9rem",
                  lineHeight: "20px",
                  height: "20px",
                }}
              >
                {sumClicks}
              </div>
            </div>
            <Button size="small" style={{ fontSize: "0.8rem", width: "53px", borderRadius: "3px" }} onClick={this.finishStudy} type="primary">
              학습종료
            </Button>
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
            <div
              style={{
                width: "95%",
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                justifyContent: "space-between",
                backgroundColor: "#dadada",
                borderRadius: "4px",
                padding: 5,
                border: "1px solid #bcbcbc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  icon={<StepBackwardOutlined />}
                  size="small"
                  style={{ fontSize: "1rem", flexGrow: 0, marginRight: "5px" }}
                  onClick={this.onClickBeforeCard}
                  type="secondary"
                />
                {!this.state.onBackMode && this.state.restore === false && diffiButtons}
                {this.state.restore === true && !this.state.onBackMode && restoreDiffiButtons}
                {!this.state.onBackMode && moreMenu}
                {this.state.onBackMode && !this.state.backModeRestore && goBackToCurrent}
                {this.state.onBackMode && this.state.backModeRestore && restoreModeGoBackToCurrent}
                {this.state.onBackMode && (
                  <Button icon={<StepForwardOutlined />} size="small" style={{ fontSize: "1rem", flexGrow: 0 }} onClick={this.onClickNextCardInBackMode} type="secondary" />
                )}
              </div>
              <div style={{ flexBasis:"100%", fontSize: "0.8rem", display: "flex" }}>
                <div style={{ width: "24px", marginRight: "5px" }}></div>
                <div style={{display:"flex", justifyContent:"space-between", width:"80%"}}>
                  <div>0%</div>
                  <div>50%</div>
                  <div>90%</div>
                </div>
                <div style={{width:"3%"}}></div>
                <div style={{width:"15%"}}>100%</div>
                <div style={{ width: "24px", marginLeft: "5px" }}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const CalculateIf = ({ currentSeq, levelConfigs }) => {
  const estimate = calculateStudyStatus(null, "prediction", currentSeq, null, levelConfigs);
  const needStudyTimeGap = (estimate.needStudyTimeGap / 60000).toFixed();
  return (
    <>
      <span>[{needStudyTimeGap}분]</span>
    </>
  );
};
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
