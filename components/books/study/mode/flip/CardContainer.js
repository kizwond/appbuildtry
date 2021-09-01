import React, { useState, useEffect, Fragment } from "react";
import { useMutation, useLazyQuery  } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";

const CardContainer = ({ cardListStudying }) => {
    const [cards, setCards] = useState()
    const [getData, { loading, error, data }] = useLazyQuery(GetContents, {
        onCompleted: onCompletedGetContents,
      });
    
    
    useEffect(() => {
        if (cardListStudying) {
            console.log(cardListStudying);
      
            var value = cardListStudying.map((item) => {
              console.log(item);
              return { location: item.contents.location, mycontents_id: item.contents.mycontents_id, buycontents_id: item.contents.buycontents_id };
            });
            console.log(value);
      
            getData({variables: { forGetContents: value }})
      
          }
      },[cardListStudying, getData]);

 
  function onCompletedGetContents() {
    console.log(data);
    setCards(data.session_getContents.contents)
    //   console.log("hello : ",data.session_getContents.sessions[0].cardlistStudying)
    //   setCardListStudying(data.session_getContents.sessions[0].cardlistStudying)
  }
  if(cards){
      
  }
  return (
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
  );
};

export default CardContainer;
