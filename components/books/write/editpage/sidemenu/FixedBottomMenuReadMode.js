import React, { useEffect, useState } from "react";
import { Button, Popover, Space } from "antd";
import M_LeftDrawerDirectRead from "../M_LeftDrawerDirectRead";
import {
  ProfileOutlined,
  FlagFilled,
  HeartFilled,
  StarFilled,
  CheckCircleFilled,
  PlusOutlined,
  MenuFoldOutlined,
  HighlightOutlined,
  MessageOutlined,
  UnderlineOutlined,
  TagOutlined,
  PicRightOutlined,
  QuestionCircleOutlined,
  EyeInvisibleOutlined,
  FlagOutlined,
  SettingOutlined,
  CloseOutlined,
} from "@ant-design/icons";
const FloatingMenu = ({ hiddenToggleHandler, underlineToggleHandler, cardTypeSets, hiddenToggle, underlineToggle }) => {
  if (cardTypeSets.length > 0) {
    console.log("cardTypeSets", cardTypeSets);
    const hiddenSettings = cardTypeSets[0].studyTool.hidden;
    const highlightSettings = cardTypeSets[0].studyTool.highlight;
    const underlineSettings = cardTypeSets[0].studyTool.underline;
    var hiddenButtons = hiddenSettings.map((item, index) => {
      if(index === 0){
        var marginValue = 0
      } else if(index === 1){
        marginValue = 30
      } else {
        marginValue = 60
      }
      return (
        <>
          <div
            // onClick={() => hide(item.color)}
            style={{
              position:"absolute",
              top:-35,
              left:`${marginValue}px`,
              border: "1px solid lightgrey",
              cursor: "pointer",
              width: "24px",
              height: "24px",
              backgroundColor: item.color,
            }}
          ></div>
        </>
      );
    });

    var underlineButtons = underlineSettings.map((item, index) => {
      if(index === 0){
        var marginValue = 0
      } else if(index === 1){
        marginValue = 30
      } else {
        marginValue = 60
      }
      return (
        <>
          <div
            onClick={() => underline(item.color, item.toolType)}
            style={{
              position:"absolute",
              top:-35,
              left:`${marginValue}px`,
              border: "1px solid lightgrey",
              cursor: "pointer",
              width: "24px",
              height: "24px",
              backgroundColor: item.color,
            }}
          >
            {item.toolType}px
          </div>
        </>
      );
    });

  }
  return (
    <div style={{  width: "100%", alignItems: "center", position: "fixed", bottom: 0, left: 0, zIndex: 3, fontSize: "0.8rem" }}>
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
          <div style={{ position:"relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <EyeInvisibleOutlined onClick={hiddenToggleHandler}  style={{ fontSize: "1.3rem" }} />
            가리기
            {hiddenToggle && <>{hiddenButtons}</>}
          </div>
          
          <div style={{ position:"relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UnderlineOutlined onClick={underlineToggleHandler}  style={{ fontSize: "1.3rem" }} />
            밑줄긋기
            {underlineToggle && <>{underlineButtons}</>}
          </div>
         
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <HighlightOutlined  style={{ fontSize: "1.3rem" }} />
            형광펜
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
