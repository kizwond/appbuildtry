import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button, Space, Divider } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { ReadOutlined } from "@ant-design/icons";
import HiddenSetting from "./HiddenSetting";
import UnderlineSetting from "./UnderlineSetting";
import HighlightSetting from "./HighlightSetting";
import { Tabs, Switch, Radio } from "antd";
const { TabPane } = Tabs;

const RightDrawer = ({ cardTypeSets, updateStudyToolApply, setBottomVisible,face1On, face2On, ttsOn }) => {

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var ttsUse = sessionStorage.getItem("ttsUse");
    console.log(ttsUse)
    if(ttsUse){
      if(ttsUse === "unable"){
        var ttsAble = false
      }
    } else {
      var ttsAble = true
    }
    // console.log(session_id);
  }


  const [visible, setVisible] = useState(false);

  const [ttsBool, setTtsBool] = useState(false);

  const [face1row1, setface1row1] = useState(true);
  const [face1row2, setface1row2] = useState(true);
  const [face1row3, setface1row3] = useState(true);
  const [face1row4, setface1row4] = useState(true);
  const [face1row5, setface1row5] = useState(true);

  const [face2row1, setface2row1] = useState(true);
  const [face2row2, setface2row2] = useState(true);
  const [face2row3, setface2row3] = useState(true);
  const [face2row4, setface2row4] = useState(true);
  const [face2row5, setface2row5] = useState(true);

  const showDrawer = () => {
    setVisible(true);
    setBottomVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  function onChangeDirection(checked) {
    console.log(`switch to ${checked}`);
  }
  function onChangeTTS(checked) {
    console.log(`switch to ${checked}`);
    if(checked === true){
      ttsOn(true)
    } else {
      ttsOn(false)
    }
    setTtsBool(checked)
  }
  function tempFunction(checked){
    console.log(`switch to ${checked}`);
  }
  function onChangeRowChange(checked) {
    console.log(`switch to ${checked}`);
  }
  function onChangeTextInputShow(checked) {
    console.log(`switch to ${checked}`);
  }

  function face1row1Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face1On("1", true)
    } else {
      face1On("1", false)
    }
    setface1row1(checked)
  }
  function face1row2Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face1On("2", true)
    } else {
      face1On("2", false)
    }
    setface1row2(checked)
  }
  function face1row3Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face1On("3", true)
    } else {
      face1On("3", false)
    }
    setface1row3(checked)
  }
  function face1row4Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face1On("4", true)
    } else {
      face1On("4", false)
    }
    setface1row4(checked)
  }
  function face1row5Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face1On("5", true)
    } else {
      face1On("5", false)
    }
    setface1row5(checked)
  }

  function face2row1Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face2On("1", true)
    } else {
      face2On("1", false)
    }
    setface2row1(checked)
  }
  function face2row2Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face2On("2", true)
    } else {
      face2On("2", false)
    }
    setface2row2(checked)
  }
  function face2row3Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face2On("3", true)
    } else {
      face2On("3", false)
    }
    setface2row3(checked)
  }
  function face2row4Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face2On("4", true)
    } else {
      face2On("4", false)
    }
    setface2row4(checked)
  }
  function face2row5Handler(checked){
    console.log(`switch to ${checked}`);
    if(checked === true){
      face2On("5", true)
    } else {
      face2On("5", false)
    }
    setface2row5(checked)
  }
  return (
    <>
      <div onClick={showDrawer} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ReadOutlined style={{ fontSize: "1.5rem" }} />
        학습설정
      </div>
      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>학습일반설정</span>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        mask={true}
        width={260}
        style={{ zIndex: 1031 }}
      >
        <Space style={{ padding: "0px 10px 0px 10px", fontSize: "1rem", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ width: "230px", fontSize: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>뒤집기방향</span>
            <Radio.Group size="small" onChange={onChangeDirection} defaultValue="front_back" >
              <Radio value="left_right" style={{ fontSize: "1rem" }}>
                좌우
              </Radio>
              <Radio value="top_bottom" style={{ fontSize: "1rem" }}>
                위아래
              </Radio>
              <Radio value="front_back" style={{ fontSize: "1rem" }}>
                앞뒤
              </Radio>
            </Radio.Group>
          </div>
          <div style={{ width: "230px", fontSize: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>TTS시작</span>
            {ttsAble === false && <Switch size="small" onChange={onChangeTTS} disabled/>}
            {ttsAble === true && <Switch size="small" onChange={onChangeTTS} />}
            
          </div>
          <div style={{ width: "230px", fontSize: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>앞뒷면1행바꾸기</span>
            <Switch size="small" onChange={onChangeRowChange} />
          </div>

          <div style={{  fontSize: "1rem", display: "flex", flexDirection: "column"}}>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span>화면표시</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}>표시</span>
                <span style={{ width: "30px" }}>TTS</span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px"}}>앞면</span>
              <span>1행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face1row1} onChange={face1row1Handler} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>2행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face1row2} onChange={face1row2Handler} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>3행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face1row3} onChange={face1row3Handler} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>4행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face1row4} onChange={face1row4Handler} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>5행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face1row5} onChange={face1row5Handler} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px"}}>뒷면</span>
              <span>1행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face2row1} onChange={face2row1Handler}  /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>2행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face2row2} onChange={face2row2Handler}  /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>3행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face2row3} onChange={face2row3Handler}  /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>4행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face2row4} onChange={face2row4Handler}  /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>5행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" checked={face2row5} onChange={face2row5Handler}  /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={tempFunction} /></span>
              </div>
            </div>
          </div>

          <div style={{ width: "230px", fontSize: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>주관식입력창</span>
            <Switch size="small" onChange={onChangeTextInputShow} />
          </div>
        </Space>
      </Drawer>
    </>
  );
};

export default RightDrawer;
