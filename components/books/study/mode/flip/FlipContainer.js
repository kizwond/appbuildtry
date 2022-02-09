import React, { Component, useState, useEffect, useCallback } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";
import { GetLevelConfig, UpdateResults } from "../../../../../graphql/query/session";
import Timer from "./Timer";
import { message, Divider, Tag, Modal, Popover, Space, Button, Input, Select, Checkbox } from "antd";
import ProgressBar from "./ProgressBar";
import { GetCardTypeSetByMybookIds } from "../../../../../graphql/query/cardtype";
import { MUTATION_UPDATE_USER_FLAG } from "../../../../../graphql/mutation/userFlagApply";
import { GetIndex, GetCardTypeSet } from "../../../../../graphql/query/allQuery";
import { GetCardSet } from "../../../../../graphql/query/cardtype";
import { AddCard } from "../../../../../graphql/query/card_contents";
import { QUERY_MY_CARD_CONTENTS } from "../../../../../graphql/query/allQuery";
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
  ProfileOutlined,
  HighlightOutlined,
  MessageOutlined,
  UnderlineOutlined,
  TagOutlined,
  PicRightOutlined,
  QuestionCircleOutlined,
  EyeInvisibleOutlined,
  FlagOutlined,
  SettingOutlined,
  CloseOutlined,
  ClearOutlined,
  EditOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { calculateStudyStatus } from "./FlipContainerSub";
import { detect, detectAll } from "tinyld";
import produce from "immer";
import decodeHtMLEntities from '../../../../common/logic/decodeHtMLEntities'

const { Option } = Select;

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const Editor = dynamic(() => import("../../../../../components/books/write/editpage/Editor"), {
  ssr: false,
});

const FlipContainer = ({
  cardListStudying,
  contentsList,
  sessionScope,
  levelConfigs,
  cardTypeSets,
  face1row,
  face2row,
  ttsOn,
  setTtsOn,
  userFlagDetails,
  isModalVisibleHidden,
  setIsModalVisibleHidden,
  setCardListStudying,
  cardsetDeleteEffect,
  updateUserFlag,
  setUserFlag,
  userFlag,
  setHiddenToggle,
  setUnderlineToggle,
  setHighlightToggle,
  saveMemo,
  sessionupdateresults,
  finishStudy,
  bookList,
  ttsNextState,
  setTTSNextState,
}) => {
  const [selectedCardType, setSelectedCardType] = useState();
  const [newCardEditor, setNewCardEditor] = useState();
  const [indexListForEditor, setIndexListForEditor] = useState([]);
  const [cardTypeSetForEditor, setCardTypeSetForEditor] = useState([]);
  const [bookSelectedForEditor, setBookSelectedForEditor] = useState("default");
  const [indexSelectedForEditor, setIndexSelectedForEditor] = useState("default");
  const [ttsArray, setTtsArray] = useState([]);
  const [played, setPlayed] = useState(false);

  const [indexset_getByMybookids, { loading: loading4, error: error4, data: selectedIndexForNewCardAdd }] = useLazyQuery(GetIndex, {
    onCompleted: afterGetIndex,
  });

  function afterGetIndex(data) {
    console.log(data);
    setIndexListForEditor(data.indexset_getByMybookids.indexsets[0].indexes);
    sessionStorage.setItem("indexset_id", data.indexset_getByMybookids.indexsets[0]._id);
  }

  const [cardtypeset_getbymybookids, { loading: loading5, error: error5, data: selectedCardTypeSetForNewCardAdd }] = useLazyQuery(GetCardTypeSet, {
    onCompleted: afterGetCardTypeSet,
  });

  function afterGetCardTypeSet(data) {
    console.log(data);
    setCardTypeSetForEditor(data.cardtypeset_getbymybookids.cardtypesets[0].cardtypes);
    sessionStorage.setItem("cardtypeset_id", data.cardtypeset_getbymybookids.cardtypesets[0]._id);
  }

  const [cardset_getByIndexIDs, { loading: loading6, error: error6, data: cardSetGet }] = useLazyQuery(GetCardSet, {
    onCompleted: afterGetCardSet,
  });

  function afterGetCardSet(data) {
    console.log(data);
    sessionStorage.setItem("cardset_id", data.cardset_getByIndexIDs.cardsets[0]._id);
  }

  const [cardset_addcardAtSameIndex] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    console.log(data);
    console.log(data.cardset_addcardAtSameIndex.cardsets[0].cards);
    const sameIndexCheck = sessionStorage.getItem("sameIndexSelectedCheck");
    const createdCards = JSON.parse(sessionStorage.getItem("createdCards"));

    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const card_seq = sessionStorage.getItem("card_seq");
    const currentCardId = cardListStudying[card_seq]._id;

    if (sameIndexCheck === "true") {
      const cardListReceived = data.cardset_addcardAtSameIndex.cardsets[0].cards;
      const filteredIndex = cardListReceived.findIndex((item) => item._id === currentCardId);
      const filteredData = cardListReceived[filteredIndex + 1];
      const {mybook_id, indexset_id, index_id, cardset_id, cardtypeset_id, cardtype_id, cardtype} = filteredData.card_info
      const {mycontent_id} = filteredData.content
      createdCards.push({mybook_id, indexset_id, index_id, cardset_id, cardtypeset_id, cardtype_id, cardtype, mycontent_id});
    } else {
      const filteredData = data.cardset_addcardAtSameIndex.cardsets[0].cards[data.cardset_addcardAtSameIndex.cardsets[0].cards.length - 1];
      const {mybook_id, indexset_id, index_id, cardset_id, cardtypeset_id, cardtype_id, cardtype} = filteredData.card_info
      const {mycontent_id} = filteredData.content
      createdCards.push({mybook_id, indexset_id, index_id, cardset_id, cardtypeset_id, cardtype_id, cardtype, mycontent_id});
    }
    sessionStorage.setItem("createdCards", JSON.stringify(createdCards));
  }
  async function addcard(
    mybook_id,
    cardtype,
    cardtype_id,
    current_position_card_id,
    indexSetId,
    index_id,
    cardSetId,
    face1_contents,
    selection_contents,
    face2_contents,
    annotation_contents,
    flagStar,
    flagComment,
    cardTypeSetId
  ) {
    const parentId = null;
    if (parentId === null) {
      var hasParent = "no";
      var parentCard_id = undefined;
    }
    try {
      await cardset_addcardAtSameIndex({
        variables: {
          forAddcardAtSameIndex: {
            currentPositionCardID: current_position_card_id,
            card_info: {
              mybook_id: mybook_id,
              indexset_id: indexSetId,
              index_id: index_id,
              cardset_id: cardSetId,
              cardtypeset_id: cardTypeSetId,
              cardtype_id,
              cardtype,
              hasParent: hasParent,
              parentCard_id: parentCard_id,
            },
            content: {
              // user_flag: null,
              // maker_flag: null,
              face1: face1_contents,
              selection: selection_contents,
              face2: face2_contents,
              annotation: annotation_contents,
              // memo: null,
            },
            makerFlag: {
              value: Number(flagStar),
              comment: flagComment,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const speakText = (ttsArray) => {
    window.speechSynthesis.cancel();
    const readModeTTSOption = JSON.parse(sessionStorage.getItem("readModeTTSOption"));
    if (ttsArray.length > 0) {
      ttsArray.map((item, index) => {
        var detected = detect(item);
        console.log(index, detected);
        if (!["ko", "en"].includes(detected)) {
          var lang = "en";
        } else {
          lang = detected;
        }
        const speechMsg = new SpeechSynthesisUtterance();
        // speechMsg.rate = readModeTTSOption.rate; // 속도: 0.1 ~ 10
        // speechMsg.pitch = readModeTTSOption.pitch; // 음높이: 0 ~ 2
        speechMsg.rate = 1; // 속도: 0.1 ~ 10
        speechMsg.pitch = 1; // 음높이: 0 ~ 2
        speechMsg.lang = "en";
        speechMsg.text = item;
        window.speechSynthesis.speak(speechMsg);
      });
      // sessionStorage.removeItem("ttsOrder");
      // ttsOption 변경시 리셋
      // 목차 변경시 리셋
    }
  };

  useEffect(() => {
    if (ttsArray.length > 0) {
      speakText(ttsArray);
    }
  }, [ttsArray]);

  const getTTSData = useCallback(() => {
    const readModeTTSOption = JSON.parse(sessionStorage.getItem("readModeTTSOption"));
    const currentFaceTmp = sessionStorage.getItem("currentFace");
    if (!currentFaceTmp) {
      var currentFace = "front";
      sessionStorage.setItem("currentFace", "front");
    } else {
      currentFace = currentFaceTmp;
    }
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const currentSeq = sessionStorage.getItem("card_seq");
    const current_card = cardListStudying[currentSeq];
    const mycontent_id = current_card.content.mycontent_id;
    const buycontent_id = current_card.content.buycontent_id;
    // const contentsList = this.props.contentsList;

    const contents = contentsList.filter((content_value) => {
      if (content_value._id === mycontent_id || content_value._id === buycontent_id) {
        return content_value;
      }
    });

    const seperateEngAndKor = (str) => {
      const arrayForTTS = [];
      while (str.length > 0) {
        const positionOfEnglish = str.search(/[a-zA-Z]/) == -1 ? 1000000 : str.search(/[a-zA-Z]/);
        const positionOfKorean = str.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/) == -1 ? 1000000 : str.search(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/);
        const targetPosition = Math.max(positionOfEnglish, positionOfKorean);
        const singleParagraph = str.substring(0, targetPosition);
        str = str.replace(singleParagraph, "");
        arrayForTTS.push(singleParagraph);
      }
      return arrayForTTS;
    };

    if (contents && currentFace === "front") {
      let arrFront = [];
      contents[0].face1.forEach((c, i) => {
        if (readModeTTSOption.faceOneTTS[i + 1] && contents[0].face1 !== null && contents[0].face1.length > 0) {
          const contentOnlyString =  decodeHtMLEntities(c).replace(
            /\/|\~/g,
            " "
          );

          const seperatedWithEngAndKor = seperateEngAndKor(contentOnlyString);
          arrFront.push(seperatedWithEngAndKor);
        }
      });

      if (readModeTTSOption.faceOneTTS.selection && contents[0].selection !== null && contents[0].selection.length > 0) {
        contents[0].selection.forEach((c, i) => {
          const contentWithoutTags =  decodeHtMLEntities(c).replace(
            /\/|\~/g,
            " "
          );
          arrFront.push(`${i + 1} ${seperateEngAndKor(contentWithoutTags)}`);
        });
      }
      const flattenContentsFront = _.flattenDeep(arrFront);
      setTtsArray(flattenContentsFront);
    } else if (contents && currentFace === "back") {
      let arrBack = [];
      if (contents[0].face2 !== null || contents[0].face2.length > 0) {
        contents[0].face2.forEach((c, i) => {
          if (readModeTTSOption.faceTwoTTS[i + 1]) {
            const contentWithoutTags =
              i === 0 && readModeTTSOption.faceOneTTS.selection && contents[0].selection !== null && contents[0].selection.length > 0
                ? "정답 " +
                decodeHtMLEntities(c).replace(
                  /\/|\~/g,
                  " "
                )
                :  decodeHtMLEntities(c).replace(
                  /\/|\~/g,
                  " "
                );
            arrBack.push(seperateEngAndKor(contentWithoutTags));
          }
        });
      }
      const flattenContentsBack = _.flattenDeep(arrBack);
      setTtsArray(flattenContentsBack);
    }
  }, [contentsList]);

  return (
    <>
      <Container
        sessionupdateresults={sessionupdateresults}
        cardListStudying={cardListStudying}
        contentsList={contentsList}
        sessionScope={sessionScope}
        levelConfigs={levelConfigs}
        cardTypeSets={cardTypeSets}
        face1row={face1row}
        face2row={face2row}
        ttsOn={ttsOn}
        setTtsOn={setTtsOn}
        userFlagDetails={userFlagDetails}
        isModalVisibleHidden={isModalVisibleHidden}
        setIsModalVisibleHidden={setIsModalVisibleHidden}
        setCardListStudying={setCardListStudying}
        cardsetDeleteEffect={cardsetDeleteEffect}
        updateUserFlag={updateUserFlag}
        setUserFlag={setUserFlag}
        userFlag={userFlag}
        setHiddenToggle={setHiddenToggle}
        setUnderlineToggle={setUnderlineToggle}
        setHighlightToggle={setHighlightToggle}
        saveMemo={saveMemo}
        finishStudy={finishStudy}
        bookList={bookList}
        indexListForEditor={indexListForEditor}
        setIndexListForEditor={setIndexListForEditor}
        cardTypeSetForEditor={cardTypeSetForEditor}
        setCardTypeSetForEditor={setCardTypeSetForEditor}
        bookSelectedForEditor={bookSelectedForEditor}
        setBookSelectedForEditor={setBookSelectedForEditor}
        indexSelectedForEditor={indexSelectedForEditor}
        setIndexSelectedForEditor={setIndexSelectedForEditor}
        indexset_getByMybookids={indexset_getByMybookids}
        cardtypeset_getbymybookids={cardtypeset_getbymybookids}
        cardset_getByIndexIDs={cardset_getByIndexIDs}
        selectedCardType={selectedCardType}
        setSelectedCardType={setSelectedCardType}
        newCardEditor={newCardEditor}
        setNewCardEditor={setNewCardEditor}
        addcard={addcard}
        ttsNextState={ttsNextState}
        setTTSNextState={setTTSNextState}
        getTTSData={getTTSData}
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
      ttsOn: true,
      firstTimeTts: true,
      flip: true,
      memo: "",
      updateMemoState: false,
      newCardModalVisible: false,
      moreStudy: false,
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
    const current_card_info_index_tmp = card_details_session_origin.findIndex((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info_index_tmp);
    if (current_card_info_index_tmp === -1) {
      var current_card_info_index = card_details_session_origin.findIndex((item) => item.content.buycontent_id === current_card_id);
    } else {
      var current_card_info_index = card_details_session_origin.findIndex((item) => item.content.mycontent_id === current_card_id);
    }
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

  onDiffClickHandler = (current_card_id, timer, studyRatio) => {
    console.log("난이도 선택하셨네요~");
    console.log(current_card_id);
    const now = new Date();
    const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info_index_tmp = card_details_session_origin.findIndex((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info_index_tmp);
    if (current_card_info_index_tmp === -1) {
      var current_card_info_index = card_details_session_origin.findIndex((item) => item.content.buycontent_id === current_card_id);
    } else {
      var current_card_info_index = card_details_session_origin.findIndex((item) => item.content.mycontent_id === current_card_id);
    }

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
    if (this.state.moreStudy === false) {
      if (card_details_session.length - 1 == Number(card_seq)) {
        console.log("원래는 끝난거!!!");
        console.log(card_details_session);

        if (this.state.onBackMode) {
          this.stopTimerTotal();
          this.resetTimer();
        } else {
          this.setState({
            flip: true,
          });
          this.setState({
            moreStudy: true,
          });
          const reviewExist_data = card_details_session.filter((item) => {
            if (item.studyStatus.needStudyTimeTmp !== null) {
              console.log(item.studyStatus.needStudyTimeTmp, now);
              return item;
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
            // this.props.finishStudy();
            console.log("여기서 끝인데????????????????????????");
          }

          //study log 생성
          const current_card_info_tmp = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);

          if (current_card_info_tmp.length === 0) {
            var current_card_info = card_details_session.filter((item) => item.content.buycontent_id === current_card_id);
          } else {
            var current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
          }

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

          if (this.props.ttsOn) {
            this.setState({
              ttsOn: true,
            });
          }
        }
      } else {
        console.log(card_details_session.length - 1, "======", Number(card_seq));
        console.log("아직 안끝");
        //여기다가 새로운 시퀀스 정보를 가공해야함.
        this.generateCardSeq(card_details_session, now, current_card_id);

        // this.setTimer(0);
      }
    } else if (this.state.moreStudy === true) {
      console.log("more study mode!!!!");

      if (this.state.onBackMode) {
        this.stopTimerTotal();
        this.resetTimer();
      } else {
        this.setState({
          flip: true,
        });
        const reviewExist_data = card_details_session.filter((item) => {
          if (item.studyStatus.needStudyTimeTmp !== null) {
            console.log(item.studyStatus.needStudyTimeTmp, now);
            return item;
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
          this.props.finishStudy();
          console.log("여기서 끝인데????????????????????????");
        }

        //study log 생성
        const current_card_info_tmp = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);

        if (current_card_info_tmp.length === 0) {
          var current_card_info = card_details_session.filter((item) => item.content.buycontent_id === current_card_id);
        } else {
          var current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
        }

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

        if (this.props.ttsOn) {
          this.setState({
            ttsOn: true,
          });
        }
      }
    }
  };

  //상황에따른 새로운 카드 시쿼스 생성
  generateCardSeq = (card_details_session, now, current_card_id) => {
    if (this.state.onBackMode) {
      this.stopTimerTotal();
      this.resetTimer();
    } else {
      this.setState({
        flip: true,
      });
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
      const current_card_info_tmp = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);

      if (current_card_info_tmp.length === 0) {
        var current_card_info = card_details_session.filter((item) => item.content.buycontent_id === current_card_id);
      } else {
        var current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
      }

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

      if (this.props.ttsOn) {
        this.setState({
          ttsOn: true,
        });
      }
    }
  };
  componentDidMount(){
    console.log("hererrrrrrr")
    this.props.setTtsOn(false)
    window.speechSynthesis.cancel();
    if(this.props.ttsOn === true){
      this.props.getTTSData();
    }
    
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.contentsList !== prevProps.contentsList) {
      console.log(this.props.contentsList);
      if (this.props.contentsList.length === 0) {
        alert("학습할 카드가 없습니다. 학습메인으로");
        window.location.href = "/m/study";
      }
    }
    // const ttsUse = sessionStorage.getItem("ttsUse");
    // if (ttsUse === null) {
    //   if (typeof SpeechSynthesisUtterance === "undefined" || typeof window.speechSynthesis === "undefined") {
    //     console.log("이 브라우저는 음성 합성을 지원하지 않습니다.");
    //     sessionStorage.setItem("ttsUse", "unable");
    //   } else {
    //     sessionStorage.setItem("ttsUse", "able");
    //   }
    // }
    // const currentFaceTmp = sessionStorage.getItem("currentFace"); 
    // if (!currentFaceTmp) {
    //   sessionStorage.setItem("currentFace", "front");
    // } else if(currentFaceTmp === "back") {
    //   sessionStorage.setItem("currentFace", "front");
    // }
    if (this.props.ttsOn) {
      if (this.state.ttsOn) {
        if (this.state.flip === true) {
          sessionStorage.setItem("currentFace", "front");
          this.props.getTTSData();
          this.setState({
            ttsOn: false,
          });
        }
        if (this.state.flip === false) {
          sessionStorage.setItem("currentFace", "back");
          this.props.getTTSData();
          this.setState({
            ttsOn: false,
          });
        }
      }
    }
    if(this.props.ttsOn !== prevProps.ttsOn){
      console.log("hererrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
      if(this.props.ttsOn === false){
        window.speechSynthesis.cancel();
      } else {
        // if(this.state.flip === true){
        //   this.props.getTTSData("back");
        // } else {
        //   this.props.getTTSData("front");
        // }
        this.props.getTTSData();
        console.log("hererrrrrr2222222222222222222222222222222222r")
      }
      
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
    const current_card_info_tmp = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info_tmp);
    if (current_card_info_tmp.length === 0) {
      var current_card_info = card_details_session.filter((item) => item.content.buycontent_id === current_card_id);
    } else {
      var current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    }
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
    const current_card_info_tmp = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info_tmp);
    if (current_card_info_tmp.length === 0) {
      var current_card_info = card_details_session.filter((item) => item.content.buycontent_id === current_card_id);
    } else {
      var current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    }

    const currentCardId = current_card_info[0]._id;

    this.generateHoldCompletedRestoretudyStatus(currentCardId, "hold");
    if (this.state.onBackMode) {
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
    const current_card_info_tmp = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info_tmp);
    if (current_card_info_tmp === -1) {
      var current_card_info = card_details_session.filter((item) => item.content.buycontent_id === current_card_id);
    } else {
      var current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    }
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
    const current_card_info_tmp = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    console.log(current_card_info_tmp);
    if (current_card_info_tmp === -1) {
      var current_card_info = card_details_session.filter((item) => item.content.buycontent_id === current_card_id);
    } else {
      var current_card_info = card_details_session.filter((item) => item.content.mycontent_id === current_card_id);
    }
    const currentCardId = current_card_info[0]._id;

    this.generateHoldCompletedRestoretudyStatus(currentCardId, "restore");
    if (this.state.onBackMode) {
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
  // speakTextFirstCard = (face1, face2) => {
  //   console.log("tts");
  //   if (face2) {
  //     const hello = async () => this.speakTextFace1(face1);
  //     hello().then(this.speakTextFace2(face2));
  //   } else {
  //     const hello = async () => this.speakTextFace1(face1);
  //     hello();
  //   }
  // };
  // speakText = () => {
  //   console.log("tts");
  //   const hello = async () => this.speakTextFace1();
  //   hello().then(this.speakTextFace2());
  // };
  // speakTextFace1 = (face1) => {
  //   window.speechSynthesis.cancel();
  //   if (face1) {
  //     var text = face1;
  //   } else {
  //     const text_tmp = document.getElementById("face1_row1").innerText;
  //     text = text_tmp.replace(/\w+\s*(?=\:)\:|[가-힣]+\s*(?=\:)\:/gi, "");
  //   }
  //   // window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

  //   console.log(text);
  //   if (text !== null) {
  //     const detected = detect(text);
  //     console.log(detected);

  //     const speechMsg = new SpeechSynthesisUtterance();
  //     speechMsg.rate = 1; // 속도: 0.1 ~ 10
  //     speechMsg.pitch = 1; // 음높이: 0 ~ 2
  //     speechMsg.lang = detected;
  //     speechMsg.text = text;

  //     // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
  //     window.speechSynthesis.speak(speechMsg);
  //   }
  // };

  // speakTextFace2 = (face2) => {
  //   window.speechSynthesis.cancel();
  //   if (face2) {
  //     var text = face2;
  //   } else {
  //     const text_id = document.getElementById("face2_row1");
  //     if (text_id === null) {
  //       return;
  //     } else {
  //       var text_tmp = document.getElementById("face2_row1").innerText;
  //     }
  //     text = text_tmp.replace(/\w+\s*(?=\:)\:|[가-힣]+\s*(?=\:)\:/gi, "");
  //   }
  //   // window.speechSynthesis.cancel(); // 현재 읽고있다면 초기화

  //   console.log(text);
  //   if (text !== null) {
  //     const detected = detect(text);
  //     console.log(detected);

  //     const speechMsg = new SpeechSynthesisUtterance();
  //     speechMsg.rate = 1; // 속도: 0.1 ~ 10
  //     speechMsg.pitch = 1; // 음높이: 0 ~ 2
  //     speechMsg.lang = detected;
  //     speechMsg.text = text;

  //     // SpeechSynthesisUtterance에 저장된 내용을 바탕으로 음성합성 실행
  //     window.speechSynthesis.speak(speechMsg);
  //   }
  // };

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

  flip = () => {
    this.setState((prevState) => ({
      flip: !prevState.flip,
    }));
    if (this.state.flip === true) {
      sessionStorage.setItem("currentFace", "back");
    } else {
      sessionStorage.setItem("currentFace", "front");
    }
    this.setState({
      ttsOn: true,
    });
  };
  onClickUserFlag = () => {
    console.log("userflagclicked!!!");
    this.props.setUserFlag(!this.props.userFlag);
  };
  hiddenEffectDeleteModal = () => {
    this.props.setIsModalVisibleHidden(true);
  };
  handleOk = () => {
    this.props.setIsModalVisibleHidden(false);
  };

  handleCancel = () => {
    this.props.setIsModalVisibleHidden(false);
  };
  hiddenElementTagHandler = (word) => {
    console.log(word);
    const currentCardSeq = sessionStorage.getItem("card_seq");
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    // const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === cardInfo.card_id);
    const newHiddenArray = cardListStudying[currentCardSeq].content.hidden.filter((item) => item.targetWord !== word);
    console.log(newHiddenArray);
    cardListStudying[currentCardSeq].content.hidden = newHiddenArray;
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    this.props.setCardListStudying(cardListStudying);
    this.props.cardsetDeleteEffect(cardListStudying[currentCardSeq].card_info.cardset_id, cardListStudying[currentCardSeq].card_info.card_id, "hidden", word);
  };

  underlineElementTagHandler = (word) => {
    console.log(word);
    const currentCardSeq = sessionStorage.getItem("card_seq");
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    // const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === cardInfo.card_id);
    const newUnderlineArray = cardListStudying[currentCardSeq].content.underline.filter((item) => item.targetWord !== word);
    console.log(newUnderlineArray);
    cardListStudying[currentCardSeq].content.underline = newUnderlineArray;
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    this.props.setCardListStudying(cardListStudying);
    this.props.cardsetDeleteEffect(cardListStudying[currentCardSeq].card_info.cardset_id, cardListStudying[currentCardSeq].card_info.card_id, "underline", word);
  };

  highlightElementTagHandler = (word) => {
    console.log(word);
    const currentCardSeq = sessionStorage.getItem("card_seq");
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    // const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === cardInfo.card_id);
    const newHighlightArray = cardListStudying[currentCardSeq].content.highlight.filter((item) => item.targetWord !== word);
    console.log(newHighlightArray);
    cardListStudying[currentCardSeq].content.highlight = newHighlightArray;
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    this.props.setCardListStudying(cardListStudying);
    this.props.cardsetDeleteEffect(cardListStudying[currentCardSeq].card_info.cardset_id, cardListStudying[currentCardSeq].card_info.card_id, "highlight", word);
  };

  userFlagChange = (flag) => {
    console.log("userFlagChangeClicked!!!");
    console.log(flag);
    const currentCardSeq = sessionStorage.getItem("card_seq");
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    cardListStudying[currentCardSeq].content.userFlag = Number(flag);
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    this.props.setCardListStudying(cardListStudying);
    this.props.updateUserFlag(cardListStudying[currentCardSeq].card_info.cardset_id, cardListStudying[currentCardSeq].card_info.card_id, flag);
    this.props.setUserFlag(false);
  };
  getSelectionText2 = () => {
    this.props.setHiddenToggle(false);
    this.props.setUnderlineToggle(false);
    this.props.setHighlightToggle(false);
    // setSearchToggle(false);
    console.log("hello");
    var text = null;
    var textRange = null;

    if (document.getSelection) {
      text = document.getSelection().toString();
      textRange = document.getSelection();
      sessionStorage.setItem("selectionText", text);
      console.log("case1", text);
    } else if (typeof document.selection != "undefined") {
      text = document.selection;
      console.log("case2", text);
    }
    console.log("end");
    console.log(text);
    console.log(textRange);

    if (textRange.anchorNode !== null && textRange.anchorNode !== "body") {
      var parentNode = document.getSelection().anchorNode.parentNode.parentNode.outerHTML;
      var parentNodeInnerHtml = document.getSelection().anchorNode.parentNode.parentNode.innerHTML;
      var parentId_tmp1 = parentNode.match(/(id=\"\w{10,100}\")/gi);
      var parentId_tmp2 = parentNode.match(/(cardSetId\w{10,100}cardId)/gi);
      var parentId_tmp3 = parentNode.match(/(cardId\w{10,100})/gi);
      if (parentId_tmp1 !== null) {
        var parentId = parentId_tmp1[0].match(/(\w{3,100})/gi);
        var cardSetId = parentId_tmp2[0].replace("cardSetId", "").replace("cardId", "");
        var cardId = parentId_tmp3[0].replace("cardId", "");
      } else {
        parentId = null;
      }
      if (parentId === null) {
        parentNode = document.getSelection().anchorNode.parentNode.parentNode.parentNode.outerHTML;
        parentNodeInnerHtml = document.getSelection().anchorNode.parentNode.parentNode.parentNode.innerHTML;
        var parentId_tmp1 = parentNode.match(/(id=\"\w{10,100}\")/gi);
        var parentId_tmp2 = parentNode.match(/(cardSetId\w{10,100}cardId)/gi);
        var parentId_tmp3 = parentNode.match(/(cardId\w{10,100})/gi);
        console.log(parentId_tmp1);
        if (parentId_tmp1 !== null) {
          var parentId = parentId_tmp1[0].match(/(\w{3,100})/gi);
          var cardSetId = parentId_tmp2[0].replace("cardSetId", "").replace("cardId", "");
          var cardId = parentId_tmp3[0].replace("cardId", "");
        } else {
          parentId = null;
        }
        if (parentId !== null) {
          sessionStorage.setItem("parentIdOfSelection", parentId[0]);
          sessionStorage.setItem("parentInnerHtml", parentNodeInnerHtml);
          sessionStorage.setItem("selectionTextCardSetId", cardSetId);
          sessionStorage.setItem("selectionTextCardId", cardId);
        } else {
          parentNode = document.getSelection().anchorNode.parentNode.parentNode.parentNode.parentNode.outerHTML;
          parentNodeInnerHtml = document.getSelection().anchorNode.parentNode.parentNode.parentNode.parentNode.innerHTML;
          var parentId_tmp1 = parentNode.match(/(id=\"\w{10,100}\")/gi);
          var parentId_tmp2 = parentNode.match(/(cardSetId\w{10,100}cardId)/gi);
          var parentId_tmp3 = parentNode.match(/(cardId\w{10,100})/gi);
          console.log(parentId_tmp1);
          if (parentId_tmp1 !== null) {
            var parentId = parentId_tmp1[0].match(/(\w{3,100})/gi);
            var cardSetId = parentId_tmp2[0].replace("cardSetId", "").replace("cardId", "");
            var cardId = parentId_tmp3[0].replace("cardId", "");
          } else {
            parentId = null;
          }
          if (parentId !== null) {
            sessionStorage.setItem("parentIdOfSelection", parentId[0]);
            sessionStorage.setItem("parentInnerHtml", parentNodeInnerHtml);
            sessionStorage.setItem("selectionTextCardSetId", cardSetId);
            sessionStorage.setItem("selectionTextCardId", cardId);
          } else {
            parentNode = document.getSelection().anchorNode.parentNode.parentNode.parentNode.parentNode.parentNode.outerHTML;
            parentNodeInnerHtml = document.getSelection().anchorNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML;
            var parentId_tmp1 = parentNode.match(/(id=\"\w{10,100}\")/gi);
            var parentId_tmp2 = parentNode.match(/(cardSetId\w{10,100}cardId)/gi);
            var parentId_tmp3 = parentNode.match(/(cardId\w{10,100})/gi);
            console.log(parentId_tmp1);
            if (parentId_tmp1 !== null) {
              var parentId = parentId_tmp1[0].match(/(\w{3,100})/gi);
              var cardSetId = parentId_tmp2[0].replace("cardSetId", "").replace("cardId", "");
              var cardId = parentId_tmp3[0].replace("cardId", "");
            } else {
              parentId = null;
              console.log("아직도 아니다");
            }
            if (parentId !== null) {
              sessionStorage.setItem("parentIdOfSelection", parentId[0]);
              sessionStorage.setItem("parentInnerHtml", parentNodeInnerHtml);
              sessionStorage.setItem("selectionTextCardSetId", cardSetId);
              sessionStorage.setItem("selectionTextCardId", cardId);
            } else {
              parentNode = document.getSelection().anchorNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.outerHTML;
              parentNodeInnerHtml = document.getSelection().anchorNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.innerHTML;
              var parentId_tmp1 = parentNode.match(/(id=\"\w{10,100}\")/gi);
              var parentId_tmp2 = parentNode.match(/(cardSetId\w{10,100}cardId)/gi);
              var parentId_tmp3 = parentNode.match(/(cardId\w{10,100})/gi);
              console.log(parentId_tmp1);
              if (parentId_tmp1 !== null) {
                var parentId = parentId_tmp1[0].match(/(\w{3,100})/gi);
                var cardSetId = parentId_tmp2[0].replace("cardSetId", "").replace("cardId", "");
                var cardId = parentId_tmp3[0].replace("cardId", "");
              } else {
                parentId = null;
                console.log("아직도 아니다2");
              }
              if (parentId !== null) {
                sessionStorage.setItem("parentIdOfSelection", parentId[0]);
                sessionStorage.setItem("parentInnerHtml", parentNodeInnerHtml);
                sessionStorage.setItem("selectionTextCardSetId", cardSetId);
                sessionStorage.setItem("selectionTextCardId", cardId);
              }
            }
          }
        }
      } else {
        sessionStorage.setItem("parentIdOfSelection", parentId[0]);
        sessionStorage.setItem("parentInnerHtml", parentNodeInnerHtml);
        sessionStorage.setItem("selectionTextCardSetId", cardSetId);
        sessionStorage.setItem("selectionTextCardId", cardId);
      }
    }
  };
  addMemo = (e) => {
    console.log(e.target.value);
    this.setState({
      memo: e.target.value,
    });
  };
  saveMemo = (card_info) => {
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const card_seq = sessionStorage.getItem("card_seq");
    cardListStudying[card_seq].content.memo = this.state.memo;
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    this.props.saveMemo(card_info.cardset_id, card_info.card_id, this.state.memo);
    this.setState({
      updateMemoState: false,
    });
  };

  updateMemo = (memo) => {
    this.setState({
      memo: memo,
    });
    this.setState({
      updateMemoState: true,
    });
  };

  // 새카드 추가 관련

  showModal = () => {
    this.setState({
      newCardModalVisible: true,
    });
  };

  handleOk = () => {
    this.setState({
      newCardModalVisible: false,
    });
    this.props.setBookSelectedForEditor("default");
    this.props.setIndexSelectedForEditor("default");
  };

  handleCancel = () => {
    this.setState({
      newCardModalVisible: false,
    });
    this.props.setBookSelectedForEditor("default");
    this.props.setIndexSelectedForEditor("default");
  };

  bookSelectOnchange = (value) => {
    console.log(`selected ${value}`);
    this.props.setBookSelectedForEditor(value);
    this.props.setIndexSelectedForEditor("default");
    this.props.indexset_getByMybookids({
      variables: {
        mybook_ids: value,
      },
    });
    this.props.cardtypeset_getbymybookids({
      variables: {
        mybook_ids: value,
      },
    });
  };
  indexSelectOnchange = (value) => {
    console.log(`selected ${value}`);
    this.props.cardset_getByIndexIDs({
      variables: {
        index_ids: value,
      },
    });
    this.props.setIndexSelectedForEditor(value);
    sessionStorage.setItem("index_id_for_newcard", value);
    console.log(this.props.cardTypeSetForEditor[0]);
    this.cardTypeInfoNewCard(this.props.cardTypeSetForEditor[0].cardtype_info);
    sessionStorage.setItem("selectedCardTypeId", this.props.cardTypeSetForEditor[0]._id);
  };

  handleChange = (value) => {
    sessionStorage.setItem("selections", 0);
    sessionStorage.removeItem("nicks_with_selections");
    sessionStorage.removeItem("nicks_without_selections");
    console.log(`selected ${value[0]}`);
    console.log(`selected ${value[1]}`);
    if (value[0] !== "default") {
      const hello = this.props.cardTypeSetForEditor.filter((item) => item.cardtype_info.name === value[0]);
      this.props.setSelectedCardType(hello[0].cardtype_info);
      sessionStorage.setItem("selectedCardTypeId", hello[0]._id);
      sessionStorage.setItem("cardtype", hello[0].cardtype_info.cardtype);
      this.cardTypeInfoNewCard(hello[0].cardtype_info, value[1]);
    }
  };
  addSelections = () => {
    console.log("add selection clicked!!!");
    sessionStorage.removeItem("removed");
    const selections = sessionStorage.getItem("selections");
    if (selections === undefined) {
      sessionStorage.setItem("selections", 1);
      var num_selection = 1;
    } else {
      var num_selection = Number(selections) + 1;
      if (num_selection === 6) {
        return;
      }
      sessionStorage.setItem("selections", num_selection);
    }
    const cardtype_info = JSON.parse(sessionStorage.getItem("cardtype_info"));
    this.cardTypeInfoNewCard(cardtype_info, num_selection);
  };
  removeSelection = () => {
    console.log("removeSelection clicked!!!");
    const selections = sessionStorage.getItem("selections");
    const num_selection = Number(selections) - 1;
    console.log(num_selection);
    sessionStorage.setItem("selections", num_selection);
    sessionStorage.setItem("removed", true);

    const cardtype_info = JSON.parse(sessionStorage.getItem("cardtype_info"));

    sessionStorage.setItem("lastSelectionRemoving", true);
    cardTypeInfoNewCard(cardtype_info, num_selection);
  };

  cardTypeInfoNewCard = (cardtype_info, selections) => {
    sessionStorage.setItem("cardtype_info", JSON.stringify(cardtype_info));
    console.log("여기다여기 : ", cardtype_info);

    const cardtypeEditor = cardtype_info.cardtype; //에디터에서 플립모드에 셀렉션 부과하려고 필요한 정보

    const num_face1 = cardtype_info.num_of_row.face1;
    const num_face2 = cardtype_info.num_of_row.face2;
    if (selections) {
      if (selections > 0) {
        var num_selection = selections;
      }
    }
    const num_annotation = cardtype_info.num_of_row.annotation;

    const nick_face1 = cardtype_info.nick_of_row.face1;
    const nick_face2 = cardtype_info.nick_of_row.face2;
    const nick_annotation = cardtype_info.nick_of_row.annotation;

    const nicks = [];

    const face1 = [];
    const face1Nick = [];
    for (var i = 0; i < num_face1; i++) {
      face1.push(i);
      face1Nick.push(nick_face1[i]);
      nicks.push(nick_face1[i]);
    }

    if (selections) {
      if (selections > 0) {
        const selection = [];
        const selectionNick = [];
        for (var i = 0; i < num_selection; i++) {
          selection.push(i);
          selectionNick.push(`보기${i + 1}`);
          nicks.push(`보기${i + 1}`);
        }
      }
    }

    const face2 = [];
    const face2Nick = [];
    for (var i = 0; i < num_face2; i++) {
      face2.push(i);
      face2Nick.push(nick_face2[i]);
      nicks.push(nick_face2[i]);
    }

    const annot = [];
    const annotNick = [];
    for (var i = 0; i < num_annotation; i++) {
      annot.push(i);
      annotNick.push(nick_annotation[i]);
      nicks.push(nick_annotation[i]);
    }

    if (this.props.selectedCardType === undefined) {
      var selectedCardTypeOption = cardtype_info.name;
    } else {
      selectedCardTypeOption = selectedCardType.name;
    }

    if (selections > 0) {
      console.log("here1");
      sessionStorage.setItem("nicks_with_selections", JSON.stringify(nicks));
    } else if (cardtypeEditor === "flip") {
      console.log("here2");
      sessionStorage.setItem("nicks_without_selections", JSON.stringify(nicks));
      sessionStorage.removeItem("nicks_with_selections");
      sessionStorage.setItem("selections_adding", 0);
    }

    if (this.props.cardTypeSetForEditor.length > 0) {
      var cardTypeListNormal = this.props.cardTypeSetForEditor.map((cardType) => {
        return (
          <>
            <Option value={[cardType.cardtype_info.name, "normal"]} style={{ fontSize: "0.8rem" }}>
              {cardType.cardtype_info.name}
            </Option>
          </>
        );
      });
    }

    const editor = (
      <>
        <div
          style={{ border: "1px solid lightgrey", borderBottom: "0px", padding: "5px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", alignItems: "center" }}
        >
          <div style={{ width: "50px" }}>템플릿 : </div>
          <Select size="small" defaultValue={selectedCardTypeOption} style={{ width: 200, fontSize: "0.75rem" }} onChange={this.handleChange}>
            <Option value="default" style={{ fontSize: "0.8rem", color: "black", fontWeight: "700" }} disabled>
              카드타입선택
            </Option>
            {cardTypeListNormal}
          </Select>
          {cardtypeEditor === "flip" && (
            <>
              {selections == undefined && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={this.addSelections}>
                  보기추가
                </Button>
              )}
              {selections == 0 && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={this.addSelections}>
                  보기추가
                </Button>
              )}
            </>
          )}
        </div>

        <div style={{ marginBottom: "100px" }}>
          <Editor
            removeSelection={this.removeSelection}
            face1={face1}
            face2={face2}
            annot={annot}
            parentId={null}
            nicks={nicks}
            cardtypeEditor={cardtypeEditor}
            onFinish={this.onFinishFromNewCard}
            setEditorOn={this.props.setNewCardEditor}
            cardtype_info={cardtype_info}
            addSelections={this.addSelections}
            // addPolly={addPolly}
          />
        </div>
      </>
    );

    this.props.setNewCardEditor(editor);
  };

  sameIndexSelected = (e) => {
    console.log(`checked`, e.target.checked);
    sessionStorage.setItem("sameIndexSelectedCheck", e.target.checked);
  };

  onFinishFromNewCard = (values, from) => {
    console.log(values);
    const cardtype_info = JSON.parse(sessionStorage.getItem("cardtype_info"));
    const mybook_id = this.props.bookSelectedForEditor;
    const cardtype = cardtype_info.cardtype;
    const cardtype_id = sessionStorage.getItem("selectedCardTypeId");
    const sameIndexSelectedCheck = sessionStorage.getItem("sameIndexSelectedCheck");
    console.log(sameIndexSelectedCheck);
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const card_seq = sessionStorage.getItem("card_seq");
    const currentCardId = cardListStudying[card_seq]._id;
    if (sameIndexSelectedCheck === "true") {
      var current_position_card_id = currentCardId;
    } else {
      current_position_card_id = null;
    }

    const cardTypeSetId = sessionStorage.getItem("cardtypeset_id");
    const index_id = sessionStorage.getItem("index_id_for_newcard");
    const indexSetId = sessionStorage.getItem("indexset_id");
    const cardSetId = sessionStorage.getItem("cardset_id");

    this.props.addcard(
      mybook_id,
      cardtype,
      cardtype_id,
      current_position_card_id,
      indexSetId,
      index_id,
      cardSetId,
      values.face1,
      values.selection,
      values.face2,
      values.annotation,
      values.flagStar,
      values.flagComment,
      cardTypeSetId
    );
    this.handleOk()
    sessionStorage.setItem("sameIndexSelectedCheck", "false");
  };
  // 새카드 추가 관련 끝

  render() {
    if (this.props.bookList) {
      if (this.props.bookList.length > 0) {
        var book_list = this.props.bookList.map((book) => {
          return (
            <>
              <Option value={book._id} style={{ fontSize: "1rem" }}>
                {book.mybook_info.title}
              </Option>
            </>
          );
        });
      }
    }
    if (this.props.indexListForEditor) {
      if (this.props.indexListForEditor.length > 0) {
        var index_list = this.props.indexListForEditor.map((item) => {
          return (
            <>
              <Option value={item._id} style={{ fontSize: "1rem" }}>
                {item.name}
              </Option>
            </>
          );
        });
      }
    }

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

      var cardLevel = card_details_session[currentSeq].studyStatus.levelCurrent;
      var recentStudyTime = card_details_session[currentSeq].studyStatus.recentStudyTime;
      var recentSelection = card_details_session[currentSeq].studyStatus.recentSelection;
      var cardInfoPop = (
        <>
          <div style={{ fontSize: "0.8rem" }}>
            <div>현레벨 : {cardLevel}</div>
            <div>최근학습시간 : {recentStudyTime}</div>
            <div>마지막난이도 : {recentSelection}</div>
            <div>기타등등... 카드 정보들</div>
          </div>
        </>
      );

      const current_card_book_id = card_details_session[currentSeq].card_info.mybook_id;
      const current_card_id_tmp = card_details_session[currentSeq].content.mycontent_id;
      if (current_card_id_tmp === null) {
        var current_card_id = card_details_session[currentSeq].content.buycontent_id;
      } else {
        var current_card_id = card_details_session[currentSeq].content.mycontent_id;
      }
      const current_card_levelconfig = this.props.levelConfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);
      // const levelconfig_option = current_card_levelconfig[0].restudy.option;
      // const diffi1 = levelconfig_option.diffi1;
      // const diffi2 = levelconfig_option.diffi2;
      // const diffi3 = levelconfig_option.diffi3;
      // const diffi4 = levelconfig_option.diffi4;
      // const diffi5 = levelconfig_option.diffi5;
      // const diffi = [];
      // diffi.push(diffi1, diffi2, diffi3, diffi4, diffi5);
      // const useDiffi = diffi.filter((item) => item.on_off === "on");

      if (statusCurrent === "completed" || statusCurrent === "hold") {
        var diffiButtons = (
          <>
            <Button icon={<RollbackOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickRestoreHandler(current_card_id)} type="primary">
              복원
            </Button>
            {!this.state.onBackMode && (
              <>
                <Button icon={<SwapRightOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickPassHandler(current_card_id)} type="primary">
                  통과
                </Button>
              </>
            )}
          </>
        );
      } else {
        var diffiButtons = (
          <div
            style={{
              position: "relative",
              width: "80%",
              flexGrow: 1,
              justifyContent: "space-between",
              borderRadius: "5px",
              background: "linear-gradient(270deg, rgba(65,255,0,1) 0%, rgba(232,255,0,1) 50%, rgba(255,0,0,1) 100%)",
              textAlign: "left",
              height: "33.41px",
            }}
          >
            <span style={{ fontSize: "0.8rem", marginLeft: "5px", lineHeight: "33.41px" }}>모르겠음</span>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 2.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 7.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 12.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 17.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 22.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 27.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 32.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 37.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 42.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 47.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 52.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 57.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 62.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 67.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 72.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 77.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 82.5)} style={{ width: "5%" }}></button>
              <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 87.5)} style={{ width: "5%" }}></button>
              <span style={{ width: "3%", backgroundColor: "#dadada", height: "33.41px" }}></span>
              <button
                className="diffi_button"
                onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 95)}
                style={{ width: "25%", fontSize: "0.8rem", display: "flex", flexDirection: "column", alignItems: "center" }}
              >
                <span>일단 알겠음</span>
                <span>
                  <CalculateIf currentSeq={currentSeq} timer={this.state.time} levelConfigs={current_card_levelconfig[0]} />
                </span>
              </button>
            </div>
          </div>
        );
      }
      var restoreDiffiButtons = (
        <div
          style={{
            position: "relative",
            width: "80%",
            flexGrow: 1,
            justifyContent: "space-between",
            borderRadius: "5px",
            background: "linear-gradient(270deg, rgba(65,255,0,1) 0%, rgba(232,255,0,1) 50%, rgba(255,0,0,1) 100%)",
            textAlign: "left",
            height: "33.41px",
          }}
        >
          <span style={{ fontSize: "0.8rem", marginLeft: "5px", lineHeight: "33.41px" }}>모르겠음</span>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 2.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 7.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 12.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 17.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 22.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 27.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 32.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 37.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 42.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 47.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 52.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 57.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 62.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 67.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 72.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 77.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 82.5)} style={{ width: "5%" }}></button>
            <button className="diffi_button" onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 87.5)} style={{ width: "5%" }}></button>
            <span style={{ width: "3%", backgroundColor: "#dadada", height: "33.41px" }}></span>
            <button
              className="diffi_button"
              onClick={() => this.onDiffClickHandler(current_card_id, this.state.time, 95)}
              style={{ width: "25%", fontSize: "0.8rem", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              <span>일단 알겠음</span>
              <span>
                <CalculateIf currentSeq={currentSeq} timer={this.state.time} levelConfigs={current_card_levelconfig[0]} />
              </span>
            </button>
          </div>
        </div>
      );
      var goBackToCurrent = (
        <>
          <Button size="small" type="primary" style={{ fontSize: "0.8rem" }} onClick={this.onClickGoBackToOrigin}>
            원위치에서 학습 이어하기
          </Button>
        </>
      );

      const moreMenuContents = (
        <Space>
          <Button icon={<SwapRightOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickPassHandler(current_card_id)} type="primary">
            통과
          </Button>
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
      const currentSeq = Number(sessionStorage.getItem("card_seq"));
      var cardInfoStatusBar = (
        <>
          <span>
            {card_details_session[currentSeq].studyStatus.statusCurrent === "yet" && "학습전"}
            {card_details_session[currentSeq].studyStatus.statusCurrent === "ing" && "학습중"}
            {card_details_session[currentSeq].studyStatus.statusCurrent === "hold" && "보류"}
            {card_details_session[currentSeq].studyStatus.statusCurrent === "completed" && "졸업"} Lv.
            {Math.round(card_details_session[currentSeq].studyStatus.levelCurrent * 10) / 10}
          </span>
        </>
      );
    }
    if (this.props.cardTypeSets.length > 0) {
      const card_details_session = JSON.parse(sessionStorage.getItem("cardListStudying"));
      var statusBar = card_details_session.map((content, index) => {
        const currentSeq = Number(sessionStorage.getItem("card_seq"));

        const statusCurrent = card_details_session[currentSeq].studyStatus.statusCurrent;
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
        if (statusCurrent === "completed" || statusCurrent === "hold") {
          var diffiButtonsPop = (
            <>
              <Space>
                <Button icon={<RollbackOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickRestoreHandler(current_card_id)} type="primary">
                  복원
                </Button>
                {/* <Button icon={<SwapRightOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickPassHandler(current_card_id)} type="primary">
                  통과
                </Button> */}
              </Space>
            </>
          );
        } else {
          var diffiButtonsPop = (
            <>
              <Space>
                {/* <Button icon={<SwapRightOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickPassHandler(current_card_id, "normal")} type="primary">
                  통과
                </Button> */}
                <Button icon={<StopOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickHoldHandler(current_card_id)} type="primary">
                  보류
                </Button>
                <Button icon={<CheckOutlined />} size="small" style={{ fontSize: "1rem" }} onClick={() => this.onClickCompletedHandler(current_card_id)} type="primary">
                  졸업
                </Button>
              </Space>
            </>
          );
        }
        const show_contents = contentsList.map((content_value) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);
            const userFlags = (
              <>
                <div>
                  <StopOutlined
                    onClick={() => userFlagChange("0")}
                    style={{
                      // border: "1px solid lightgrey",
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                      background: "white",
                      cursor: "pointer",
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: "#ff8e8e",
                      boxShadow: "rgb(144 144 144) 1px 1px 2px 0px",
                      marginBottom: "3px",
                    }}
                  />
                </div>
                <div style={{ position: "relative" }}>
                  <FlagFilled
                    onClick={() => this.userFlagChange("1")}
                    style={{
                      // border: "1px solid lightgrey",
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                      background: "#ffd1d1",
                      cursor: "pointer",
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: `${this.props.userFlagDetails.flag1.figureColor}`,
                      boxShadow: "rgb(144 144 144) 1px 1px 2px 0px",
                      marginBottom: "3px",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 9,
                      top: 7,
                      color: "black",
                      width: "14px",
                      height: "14px",
                      backgroundColor: "white",
                      borderRadius: "7px",
                      lineHeight: "14px",
                      border: "1px solid #ff0000",
                    }}
                  >
                    1
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <FlagFilled
                    onClick={() => this.userFlagChange("2")}
                    style={{
                      // border: "1px solid lightgrey",
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                      background: "#ffe7bb",
                      cursor: "pointer",
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: `${this.props.userFlagDetails.flag2.figureColor}`,
                      boxShadow: "rgb(144 144 144) 1px 1px 2px 0px",
                      marginBottom: "3px",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 9,
                      top: 7,
                      color: "black",
                      width: "14px",
                      height: "14px",
                      backgroundColor: "white",
                      borderRadius: "7px",
                      lineHeight: "14px",
                      border: "1px solid #ffa500",
                    }}
                  >
                    2
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <FlagFilled
                    onClick={() => this.userFlagChange("3")}
                    style={{
                      // border: "1px solid lightgrey",
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                      background: "#e7e773",
                      cursor: "pointer",
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: `${this.props.userFlagDetails.flag3.figureColor}`,
                      boxShadow: "rgb(144 144 144) 1px 1px 2px 0px",
                      marginBottom: "3px",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 9,
                      top: 7,
                      color: "black",
                      width: "14px",
                      height: "14px",
                      backgroundColor: "white",
                      borderRadius: "7px",
                      lineHeight: "14px",
                      border: "1px solid #ffff00",
                    }}
                  >
                    3
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <FlagFilled
                    onClick={() => this.userFlagChange("4")}
                    style={{
                      // border: "1px solid lightgrey",
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                      background: "#beffbe",
                      cursor: "pointer",
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: `${this.props.userFlagDetails.flag4.figureColor}`,
                      boxShadow: "rgb(144 144 144) 1px 1px 2px 0px",
                      marginBottom: "3px",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 9,
                      top: 7,
                      color: "black",
                      width: "14px",
                      height: "14px",
                      backgroundColor: "white",
                      borderRadius: "7px",
                      lineHeight: "14px",
                      border: "1px solid #008000",
                    }}
                  >
                    4
                  </span>
                </div>
                <div style={{ position: "relative" }}>
                  <FlagFilled
                    onClick={() => this.userFlagChange("5")}
                    style={{
                      // border: "1px solid lightgrey",
                      width: "30px",
                      height: "30px",
                      borderRadius: "15px",
                      background: "#ceceff",
                      cursor: "pointer",
                      fontSize: "20px",
                      lineHeight: "24px",
                      color: `${this.props.userFlagDetails.flag5.figureColor}`,
                      boxShadow: "rgb(144 144 144) 1px 1px 2px 0px",
                      marginBottom: "3px",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: 9,
                      top: 7,
                      color: "black",
                      width: "14px",
                      height: "14px",
                      backgroundColor: "white",
                      borderRadius: "7px",
                      lineHeight: "14px",
                      border: "1px solid #0000ff",
                    }}
                  >
                    5
                  </span>
                </div>
              </>
            );

            var annotationPop = (
              <>
                <div style={{ fontSize: "0.8rem" }}>
                  <div>{content_value.annotation[0]}</div>
                </div>
              </>
            );
            var memoPop = (
              <>
                <div style={{ fontSize: "0.8rem" }}>
                  {!this.state.updateMemoState && (
                    <>
                      <div>{content.content.memo}</div>
                      <div>
                        <Button size="small" onClick={() => this.updateMemo(content.content.memo)}>
                          수정
                        </Button>
                      </div>
                    </>
                  )}

                  {this.state.updateMemoState && (
                    <>
                      <Input value={this.state.memo} onChange={(e) => this.addMemo(e)} />
                      <Button size="small" onClick={() => this.saveMemo(content.card_info)}>
                        저장
                      </Button>
                    </>
                  )}
                  {content.content.memo === null && (
                    <>
                      <Input placeholder="메모추가" onChange={(e) => this.addMemo(e)} />
                      <Button size="small" onClick={() => this.saveMemo(content.card_info)}>
                        저장
                      </Button>
                    </>
                  )}
                </div>
              </>
            );

            var toolPop = (
              <>
                <div>가리기</div>
                {content.content.hidden &&
                  content.content.hidden.map((item) => {
                    return (
                      <>
                        <Tag onClick={() => this.hiddenElementTagHandler(item.targetWord)}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>{item.targetWord}</span>
                            <span
                              style={{
                                marginLeft: "3px",
                                color: "grey",
                              }}
                            >
                              <CloseOutlined />
                            </span>
                          </div>
                        </Tag>
                      </>
                    );
                  })}
                <div>밑줄</div>
                {content.content.underline &&
                  content.content.underline.map((item) => {
                    return (
                      <>
                        <Tag onClick={() => this.underlineElementTagHandler(item.targetWord)}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>{item.targetWord}</span>
                            <span
                              style={{
                                marginLeft: "3px",
                                color: "grey",
                              }}
                            >
                              <CloseOutlined />
                            </span>
                          </div>
                        </Tag>
                      </>
                    );
                  })}
                <div>형광펜</div>
                {content.content.highlight &&
                  content.content.highlight.map((item) => {
                    return (
                      <>
                        <Tag onClick={() => this.highlightElementTagHandler(item.targetWord)}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <span>{item.targetWord}</span>
                            <span
                              style={{
                                marginLeft: "3px",
                                color: "grey",
                              }}
                            >
                              <CloseOutlined />
                            </span>
                          </div>
                        </Tag>
                      </>
                    );
                  })}
              </>
            );
            return (
              <>
                <div
                  style={{
                    backgroundColor: "#f0f0f0",
                    height: "32px",
                    padding: "0 5px 0 5px",
                    // boxShadow: "0px 0px 1px 1px #eeeeee",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                    alignItems: "center",
                    // border: "1px solid gainsboro",
                    borderTopLeftRadius: "3px",
                    borderTopRightRadius: "3px",
                  }}
                >
                  <div style={{ width: "24pxpx", lineHeight: "0px", position: "relative", textAlign: "center" }}>
                    {content.content.userFlag === 0 && (
                      <>
                        <FlagOutlined
                          onClick={this.onClickUserFlag}
                          style={{
                            cursor: "pointer",
                            fontSize: "16px",
                            color: "#f0f0f0",
                            border: "1px solid lightgrey",
                            borderRadius: "3px",
                            width: "24px",
                            height: "24px",
                          }}
                        />
                      </>
                    )}
                    {content.content.userFlag !== 0 && (
                      <>
                        <FlagFilled
                          onClick={this.onClickUserFlag}
                          style={{
                            cursor: "pointer",
                            fontSize: "21px",
                            border: "1px solid #f0f0f0",
                            width: "24px",
                            height: "24px",
                            color: `${this.props.userFlagDetails["flag" + String(content.content.userFlag)].figureColor}`,
                          }}
                        />
                      </>
                    )}

                    {this.props.userFlag && (
                      <>
                        <span className="user_flags" style={{ position: "absolute", zIndex: "9999", left: "-4px", top: "30px" }}>
                          {userFlags}
                        </span>
                      </>
                    )}
                  </div>
                  {/* <Popover
                    content={"준비중입니다..."}
                    placement="bottomLeft"
                    title={
                      <>
                        <span style={{ fontSize: "0.8rem" }}>새카드 추가하기</span>
                      </>
                    }
                    trigger="click"
                  >
                    <Button
                      size="small"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "3px",
                        fontSize: "0.9rem",
                        color: "#939393",
                      }}
                    >
                      새카드
                    </Button>
                  </Popover> */}
                  <Button
                    size="small"
                    style={{
                      // border: "none",
                      backgroundColor: "white",
                      borderRadius: "3px",
                      fontSize: "0.9rem",
                      color: "#939393",
                    }}
                    onClick={this.showModal}
                    // icon={<PlusOutlined style={{ fontSize: "16px" }} />}
                  >
                    새카드
                  </Button>
                  <Modal title="새카드 추가하기" visible={this.state.newCardModalVisible} onOk={this.handleOk} onCancel={this.handleCancel} footer={null}>
                    <div>
                      <Select size="small" value={this.props.bookSelectedForEditor} style={{ width: 200, fontSize: "1rem" }} onChange={this.bookSelectOnchange}>
                        <Option value="default" style={{ fontSize: "1rem", color: "black", fontWeight: "700" }} disabled>
                          책선택
                        </Option>
                        {book_list}
                      </Select>
                    </div>
                    <div>
                      <Select size="small" value={this.props.indexSelectedForEditor} style={{ width: 200, fontSize: "1rem" }} onChange={this.indexSelectOnchange}>
                        <Option value="default" style={{ fontSize: "1rem", color: "black", fontWeight: "700" }} disabled>
                          목차선택
                        </Option>
                        {index_list}
                      </Select>
                      {content.card_info.index_id === this.props.indexSelectedForEditor && (
                        <>
                          <div>
                            <Checkbox onChange={this.sameIndexSelected}>해당카드 바로뒤에 저장</Checkbox>
                          </div>
                        </>
                      )}
                    </div>
                    <div>{this.props.indexSelectedForEditor !== "default" && this.props.newCardEditor}</div>
                  </Modal>

                  <Popover
                    content={diffiButtonsPop}
                    placement="bottomLeft"
                    title={
                      <>
                        <span style={{ fontSize: "0.8rem" }}>학습상태변경</span>
                      </>
                    }
                    trigger="click"
                  >
                    <Button
                      size="small"
                      style={{
                        // border: "none",
                        backgroundColor: "white",
                        borderRadius: "3px",
                        fontSize: "0.9rem",
                        color: "#939393",
                      }}
                      // icon={<ControlOutlined style={{ fontSize: "16px" }} />}
                    >
                      상태변경
                    </Button>
                  </Popover>

                  <Popover
                    content={toolPop}
                    placement="bottom"
                    title={
                      <>
                        <span style={{ fontSize: "0.8rem" }}>툴해제</span>
                      </>
                    }
                    trigger="click"
                  >
                    <Button
                      size="small"
                      style={{
                        // border: "none",
                        backgroundColor: "white",
                        borderRadius: "3px",
                        fontSize: "0.9rem",
                        color: "#939393",
                      }}
                      // icon={<ClearOutlined unselectable="on" style={{ pointerEvents: "none", fontSize: "16px" }} />}
                    >
                      툴해제
                    </Button>
                  </Popover>

                  <Popover
                    content={"준비중입니다..."}
                    placement="bottomRight"
                    title={
                      <>
                        <span style={{ fontSize: "0.8rem" }}>질문게시판</span>
                      </>
                    }
                    trigger="click"
                  >
                    <Button
                      size="small"
                      style={{
                        // border: "none",
                        backgroundColor: "white",
                        borderRadius: "3px",
                        fontSize: "0.9rem",
                        color: "#939393",
                      }}
                      // icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                    >
                      게시판
                    </Button>
                  </Popover>

                  <Popover
                    content={memoPop}
                    placement="bottomRight"
                    title={
                      <>
                        <span style={{ fontSize: "0.8rem" }}>메모</span>
                      </>
                    }
                    trigger="click"
                  >
                    <Button
                      size="small"
                      style={{
                        // border: "none",
                        backgroundColor: "white",
                        borderRadius: "3px",
                        fontSize: "0.9rem",
                        color: "#939393",
                      }}
                      // icon={<MessageOutlined style={{ fontSize: "16px" }} />}
                    >
                      메모
                    </Button>
                  </Popover>

                  <Popover
                    content={annotationPop}
                    placement="bottomRight"
                    title={
                      <>
                        <span style={{ fontSize: "0.8rem" }}>주석</span>
                      </>
                    }
                    trigger="click"
                  >
                    <Button
                      size="small"
                      style={{
                        // border: "none",
                        backgroundColor: "white",
                        borderRadius: "3px",
                        fontSize: "0.9rem",
                        color: "#939393",
                      }}
                      // icon={<PicRightOutlined style={{ fontSize: "16px" }} />}
                    >
                      주석
                    </Button>
                  </Popover>
                </div>
              </>
            );
          }
        });
        return show_contents;
      });

      var makerFlagContent = card_details_session.map((content, index) => {
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
        const show_contents = contentsList.map((content_value) => {
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
      var face1Contents = card_details_session.map((content, index) => {
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
        const show_contents = contentsList.map((content_value) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);
            return (
              <>
                {content.card_info.cardtype === "read" && (
                  <>
                    <div style={{ padding: 5, width: "100%", height: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          // minHeight: "calc(75vh - 150px)",
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                          overflow: "auto",
                        }}
                      >
                        {/* 페이스 스타일 영역 */}
                        <div
                          style={{
                            flexBasis: "100%",
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
                                className="face1"
                                key={`face1_row${index + 1}`}
                                id={`face1_row${index + 1}`}
                                style={{
                                  visibility: `${this.props.face1row[`face1row${index + 1}`] === false ? "hidden" : "visible"}`,
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
                                <Alter content={content} item={item} index={index} getSelectionText2={this.getSelectionText2} cardTypeSets={cardTypeSets} />
                                {/* <FroalaEditorView model={item} /> */}
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
                    <div style={{ padding: 5, width: "100%", height: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          // minHeight: "calc(75vh - 150px)",
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                          overflow: "auto",
                        }}
                      >
                        {/* 페이스 스타일 영역 */}
                        <div
                          style={{
                            flexBasis: "100%",
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
                                className="face1"
                                key={`face1_row${index + 1}`}
                                style={{
                                  visibility: `${this.props.face1row[`face1row${index + 1}`] === false ? "hidden" : "visible"}`,
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
                                <Alter content={content} item={item} index={index} getSelectionText2={this.getSelectionText2} cardTypeSets={cardTypeSets} />
                                {/* <FroalaEditorView model={item} /> */}
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
                    <div onClick={this.flip} style={{ padding: 5, width: "100%", height: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          // minHeight: "calc(75vh - 150px)",
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                          overflow: "auto",
                        }}
                      >
                        <div
                          style={{
                            flexBasis: "100%",
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
                                  visibility: `${this.props.face1row[`face1row${index + 1}`] === false ? "hidden" : "visible"}`,
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
                                <Alter content={content} item={item} index={index} getSelectionText2={this.getSelectionText2} cardTypeSets={cardTypeSets} />
                                {/* <FroalaEditorView model={item} /> */}
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
                                    <Alter content={content} item={item} index={index} getSelectionText2={this.getSelectionText2} cardTypeSets={cardTypeSets} />
                                    {/* <FroalaEditorView model={item} /> */}
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
      var face2Contents = card_details_session.map((content, index) => {
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
        const show_contents = contentsList.map((content_value) => {
          if ((content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) && index === currentSeq) {
            // console.log(content_value._id, content.content.buycontent_id);
            // console.log("해당카드 정보", content);
            // console.log("해당컨텐츠 정보", content_value);
            return (
              <>
                {content.card_info.cardtype === "flip" && (
                  <>
                    <div onClick={this.flip} style={{ padding: 5, width: "100%", height: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                      <div
                        style={{
                          // minHeight: "calc(75vh - 150px)",
                          height: "100%",
                          width: "100%",
                          display: "flex",
                          alignItems: alignVertical,
                          justifyContent: alignHorizontal,
                          overflow: "auto",
                        }}
                      >
                        {/* 페이스2 스타일 영역 */}
                        <div
                          style={{
                            flexBasis: "100%",
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
                                  className="face2"
                                  key={`face2_row${index + 1}`}
                                  id={`face2_row${index + 1}`}
                                  style={{
                                    visibility: `${this.props.face2row[`face2row${index + 1}`] === false ? "hidden" : "visible"}`,
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

                                  {index !== 0 && <Alter content={content} item={item} index={index} getSelectionText2={this.getSelectionText2} cardTypeSets={cardTypeSets} />}
                                  {/* {index !== 0 && <FroalaEditorView model={item} />} */}
                                </div>
                              </>
                            ))}

                          {(content_value.selection === null || content_value.selection.length === 0) &&
                            content_value.face2.map((item, index) => (
                              <>
                                <div
                                  className="face2"
                                  key={`face2_row${index + 1}`}
                                  // id={`face2_row${index + 1}`}
                                  value={item}
                                  style={{
                                    visibility: `${this.props.face2row[`face2row${index + 1}`] === false ? "hidden" : "visible"}`,
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
                                  <Alter content={content} item={item} index={index} getSelectionText2={this.getSelectionText2} cardTypeSets={cardTypeSets} />
                                  {/* <FroalaEditorView model={item} /> */}
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
      // console.log(face2Contents)
    }

    return (
      <>
        <svg xmlns="//www.w3.org/2000/svg" version="1.1" className="svg-filters" style={{ display: "none" }}>
          <defs>
            <filter id="marker-shape">
              <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
              <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
            </filter>
          </defs>
        </svg>
        <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
          <div style={{ width: "95%", position: "fixed", top: "50px" }}>
            <div
              style={{
                margin: "auto",
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
                  padding: "5px 5px",
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
                    marginBottom: "5px",
                  }}
                >
                  <div style={{ width: "100%", display: "flex", flexDirection: "flex", alignItems: "center", justifyContent: "flex-start" }}>
                    <div style={{ marginBottom: "0px", fontSize: "0.8rem", marginRight: "5px", width: "37px", flexShrink: 0 }}>완료율</div>
                    <ProgressBar bgcolor={"#32c41e"} completed={progress} />
                  </div>

                  <div style={{ width: "100%", display: "flex", flexDirection: "flex", alignItems: "center", marginLeft: "5px", justifyContent: "flex-start" }}>
                    <div style={{ lineHeight: "1rem", marginBottom: "0px", fontSize: "0.8rem", display: "flex", flexDirection: "column", marginRight: "5px" }}>
                      <div>카드정보</div>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#e2e2e2",
                        boxShadow: "inset 2px 2px 3px 0px #acacac",
                        textAlign: "right",
                        paddingRight: "5px",
                        width: "50%",
                        flexGrow: 1,
                        fontFamily: "Mina, sans-serif",
                        fontSize: "0.9rem",
                        lineHeight: "20px",
                        height: "20px",
                        borderRadius: "3px",
                      }}
                    >
                      {cardInfoStatusBar}
                    </div>
                  </div>
                  <Popover
                    content={cardInfoPop}
                    placement="bottomRight"
                    title={
                      <>
                        <span style={{ fontSize: "0.8rem" }}>카드정보</span>
                      </>
                    }
                    trigger="click"
                  >
                    <Button
                      size="small"
                      style={{ flexShrink: 0, fontSize: "0.8rem", width: "32px", height: "20px", marginLeft: "5px", borderRadius: "3px", padding: "2px", border: "none" }}
                    >
                      상세
                    </Button>
                  </Popover>
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
              {/* <Button size="small" style={{ fontSize: "1rem", width: "53px", height: "60px", borderRadius: "3px", marginLeft: "5px" }} onClick={this.props.finishStudy} type="primary">
                학습
                <br />
                종료
              </Button> */}
            </div>
          </div>
          <div style={{ width: "95%", position: "fixed", top: "115px" }}>
            <div style={{ margin: "auto", width: "100%", maxWidth: "972px", border: "1px solid lightgrey", borderRadius: "3px" }}>{statusBar}</div>
          </div>
          <div style={style_study_layout_bottom}>
            <div style={{ width: "100%", height: "100%" }}>
              <div style={{ height: "15px", paddingLeft: "5px" }}>{makerFlagContent}</div>
              <div style={contentsDisplay}>
                {this.state.flip && <div style={{ height: "100%" }}>{face1Contents}</div>}
                {!this.state.flip && <div style={{ height: "100%" }}>{face2Contents}</div>}
              </div>
            </div>
          </div>

          {this.state.onBackMode && (
            <>
              <div style={{ width: "100%", textAlign: "center", marginBottom: "113px", position: "fixed", bottom: 0, left: 0 }}>{goBackToCurrent}</div>
            </>
          )}

          <div style={{ width: "100%", height: "57px", textAlign: "center", marginBottom: "50px", position: "fixed", bottom: 0, left: 0 }}>
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
                padding: "5px 5px 0px 5px",
                border: "1px solid #bcbcbc",
                height: "57px",
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
                {!this.state.onBackMode && this.state.restore === false && diffiButtons}
                {this.state.restore === true && !this.state.onBackMode && restoreDiffiButtons}
                {!this.state.onBackMode && moreMenu}
                {this.state.onBackMode && !this.state.backModeRestore && diffiButtons}
                {this.state.onBackMode && this.state.backModeRestore && restoreDiffiButtons}
                {this.state.onBackMode && (
                  <Button
                    icon={<StepForwardOutlined />}
                    size="small"
                    style={{ fontSize: "1rem", flexGrow: 0, marginLeft: "5px" }}
                    onClick={this.onClickNextCardInBackMode}
                    type="secondary"
                  />
                )}
              </div>
              {!this.state.onBackMode && !this.state.restore ? (
                <>
                  <div style={{ flexBasis: "100%", fontSize: "0.8rem", display: "flex", color: "#737373" }}>
                    <div style={{ width: "24px", marginRight: "5px" }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                      <div style={{ width: "30%", textAlign: "left" }}>0%</div>
                      <div>50%</div>
                      <div>90%</div>
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "15%", textAlign: "right" }}>100%</div>
                    <div style={{ width: "24px" }}></div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ flexBasis: "100%", fontSize: "0.8rem", display: "flex", color: "#737373" }}>
                    <div style={{ width: "24px", marginRight: "5px" }}></div>
                    <div style={{ display: "flex", justifyContent: "space-between", width: "80%" }}>
                      <div style={{ width: "30%", textAlign: "left" }}>0%</div>
                      <div>50%</div>
                      <div>90%</div>
                    </div>
                    <div style={{ width: "3%" }}></div>
                    <div style={{ width: "15%", textAlign: "right" }}>100%</div>
                    <div style={{ width: "24px" }}></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {/* <div style={{ height: "100px" }}></div> */}
      </>
    );
  }
}

const CalculateIf = ({ currentSeq, levelConfigs }) => {
  const estimate = calculateStudyStatus(null, "prediction", currentSeq, null, levelConfigs);
  const min = estimate.needStudyTimeGap / 60000;
  const hour = min / 60;
  const day = hour / 24;
  const month = day / 30;
  const year = month / 12;
  if (min < 60) {
    var time = min.toFixed();
    var unit = "분";
  } else if (min > 60) {
    if (hour < 24) {
      time = hour.toFixed();
      unit = "시간";
    } else if (hour > 24) {
      if (day < 30) {
        time = day.toFixed();
        unit = "일";
      } else if (day > 30) {
        if (month < 12) {
          time = month.toFixed();
          unit = "달";
        } else if (month > 12) {
          time = year.toFixed();
          unit = "년";
        }
      }
    }
  }

  return (
    <>
      <span>
        [+{time}
        {unit}]
      </span>
    </>
  );
};

const Alter = ({ content, item, index, getSelectionText2, cardTypeSets }) => {
  // console.log(content);
  // console.log(cardTypeSets);
  var altered = item;
  if (content.content.hidden.length > 0) {
    content.content.hidden.map((element) => {
      const color = cardTypeSets[0].studyTool.hidden[element.toolType].color;
      const tmp = element.targetWord;
      const remake = tmp.replaceAll("'", "&#39;");
      const remake2 = remake.replaceAll(">", "&gt;");
      const remake3 = remake2.replaceAll("<", "&lt;");
      const remake4 = remake3.replaceAll("→", "&rarr;");
      const remake5 = remake4.replaceAll('"', "&quot;");
      const remake6 = remake5.replaceAll("•", "&bull;");
      const remake7 = remake6.replaceAll(/\s\s/g, "&nbsp; ");
      const remake9 = remake7.replaceAll("·", "&middot;");
      altered = altered.replaceAll(remake9, `<span style="background-color:${color}; color:${color}">${element.targetWord}</span>`);
    });
  }
  if (content.content.underline.length > 0) {
    content.content.underline.map((element) => {
      const color = cardTypeSets[0].studyTool.underline[element.toolType].color;
      const thickness = cardTypeSets[0].studyTool.underline[element.toolType].attr1;
      const lineType = cardTypeSets[0].studyTool.underline[element.toolType].attr2;
      const tmp = element.targetWord;
      const remake = tmp.replaceAll("'", "&#39;");
      const remake2 = remake.replaceAll(">", "&gt;");
      const remake3 = remake2.replaceAll("<", "&lt;");
      const remake4 = remake3.replaceAll("→", "&rarr;");
      const remake5 = remake4.replaceAll('"', "&quot;");
      const remake6 = remake5.replaceAll("•", "&bull;");
      const remake7 = remake6.replaceAll(/\s\s/g, "&nbsp; ");
      const remake9 = remake7.replaceAll("·", "&middot;");
      altered = altered.replaceAll(remake9, `<span style="display:inline-block; border-bottom: ${thickness}px ${lineType} ${color}">${element.targetWord}</span>`);
    });
  }

  if (content.content.highlight.length > 0) {
    content.content.highlight.map((element) => {
      const color = cardTypeSets[0].studyTool.highlight[element.toolType].color;
      const tmp = element.targetWord;
      const remake = tmp.replaceAll("'", "&#39;");
      const remake2 = remake.replaceAll(">", "&gt;");
      const remake3 = remake2.replaceAll("<", "&lt;");
      const remake4 = remake3.replaceAll("→", "&rarr;");
      const remake5 = remake4.replaceAll('"', "&quot;");
      const remake6 = remake5.replaceAll("•", "&bull;");
      const remake7 = remake6.replaceAll(/\s\s/g, "&nbsp; ");
      const remake9 = remake7.replaceAll("·", "&middot;");
      altered = altered.replaceAll(remake9, `<span class="brush${element.toolType}" style="display:inline-block; background-color:${color}">${element.targetWord}</span>`);
      // if (element.toolType === 0 || element.toolType === 1 || element.toolType === 3 || element.toolType === 4) {
      //   altered = altered.replace(
      //     element.targetWord,
      //     `<span class="brush${element.toolType === 0 || element.toolType === 1 ? 1 : 3}" style="display:inline-block; --bubble-color:${color}; --z-index:-1">${
      //       element.targetWord
      //     }</span>`
      //   );
      // } else if (element.toolType === 2) {
      //   altered = altered.replace(
      //     element.targetWord,
      //     `<span class="brush${element.toolType}" style="display:inline-block; background-color:${color}">${element.targetWord}</span>`
      //   );
      // }
    });
  }

  var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

  if (varUA.indexOf("android") > -1) {
    //안드로이드
    // console.log("android");
    var contentsToRender = (
      <>
        <div
          id={`${content._id}face1row${index + 1}cardSetId${content.card_info.cardset_id}cardId${content.card_info.card_id}`}
          dangerouslySetInnerHTML={{ __html: altered }}
          onContextMenu={getSelectionText2}
        ></div>
      </>
    );
  } else if (varUA.indexOf("iphone") > -1 || varUA.indexOf("ipad") > -1 || varUA.indexOf("ipod") > -1) {
    //IOS
    // console.log("ios");
    var contentsToRender = (
      <>
        <div
          id={`${content._id}face1row${index + 1}cardSetId${content.card_info.cardset_id}cardId${content.card_info.card_id}`}
          dangerouslySetInnerHTML={{ __html: altered }}
          onPointerUp={getSelectionText2}
        ></div>
      </>
    );
  } else {
    //아이폰, 안드로이드 외
    // console.log("other");
    var contentsToRender = (
      <>
        <div
          id={`${content._id}face1row${index + 1}cardSetId${content.card_info.cardset_id}cardId${content.card_info.card_id}`}
          dangerouslySetInnerHTML={{ __html: altered }}
          onPointerUp={getSelectionText2}
        ></div>
      </>
    );
  }

  return <>{contentsToRender}</>;
};

const style_study_layout_bottom = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  margin: "auto",
  maxWidth: "972px",
  marginTop: "154px",
  height: "calc(100vh - 267px)",

  border: "1px solid lightgrey",
  borderRadius: "3px",
};
const contentsDisplay = {
  backgroundColor: "white",
  padding: "10px",
  alignItems: "center",
  height: "95%",
};
