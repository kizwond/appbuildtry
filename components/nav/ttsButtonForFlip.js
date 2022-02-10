import { SoundOutlined, PauseOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button,Popover } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState,useCallback } from "react";
import { QUERY_MY_CARD_CONTENTS } from "../../graphql/query/allQuery";
import { detect, detectAll } from "tinyld";
import _ from "lodash";

const TTSButton = ({ ttsOn, setTtsOn, ttsNextState, setTTSNextState }) => {

  // const ISSERVER = typeof window === "undefined";
  // if (!ISSERVER) {
  //   var ttsUse = sessionStorage.getItem("ttsUse");
  //   if(ttsUse === "unable"){
  //     var useTTS = false
  //   } else {
  //     useTTS = true
  //   }
  // }

  const getTTSDataPause = async () => {
    window.speechSynthesis.cancel();
    setTtsOn(false)
  };

  const continueTTS = async () => {
    setTtsOn(true)
  };

  const content = (
    <div>
      이 브라우저는 음성 합성을 지원하지 않습니다.
    </div>
  );
  return (
    <>
      {ttsOn === true &&(
        <>
          <Button
            size="small"
            onClick={getTTSDataPause}
            style={{
              fontSize: "1rem",
              borderRadius: "5px",
              marginRight: "5px",
            }}
            type="primary"
            icon={<PauseOutlined />}
          />
        </>
      )}
      {ttsOn === false  &&(
        <>
          <Button
            size="small"
            onClick={continueTTS}
            style={{
              fontSize: "1rem",
              borderRadius: "5px",
              marginRight: "5px",
            }}
            type="primary"
            icon={<SoundOutlined />}
          />
        </>
      )}

      {/* {ttsOn === false && useTTS === false &&(
        <>
        <Popover trigger="click" content={content} >
          <Button
            size="small"
            style={{
              fontSize: "1rem",
              borderRadius: "5px",
              marginRight: "5px",
            }}
            type="primary"
            icon={<SoundOutlined />}
            disabled
          />
          </Popover>
        </>
      )} */}
    </>
  );
};

export default TTSButton;
