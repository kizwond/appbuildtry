import React, { Component, useState, useEffect, useCallback } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";
import { GetLevelConfig, UpdateResults } from "../../../../../graphql/query/session";
import Timer from "./Timer";
import { Avatar, Menu, Radio, Modal, Popover, Space, Button, Input } from "antd";
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
import produce from "immer";
import { calculateExamStatus } from "./ExamContainerSub";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const ExamContainer = ({ cardListStudying, contentsList, sessionScope, levelConfigs, cardTypeSets }) => {
  const router = useRouter();
  const [session_updateResults] = useMutation(UpdateResults, { onCompleted: showdataafterupdateresult });
  function showdataafterupdateresult(data) {
    console.log("data", data);
    if (data.session_updateResults.status === "200") {
      sessionStorage.setItem("endTimeOfSession", new Date());
      sessionStorage.setItem("isFinished", "true")
      router.push("/m/study/examresult");
    }
  }

  const sessionupdateresults = useCallback(
    async (sessionId, filtered, resultOfSession, resultByBook, createdCards, dataForRegression, cardlist_to_send) => {
      try {
        await session_updateResults({
          variables: {
            forUpdateResults: {
              session_id: sessionId,
              createdCards,
              cardlistUpdated: filtered,
              clickHistory: cardlist_to_send,
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

export default ExamContainer;

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
      ttsOn: true,
      firstTimeTts: true,
      flip: true,
    };
    this.keyCount = 0;
    this.getKey = this.getKey.bind(this);
  }
  getKey() {
    return this.keyCount++;
  }

  //????????? ??????
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

  //????????? ?????? ???

  milliseconds = (h, m, s) => (h * 60 * 60 + m * 60 + s) * 1000;

  //??????????????? ????????? ?????? ????????? ??????
  generateCardSeq = () => {
    const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const origin_seq = sessionStorage.getItem("origin_seq");
    const card_seq = sessionStorage.getItem("card_seq");

    const listLength = card_details_session.length;
    console.log(listLength);
    if (Number(listLength) - 1 === Number(card_seq)) {
      alert("????????? ???????????????. ?????????????????? ???????????????.");
      this.finishExam();
    } else {
      if (card_seq === origin_seq) {
        this.setState({
          onBackMode: false,
        });
        sessionStorage.setItem("origin_seq", Number(origin_seq) + 1);
        sessionStorage.setItem("card_seq", Number(card_seq) + 1);
      } else {
        sessionStorage.setItem("card_seq", Number(card_seq) + 1);
      }

      this.stopTimerTotal();
      this.resetTimer();
    }
  };

  saveAnswer = (current_card_info, answer, content) => {
    console.log(current_card_info, answer, content.face1[0], content.face2[0]);

    //????????????????????????????????? rightanswer field????????? face2[0]??? ?????????.
    // ????????? examLog???????????? ????????????, ???????????? ?????? ?????????????????? ?????????.

    // const submitted = { cardId: current_card_info._id, card_info: current_card_info, answer: answer, content: content.face1[0] };
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const card_seq = sessionStorage.getItem("card_seq")
    cardListStudying[card_seq].studyStatus.recentExamAnswer = answer;
    cardListStudying[card_seq].studyStatus.rightAnswer = content.face2[0].replace(/(<([^>]+)>)/ig,"");
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
  };

  // ???????????? ??????
  onClickBeforeCard = () => {
    const card_seq = sessionStorage.getItem("card_seq");
    console.log(card_seq);
    if (Number(card_seq) === Number(0)) {
      alert("??????????????? ????????????.");
      return;
    } else {
      this.setState({
        onBackMode: true,
      });
      sessionStorage.setItem("card_seq", Number(card_seq) - 1);
    }
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

  finishExam = () => {
    calculateExamStatus();

    const cardlist_to_send = null;
    const filtered = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const resultOfSession = JSON.parse(sessionStorage.getItem("resultOfSession"));
    const resultByBook = JSON.parse(sessionStorage.getItem("resultByBook"));
    const createdCards = null;
    const dataForRegression = null;
    if (filtered) {
      console.log("????????? ?????????????????? ????????? ????????????!!!!");
      sessionStorage.setItem("card_seq", 0);
      const sessionId = sessionStorage.getItem("session_Id");
      filtered.forEach(function (v) {
        delete v.__typename;
        delete v.studyStatus.userFlagPrev;
        delete v.studyStatus.userFlagOriginal;
        delete v.studyStatus.statusPrev;
        delete v.studyStatus.statusOriginal;
        delete v.studyStatus.needStudyTimeTmp;
        delete v.studyStatus.isUpdated;
        delete v.studyStatus.levelUpdated;
        delete v.studyStatus.rightAnswer;
        delete v.studyStatus.__typename;
        delete v.content.hidden;
        delete v.content.underline;
        delete v.content.highlight;
        delete v.content.makerFlag.__typename;
        delete v.content.__typename;
        delete v._id;
        delete v.card_info.time_created;
        delete v.card_info.__typename;
        delete v.seqInCardlist;
      });
      this.props.sessionupdateresults(sessionId, filtered, resultOfSession, resultByBook, createdCards, dataForRegression, cardlist_to_send);
    }
    // const examLog = JSON.parse(sessionStorage.getItem("examLog"));
    // console.log(examLog.filter((item) => item.answer !== ""));
    // const answerExist = examLog.filter((item) => item.answer !== "");
    // const lastIdOfExist = answerExist[answerExist.length - 1].cardId;
    // console.log(lastIdOfExist);
    // const indexOfLastExist = examLog.findIndex((item) => item.cardId === lastIdOfExist);
    // console.log(indexOfLastExist);
    // examLog.splice(indexOfLastExist + 1, examLog.length - 1);
    // console.log(examLog);
    // sessionStorage.setItem("examLog", JSON.stringify(examLog));

    // examresults??? ?????? ????????? ??????????????? ??????????????????.
  };

  render() {
    if (this.props.levelConfigs) {
      const examLog = JSON.parse(sessionStorage.getItem("examLog"));
      if (examLog !== null) {
        var totalLength = examLog.length;
        var filtered = examLog.filter((item) => item.answer);
        if (filtered === -1) {
          var progress = 0;
        } else {
          progress = (filtered.length / totalLength) * 100;
        }
      } else {
        var progress = 0;
      }
    }

    if (this.props.cardTypeSets.length > 0) {
      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      var makerFlagContent = card_details_session.map((content, index) => {
        const currentSeq = Number(sessionStorage.getItem("card_seq"));
        // console.log("????????? ????????? ????????? ??????", cardTypeSets);
        //   console.log(content);
        const cardTypeSets = this.props.cardTypeSets;
        const contentsList = this.props.contentsList;

        const current_card_style_set = cardTypeSets.filter((item) => item._id === content.card_info.cardtypeset_id);

        // console.log(current_card_style_set);

        const makerFlagStyle = current_card_style_set[0].makerFlag_style;
        // console.log(row_font);
        // console.log(content);
        // console.log(contentsList);
        const show_contents = contentsList.map((content_value) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("???????????? ??????", content);
            // console.log("??????????????? ??????", content_value);

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
                    alignItems: "center",
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
                  <span style={{ display: "flex", marginRight: "5px", fontSize: `${figure_size}px` }}>{ratings}</span>
                  <span
                    style={{
                      color: comment_font_color,
                      fontFamily: `${
                        comment_font_font === "??????"
                          ? `Nanum Gothic, sans-serif`
                          : comment_font_font === "??????"
                          ? `Nanum Myeongjo, sans-serif`
                          : comment_font_font === "??????"
                          ? `Gowun Batang, sans-serif`
                          : comment_font_font === "??????"
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
      var face1Contents = card_details_session.map((content, index) => {
        const currentSeq = Number(sessionStorage.getItem("card_seq"));
        // console.log("????????? ????????? ????????? ??????", cardTypeSets);
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
        const show_contents = contentsList.map((content_value) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("???????????? ??????", content);
            // console.log("??????????????? ??????", content_value);
            return (
              <>
                {content.card_info.cardtype === "flip" && (
                  <>
                    <div style={{ padding: 5, width: "100%", height: "100%",border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          // minHeight: "calc(75vh - 150px)",
                          height: "100%",
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
                                className="face1"
                                key={`face1_row${index + 1}`}
                                style={{
                                  visibility: `${this.props[`face1row${index + 1}`] === false ? "hidden" : "visible"}`,
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
                                    row_font.face1[index].font === "??????"
                                      ? `Nanum Gothic, sans-serif`
                                      : row_font.face1[index].font === "??????"
                                      ? `Nanum Myeongjo, sans-serif`
                                      : row_font.face1[index].font === "??????"
                                      ? `Gowun Batang, sans-serif`
                                      : row_font.face1[index].font === "??????"
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
                                  className="face1"
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
                                      row_font.face1[row_font.face1.length - 1].font === "??????"
                                        ? `Nanum Gothic, sans-serif`
                                        : row_font.face1[row_font.face1.length - 1].font === "??????"
                                        ? `Nanum Myeongjo, sans-serif`
                                        : row_font.face1[row_font.face1.length - 1].font === "??????"
                                        ? `Gowun Batang, sans-serif`
                                        : row_font.face1[row_font.face1.length - 1].font === "??????"
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
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>???</span>
                                        </>
                                      )}
                                      {index === 1 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>???</span>
                                        </>
                                      )}
                                      {index === 2 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>???</span>
                                        </>
                                      )}
                                      {index === 3 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>???</span>
                                        </>
                                      )}
                                      {index === 4 && (
                                        <>
                                          <span style={{ marginRight: "5px", fontSize: "1.5rem" }}>???</span>
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

      var diffiButtons = card_details_session.map((content, index) => {
        const currentSeq = Number(sessionStorage.getItem("card_seq"));
        // console.log("????????? ????????? ????????? ??????", cardTypeSets);
        //   console.log(content);

        const contentsList = this.props.contentsList;
        // const FroalaEditorView = this.props.FroalaEditorView;

        const show_contents = contentsList.map((content_value) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("???????????? ??????", content);
            // console.log("??????????????? ??????", content_value);

            const examLog = JSON.parse(sessionStorage.getItem("examLog"));
            if (examLog !== null) {
              const answerRecordedIndex = examLog.findIndex((item) => item.cardId === content._id);
              //   console.log(answerRecordedIndex)
              if (answerRecordedIndex === -1) {
                var answerField = "";
              } else {
                answerField = examLog[answerRecordedIndex].answer;
              }
            }

            return (
              <>
                {content.card_info.cardtype === "flip" && (
                  <>
                    {content_value.selection !== null &&
                      content_value.selection.length > 0 &&
                      content_value.selection.map((item, index) => (
                        <>
                          <Radio.Group defaultValue={answerField} buttonStyle="solid" size="small" onChange={(e) => this.saveAnswer(content, e.target.value, content_value)}>
                            {index === 0 && (
                              <>
                                <Radio.Button value="1">???</Radio.Button>
                              </>
                            )}
                            {index === 1 && (
                              <>
                                <Radio.Button value="2">???</Radio.Button>
                              </>
                            )}
                            {index === 2 && (
                              <>
                                <Radio.Button value="3">???</Radio.Button>
                              </>
                            )}
                            {index === 3 && (
                              <>
                                <Radio.Button value="4">???</Radio.Button>
                              </>
                            )}
                            {index === 4 && (
                              <>
                                <Radio.Button value="5">???</Radio.Button>
                              </>
                            )}
                          </Radio.Group>
                        </>
                      ))}

                    {(content_value.selection === null || content_value.selection.length === 0) &&
                      content_value.face2.map((item, index) => {
                        if (index === 0) {
                          return (
                            <>
                              <Input type="text" onChange={(e) => this.saveAnswer(content, e.target.value, content_value)} defaultValue={answerField} />
                            </>
                          );
                        }
                      })}
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
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ width: "95%", position: "fixed", top: "50px" }}>
            <div
              style={{
                margin:"auto",
                backgroundColor: "white",
                width: "100%",
                maxWidth: "972px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  padding: "1px 5px",
                  flexGrow: 1,
                  color: "#8b8b8b",
                  border: "1px solid lightgrey",
                  backgroundColor: "#f1f1f1",
                  borderRadius: "3px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ width: "100%", display: "flex", flexDirection: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                    <div style={{ marginBottom: "0px", fontSize: "0.8rem", marginRight: "5px", width: "37px", flexShrink: 0 }}>?????????</div>
                    <ProgressBar bgcolor={"#32c41e"} completed={progress} />
                  </div>
               
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
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
              </div>
              <Button size="small" style={{ fontSize: "1rem", width: "53px", height: "60px", borderRadius: "3px", marginLeft: "5px" }} onClick={this.finishExam} type="primary">
                ??????
                <br />
                ??????
              </Button>
            </div>
          </div>
          <div style={style_study_layout_bottom}>
            <div style={{ width: "100%",height: "100%"}}>
              <div style={{ height: "15px", paddingLeft: "5px" }}>{makerFlagContent}</div>
              <div style={contentsDisplay}>
                <div style={{height: "100%"}}>{face1Contents}</div>
              </div>
            </div>
          </div>
          <div style={{ width: "100%", height: "57px", textAlign: "center", marginBottom: "35px", position: "fixed", bottom: 0, left: 0, zIndex: 3 }}>
            <div
              style={{
                width: "95%",
                maxWidth: "972px",
                display: "flex",
                flexDirection: "column",
                margin: "auto",
                justifyContent: "space-between",
                backgroundColor: "#dadada",
                borderRadius: "4px",
                padding: "5px 5px 5px 5px",
                border: "1px solid #bcbcbc",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Button
                  icon={<StepBackwardOutlined />}
                  size="small"
                  style={{ fontSize: "1rem", flexGrow: 0, marginRight: "5px" }}
                  onClick={this.onClickBeforeCard}
                  type="secondary"
                />
                {diffiButtons}
                <Button icon={<StepForwardOutlined />} size="small" style={{ fontSize: "1rem", flexGrow: 0, marginLeft: "5px" }} onClick={this.generateCardSeq} type="secondary" />
              </div>
            </div>
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
  maxWidth: "972px",
  marginTop: "120px",
  height: "calc(100vh - 223px)",
  overflow: "auto",
  border: "1px solid lightgrey",
  borderRadius: "3px",
};
const contentsDisplay = {
  backgroundColor: "white",
  padding: "10px",
  alignItems: "center",
  height: "95%",
};