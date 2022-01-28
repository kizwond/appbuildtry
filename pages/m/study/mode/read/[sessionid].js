import React, { useState, useEffect, useCallback } from "react";
import { GetSession } from "../../../../../graphql/query/session";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
// import CardContainer from '../../../../../components/books/study/mode/flip/CardContainer';
import StudyLayout from "../../../../../components/layout/StudyLayout";
import { GET_CARD_CONTENT, GET_BUY_CARD_CONTENT, GET_CARDTYPESET, AddCard } from "../../../../../graphql/query/card_contents";
import { MUTATION_UPDATE_USER_FLAG } from "../../../../../graphql/mutation/userFlagApply";
import {
  ProfileOutlined,
  FlagFilled,
  HeartFilled,
  StarFilled,
  CheckCircleFilled,
  PlusOutlined,
  MenuFoldOutlined,
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
  DeleteOutlined,
  EditOutlined,
  FormOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import FixedBottomMenuReadMode from "../../../../../components/books/write/editpage/sidemenu/FixedBottomMenuReadMode";
import { Button, Modal, Tag, message, Divider, Select } from "antd";
import { ForAddEffect, ForDeleteEffect } from "../../../../../graphql/mutation/studyUtils";
import { Dictionary } from "../../../../../graphql/query/card_contents";
const { Option } = Select;

const FroalaEditorView = dynamic(() => import("react-froala-wysiwyg/FroalaEditorView"), {
  ssr: false,
});

const Editor = dynamic(() => import("../../../../../components/books/write/editpage/Editor"), {
  ssr: false,
});

const ReadMode = () => {
  const { query } = useRouter();

  const [cardListStudying, setCardListStudying] = useState();
  const [sessionScope, setSessionScope] = useState();
  const [contentsList, setContentsList] = useState([]);
  const [cardTypeSets, setCardTypeSets] = useState([]);
  const [cardId, setCardId] = useState("");
  const [cardInfo, setCardInfo] = useState("");
  const [userFlag, setUserFlag] = useState();
  const [userFlagDetails, setUserFlagDetails] = useState();
  const [cardClickMenu, setCardClickMenu] = useState(false);
  const [hiddenToggle, setHiddenToggle] = useState(false);
  const [underlineToggle, setUnderlineToggle] = useState(false);
  const [highlightToggle, setHighlightToggle] = useState(false);
  const [searchToggle, setSearchToggle] = useState(false);
  const [editorOn, setEditorOn] = useState();
  const [selectedCardType, setSelectedCardType] = useState();

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    console.log(ISSERVER);
    var session_id_temp = sessionStorage.getItem("session_Id");
    if (query.sessionid === undefined) {
      var session_id = session_id_temp;
    } else {
      session_id = query.sessionid;
    }
  }

  const { loading, error, data } = useQuery(GetSession, {
    variables: { session_id: session_id },
    // onCompleted: onCompletedGetSession,
  });

  const [mycontent_getMycontentByMycontentIDs, { loading: loading2, error: error2, data: myContents }] = useLazyQuery(GET_CARD_CONTENT, { onCompleted: afterGetContent });
  const [buycontent_getBuycontentByBuycontentIDs, { loading: loading3, error: error3, data: buyContents }] = useLazyQuery(GET_BUY_CARD_CONTENT, {
    onCompleted: afterGetBuyContent,
  });
  const [cardtypeset_getbymybookids, { loading: loading4, error: error4, data: cardtypeset }] = useLazyQuery(GET_CARDTYPESET, {
    onCompleted: afterGetCardTypeSet,
  });

  function afterGetContent(data) {
    console.log(data);
    // console.log(contentsList);
    const newArray = contentsList.concat(data.mycontent_getMycontentByMycontentIDs.mycontents);
    var uniq = newArray.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
    // console.log(uniq);
    setContentsList(uniq);
  }
  function afterGetBuyContent(data) {
    // console.log(data);
    // console.log(contentsList);
    const newArray = contentsList.concat(data.buycontent_getBuycontentByBuycontentIDs.buycontents);
    var uniq = newArray.filter((v, i, a) => a.findIndex((t) => t._id === v._id) === i);
    // console.log(uniq);
    setContentsList(uniq);
  }
  function afterGetCardTypeSet(data) {
    console.log(data);
    setCardTypeSets(data.cardtypeset_getbymybookids.cardtypesets);
  }

  function updateStudyToolApply(data) {
    setCardTypeSets(data);
  }

  //userflag update
  const [cardset_updateUserFlag] = useMutation(MUTATION_UPDATE_USER_FLAG, {
    onCompleted: afterupdateuserflag,
  });
  function afterupdateuserflag(data) {
    console.log("data", data);
  }

  const updateUserFlag = useCallback(
    async (cardset_id, card_id, flag) => {
      try {
        await cardset_updateUserFlag({
          variables: {
            forUpdateUserFlag: {
              cardset_id,
              card_id,
              value: Number(flag),
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [cardset_updateUserFlag]
  );

  useEffect(() => {
    console.log("useEffect fired~!!!!! read mode!!!!");
    if (data) {
      console.log("최초 리드모드 데이터 : ", data);

      const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
      setCardListStudying(cardListStudying);

      setSessionScope(data.session_getSession.sessions[0].sessionScope);
      setUserFlagDetails(data.userflagconfig_get.userflagconfigs[0].details);
      sessionStorage.setItem("card_seq", 0);
      sessionStorage.removeItem("cardlist_to_send");
      const now = new Date();
      sessionStorage.setItem("started", now);

      const cardIdList = cardListStudying.map((item) => {
        return item.content.mycontent_id;
      });
      const buyContentsIdsList = cardListStudying.map((item) => {
        return item.content.buycontent_id;
      });
      const mybook_ids = data.session_getSession.sessions[0].sessionScope.map((item) => {
        return item.mybook_id;
      });
      console.log(cardIdList);
      console.log(buyContentsIdsList);
      console.log(mybook_ids);
      mycontent_getMycontentByMycontentIDs({
        variables: {
          mycontent_ids: cardIdList,
        },
      });

      buycontent_getBuycontentByBuycontentIDs({
        variables: {
          buycontent_ids: buyContentsIdsList,
        },
      });

      cardtypeset_getbymybookids({
        variables: {
          mybook_ids: mybook_ids,
        },
      });
    } else {
      console.log("why here?");
    }
  }, [data, mycontent_getMycontentByMycontentIDs, buycontent_getBuycontentByBuycontentIDs, cardtypeset_getbymybookids]);

  // 읽기모드 에디터 뿌리기
  const prepareCardInDictionary = (radio) => {
    console.log("카드생성전 데이터 꾸리기!!");
    if (radio === "next") {
      const selectionTextCardId = sessionStorage.getItem("selectionTextCardId");
      const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
      const selectionCard = cardListStudying.filter((item) => item._id === selectionTextCardId);
      const cardTypeSetId = selectionCard[0].card_info.cardtypeset_id;
      const cardTypeId = selectionCard[0].card_info.cardtype_id;

      const selectedCardTypeSet = cardTypeSets.filter((item) => item._id === cardTypeSetId);
      console.log(selectedCardTypeSet);
      const cardtype_info_tmp = selectedCardTypeSet[0].cardtypes.filter((item) => item._id === cardTypeId);
      console.log(cardtype_info_tmp);
      const cardtype_info = cardtype_info_tmp[0].cardtype_info;
      console.log(cardtype_info);
      setSelectedCardType(selectedCardTypeSet[0].cardtypes);
      // cardTypeInfo(cardtype_info, null, null)
    }
    //카드생성버튼을 누를때 전체 책 리스트를 받는다.
    //
  };
  const fireEditor = (cardtypeId) => {
    const selectedCardType_tmp = selectedCardType.filter((item) => item._id === cardtypeId);
    cardTypeInfo(selectedCardType_tmp[0], null, null);
  };

  const onFinish = (values, from) => {
    console.log(values);
    const selectionTextCardId = sessionStorage.getItem("selectionTextCardId");
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const selectionCard = cardListStudying.filter((item) => item._id === selectionTextCardId);
    console.log(selectionCard);
    const mybook_id = selectionCard[0].card_info.mybook_id;
    const cardtype = selectionCard[0].card_info.cardtype;
    const cardtype_id = selectionCard[0].card_info.cardtype_id;
    const current_position_card_id = selectionCard[0].card_info.card_id;
    const indexSetId = selectionCard[0].card_info.indexset_id;
    const index_id = selectionCard[0].card_info.index_id;
    const cardSetId = selectionCard[0].card_info.cardset_id;
    const cardTypeSetId = selectionCard[0].card_info.cardtypeset_id;

    // console.log(values.parentId);
    // const mybook_id = localStorage.getItem("book_id");
    // const cardtype = sessionStorage.getItem("cardtype");
    // console.log("??????????????????????", cardId);
    // if (from === "inCard") {
    //   var current_position_card_id = cardId;
    //   console.log("should have cardid", cardId);
    // } else {
    //   current_position_card_id = null;
    //   console.log("should be null", cardId);
    // }

    // const cardtype_id = sessionStorage.getItem("selectedCardTypeId");

    addcard(
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
  };

  const [cardset_addcardAtSameIndex] = useMutation(AddCard, { onCompleted: afteraddcardmutation });

  function afteraddcardmutation(data) {
    console.log(data);
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

  const cardTypeInfo = (selectedCardType_tmp, parentId, selections) => {
    const cardtype_info = selectedCardType_tmp.cardtype_info;
    sessionStorage.setItem("cardtype_info", JSON.stringify(cardtype_info));
    sessionStorage.setItem("parentId", parentId);

    console.log("cardTypeInfo fired!!!! editor on process");
    console.log(selections);

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

    if (selectedCardType_tmp === undefined) {
      var selectedCardTypeOption = cardtype_info.name;
    } else {
      selectedCardTypeOption = selectedCardType_tmp.name;
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

    const editor = (
      <>
        {/* <div
          style={{ border: "1px solid lightgrey", borderBottom: "0px", padding: "5px", display: "flex", justifyContent: "space-between", fontSize: "0.8rem", alignItems: "center" }}
        >
          {cardtypeEditor === "flip" && (
            <>
              {selections == undefined && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={addSelections}>
                  보기추가
                </Button>
              )}
              {selections == 0 && (
                <Button size="small" style={{ fontSize: "0.8rem", marginLeft: "3px" }} onClick={addSelections}>
                  보기추가
                </Button>
              )}
            </>
          )}
        </div> */}

        <div style={{ marginBottom: "100px" }}>
          <Editor
            // removeSelection={removeSelection}
            face1={face1}
            face2={face2}
            annot={annot}
            parentId={parentId}
            nicks={nicks}
            cardtypeEditor={cardtypeEditor}
            onFinish={onFinish}
            setEditorOn={setEditorOn}
            cardtype_info={cardtype_info}
            // addSelections={addSelections}
            // addPolly={addPolly}
            // forceUpdateBool={forceUpdateBool}
            // setForceUpdateBool={setForceUpdateBool}
          />
        </div>
      </>
    );
    setEditorOn(editor);
  };

  function onClickUserFlag() {
    console.log("userflagclicked!!!");
    setUserFlag(!userFlag);
    setCardClickMenu(false);
  }

  function userFlagChange(flag) {
    console.log("userFlagChangeClicked!!!");
    console.log(flag);
    updateUserFlag(cardInfo.cardset_id, cardInfo.card_id, flag);
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const filtered = cardListStudying.findIndex((item) => item.card_info.card_id === cardInfo.card_id);
    console.log(filtered);
    cardListStudying[filtered].content.userFlag = Number(flag);
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    setCardListStudying(cardListStudying);
    setUserFlag(false);
  }

  function onClickCardMenu() {
    console.log("userFlagChangeClicked!!!");
    setCardClickMenu(!cardClickMenu);
    setUserFlag(false);
  }

  const getSelectionText2 = () => {
    setHiddenToggle(false);
    setUnderlineToggle(false);
    setHighlightToggle(false);
    setSearchToggle(false);
    console.log("hello");
    var text = null;
    var textRange = null;
    console.log(typeof document.selection);
    console.log(document.selection);
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

    if (textRange.anchorNode !== null && textRange.anchorNode !== "body") {
      var parentNode = document.getSelection().anchorNode.parentNode.parentNode.outerHTML;
      var parentNodeInnerHtml = document.getSelection().anchorNode.parentNode.parentNode.innerHTML;
      var parentId_tmp1 = parentNode.match(/(id=\"\w{1,100}\")/gi);
      var parentId_tmp2 = parentNode.match(/(cardSetId\w{1,100}cardId)/gi);
      var parentId_tmp3 = parentNode.match(/(cardId\w{1,100})/gi);
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
        var parentId_tmp1 = parentNode.match(/(id=\"\w{1,100}\")/gi);
        var parentId_tmp2 = parentNode.match(/(cardSetId\w{1,100}cardId)/gi);
        var parentId_tmp3 = parentNode.match(/(cardId\w{1,100})/gi);
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
          var parentId_tmp1 = parentNode.match(/(id=\"\w{1,100}\")/gi);
          var parentId_tmp2 = parentNode.match(/(cardSetId\w{1,100}cardId)/gi);
          var parentId_tmp3 = parentNode.match(/(cardId\w{1,100})/gi);
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

  const hide = (toolType) => {
    const selectionText = sessionStorage.getItem("selectionText");
    console.log(selectionText);
    if (selectionText === "") {
      return;
    }
    // const parentIdOfSelection = sessionStorage.getItem("parentIdOfSelection");
    // const parentInnerHtml = sessionStorage.getItem("parentInnerHtml");
    const selectionTextCardSetId = sessionStorage.getItem("selectionTextCardSetId");
    const selectionTextCardId = sessionStorage.getItem("selectionTextCardId");
    // const replaced = parentInnerHtml.replace(selectionText, `<span style="visibility:hidden;">${selectionText}</span>`);
    const newHiddenValue = {
      targetWord: selectionText,
      toolType: toolType,
    };
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === selectionTextCardId);
    cardListStudying[needToBeChangedIndex].content.hidden.push(newHiddenValue);
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    setCardListStudying(cardListStudying);
    cardsetAddEffect(selectionTextCardSetId, selectionTextCardId, "hidden", selectionText, null);
    console.log(selectionTextCardSetId, selectionTextCardId, "hidden", selectionText, null);
    // var elem = document.getElementById(parentIdOfSelection);

    // elem.innerHTML = replaced;
    setHiddenToggle(false);
    sessionStorage.removeItem("selectionText");
  };

  const underline = (toolType) => {
    const selectionText = sessionStorage.getItem("selectionText");
    console.log(selectionText);
    if (selectionText === "") {
      return;
    }
    // const parentIdOfSelection = sessionStorage.getItem("parentIdOfSelection");
    // const parentInnerHtml = sessionStorage.getItem("parentInnerHtml");
    const selectionTextCardSetId = sessionStorage.getItem("selectionTextCardSetId");
    const selectionTextCardId = sessionStorage.getItem("selectionTextCardId");
    // const replaced = parentInnerHtml.replace(selectionText, `<span style="visibility:hidden;">${selectionText}</span>`);
    const newUnderlineValue = {
      targetWord: selectionText,
      toolType: toolType,
    };
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === selectionTextCardId);
    cardListStudying[needToBeChangedIndex].content.underline.push(newUnderlineValue);
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    setCardListStudying(cardListStudying);
    cardsetAddEffect(selectionTextCardSetId, selectionTextCardId, "underline", selectionText, toolType);
    console.log(selectionTextCardSetId, selectionTextCardId, "underline", selectionText, toolType);
    // var elem = document.getElementById(parentIdOfSelection);

    // elem.innerHTML = replaced;
    setUnderlineToggle(false);
    sessionStorage.removeItem("selectionText");
  };

  const highlight = (toolType) => {
    const selectionText = sessionStorage.getItem("selectionText");
    console.log(selectionText);
    if (selectionText === "") {
      return;
    }
    // const parentIdOfSelection = sessionStorage.getItem("parentIdOfSelection");
    // const parentInnerHtml = sessionStorage.getItem("parentInnerHtml");
    const selectionTextCardSetId = sessionStorage.getItem("selectionTextCardSetId");
    const selectionTextCardId = sessionStorage.getItem("selectionTextCardId");
    // const replaced = parentInnerHtml.replace(selectionText, `<span style="visibility:hidden;">${selectionText}</span>`);
    const newHighlightValue = {
      targetWord: selectionText,
      toolType: toolType,
    };
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === selectionTextCardId);
    cardListStudying[needToBeChangedIndex].content.highlight.push(newHighlightValue);
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    setCardListStudying(cardListStudying);
    cardsetAddEffect(selectionTextCardSetId, selectionTextCardId, "highlight", selectionText, toolType);
    console.log(selectionTextCardSetId, selectionTextCardId, "highlight", selectionText, toolType);
    // var elem = document.getElementById(parentIdOfSelection);

    // elem.innerHTML = replaced;
    setHighlightToggle(false);
    sessionStorage.removeItem("selectionText");
  };

  const search = (menu) => {
    const selectionText = sessionStorage.getItem("selectionText");
    console.log(selectionText);
    if (selectionText === "") {
      return;
    }
    if (menu === "영한사전") {
      searchWord();
      setSearchToggle(false);
    } else if (menu === "백과사전") {
      setSearchToggle(false);
      sessionStorage.removeItem("selectionText");
      return;
    }
  };

  const hiddenToggleHandler = (info) => {
    console.log("userflagclicked!!!");
    setHiddenToggle(!hiddenToggle);
    setUnderlineToggle(false);
    setHighlightToggle(false);
    setSearchToggle(false);
    if (hiddenToggle === false) {
      message.destroy();
      info();
    }
  };

  const underlineToggleHandler = (info) => {
    console.log("underlineToggleHandler!!!");
    setUnderlineToggle(!underlineToggle);
    setHiddenToggle(false);
    setHighlightToggle(false);
    setSearchToggle(false);
    if (underlineToggle === false) {
      message.destroy();
      info();
    }
  };

  const highlightToggleHandler = (info) => {
    console.log("underlineToggleHandler!!!");
    setHighlightToggle(!highlightToggle);
    setHiddenToggle(false);
    setUnderlineToggle(false);
    setSearchToggle(false);
    if (highlightToggle === false) {
      message.destroy();
      info();
    }
  };

  const searchToggleHandler = (info) => {
    console.log("searchToggleHandler!!!");
    setSearchToggle(!searchToggle);
    setHiddenToggle(false);
    setUnderlineToggle(false);
    setHighlightToggle(false);
    if (searchToggle === false) {
      message.destroy();
      info();
    }
  };

  const [isModalVisibleHidden, setIsModalVisibleHidden] = useState(false);
  const [isModalVisibleUnderline, setIsModalVisibleUnderline] = useState(false);
  const [isModalVisibleHighlight, setIsModalVisibleHighlight] = useState(false);

  const handleOk = () => {
    setIsModalVisibleHidden(false);
    setIsModalVisibleUnderline(false);
    setIsModalVisibleHighlight(false);
  };

  const handleCancel = () => {
    setIsModalVisibleHidden(false);
    setIsModalVisibleUnderline(false);
    setIsModalVisibleHighlight(false);
  };

  const hiddenEffectDeleteModal = () => {
    setIsModalVisibleHidden(true);
  };
  const underlineEffectDeleteModal = () => {
    setIsModalVisibleUnderline(true);
  };

  const highlightEffectDeleteModal = () => {
    setIsModalVisibleHighlight(true);
  };

  function hiddenElementTagHandler(word) {
    console.log(word);
    console.log(cardInfo);

    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === cardInfo.card_id);
    const newHiddenArray = cardListStudying[needToBeChangedIndex].content.hidden.filter((item) => item.targetWord !== word);
    console.log(newHiddenArray);
    cardListStudying[needToBeChangedIndex].content.hidden = newHiddenArray;
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    setCardListStudying(cardListStudying);
    cardsetDeleteEffect(cardInfo.cardset_id, cardInfo.card_id, "hidden", word);
  }

  function underlineElementTagHandler(word) {
    console.log(word);
    console.log(cardInfo);

    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === cardInfo.card_id);
    const newUnderlineArray = cardListStudying[needToBeChangedIndex].content.underline.filter((item) => item.targetWord !== word);
    console.log(newUnderlineArray);
    cardListStudying[needToBeChangedIndex].content.underline = newUnderlineArray;
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    setCardListStudying(cardListStudying);
    cardsetDeleteEffect(cardInfo.cardset_id, cardInfo.card_id, "underline", word);
  }

  function highlightElementTagHandler(word) {
    console.log(word);
    console.log(cardInfo);

    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const needToBeChangedIndex = cardListStudying.findIndex((item) => item.card_info.card_id === cardInfo.card_id);
    const newHighlightArray = cardListStudying[needToBeChangedIndex].content.highlight.filter((item) => item.targetWord !== word);
    console.log(newHighlightArray);
    cardListStudying[needToBeChangedIndex].content.highlight = newHighlightArray;
    sessionStorage.setItem("cardListStudying", JSON.stringify(cardListStudying));
    setCardListStudying(cardListStudying);
    cardsetDeleteEffect(cardInfo.cardset_id, cardInfo.card_id, "highlight", word);
  }

  if (cardTypeSets.length > 0) {
    var contents = cardListStudying.map((content) => {
      // console.log("카드에 스타일 입히기 시작", cardTypeSets);
      //   console.log(content);
      const current_card_style_set = cardTypeSets.filter((item) => item._id === content.card_info.cardtypeset_id);

      // console.log(current_card_style_set);
      const current_card_style = current_card_style_set[0].cardtypes.filter((item) => item._id === content.card_info.cardtype_id);
      // console.log(current_card_style);
      const face_style = current_card_style[0].face_style;
      const row_style = current_card_style[0].row_style;
      const row_font = current_card_style[0].row_font;
      const makerFlagStyle = current_card_style_set[0].makerFlag_style;
      // console.log(row_font);
      // console.log(content);
      // console.log(contentsList);
      const show_contents = contentsList.map((content_value) => {
        if (content_value._id === content.content.mycontent_id || content_value._id === content.content.buycontent_id) {
          // console.log(content_value._id, content.content.buycontent_id);
          if (content_value._id === cardId) {
            var borderLeft = "2px solid blue";
          } else {
            borderLeft = "none";
          }
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
                <span
                  style={{
                    display: "inline-block",
                    marginRight: "5px",
                    fontSize: `${figure_size}px`,
                  }}
                >
                  {ratings}
                </span>
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

          const userFlags = (
            <>
              <FlagOutlined
                onClick={() => userFlagChange("0")}
                style={{
                  border: "1px solid lightgrey",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "white",
                }}
              />
              <FlagFilled
                onClick={() => userFlagChange("1")}
                style={{
                  border: "1px solid lightgrey",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: `${userFlagDetails.flag1.figureColor}`,
                }}
              />
              <FlagFilled
                onClick={() => userFlagChange("2")}
                style={{
                  border: "1px solid lightgrey",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: `${userFlagDetails.flag2.figureColor}`,
                }}
              />
              <FlagFilled
                onClick={() => userFlagChange("3")}
                style={{
                  border: "1px solid lightgrey",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: `${userFlagDetails.flag3.figureColor}`,
                }}
              />
              <FlagFilled
                onClick={() => userFlagChange("4")}
                style={{
                  border: "1px solid lightgrey",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: `${userFlagDetails.flag4.figureColor}`,
                }}
              />
              <FlagFilled
                onClick={() => userFlagChange("5")}
                style={{
                  border: "1px solid lightgrey",
                  background: "white",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: `${userFlagDetails.flag5.figureColor}`,
                }}
              />
            </>
          );

          return (
            <>
              {content.card_info.cardtype === "read" && (
                <>
                  {content._id === cardId && (
                    <>
                      <div
                        style={{
                          backgroundColor: "#f0f0f0",
                          height: "38px",
                          padding: "0 5px 0 5px",
                          // boxShadow: "0px 0px 1px 1px #eeeeee",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          border: "1px solid gainsboro",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        <div style={{ width: "24pxpx", height: "2rem", position: "relative", textAlign: "center" }}>
                          {content.content.userFlag === 0 && (
                            <>
                              <FlagOutlined
                                onClick={onClickUserFlag}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: "#f0f0f0",
                                  border: "1px solid lightgrey",
                                }}
                              />
                            </>
                          )}
                          {content.content.userFlag !== 0 && (
                            <>
                              <FlagFilled
                                onClick={onClickUserFlag}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: `${userFlagDetails["flag" + String(content.content.userFlag)].figureColor}`,
                                }}
                              />
                            </>
                          )}

                          {userFlag && (
                            <>
                              <span style={{ position: "absolute", right: 0 }}>{userFlags}</span>
                            </>
                          )}
                        </div>
                        <div unselectable="on" style={{ position: "relative" }}>
                          <Button
                            unselectable="on"
                            className="hiddenButton"
                            onClick={hiddenEffectDeleteModal}
                            size="small"
                            style={{
                              border: "none",
                              backgroundColor: "#f0f0f0",
                            }}
                            icon={<ClearOutlined unselectable="on" style={{ pointerEvents: "none", fontSize: "16px" }} />}
                          ></Button>

                          <Modal title="학습도구해제" footer={null} visible={isModalVisibleHidden} onOk={handleOk} onCancel={handleCancel}>
                            <div>가리기</div>
                            {content.content.hidden &&
                              content.content.hidden.map((item) => {
                                return (
                                  <>
                                    <Tag onClick={() => hiddenElementTagHandler(item.targetWord)}>
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
                                    <Tag onClick={() => underlineElementTagHandler(item.targetWord)}>
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
                                    <Tag onClick={() => highlightElementTagHandler(item.targetWord)}>
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
                          </Modal>
                        </div>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<PlusOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<FormOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                        ></Button>

                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<BarChartOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<MessageOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        {content_value.annotation.length > 0 && content_value.annotation[0] !== "" ? (
                          <>
                            <Button
                              size="small"
                              style={{
                                border: "none",
                                backgroundColor: "#f0f0f0",
                              }}
                              icon={<PicRightOutlined style={{ fontSize: "16px" }} />}
                            ></Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              style={{
                                border: "none",
                                backgroundColor: "#f0f0f0",
                              }}
                              icon={<PicRightOutlined style={{ fontSize: "16px" }} />}
                              disabled
                            ></Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {content._id !== cardId && (
                    <>
                      <div
                        style={{
                          padding: "0px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "end",
                        }}
                      >
                        {content.content.userFlag === 0 && (
                          <>
                            <div
                              style={{
                                backgroundColor: "#ffffff00",
                                height: "2px",
                                width: "20px",
                                borderRadius: "2px",
                              }}
                            >
                              {" "}
                            </div>
                          </>
                        )}
                        {content.content.userFlag !== 0 && (
                          <>
                            <div
                              style={{
                                backgroundColor: `${userFlagDetails["flag" + String(content.content.userFlag)].figureColor}`,
                                height: "2px",
                                width: "20px",
                                borderRadius: "2px",
                              }}
                            >
                              {" "}
                            </div>
                          </>
                        )}

                        <div style={{ display: "flex", alignItems: "end" }}>
                          {content.content.memo !== null && (
                            <>
                              <div
                                style={{
                                  backgroundColor: "#50d663",
                                  height: "2px",
                                  width: "20px",
                                  borderRadius: "2px",
                                }}
                              >
                                {" "}
                              </div>
                            </>
                          )}
                          {content_value.annotation.length > 0 && content_value.annotation[0] !== "" && (
                            <>
                              <div
                                style={{
                                  backgroundColor: "blue",
                                  height: "2px",
                                  width: "20px",
                                  borderRadius: "2px",
                                }}
                              >
                                {" "}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <div className={`${content._id} other`} style={{ marginBottom: "0px" }}>
                    <div onClick={() => onClickCard(content._id, "normal", null, content.card_info)}>
                      {/* 페이스 스타일 영역 */}
                      {content.content.makerFlag.value !== null && flagArea}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
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
                                {/* <FroalaEditorView model={item} /> */}
                                <Alter content={content} item={item} index={index} getSelectionText2={getSelectionText2} cardTypeSets={cardTypeSets} />
                                {/* {content.content.hidden.length > 0 || content.content.underline.length > 0 || content.content.highlight.length > 0 ? (
                                  <Alter content={content} item={item} index={index} getSelectionText2={getSelectionText2} />
                                ) : (
                                  <>
                                    <div id={`${content._id}face1row${index + 1}`} dangerouslySetInnerHTML={{ __html: item }} onPointerUp={getSelectionText2}></div>
                                  </>
                                )} */}
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider style={{ marginTop: "5px", marginBottom: "5px" }} dashed />
                </>
              )}

              {content.card_info.cardtype === "share" && (
                <>
                  {content._id === cardId && (
                    <>
                      <div
                        style={{
                          backgroundColor: "#f0f0f0",
                          height: "38px",
                          padding: "0 5px 0 5px",
                          // boxShadow: "0px 0px 1px 1px #eeeeee",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          border: "1px solid gainsboro",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        <div style={{ width: "24pxpx", height: "2rem", position: "relative", textAlign: "center" }}>
                          {content.content.userFlag === 0 && (
                            <>
                              <FlagOutlined
                                onClick={onClickUserFlag}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: "#f0f0f0",
                                  border: "1px solid lightgrey",
                                }}
                              />
                            </>
                          )}
                          {content.content.userFlag !== 0 && (
                            <>
                              <FlagFilled
                                onClick={onClickUserFlag}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: `${userFlagDetails["flag" + String(content.content.userFlag)].figureColor}`,
                                }}
                              />
                            </>
                          )}

                          {userFlag && (
                            <>
                              <span style={{ position: "absolute", right: 0 }}>{userFlags}</span>
                            </>
                          )}
                        </div>
                        <div unselectable="on" style={{ position: "relative" }}>
                          <Button
                            unselectable="on"
                            className="hiddenButton"
                            onClick={hiddenEffectDeleteModal}
                            size="small"
                            style={{
                              border: "none",
                              backgroundColor: "#f0f0f0",
                            }}
                            icon={<ClearOutlined unselectable="on" style={{ pointerEvents: "none", fontSize: "16px" }} />}
                          ></Button>

                          <Modal title="학습도구해제" footer={null} visible={isModalVisibleHidden} onOk={handleOk} onCancel={handleCancel}>
                            <div>가리기</div>
                            {content.content.hidden &&
                              content.content.hidden.map((item) => {
                                return (
                                  <>
                                    <Tag onClick={() => hiddenElementTagHandler(item.targetWord)}>
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
                                    <Tag onClick={() => underlineElementTagHandler(item.targetWord)}>
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
                                    <Tag onClick={() => highlightElementTagHandler(item.targetWord)}>
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
                          </Modal>
                        </div>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<PlusOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<FormOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                        ></Button>

                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<BarChartOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<MessageOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        {content_value.annotation.length > 0 && content_value.annotation[0] !== "" ? (
                          <>
                            <Button
                              size="small"
                              style={{
                                border: "none",
                                backgroundColor: "#f0f0f0",
                              }}
                              icon={<PicRightOutlined style={{ fontSize: "16px" }} />}
                            ></Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              style={{
                                border: "none",
                                backgroundColor: "#f0f0f0",
                              }}
                              icon={<PicRightOutlined style={{ fontSize: "16px" }} />}
                              disabled
                            ></Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {content._id !== cardId && (
                    <>
                      <div
                        style={{
                          padding: "0px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "end",
                        }}
                      >
                        {content.content.userFlag === 0 && (
                          <>
                            <div
                              style={{
                                backgroundColor: "#ffffff00",
                                height: "2px",
                                width: "20px",
                                borderRadius: "2px",
                              }}
                            >
                              {" "}
                            </div>
                          </>
                        )}
                        {content.content.userFlag !== 0 && (
                          <>
                            <div
                              style={{
                                backgroundColor: `${userFlagDetails["flag" + String(content.content.userFlag)].figureColor}`,
                                height: "2px",
                                width: "20px",
                                borderRadius: "2px",
                              }}
                            >
                              {" "}
                            </div>
                          </>
                        )}

                        <div style={{ display: "flex", alignItems: "end" }}>
                          {content.content.memo !== null && (
                            <>
                              <div
                                style={{
                                  backgroundColor: "#50d663",
                                  height: "2px",
                                  width: "20px",
                                  borderRadius: "2px",
                                }}
                              >
                                {" "}
                              </div>
                            </>
                          )}
                          {content_value.annotation.length > 0 && content_value.annotation[0] !== "" && (
                            <>
                              <div
                                style={{
                                  backgroundColor: "blue",
                                  height: "2px",
                                  width: "20px",
                                  borderRadius: "2px",
                                }}
                              >
                                {" "}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <div className={`${content._id} child_group other`}>
                    <div style={{ marginBottom: "0px" }}>
                      <div onClick={() => onClickCard(content._id, "share")}>
                        {/* 페이스 스타일 영역 */}
                        {content.content.makerFlag.value !== null && flagArea}
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
                                {/* <FroalaEditorView model={item} /> */}
                                <Alter content={content} item={item} index={index} getSelectionText2={getSelectionText2} cardTypeSets={cardTypeSets} />
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider style={{ marginTop: "5px", marginBottom: "5px" }} dashed />
                </>
              )}
              {content.card_info.cardtype === "flip" && (
                <>
                  {content._id === cardId && (
                    <>
                      <div
                        style={{
                          backgroundColor: "#f0f0f0",
                          height: "38px",
                          padding: "0 5px 0 5px",
                          // boxShadow: "0px 0px 1px 1px #eeeeee",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          border: "1px solid gainsboro",
                          borderTopLeftRadius: "10px",
                          borderTopRightRadius: "10px",
                        }}
                      >
                        <div style={{ width: "24pxpx", height: "2rem", position: "relative", textAlign: "center" }}>
                          {content.content.userFlag === 0 && (
                            <>
                              <FlagOutlined
                                onClick={onClickUserFlag}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: "#f0f0f0",
                                  border: "1px solid lightgrey",
                                }}
                              />
                            </>
                          )}
                          {content.content.userFlag !== 0 && (
                            <>
                              <FlagFilled
                                onClick={onClickUserFlag}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: `${userFlagDetails["flag" + String(content.content.userFlag)].figureColor}`,
                                }}
                              />
                            </>
                          )}

                          {userFlag && (
                            <>
                              <span style={{ position: "absolute", right: 0 }}>{userFlags}</span>
                            </>
                          )}
                        </div>
                        <div unselectable="on" style={{ position: "relative" }}>
                          <Button
                            unselectable="on"
                            className="hiddenButton"
                            onClick={hiddenEffectDeleteModal}
                            size="small"
                            style={{
                              border: "none",
                              backgroundColor: "#f0f0f0",
                            }}
                            icon={<ClearOutlined unselectable="on" style={{ pointerEvents: "none", fontSize: "16px" }} />}
                          ></Button>

                          <Modal title="학습도구해제" footer={null} visible={isModalVisibleHidden} onOk={handleOk} onCancel={handleCancel}>
                            <div>가리기</div>
                            {content.content.hidden &&
                              content.content.hidden.map((item) => {
                                return (
                                  <>
                                    <Tag onClick={() => hiddenElementTagHandler(item.targetWord)}>
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
                                    <Tag onClick={() => underlineElementTagHandler(item.targetWord)}>
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
                                    <Tag onClick={() => highlightElementTagHandler(item.targetWord)}>
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
                          </Modal>
                        </div>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<PlusOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<FormOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<DeleteOutlined style={{ fontSize: "16px" }} />}
                        ></Button>

                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<ProfileOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<BarChartOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        <Button
                          size="small"
                          style={{
                            border: "none",
                            backgroundColor: "#f0f0f0",
                          }}
                          icon={<MessageOutlined style={{ fontSize: "16px" }} />}
                        ></Button>
                        {content_value.annotation.length > 0 && content_value.annotation[0] !== "" ? (
                          <>
                            <Button
                              size="small"
                              style={{
                                border: "none",
                                backgroundColor: "#f0f0f0",
                              }}
                              icon={<PicRightOutlined style={{ fontSize: "16px" }} />}
                            ></Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="small"
                              style={{
                                border: "none",
                                backgroundColor: "#f0f0f0",
                              }}
                              icon={<PicRightOutlined style={{ fontSize: "16px" }} />}
                              disabled
                            ></Button>
                          </>
                        )}
                      </div>
                    </>
                  )}
                  {content._id !== cardId && (
                    <>
                      <div
                        style={{
                          padding: "0px",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "end",
                        }}
                      >
                        {content.content.userFlag === 0 && (
                          <>
                            <div
                              style={{
                                backgroundColor: "#ffffff00",
                                height: "2px",
                                width: "20px",
                                borderRadius: "2px",
                              }}
                            >
                              {" "}
                            </div>
                          </>
                        )}
                        {content.content.userFlag !== 0 && (
                          <>
                            <div
                              style={{
                                backgroundColor: `${userFlagDetails["flag" + String(content.content.userFlag)].figureColor}`,
                                height: "2px",
                                width: "20px",
                                borderRadius: "2px",
                              }}
                            >
                              {" "}
                            </div>
                          </>
                        )}

                        <div style={{ display: "flex", alignItems: "end" }}>
                          {content.content.memo !== null && (
                            <>
                              <div
                                style={{
                                  backgroundColor: "#50d663",
                                  height: "2px",
                                  width: "20px",
                                  borderRadius: "2px",
                                }}
                              >
                                {" "}
                              </div>
                            </>
                          )}
                          {content_value.annotation.length > 0 && content_value.annotation[0] !== "" && (
                            <>
                              <div
                                style={{
                                  backgroundColor: "blue",
                                  height: "2px",
                                  width: "20px",
                                  borderRadius: "2px",
                                }}
                              >
                                {" "}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <div className={`${content.card_info.parentCard_id} ${content._id} child_group other`}>
                    <div style={{ marginBottom: "0px" }}>
                      <div
                        onClick={() => onClickCard(content._id, "flip", content.card_info.parentCard_id, content.card_info)}
                        // style={{ borderLeft: `${content.card_info.hasParent === "yes" && "2px solid green"}` }}
                      >
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
                          {/* 페이스1 스타일 영역 */}
                          {content.content.makerFlag.value !== null && flagArea}
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
                                  {/* <FroalaEditorView model={item} /> */}
                                  <Alter content={content} item={item} index={index} getSelectionText2={getSelectionText2} cardTypeSets={cardTypeSets} />
                                  {/* <div id={`face1row${index + 1}`} dangerouslySetInnerHTML={{ __html: item }}></div> */}
                                </div>
                              </>
                            ))}
                            {content_value.selection &&
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
                                    {/* <FroalaEditorView model={item} /> */}
                                    <Alter content={content} item={item} index={index} getSelectionText2={getSelectionText2} cardTypeSets={cardTypeSets} />
                                  </div>
                                </>
                              ))}
                          </div>
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
                            {content_value.face2.map((item, index) => (
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
                                  {/* <FroalaEditorView model={item} /> */}
                                  <Alter content={content} item={item} index={index} getSelectionText2={getSelectionText2} cardTypeSets={cardTypeSets} />
                                  {/* <div id={`face2row${index + 1}`} dangerouslySetInnerHTML={{ __html: item }}></div> */}
                                </div>
                              </>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Divider style={{ marginTop: "5px", marginBottom: "5px" }} dashed />
                </>
              )}
            </>
          );
        }
      });
      return show_contents;
    });
  }

  const onClickCard = (card_id, from, group, card_info) => {
    console.log(card_info);
    sessionStorage.removeItem("selectionText");
    const selected1 = document.getElementsByClassName(card_id);
    const selected2 = document.getElementsByClassName("other");

    for (var a = 0; a < selected2.length; a++) {
      const section = selected2.item(a);
      section.style.border = "none";
      section.style.borderBottomLeftRadius = "0px";
      section.style.borderBottomRightRadius = "0px";
      // section.style.boxShadow = "#ffffff00 0px 0px 0px 0px";
    }
    for (var a = 0; a < selected1.length; a++) {
      const section = selected1.item(a);
      section.style.border = "1px solid gainsboro";
      section.style.borderTop = "none";
      section.style.borderBottomLeftRadius = "5px";
      section.style.borderBottomRightRadius = "5px";
      section.style.padding = "5px 0px";

      // section.style.boxShadow = "#eeeeee 0px 1px 2px 1px";
    }

    if (cardId === card_id) {
      setCardId("");
      setCardInfo("");
      for (var a = 0; a < selected2.length; a++) {
        const section = selected2.item(a);
        section.style.border = "none";
        section.style.borderBottomLeftRadius = "0px";
        section.style.borderBottomRightRadius = "0px";
        // section.style.boxShadow = "#ffffff00 0px 0px 0px 0px";
      }
    } else {
      setCardId(card_id);
      setCardInfo(card_info);
    }
    setCardClickMenu(false);
    setUserFlag(false);
    setHiddenToggle(false);
    setUnderlineToggle(false);
  };

  const [cardset_addEffect] = useMutation(ForAddEffect, {
    onCompleted: showdataaftereffectfetch,
  });
  function showdataaftereffectfetch(data) {
    console.log("data", data);
    // setCardListStudying(data.showdataaftereffectfetch.cardlistStudying);
  }

  const cardsetAddEffect = useCallback(
    async (cardset_id, card_id, effectType, targetWord, toolType) => {
      try {
        await cardset_addEffect({
          variables: {
            forAddEffect: {
              cardset_id,
              card_id,
              effectType,
              targetWord,
              toolType: Number(toolType),
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [cardset_addEffect]
  );

  const [cardset_deleteEffect] = useMutation(ForDeleteEffect, {
    onCompleted: showdataafterdeleteeffect,
  });
  function showdataafterdeleteeffect(data) {
    console.log("data", data);
    // setCardListStudying(data.showdataaftereffectfetch.cardlistStudying);
  }

  const cardsetDeleteEffect = useCallback(
    async (cardset_id, card_id, effectType, targetWord) => {
      try {
        await cardset_deleteEffect({
          variables: {
            forDeleteEffect: {
              cardset_id,
              card_id,
              effectType,
              targetWord,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [cardset_deleteEffect]
  );

  const [searchResult, setSearchResult] = useState(false);
  const [cardset_inquireLanguageDictionary] = useMutation(Dictionary, {
    onCompleted: afterdictionary,
  });
  function afterdictionary(data) {
    console.log("data", data.cardset_inquireLanguageDictionary.data1);
    const selectionText = sessionStorage.getItem("selectionText");
    const original = data.cardset_inquireLanguageDictionary.data1;
    const meaning = original.match(/(KO\">([ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s(),\.\?]{1,100}))/gi);
    const definitionKo = meaning[0].match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s(),\.\?]{1,100})/gi)[0];
    const additional = meaning[1].match(/([ㄱ-ㅎ|ㅏ-ㅣ|가-힣\s(),\.\?]{1,100})/gi)[0];
    const definitionEg = original.match(/(def\">([a-z\s(),\.\?]{1,200}))/gi);
    const definitionEg1 = definitionEg[0].match(/([a-z\s(),\.\?]{1,200})/gi)[1];
    const definitionEg2 = definitionEg[1].match(/([a-z\s(),\.\?]{1,200})/gi)[1];
    const exampleEg = original.match(/(eg\">([a-z\s(),\.\?]{1,200}))/gi);
    const exampleEg1 = exampleEg[0].match(/([a-z\s(),\.\?]{1,200})/gi)[1];
    const exampleEg2 = exampleEg[1].match(/([a-z\s(),\.\?]{1,200})/gi)[1];
    console.log(meaning);
    console.log("뜻", definitionKo);
    console.log("뜻2", additional);
    console.log(definitionEg);
    console.log("영영뜻", definitionEg1);
    console.log("영영뜻2", definitionEg2);
    console.log(exampleEg);
    console.log("영어예문", exampleEg1);
    console.log("영어예문2", exampleEg2);
    const results = {
      selectionText: selectionText,
      meaning1: definitionKo,
      meaning2: additional,
      meaningEng1: definitionEg1,
      meaningEng2: definitionEg2,
      example1: exampleEg1,
      example2: exampleEg2,
    };
    setSearchResult(results);
    sessionStorage.removeItem("selectionText");
  }

  const searchWord = useCallback(async () => {
    const selectionText = sessionStorage.getItem("selectionText");
    try {
      await cardset_inquireLanguageDictionary({
        variables: {
          targetWord: selectionText,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [cardset_inquireLanguageDictionary]);

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
      <StudyLayout mode="읽기">
    
          <div
            style={{
              margin:"auto",
              width: "95%",
              maxWidth:"972px",
              marginBottom: "120px",
              marginTop: "50px",
            }}
          >
            <div id="contents">{contents}</div>
          </div>
    
        {data && (
          <>
            <FixedBottomMenuReadMode
              hide={hide}
              underline={underline}
              highlight={highlight}
              search={search}
              underlineToggle={underlineToggle}
              hiddenToggle={hiddenToggle}
              highlightToggle={highlightToggle}
              searchToggle={searchToggle}
              cardTypeSets={cardTypeSets}
              hiddenToggleHandler={hiddenToggleHandler}
              underlineToggleHandler={underlineToggleHandler}
              highlightToggleHandler={highlightToggleHandler}
              searchToggleHandler={searchToggleHandler}
              updateStudyToolApply={updateStudyToolApply}
              setHiddenToggle={setHiddenToggle}
              setUnderlineToggle={setUnderlineToggle}
              setHighlightToggle={setHighlightToggle}
              setSearchToggle={setSearchToggle}
              searchResult={searchResult}
              prepareCardInDictionary={prepareCardInDictionary}
              editorOn={editorOn}
              selectedCardType={selectedCardType}
              fireEditor={fireEditor}
            />
          </>
        )}
      </StudyLayout>
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
      altered = altered.replace(element.targetWord, `<span style="background-color:${color}; color:${color}">${element.targetWord}</span>`);
    });
  }
  if (content.content.underline.length > 0) {
    content.content.underline.map((element) => {
      const color = cardTypeSets[0].studyTool.underline[element.toolType].color;
      const thickness = cardTypeSets[0].studyTool.underline[element.toolType].attr1;
      const lineType = cardTypeSets[0].studyTool.underline[element.toolType].attr2;
      // console.log(element);
      altered = altered.replace(element.targetWord, `<span style="display:inline-block; border-bottom: ${thickness}px ${lineType} ${color}">${element.targetWord}</span>`);
    });
  }

  if (content.content.highlight.length > 0) {
    content.content.highlight.map((element) => {
      const color = cardTypeSets[0].studyTool.highlight[element.toolType].color;
      if (element.toolType === 0 || element.toolType === 1 || element.toolType === 3 || element.toolType === 4) {
        altered = altered.replace(
          element.targetWord,
          `<span class="brush${element.toolType === 0 || element.toolType === 1 ? 1 : 3}" style="display:inline-block; --bubble-color:${color}; --z-index:-1">${
            element.targetWord
          }</span>`
        );
      } else if (element.toolType === 2) {
        altered = altered.replace(
          element.targetWord,
          `<span class="brush${element.toolType}" style="display:inline-block; background-color:${color}">${element.targetWord}</span>`
        );
      }
    });
  }

  var varUA = navigator.userAgent.toLowerCase(); //userAgent 값 얻기

  if (varUA.indexOf("android") > -1) {
    //안드로이드
    console.log("android");
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
    console.log("ios");
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
    console.log("other");
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

export default ReadMode;
