import React, { useEffect, useState } from "react";
import { Button, Popover, Space } from "antd";
import M_LeftDrawerDirectRead from "../M_LeftDrawerDirectRead";
import { HighlightOutlined, SettingOutlined, SoundOutlined } from "@ant-design/icons";

const FloatingMenu = () => {
  return (
    <div style={{ width: "100%", alignItems: "center", position: "fixed", bottom: 0, left: 0, zIndex: 3, fontSize: "0.8rem" }}>
      <div
        style={{
          margin: "auto",
          background: "white",
          // borderRadius: "5px 5px 0 0",
          borderBottom: "none",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 5,
          boxShadow: "0px -1px 6px -1px #999999",
          alignItems: "center",
          color: "#5b5b5b",
        }}
      >
        <div
          style={{
            margin: 0,
            width: "100%",
            display: "flex",
            flexDirection: "row",
            listStyle: "none",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <SoundOutlined style={{ fontSize: "1.3rem" }} />
            TTS
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <HighlightOutlined style={{ fontSize: "1.3rem" }} />
            도구
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <SettingOutlined style={{ fontSize: "1.3rem" }} />
            학습설정
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingMenu;
