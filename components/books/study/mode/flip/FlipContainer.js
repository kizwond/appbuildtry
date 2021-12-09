import React, { Component, useState, useEffect, useCallback, useRef } from "react";
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
} from "@ant-design/icons";

import dynamic from "next/dynamic";

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

class FlipContainer extends Component {
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
    };
    this.keyCount = 0;
    this.getKey = this.getKey.bind(this);
  }
  getKey() {
    return this.keyCount++;
  }
  onClickCard = () => {
    console.log("here");
  };

  handleClickPopover = (visible) => {
    this.setState({
      popoverClicked: visible,
    });
  };

  onClickNextCard = () => {
    const cardListLength = this.props.cardListStudying.length;
    const cardSeqNum = this.state.cardSeq + 1;
    if (cardListLength === cardSeqNum) {
      alert("마지막 카드여~");
    } else {
      this.setState((prevState) => ({
        cardSeq: prevState.cardSeq + 1,
      }));
      this.setState((prevState) => ({
        clickCount: prevState.clickCount + 1,
      }));
    }
  };

  onClickNextCardInBackMode = () => {
    if (this.state.originCardSeq === this.state.cardSeq + 1) {
      this.setState({
        onBackMode: false,
      });
      this.setState((prevState) => ({
        cardSeq: prevState.cardSeq + 1,
      }));
    } else {
      this.setState((prevState) => ({
        cardSeq: prevState.cardSeq + 1,
      }));
      this.setState((prevState) => ({
        clickCount: prevState.clickCount + 1,
      }));
    }
  };

  onClickBeforeCard = () => {
    const cardSeqNum = this.state.cardSeq;
    if (this.state.onBackMode === false) {
      this.setState({
        originCardSeq: this.state.cardSeq,
      });
    }
    if (cardSeqNum === 0) {
      alert("이전카드 더 없어요~");
    } else {
      this.setState((prevState) => ({
        cardSeq: prevState.cardSeq - 1,
      }));
      this.setState({
        onBackMode: true,
      });
      this.setState((prevState) => ({
        clickCount: prevState.clickCount + 1,
      }));
    }
  };
  onDiffClickHandler = () => {
    console.log("난이도 선택하셨네요~");
    this.onClickNextCard();
  };

  onClickGoBackToOrigin = () => {
    this.setState({
      cardSeq: this.state.originCardSeq,
    });
    this.setState((prevState) => ({
      onBackMode: !prevState.onBackMode,
    }));
    this.setState((prevState) => ({
      clickCount: prevState.clickCount + 1,
    }));
  };

  onClickPassHandler = () => {
    this.setState({
      popoverClicked: false,
    });
    this.onClickNextCard();
  };

  onClickSuspendHandler = () => {
    this.setState({
      popoverClicked: false,
    });
    this.onClickNextCard();
  };

  onClickCompletedHandler = () => {
    this.setState({
      popoverClicked: false,
    });
    this.onClickNextCard();
  };
  render() {
    if (this.props.levelConfigs) {
      const current_card_book_id = this.props.cardListStudying[this.state.cardSeq].card_info.mybook_id;
      const current_card_id = this.props.cardListStudying[this.state.cardSeq].content.mycontent_id;
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
      var diffiButtons = useDiffi.map((item) => (
        <>
          <Button size="small" type="primary" style={{ fontSize: "0.8rem", borderRadius:"3px" }} onClick={() => this.onDiffClickHandler(item.period, item.name, current_card_id)}>
            {item.nick}
          </Button>
        </>
      ));

      var goBackToCurrent = (
        <>
          <Button size="small" type="primary" style={{ fontSize: "0.8rem" }} onClick={this.onClickGoBackToOrigin}>
            원위치에서 학습 이어하기
          </Button>
        </>
      );

      const moreMenuContents = (
        <Space>
          <Button icon={<SwapRightOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.onClickPassHandler} type="primary">
            통과
          </Button>
          <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.onClickSuspendHandler} type="primary">
            보류
          </Button>
          <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.onClickCompletedHandler} type="primary">
            졸업
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
      var makerFlagContent = this.props.cardListStudying.map((content) => {
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
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === this.state.cardSeq) {
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
      var face1Contents = this.props.cardListStudying.map((content) => {
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
        // console.log(row_font);
        // console.log(content);
        // console.log(contentsList);
        const show_contents = contentsList.map((content_value, index) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === this.state.cardSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);
            return (
              <>
                {content.card_info.cardtype === "read" && (
                  <>
                    <div className={`${content._id} other`}>
                      <div style={{ marginBottom: "0px" }}>
                        <div onClick={() => this.onClickCard(content._id, "read")}>
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
                    </div>
                  </>
                )}
                {content.card_info.cardtype === "general" && (
                  <>
                    <div className={`${content._id} child_group other`}>
                      <div style={{ marginBottom: "0px" }}>
                        <div onClick={() => this.onClickCard(content._id, "general")}>
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
                    </div>
                  </>
                )}
                {content.card_info.cardtype === "flip" && (
                  <>
                    <div className={`${content.card_info.parentCard_id} ${content._id} child_group other`}>
                      <div style={{ marginBottom: "0px" }}>
                        <div
                          onClick={() => this.onClickCard(content._id, "flip", content.card_info.parentCard_id)}
                          // style={{ borderLeft: `${content.card_info.hasParent === "yes" && "2px solid green"}` }}
                        >
                          {/* 페이스1 스타일 영역 */}

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
                    </div>
                  </>
                )}
              </>
            );
          }
        });
        return show_contents;
      });
      var face2Contents = this.props.cardListStudying.map((content) => {
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
        // console.log(row_font);
        // console.log(content);
        // console.log(contentsList);
        const show_contents = contentsList.map((content_value, index) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === this.state.cardSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);
            return (
              <>
                {content.card_info.cardtype === "flip" && (
                  <>
                    <div className={`${content.card_info.parentCard_id} ${content._id} child_group other`}>
                      <div style={{ marginBottom: "0px" }}>
                        <div onClick={() => this.onClickCard(content._id, "flip", content.card_info.parentCard_id)}>
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

                            {content_value.selection === null ||
                              (content_value.selection.length === 0 &&
                                content_value.face2.map((item, index) => (
                                  <>
                                    <div
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
                                )))}
                          </div>
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
        <div style={{ display: "flex", flexDirection: "column", marginBottom: "50px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
              <div style={{ width: "50px", fontSize: "1rem", marginRight: "5px" }}>완료율</div>
              <ProgressBar bgcolor={"#32c41e"} completed={100} />
            </div>
            <div style={{ fontSize: "1rem", width: "70px", textAlign: "right" }}>Click : {this.state.clickCount}</div>
          </div>
          <div style={style_study_layout_bottom}>
            <div style={{ width: "100%", border: "1px solid lightgrey" }}>
              <div>{makerFlagContent}</div>
              <div style={contentsDisplay}>
                <div style={{ position: "relative", minHeight: "200px", height: "50%", width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>{face1Contents}</div>
                <div style={{ position: "relative", minHeight: "200px", height: "50%", width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>{face2Contents}</div>
              </div>
            </div>
          </div>
          <div style={{  width:"100%", textAlign:"center", marginBottom: "50px", position: "fixed", bottom: 0, left: 0, zIndex: 3, }}>
            <Space style={{width:"95%", justifyContent:"space-between", backgroundColor:"#274c96", borderRadius:"4px", padding:10,boxShadow: "0px 0px 7px -2px black"}}>
              <Button icon={<StepBackwardOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={this.onClickBeforeCard} type="secondary" />
              {!this.state.onBackMode && diffiButtons}
              {!this.state.onBackMode && moreMenu}
              {this.state.onBackMode && goBackToCurrent}
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

export default FlipContainer;

const style_study_layout_bottom = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  margin: "auto",
  marginTop: "10px",
};
const contentsDisplay = {
  minHeight: "300px",
  backgroundColor: "white",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
};
