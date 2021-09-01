import React, { useState, useEffect, Fragment } from "react";
import StudyLayout from "../../../../../components/layout/StudyLayout";
import { GetSession } from "../../../../../graphql/query/session";
import { useMutation, useQuery } from "@apollo/client";

const FlipMode = () => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var session_id = localStorage.getItem("session_id");
    console.log(session_id);
  }

  const [cardInfos, setCardInfos] = useState();
  const { loading, error, data } = useQuery(GetSession, {
    variables: { session_id: session_id },
  });

  useEffect(() => {
    console.log("세션 카드 인포 저장");
    if (data) {
      console.log("--->", data);
      setCardInfos(data.getsession);
    }
  }, [data]);

  return (
    <StudyLayout>
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
    </StudyLayout>
  );
};

export default FlipMode;
