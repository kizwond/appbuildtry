import React, { useState, useEffect, Fragment } from 'react';
import { GetSession } from '../../../../../graphql/query/session';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
// import CardContainer from '../../../../../components/books/study/mode/flip/CardContainer';
import StudyLayout from "../../../../../components/layout/StudyLayout";

const ReadMode = () => {
  const { query } = useRouter();
  console.log(query.sessionid);

  const [cardListStudying, setCardListStudying] = useState();
  const [sessionScope, setSessionScope] = useState();

  const ISSERVER = typeof window === 'undefined';
  if (!ISSERVER) {
    var session_id_temp = sessionStorage.getItem('session_Id');
    if (query.sessionid === undefined) {
      var session_id = session_id_temp;
    } else {
      session_id = query.sessionid;
    }
    console.log(session_id);
  }

  const { loading, error, data } = useQuery(GetSession, {
    variables: { session_id: session_id },
    onCompleted: onCompletedGetSession,
  });

  function onCompletedGetSession(){
    console.log("최초 리드모드 데이터 : ", data)
    console.log("세션스코프 : ", data.session_getSession.sessions[0].sessionScope)
    console.log("카드리스트스터딩 :" ,data.session_getSession.sessions[0].cardlistStudying)
    sessionStorage.setItem("cardListStudying", JSON.stringify(data.session_getSession.sessions[0].cardlistStudying))
    setCardListStudying(data.session_getSession.sessions[0].cardlistStudying)
    setSessionScope(data.session_getSession.sessions[0].sessionScope)
    sessionStorage.setItem("card_seq", 0)
    sessionStorage.removeItem("cardlist_to_send")
    const now = new Date();
    sessionStorage.setItem("started", now)
  }

  return (
    <StudyLayout>
       <div style={{width: "90%", margin: "auto", marginBottom: "120px", marginTop: "50px" }}>
          read mode
        </div>
      {/* <CardContainer
        cardListStudying={cardListStudying}
        sessionScope={sessionScope}
        ttsFields={ttsFields}
      /> */}
    </StudyLayout>
  );
};

export default ReadMode;
