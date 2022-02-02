import React, { useState, useEffect, useCallback } from "react";
import { GetSession } from "../../../../../graphql/query/session";
import { QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS } from "../../../../../graphql/query/allQuery";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import FlipContainer from "../../../../../components/books/study/mode/flip/FlipContainer";
import StudyLayout from "../../../../../components/layout/StudyLayout";
import FixedBottomMenuFlipMode from "../../../../../components/books/write/editpage/sidemenu/FixedBottomMenuFlipMode";
import { GET_CARD_CONTENT, GET_BUY_CARD_CONTENT, GET_CARDTYPESET, AddCard } from "../../../../../graphql/query/card_contents";
import { MUTATION_UPDATE_USER_FLAG } from "../../../../../graphql/mutation/userFlagApply";
import { Button, Modal, Space, Tag, message, Divider } from "antd";
import { ForAddEffect, ForDeleteEffect } from "../../../../../graphql/mutation/studyUtils";
import { SAVEMEMO } from "../../../../../graphql/mutation/addMemo";
import dynamic from "next/dynamic";
import { Dictionary } from "../../../../../graphql/query/card_contents";
import { UpdateResults } from "../../../../../graphql/query/session";
import { calculateStudyStatus } from "../../../../../components/books/study/mode/flip/FlipContainerSub";
import produce from "immer";

const Editor = dynamic(() => import("../../../../../components/books/write/editpage/Editor"), {
  ssr: false,
});

const FlipMode = () => {
  const { query } = useRouter();
  // console.log(query.sessionid);

  const [cardListStudying, setCardListStudying] = useState();

  const [ttsOn, setTtsOn] = useState(false);

  const [sessionScope, setSessionScope] = useState();
  const [levelConfigs, setLevelConfigs] = useState();
  const [contentsList, setContentsList] = useState([]);
  const [cardTypeSets, setCardTypeSets] = useState([]);

  const [hiddenToggle, setHiddenToggle] = useState(false);
  const [underlineToggle, setUnderlineToggle] = useState(false);
  const [highlightToggle, setHighlightToggle] = useState(false);

  const [face1row1, setFace1row1] = useState(true);
  const [face1row2, setFace1row2] = useState(true);
  const [face1row3, setFace1row3] = useState(true);
  const [face1row4, setFace1row4] = useState(true);
  const [face1row5, setFace1row5] = useState(true);

  const [face2row1, setFace2row1] = useState(true);
  const [face2row2, setFace2row2] = useState(true);
  const [face2row3, setFace2row3] = useState(true);
  const [face2row4, setFace2row4] = useState(true);
  const [face2row5, setFace2row5] = useState(true);
  const [userFlagDetails, setUserFlagDetails] = useState();
  const [isModalVisibleHidden, setIsModalVisibleHidden] = useState(false);
  const [userFlag, setUserFlag] = useState(false);
  const [searchResult, setSearchResult] = useState(false);

  const [searchToggle, setSearchToggle] = useState(false);
  const [editorOn, setEditorOn] = useState();
  const [selectedCardType, setSelectedCardType] = useState();

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var session_id_temp = sessionStorage.getItem("session_Id");
    if (query.sessionid === undefined) {
      var session_id = session_id_temp;
    } else {
      session_id = query.sessionid;
    }
    // console.log(session_id);
  }

  const router = useRouter();
  const [session_updateResults] = useMutation(UpdateResults, { onCompleted: showdataafterupdateresult });
  function showdataafterupdateresult(data) {
    console.log("data", data);
    if (data.session_updateResults.status === "200") {
      sessionStorage.setItem("endTimeOfSession", new Date());
      router.push("/m/study/result");
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



  const { loading, error, data } = useQuery(GetSession, {
    variables: { session_id: session_id },
  });
  const [levelconfig_getLevelconfigs, { loading: loading5, error: error5, data: levelconfig }] = useLazyQuery(QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS, {
    onCompleted: afterGetLevelConfig,
  });
  function afterGetLevelConfig(data) {
    console.log(data);
    setLevelConfigs(data.levelconfig_getLevelconfigs.levelconfigs);
  }
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
    console.log(data);
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
  useEffect(() => {
    if (data) {
      const dataExist = JSON.parse(sessionStorage.getItem("firstFetchData"));
      if (dataExist) {
        console.log(dataExist);
        console.log(data);
        if (JSON.stringify(dataExist) == JSON.stringify(data)) {
          const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
          setCardListStudying(cardListStudying);
          setSessionScope(data.session_getSession.sessions[0].sessionScope);
          setUserFlagDetails(data.userflagconfig_get.userflagconfigs[0].details);
          const cardIdList = cardListStudying.map((item) => {
            return item.content.mycontent_id;
          });
          const buyContentsIdsList = cardListStudying.map((item) => {
            return item.content.buycontent_id;
          });
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
          const mybook_ids = data.session_getSession.sessions[0].sessionScope.map((item) => {
            return item.mybook_id;
          });
          levelconfig_getLevelconfigs({
            variables: {
              mybook_ids: mybook_ids,
            },
          });
          cardtypeset_getbymybookids({
            variables: {
              mybook_ids: mybook_ids,
            },
          });
        } else {
          sessionStorage.removeItem("firstFetchData");
          sessionStorage.setItem("firstFetchData", JSON.stringify(data));
          console.log("최초 리드모드 데이터 : ", data);
          console.log("세션스코프 : ", data.session_getSession.sessions[0].sessionScope);
          const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
          setCardListStudying(cardListStudying);
          setSessionScope(data.session_getSession.sessions[0].sessionScope);
          setUserFlagDetails(data.userflagconfig_get.userflagconfigs[0].details);
          sessionStorage.setItem("card_seq", 0);
          sessionStorage.setItem("origin_seq", 0);
          sessionStorage.removeItem("cardlist_to_send");
          sessionStorage.removeItem("studyLogCardIds");
          const now = new Date();
          sessionStorage.setItem("started", now);
          const cardIdList = cardListStudying.map((item) => {
            return item.content.mycontent_id;
          });
          const buyContentsIdsList = cardListStudying.map((item) => {
            return item.content.buycontent_id;
          });
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
          const mybook_ids = data.session_getSession.sessions[0].sessionScope.map((item) => {
            return item.mybook_id;
          });
          levelconfig_getLevelconfigs({
            variables: {
              mybook_ids: mybook_ids,
            },
          });
          cardtypeset_getbymybookids({
            variables: {
              mybook_ids: mybook_ids,
            },
          });
        }
      } else {
        sessionStorage.removeItem("firstFetchData");
        sessionStorage.setItem("firstFetchData", JSON.stringify(data));
        console.log("최초 리드모드 데이터 : ", data);
        console.log("세션스코프 : ", data.session_getSession.sessions[0].sessionScope);
        const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
        setCardListStudying(cardListStudying);
        setSessionScope(data.session_getSession.sessions[0].sessionScope);
        setUserFlagDetails(data.userflagconfig_get.userflagconfigs[0].details);
        sessionStorage.setItem("card_seq", 0);
        sessionStorage.setItem("origin_seq", 0);
        sessionStorage.removeItem("cardlist_to_send");
        sessionStorage.removeItem("studyLogCardIds");
        const now = new Date();
        sessionStorage.setItem("started", now);
        const cardIdList = cardListStudying.map((item) => {
          return item.content.mycontent_id;
        });
        const buyContentsIdsList = cardListStudying.map((item) => {
          return item.content.buycontent_id;
        });
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
        const mybook_ids = data.session_getSession.sessions[0].sessionScope.map((item) => {
          return item.mybook_id;
        });
        levelconfig_getLevelconfigs({
          variables: {
            mybook_ids: mybook_ids,
          },
        });
        cardtypeset_getbymybookids({
          variables: {
            mybook_ids: mybook_ids,
          },
        });
      }
    }
  }, [data, levelconfig_getLevelconfigs, mycontent_getMycontentByMycontentIDs, buycontent_getBuycontentByBuycontentIDs, cardtypeset_getbymybookids]);
  
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

  const onFinish = (values, from) => {
    console.log(values);
    const selectionTextCardId = sessionStorage.getItem("selectionTextCardId");
    const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const selectionCard = cardListStudying.filter((item) => item._id === selectionTextCardId);
    console.log(selectionCard)
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

    addcard(mybook_id, cardtype, cardtype_id, current_position_card_id, indexSetId, index_id,cardSetId,values.face1, values.selection, values.face2, values.annotation, values.flagStar, values.flagComment, cardTypeSetId);
  };
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
  const [cardset_deleteEffect] = useMutation(ForDeleteEffect, {
    onCompleted: showdataafterdeleteeffect,
  });
  function showdataafterdeleteeffect(data) {
    console.log("data", data);
    // setCardListStudying(data.showdataaftereffectfetch.cardlistStudying);
  }

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

  function updateStudyToolApply(data) {
    setCardTypeSets(data);
  }

  function face1On(row, bool) {
    if (row === "1") {
      setFace1row1(bool);
    } else if (row === "2") {
      setFace1row2(bool);
    } else if (row === "3") {
      setFace1row3(bool);
    } else if (row === "4") {
      setFace1row4(bool);
    } else if (row === "5") {
      setFace1row5(bool);
    }
  }
  function face2On(row, bool) {
    if (row === "1") {
      setFace2row1(bool);
    } else if (row === "2") {
      setFace2row2(bool);
    } else if (row === "3") {
      setFace2row3(bool);
    } else if (row === "4") {
      setFace2row4(bool);
    } else if (row === "5") {
      setFace2row5(bool);
    }
  }

  const [cardset_updateMemo] = useMutation(SAVEMEMO, {
    onCompleted: showdataaftermemoadd,
  });
  function showdataaftermemoadd(data) {
    console.log("data", data);
  }

  const saveMemo = useCallback(
    async (cardset_id, card_id, memo) => {
      try {
        await cardset_updateMemo({
          variables: {
            forUpdateMemo: {
              cardset_id,
              card_id,
              memo,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    [cardset_updateMemo]
  );

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

  const generateStudyStatus = (card_details_session, current_card_info_index) => {
    const updateThis = card_details_session[current_card_info_index];
    const getUpdateThis = JSON.parse(sessionStorage.getItem("cardlist_to_send"));
    if (getUpdateThis) {
      var finalUpdate = getUpdateThis.concat(updateThis);
    } else {
      finalUpdate = [updateThis];
    }
    sessionStorage.setItem("cardlist_to_send", JSON.stringify(finalUpdate));
  };

  const generateOnFinishStudyStatus = () => {
    const card_details_session_origin = JSON.parse(sessionStorage.getItem("cardListStudying"));
    const current_card_info_index = sessionStorage.getItem("card_seq");
    const current_card_book_id = card_details_session_origin[current_card_info_index].card_info.mybook_id;
    const current_card_levelconfig = levelConfigs.filter((item) => item.levelconfig_info.mybook_id === current_card_book_id);

    const timer = 1000;
    const now = new Date();

    const card_details_session = calculateStudyStatus(null, "finish", current_card_info_index, timer, current_card_levelconfig[0]);

    //업데이트된 학습정보 세션스토리지에 다시 저장
    sessionStorage.setItem("cardListStudying", JSON.stringify(card_details_session));

    //서버에 보내기 위한 학습정보 리스트 생성
    generateStudyStatus(card_details_session, current_card_info_index);
  };

  const finishStudy = () => {
    console.log("finishStudy Clicked!!!");
    generateOnFinishStudyStatus();
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
        delete v.studyStatus.statusPrev;
        delete v.studyStatus.statusOriginal;
        delete v.studyStatus.needStudyTimeTmp;
        delete v.studyStatus.isUpdated;
        delete v.studyStatus.levelUpdated;
        delete v.studyStatus.sessionStatusPrev;
        delete v.studyStatus.sessionStatusCurrent;
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
      cardlist_to_send.forEach(function (v) {
        delete v.__typename;
        delete v.studyStatus.userFlagPrev;
        delete v.studyStatus.userFlagOriginal;
        delete v.studyStatus.statusPrev;
        delete v.studyStatus.statusOriginal;
        delete v.studyStatus.needStudyTimeTmp;
        delete v.studyStatus.isUpdated;
        delete v.studyStatus.levelUpdated;

        delete v.studyStatus.originalStudyRatio;
        delete v.studyStatus.levelOriginal;
        delete v.studyStatus.studyTimesInSession;
        delete v.studyStatus.studyHourInSession;
        delete v.studyStatus.elapsedHourFromLastSession;
        delete v.studyStatus.statusCurrent;
        delete v.studyStatus.recentSelectTime;
        delete v.studyStatus.recentStudyTime;
        delete v.studyStatus.totalStudyHour;
        delete v.studyStatus.totalStudyTimes;
        delete v.studyStatus.recentExamTime;
        delete v.studyStatus.totalExamTimes;
        delete v.studyStatus.sessionStatusPrev;
        delete v.studyStatus.sessionStatusCurrent;
        delete v.studyStatus.__typename;

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

      console.log("filtered : ", filtered);
      console.log("sessionId : ", sessionId);
      sessionupdateresults(sessionId, filtered, resultOfSession, resultByBook, createdCards, dataForRegression, cardlist_to_send);
    } else {
      console.log("공부끝");
    }
  };
  return (
    <StudyLayout mode="학습" finishStudy={finishStudy}>
      <div
        style={{
          height: "100%",
          width: "95%",
          margin: "auto",
        }}
      >
        {contentsList.length > 0 && (
          <>
            <FlipContainer
              ttsOn={ttsOn}
              setTtsOn={setTtsOn}
              face1row1={face1row1}
              face1row2={face1row2}
              face1row3={face1row3}
              face1row4={face1row4}
              face1row5={face1row5}
              face2row1={face2row1}
              face2row2={face2row2}
              face2row3={face2row3}
              face2row4={face2row4}
              face2row5={face2row5}
              cardListStudying={cardListStudying}
              setCardListStudying={setCardListStudying}
              contentsList={contentsList}
              sessionScope={sessionScope}
              levelConfigs={levelConfigs}
              cardTypeSets={cardTypeSets}
              userFlagDetails={userFlagDetails}
              isModalVisibleHidden={isModalVisibleHidden}
              setIsModalVisibleHidden={setIsModalVisibleHidden}
              cardsetDeleteEffect={cardsetDeleteEffect}
              updateUserFlag={updateUserFlag}
              userFlag={userFlag}
              setUserFlag={setUserFlag}
              setHiddenToggle={setHiddenToggle}
              setUnderlineToggle={setUnderlineToggle}
              setHighlightToggle={setHighlightToggle}
              saveMemo={saveMemo}
              sessionupdateresults={sessionupdateresults}
              finishStudy={finishStudy}
            />
          </>
        )}
      </div>
      {data && (
        <>
          <FixedBottomMenuFlipMode
            ttsOn={setTtsOn}
            face1On={face1On}
            face2On={face2On}
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
            finishStudy={finishStudy}
          />
        </>
      )}
    </StudyLayout>
  );
};

export default FlipMode;
