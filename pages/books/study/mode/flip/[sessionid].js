import React, { useState, useEffect, Fragment } from "react";
import Layout from "../../../../../components/layout/Layout";
import { GetSession } from "../../../../../graphql/query/session";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from 'next/router';
import CardContainer from "../../../../../components/books/study/mode/flip/CardContainer";
const FlipMode = () => {
  const { query } = useRouter();
  console.log(query.sessionid)

  const[cardListStudying, setCardListStudying] = useState();
  const[sessionScope, setSessionScope] = useState();

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var session_id_temp = sessionStorage.getItem("session_Id")
    if(query.sessionid === undefined){
       var session_id = session_id_temp
     } else {
      session_id = query.sessionid;
     }
     console.log(session_id)
  } 

  const { loading, error, data } = useQuery(GetSession, {
    variables: { session_id: session_id},
    onCompleted:onCompletedGetSession
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
  
  console.log("here")
  return (
    <Layout>
      <CardContainer cardListStudying={cardListStudying} sessionScope={sessionScope}/>
    </Layout>
  );
};

export default FlipMode;
