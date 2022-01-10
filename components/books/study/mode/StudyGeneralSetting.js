import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button, Space, Divider } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { ReadOutlined } from "@ant-design/icons";
import HiddenSetting from "./HiddenSetting";
import UnderlineSetting from "./UnderlineSetting";
import HighlightSetting from "./HighlightSetting";
import { Tabs, Switch, Radio } from "antd";
const { TabPane } = Tabs;

const RightDrawer = ({ cardTypeSets, updateStudyToolApply, setBottomVisible }) => {
  const [visible, setVisible] = useState(false);

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
  }
  function onChangeRowChange(checked) {
    console.log(`switch to ${checked}`);
  }
  function onChangeTextInputShow(checked) {
    console.log(`switch to ${checked}`);
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
            <Radio.Group size="small" onChange={onChangeDirection} defaultValue="top_bottom" >
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
            <Switch size="small" onChange={onChangeTTS} />
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
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>2행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>3행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>4행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>앞면</span>
              <span>5행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px"}}>뒷면</span>
              <span>1행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>2행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>3행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>4행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
              </div>
            </div>
            <div style={{ width: "230px", display: "flex", justifyContent: "space-between" }}>
              <span style={{marginLeft:"50px", visibility:"hidden"}}>뒷면</span>
              <span>5행</span>
              <div style={{ width: "70px", display: "flex", justifyContent: "space-between" }}>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
                <span style={{ width: "30px" }}><Switch size="small" onChange={onChangeTTS} /></span>
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
