import React, { useEffect, useState } from "react";
import { message, Popover, Space, Drawer } from "antd";
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
  DashOutlined,
  SoundOutlined,
  ToolOutlined,
  ReadOutlined,
} from "@ant-design/icons";

import StudyToolSetting from "../../../study/mode/StudyToolSetting";
import Item from "antd/lib/list/Item";

const FloatingMenu = ({
  highlightToggle,
  highlightToggleHandler,
  hiddenToggleHandler,
  underlineToggleHandler,
  cardTypeSets,
  hiddenToggle,
  underlineToggle,
  hide,
  underline,
  highlight,
  updateStudyToolApply,
  setHiddenToggle,
  setUnderlineToggle,
  setHighlightToggle,
}) => {
  const [visible, setVisible] = useState(false);
  const [bottomVisible, setBottomVisible] = useState(false);
  const handleVisibleChange = () => {
    setVisible(!visible);
  };

  const info = () => {
    var selectionText = sessionStorage.getItem("selectionText");
    console.log(selectionText);
    if (selectionText === null) {
      selectionText = "선택영역이 없습니다.";
    }
    message.success({
      content: selectionText,
      style: {
        marginTop: "20vh",
      },
    });
  };

  if (cardTypeSets.length > 0) {
    const hiddenSettings = cardTypeSets[0].studyTool.hidden;
    const highlightSettings = cardTypeSets[0].studyTool.highlight;
    const underlineSettings = cardTypeSets[0].studyTool.underline;

    var hiddenButtons = hiddenSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -51;
      } else if (index === 1) {
        marginValue = -97;
      } else if (index === 2) {
        marginValue = -143;
      } else if (index === 3) {
        marginValue = -189;
      } else if (index === 4) {
        marginValue = -235;
      }
      return (
        <>
          <div
            onClick={() => hide(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              left: "-11px",
              cursor: "pointer",
              width: "50px",
              height: "40px",
              borderRadius: "3px",
              backgroundColor: "white",
              textAlign: "center",
              boxShadow: "1px 1px 4px 0px #c7c7c7",
              padding: "10px 10px 10px 10px",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                width: "30px",
                height: "20px",
                borderRadius: "3px",
                backgroundColor: item.color,
                textAlign: "center",
              }}
            ></div>
          </div>
        </>
      );
    });

    var underlineButtons = underlineSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -51;
      } else if (index === 1) {
        marginValue = -97;
      } else if (index === 2) {
        marginValue = -143;
      } else if (index === 3) {
        marginValue = -189;
      } else if (index === 4) {
        marginValue = -235;
      }
      return (
        <>
          <div
            onClick={() => underline(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              left: "-7px",
              cursor: "pointer",
              width: "50px",
              height: "40px",
              borderRadius: "3px",
              backgroundColor: "white",
              textAlign: "center",
              boxShadow: "1px 1px 4px 0px #c7c7c7",
              padding: "15px 10px 5px 10px",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                width: "30px",
                height: "1px",
                borderBottom: `${item.attr1}px ${item.attr2} ${item.color}`,
                textAlign: "center",
                lineHeight: "20px",
              }}
            >
              {item.attr1}px
            </div>
          </div>
        </>
      );
    });

    var highlightButtons = highlightSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -51;
      } else if (index === 1) {
        marginValue = -97;
      } else if (index === 2) {
        marginValue = -143;
      } else if (index === 3) {
        marginValue = -189;
      } else if (index === 4) {
        marginValue = -235;
      }
      return (
        <>
          <div
            onClick={() => highlight(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              left: "-10px",
              cursor: "pointer",
              width: "50px",
              height: "40px",
              borderRadius: "3px",
              backgroundColor: "white",
              textAlign: "center",
              boxShadow: "1px 1px 4px 0px #c7c7c7",
              padding: "5px 10px 5px 10px",
              lineHeight: "45px",
            }}
          >
            <div
              style={{
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              {item.attr1 === "brush2" && (
                <>
                  <div className={item.attr1} style={{ height: "15px", fontSize: "0.8rem", display: "inline-block", backgroundColor: item.color }}>
                    brush{index + 1}
                  </div>
                </>
              )}
              {item.attr1 !== "brush2" && (
                <>
                  <div className={item.attr1} style={{ fontSize: "0.8rem", display: "inline-block", "--bubble-color": item.color, "--z-index": 0 }}>
                    brush{index + 1}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      );
    });
  }
  function hideAll() {
    setHiddenToggle(false);
    setUnderlineToggle(false);
    setHighlightToggle(false);
    setBottomVisible(!bottomVisible);
  }
  const onClose = () => {
    setBottomVisible(false);
  };
  return (
    <>
      <svg xmlns="//www.w3.org/2000/svg" version="1.1" className="svg-filters" style={{ display: "none" }}>
        <defs>
          <filter id="marker-shape">
            <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
          </filter>
        </defs>
      </svg>

      <div style={{ width: "100%", alignItems: "center", position: "fixed", bottom: 0, left: 0, zIndex: 3, fontSize: "0.8rem" }}>
        <div
          style={{
            margin: "auto",
            background: "white",
            borderBottom: "none",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 5,
            boxShadow: "0px -1px 3px -1px #d2d2d2",
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
            <div onClick={() => hiddenToggleHandler(info)} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <EyeInvisibleOutlined style={{ fontSize: "1.3rem" }} />
              가리기
              {hiddenToggle && <>{hiddenButtons}</>}
            </div>

            <div onClick={() => underlineToggleHandler(info)} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <UnderlineOutlined style={{ fontSize: "1.3rem" }} />
              밑줄긋기
              {underlineToggle && <>{underlineButtons}</>}
            </div>

            <div onClick={() => highlightToggleHandler(info)} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <HighlightOutlined style={{ fontSize: "1.3rem" }} />
              형광펜
              {highlightToggle && <>{highlightButtons}</>}
            </div>

            <div onClick={hideAll} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DashOutlined style={{ fontSize: "1.3rem" }} />
              더보기
            </div>

            <Drawer className="moreBottomDrawer" maskStyle={{marginTop:"40px"}} height="100px" placement="bottom" closable={false} onClose={onClose} visible={bottomVisible}>
              <Space
                size={16}
                style={{ padding:20, display: "flex", flexDirection: "flex-start", justifyContent: "flex-start", flexWrap: "wrap", fontSize: "0.8rem" }}
              >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <ReadOutlined style={{ fontSize: "1.3rem" }} />
                  학습설정
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <StudyToolSetting setBottomVisible={setBottomVisible} cardTypeSets={cardTypeSets} updateStudyToolApply={updateStudyToolApply} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <SoundOutlined style={{ fontSize: "1.3rem" }} />
                  TTS설정
                </div>
              </Space>
            </Drawer>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingMenu;
