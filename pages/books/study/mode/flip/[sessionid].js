import React, { useState, useEffect, Fragment } from "react";
import Layout from "../../../../../components/layout/Layout";
import { GetSession } from "../../../../../graphql/query/session";
import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from 'next/router';
const FlipMode = () => {
  const { query } = useRouter();
  console.log(query.sessionid)

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
    variables: { session_id: session_id },
    onCompleted:(data)=>console.log(data)
  });
  
  console.log("here")
  return (
    <Layout>
      <div>
        <div style={{ marginTop: "50px", margin: "auto", width: "600px", height: "500px", border: "1px solid grey" }}>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
            <div style={{ display: "flex", height: "80%", alignItems: "center", justifyContent: "center" }}>contents</div>
            <div style={{ padding: 10, display: "flex", alignItems: "center", justifyContent: "space-around" }}>
              <button>5분뒤한번더</button>
              <button>10분뒤한번더</button>
              <button>20분뒤한번더</button>
              <button>30분뒤한번더</button>
              <button>세션탈출</button>
            </div>
          </div>
        </div>
      </div>
      <div>뒤집기모드</div>
    </Layout>
  );
};

export default FlipMode;
