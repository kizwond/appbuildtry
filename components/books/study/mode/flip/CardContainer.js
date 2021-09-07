import React, { useState, useEffect, useCallback } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";
import { GetLevelConfig, UpdateResults } from "../../../../../graphql/query/session";

const CardContainer = ({ cardListStudying, sessionScope }) => {
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
    //   console.log("hello : ",data.session_getContents.sessions[0].cardlistStudying)
    //   setCardListStudying(data.session_getContents.sessions[0].cardlistStudying)
  }

  function onCompletedGetLevelConfig() {
    console.log("data1", data1);
    setLevelconfigs(data1.levelconfig_getLevelconfigs.levelconfigs);
    //   console.log("hello : ",data.session_getContents.sessions[0].cardlistStudying)
    //   setCardListStudying(data.session_getContents.sessions[0].cardlistStudying)
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
  }, [cards]);

  const onDiffClickHandler = useCallback(async () => {
    const card_seq = sessionStorage.getItem("card_seq");
    sessionStorage.setItem("card_seq", Number(card_seq) + 1);
    cardShow();
  }, [cardShow]);

  useEffect(() => {
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
          <button onClick={() => onDiffClickHandler()}>{item.nick}</button>
        </>
      ));
      setDiffis(diffiButtons);
    }
  }, [cards, levelconfigs, cardListStudying, onDiffClickHandler]);

  const [session_updateResults] = useMutation(UpdateResults, { onCompleted: showdataposition });

  function showdataposition(data) {
    console.log("data", data);
  }

  async function sessionupdateresults(value) {
    try {
      await session_updateResults({
        variables: {
          forUpdateResults: {
            session_id: ID,
            studyResults: {
              _id: ID,
              seqInCardlist: Int,
              card_info: {
                mybook_id: ID,
                cardset_id: ID,
                cardtypeset_id: ID,
                cardtype_id: ID,
                cardtype: String,
                time_created: String,
                hasParent: String,
                parent_card_id: ID,
              },
              contents: {
                maker_flag: Int,
                user_flag: Int,
                location: String,
                mycontents_id: String,
                buycontents_id: String,
              },
              studyStatus: {
                statusOriginal: String,
                statusPrev: String,
                levelOriginal: Int,
                studyTimesInSession: Int,
                userFlagOriginal: Int,
                userFlagPrev: Int,
                statusCurrent: String,
                recentKnowTime: String,
                recentStudyResult: String,
                recentExamResult: String,
                recentExamTime: String,
                recentStudyTime: String,
                recentSelection: String,
                recentSelectTime: String,
                needStudyTime: String,
                currentLevStudyTimes: Int,
                currentLevAccuStudyTime: String,
                totalStudyTimes: Int,
                totalExamTimes: Int,
                recentStayHour: String,
                totalStayHour: String,
                levelCurrent: Int,
              },
            },
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

  return (
    <div style={{ marginTop: "50px", margin: "auto", width: "600px", height: "500px", border: "1px solid grey" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", height: "80%", alignItems: "center", justifyContent: "center" }}>
          <div>face1: {face1Contents}</div>
          <div>face2: {face2Contents}</div>
        </div>
        <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-around" }}>{diffis}</div>
      </div>
    </div>
  );
};

export default CardContainer;
