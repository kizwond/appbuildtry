import { SoundOutlined, PauseOutlined } from "@ant-design/icons";
import { useLazyQuery } from "@apollo/client";
import { Button } from "antd";
import React from "react";
import { useEffect } from "react";
import { useState,useCallback } from "react";
import { QUERY_MY_CARD_CONTENTS } from "../../graphql/query/allQuery";
import { detect, detectAll } from "tinyld";
import _ from "lodash";

const TTSButton = ({ ttsOn, setTtsOn, ttsNextState, setTTSNextState }) => {

  const getTTSDataPause = async () => {
    window.speechSynthesis.cancel();
    setTtsOn(false)
  };

  const continueTTS = async () => {
    setTtsOn(true)
  };

  return (
    <>
      {ttsOn === true && (
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
      {ttsOn === false && (
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
    </>
  );
};

export default TTSButton;
