import React, { useState, useEffect } from "react";
import { GetSession } from "../../../../../graphql/query/session";
import { QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS } from "../../../../../graphql/query/allQuery";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import ExamContainer from "../../../../../components/books/study/mode/flip/ExamContainer";
import StudyLayout from "../../../../../components/layout/StudyLayout";
import FixedBottomMenuExamMode from "../../../../../components/books/write/editpage/sidemenu/FixedBottomMenuExamMode";
import { GET_CARD_CONTENT, GET_BUY_CARD_CONTENT, GET_CARDTYPESET } from "../../../../../graphql/query/card_contents";
import { Button, Modal, Space, Tag, message, Divider } from "antd";

const ExamMode = () => {
  const { query } = useRouter();
  // console.log(query.sessionid);

  const [cardListStudying, setCardListStudying] = useState();

  const [sessionScope, setSessionScope] = useState();
  const [levelConfigs, setLevelConfigs] = useState();
  const [contentsList, setContentsList] = useState([]);
  const [cardTypeSets, setCardTypeSets] = useState([]);

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
        sessionStorage.removeItem("examLog");
        sessionStorage.setItem("firstFetchData", JSON.stringify(data));
        console.log("최초 리드모드 데이터 : ", data);
        console.log("세션스코프 : ", data.session_getSession.sessions[0].sessionScope);
        const cardListStudying = JSON.parse(sessionStorage.getItem("cardListStudying"));
        const examLogPrepare = cardListStudying.map(item=>{
          return ({cardId : item._id, card_info:item, answer:"", content:""})
        })
        sessionStorage.setItem("examLog", JSON.stringify(examLogPrepare))
        setCardListStudying(cardListStudying);
        setSessionScope(data.session_getSession.sessions[0].sessionScope);
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

  return (
    <StudyLayout mode="시험">
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
            <ExamContainer
              cardListStudying={cardListStudying}
              contentsList={contentsList}
              sessionScope={sessionScope}
              levelConfigs={levelConfigs}
              cardTypeSets={cardTypeSets}
            />
          </>
        )}
      </div>
      {data && (
        <>
          <FixedBottomMenuExamMode
            cardTypeSets={cardTypeSets}
          />
        </>
      )}
    </StudyLayout>
  );
};

export default ExamMode;
