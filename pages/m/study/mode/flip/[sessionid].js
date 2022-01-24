import React, { useState, useEffect, useCallback } from "react";
import { GetSession } from "../../../../../graphql/query/session";
import { QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS } from "../../../../../graphql/query/allQuery";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import FlipContainer from "../../../../../components/books/study/mode/flip/FlipContainer";
import StudyLayout from "../../../../../components/layout/StudyLayout";
import FixedBottomMenuFlipMode from "../../../../../components/books/write/editpage/sidemenu/FixedBottomMenuFlipMode";
import { GET_CARD_CONTENT, GET_BUY_CARD_CONTENT, GET_CARDTYPESET } from "../../../../../graphql/query/card_contents";
import { MUTATION_UPDATE_USER_FLAG } from "../../../../../graphql/mutation/userFlagApply";
import { Button, Modal, Space, Tag, message, Divider } from "antd";
import { ForAddEffect, ForDeleteEffect } from "../../../../../graphql/mutation/studyUtils";
import { createFalse } from "typescript";
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

  const hiddenToggleHandler = (info) => {
    console.log("userflagclicked!!!");
    setHiddenToggle(!hiddenToggle);
    setUnderlineToggle(false);
    setHighlightToggle(false);
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
    if (highlightToggle === false) {
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
  return (
    <StudyLayout mode="뒤집기">
      <div
        style={{
          height: "100%",
          width: "95%",
          margin: "auto",
          marginTop: "50px",
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
            underlineToggle={underlineToggle}
            hiddenToggle={hiddenToggle}
            highlightToggle={highlightToggle}
            cardTypeSets={cardTypeSets}
            hiddenToggleHandler={hiddenToggleHandler}
            underlineToggleHandler={underlineToggleHandler}
            highlightToggleHandler={highlightToggleHandler}
            updateStudyToolApply={updateStudyToolApply}
            setHiddenToggle={setHiddenToggle}
            setUnderlineToggle={setUnderlineToggle}
            setHighlightToggle={setHighlightToggle}
          />
        </>
      )}
    </StudyLayout>
  );
};

export default FlipMode;
