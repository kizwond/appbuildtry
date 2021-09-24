import React, { useState, useEffect, Fragment } from 'react';
import Layout from '../../../../../components/layout/Layout';
import { GetSession } from '../../../../../graphql/query/session';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import CardContainer from '../../../../../components/books/study/mode/flip/CardContainer';
import StudyNav from '../../../../../components/books/study/mode/StudyNav';

const FlipMode = () => {
  const { query } = useRouter();
  console.log(query.sessionid);

  const [cardListStudying, setCardListStudying] = useState();
  const [sessionScope, setSessionScope] = useState();
  const [ttsFields, setTtsFields] = useState([]);

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
    console.log("hello : ", data)
    console.log("hello : ", data.session_getSession.sessions[0].sessionScope)
    console.log("hello : ",data.session_getSession.sessions[0].cardlistStudying)
    sessionStorage.setItem("cardListStudying", JSON.stringify(data.session_getSession.sessions[0].cardlistStudying))
    setCardListStudying(data.session_getSession.sessions[0].cardlistStudying)
    setSessionScope(data.session_getSession.sessions[0].sessionScope)
    sessionStorage.setItem("card_seq", 0)
    sessionStorage.removeItem("cardlist_to_send")
  }

  console.log('here');

  function onChangeTTS(e) {
    console.log(`checked = ${e.target.checked}`);
    console.log(`value = ${e.target.value}`);
    if(e.target.checked === true){
      const newvalue = ttsFields.concat(e.target.value)
      setTtsFields(newvalue)
      console.log(newvalue)
    } else {
      const newvalue = ttsFields;
      const idx = newvalue.indexOf(e.target.value) 
      if (idx > -1) newvalue.splice(idx, 1)
      setTtsFields(newvalue)
      console.log(newvalue)
    }
  }

  return (
    <Layout>
      <StudyNav onChangeTTS={onChangeTTS} sessionScope={sessionScope}/>
      <CardContainer
        cardListStudying={cardListStudying}
        sessionScope={sessionScope}
        ttsFields={ttsFields}
      />
    </Layout>
  );
};

export default FlipMode;
