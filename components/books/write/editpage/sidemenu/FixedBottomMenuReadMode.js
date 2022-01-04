import React, { useEffect, useState } from "react";
import { message, Popover, Space } from "antd";
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
import 'animate.css';

import StudyToolSetting from "../../../study/mode/StudyToolSetting";

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
}) => {
  const [visible, setVisible] = useState(false);
  const handleVisibleChange = () => {
    setVisible(!visible);
  };

  const info = () => {
    var selectionText = sessionStorage.getItem("selectionText");
    console.log(selectionText)
    if(selectionText === null){
      selectionText = "선택영역이 없습니다."
    }
    message.success({
      content: selectionText,
      style: {
        marginTop: '20vh',
      },
    });
  };

  if (cardTypeSets.length > 0) {
    // var selectionText = sessionStorage.getItem("selectionText");
    // console.log("cardTypeSets", cardTypeSets);
    const hiddenSettings = cardTypeSets[0].studyTool.hidden;
    const highlightSettings = cardTypeSets[0].studyTool.highlight;
    const underlineSettings = cardTypeSets[0].studyTool.underline;
    // if (selectionText === "" || selectionText === null || selectionText === undefined) {
    //   selectionText = "선택영역이 없습니다.";
    // }
    // var selectionTextShow = (
    //   <>
    //     <div
    //       style={{
    //         position: "absolute",
    //         top: -55,
    //         left: `100px`,
    //         border: "1px solid lightgrey",
    //         width: "200px",
    //         textAlign: "center",
    //       }}
    //     >
    //       {selectionText}
    //     </div>
    //   </>
    // );
    var hiddenButtons = hiddenSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -37;
      } else if (index === 1) {
        marginValue = -69;
      } else if (index === 2) {
        marginValue = -101;
      } else if (index === 3) {
        marginValue = -133;
      } else if (index === 4) {
        marginValue = -165;
      }
      return (
        <>
          <div
            onClick={() => hide(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              left: "0px",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: item.color,
              lineHeight:"30px",
              textAlign:"center",
              boxShadow: "0px 0px 4px 0px #949494"
            }}
          ></div>
        </>
      );
    });

    var underlineButtons = underlineSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -37;
      } else if (index === 1) {
        marginValue = -69;
      } else if (index === 2) {
        marginValue = -101;
      } else if (index === 3) {
        marginValue = -133;
      } else if (index === 4) {
        marginValue = -165;
      }
      return (
        <>
          <div
            onClick={() => underline(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              left: "3px",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: item.color,
              lineHeight:"30px",
              textAlign:"center",
              boxShadow: "0px 0px 4px 0px #949494"
            }}
          >
            {item.attr1}px
          </div>
        </>
      );
    });

    var highlightButtons = highlightSettings.map((item, index) => {
      if (index === 0) {
        var marginValue = -37;
      } else if (index === 1) {
        marginValue = -69;
      } else if (index === 2) {
        marginValue = -101;
      } else if (index === 3) {
        marginValue = -133;
      } else if (index === 4) {
        marginValue = -165;
      }
      return (
        <>
          <div
            onClick={() => highlight(index)}
            style={{
              position: "absolute",
              top: `${marginValue}px`,
              left: "0px",
              cursor: "pointer",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: item.color,
              lineHeight:"30px",
              textAlign:"center",
              boxShadow: "0px 0px 4px 0px #949494"
            }}
          >
            {index + 1}
          </div>
        </>
      );
    });
  }
  return (
    <div style={{ width: "100%", alignItems: "center", position: "fixed", bottom: 0, left: 0, zIndex: 3, fontSize: "0.8rem" }}>
      {/* <div style={{ position: "relative" }}>
        {hiddenToggle && <>{selectionTextShow}</>}
        {underlineToggle && <>{selectionTextShow}</>}
        {highlightToggle && <>{selectionTextShow}</>}
      </div> */}

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
          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <EyeInvisibleOutlined onClick={()=>hiddenToggleHandler(info)} style={{ fontSize: "1.3rem" }} />
            가리기
            {hiddenToggle && <>{hiddenButtons}</>}
          </div>

          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UnderlineOutlined onClick={()=>underlineToggleHandler(info)} style={{ fontSize: "1.3rem" }} />
            밑줄긋기
            {underlineToggle && <>{underlineButtons}</>}
          </div>

          <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <HighlightOutlined onClick={()=>highlightToggleHandler(info)} style={{ fontSize: "1.3rem" }} />
            형광펜
            {highlightToggle && <>{highlightButtons}</>}
            
          </div>

          <Popover
            placement="topRight"
            content={
              <>
                <Space
                  onClick={handleVisibleChange}
                  size={16}
                  style={{ width: "268px", display: "flex", flexDirection: "flex-start", justifyContent: "flex-start", flexWrap: "wrap", fontSize: "0.8rem" }}
                >
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <ReadOutlined style={{ fontSize: "1.3rem" }} />
                    학습설정
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <StudyToolSetting cardTypeSets={cardTypeSets} updateStudyToolApply={updateStudyToolApply} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <SoundOutlined style={{ fontSize: "1.3rem" }} />
                    TTS설정
                  </div>
                </Space>
              </>
            }
            trigger="click"
            visible={visible}
            onVisibleChange={handleVisibleChange}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <DashOutlined style={{ fontSize: "1.3rem" }} />
              더보기
            </div>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default FloatingMenu;
