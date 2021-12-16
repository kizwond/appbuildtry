import React, { useState, useEffect, Fragment } from "react";
import { GetSession } from "../../../../../graphql/query/session";
import { QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS } from "../../../../../graphql/query/allQuery";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import FlipContainer from "../../../../../components/books/study/mode/flip/FlipContainer";
import StudyLayout from "../../../../../components/layout/StudyLayout";
import FixedBottomMenuFlipMode from "../../../../../components/books/write/editpage/sidemenu/FixedBottomMenuFlipMode";
import {
  GET_CARD_CONTENT,
  GET_BUY_CARD_CONTENT,
  GET_CARDTYPESET,
} from "../../../../../graphql/query/card_contents";

const FlipMode = () => {
  const { query } = useRouter();
  // console.log(query.sessionid);

  const [cardListStudying, setCardListStudying] = useState();
  const [sessionScope, setSessionScope] = useState();
  const [levelConfigs, setLevelConfigs] = useState();
  const [contentsList, setContentsList] = useState([]);
  const [cardTypeSets, setCardTypeSets] = useState([]);

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
  const [
    levelconfig_getLevelconfigs,
    { loading: loading5, error: error5, data: levelconfig },
  ] = useLazyQuery(QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS, {
    onCompleted: afterGetLevelConfig,
  });
  function afterGetLevelConfig(data) {
    console.log(data);
    setLevelConfigs(data.levelconfig_getLevelconfigs.levelconfigs);
  }
  const [
    mycontent_getMycontentByMycontentIDs,
    { loading: loading2, error: error2, data: myContents },
  ] = useLazyQuery(GET_CARD_CONTENT, { onCompleted: afterGetContent });
  const [
    buycontent_getBuycontentByBuycontentIDs,
    { loading: loading3, error: error3, data: buyContents },
  ] = useLazyQuery(GET_BUY_CARD_CONTENT, {
    onCompleted: afterGetBuyContent,
  });
  const [
    cardtypeset_getbymybookids,
    { loading: loading4, error: error4, data: cardtypeset },
  ] = useLazyQuery(GET_CARDTYPESET, {
    onCompleted: afterGetCardTypeSet,
  });
  function afterGetContent(data) {
    console.log(data);
    // console.log(contentsList);
    const newArray = contentsList.concat(
      data.mycontent_getMycontentByMycontentIDs.mycontents
    );
    var uniq = newArray.filter(
      (v, i, a) => a.findIndex((t) => t._id === v._id) === i
    );
    // console.log(uniq);
    setContentsList(uniq);
  }
  function afterGetBuyContent(data) {
    // console.log(data);
    // console.log(contentsList);
    const newArray = contentsList.concat(
      data.buycontent_getBuycontentByBuycontentIDs.buycontents
    );
    var uniq = newArray.filter(
      (v, i, a) => a.findIndex((t) => t._id === v._id) === i
    );
    // console.log(uniq);
    setContentsList(uniq);
  }
  function afterGetCardTypeSet(data) {
    console.log(data);
    setCardTypeSets(data.cardtypeset_getbymybookids.cardtypesets);
  }
  useEffect(() => {
    if (data) {
      console.log("최초 리드모드 데이터 : ", data);
      console.log(
        "세션스코프 : ",
        data.session_getSession.sessions[0].sessionScope
      );
      console.log(
        "카드리스트스터딩 :",
        data.session_getSession.sessions[0].cardlistStudying
      );
      sessionStorage.setItem(
        "cardListStudying",
        JSON.stringify(data.session_getSession.sessions[0].cardlistStudying)
      );
      setCardListStudying(data.session_getSession.sessions[0].cardlistStudying);
      setSessionScope(data.session_getSession.sessions[0].sessionScope);
      sessionStorage.setItem("card_seq", 0);
      sessionStorage.setItem("origin_seq", 0);
      sessionStorage.removeItem("cardlist_to_send");
      sessionStorage.removeItem("studyLogCardIds");
      const now = new Date();
      sessionStorage.setItem("started", now);
      const cardIdList =
        data.session_getSession.sessions[0].cardlistStudying.map((item) => {
          return item.content.mycontent_id;
        });
      const buyContentsIdsList =
        data.session_getSession.sessions[0].cardlistStudying.map((item) => {
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
      const mybook_ids = data.session_getSession.sessions[0].sessionScope.map(
        (item) => {
          return item.mybook_id;
        }
      );
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
  }, [
    data,
    levelconfig_getLevelconfigs,
    mycontent_getMycontentByMycontentIDs,
    buycontent_getBuycontentByBuycontentIDs,
    cardtypeset_getbymybookids,
  ]);

  return (
    <StudyLayout>
      <div
        style={{
          height: "100%",
          width: "95%",
          margin: "auto",
          marginTop: "50px",
        }}
      >
        <FlipContainer
          cardListStudying={cardListStudying}
          contentsList={contentsList}
          sessionScope={sessionScope}
          levelConfigs={levelConfigs}
          cardTypeSets={cardTypeSets}
        />
      </div>
      {data && (
        <>
          <FixedBottomMenuFlipMode />
        </>
      )}
    </StudyLayout>
  );
};

export default FlipMode;
