import React, { Component, useState, useEffect, useCallback, useRef } from "react";
import { useMutation, useLazyQuery } from "@apollo/client";
import { GetContents } from "../../../../../graphql/query/getContents";
import { GetLevelConfig, UpdateResults } from "../../../../../graphql/query/session";
import Timer from "./Timer";
import { Avatar, Menu, Dropdown, Modal, Popover, Select, Button } from "antd";
import { UserOutlined, DownOutlined, FlagFilled, SettingOutlined, LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";
import ProgressBar from "./ProgressBar";
import { GetCardTypeSetByMybookIds } from "../../../../../graphql/query/cardtype";

class FlipContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      start: 0,
      time_total: 0,
      isOn_total: false,
      start_total: 0,
      average_completed: 0,
      clickCount: 0,
      flag: "white",
      pageStatus: "normal",
      cardlist_studying: [],
      contents: [],
      backContents: [],
      contentsList: [],
      getKnowTime: "",
      confirmOn: "ask",
    };
    this.keyCount = 0;
    this.getKey = this.getKey.bind(this);
  }
  getKey() {
    return this.keyCount++;
  }

  render() {
    return (
      <>
        <div style={{display:"flex", flexDirection:"column"}}>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
              <div style={{width:"100%", display: "flex", alignItems: "center" }}>
                <div style={{ width:"50px", fontSize: "1rem", marginRight:"5px" }}>완료율</div>
                <ProgressBar bgcolor={"#32c41e"} completed={100} />
              </div>
              <div style={{fontSize:"1rem"}}>click count 자리</div>
            </div>
          <div style={style_study_layout_bottom}>
            <div style={{ width: "100%", border: "1px solid lightgrey"}}>
              <div style={contentsDisplay}>
                <div style={{ position: "relative", height: "50%", width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>1면자리</div>
                </div>
                <div style={{ position: "relative", height: "50%", width: "100%", border: "1px dashed lightgrey", borderRadius: "5px" }}>
                  <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>2면자리</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default FlipContainer;


const style_study_layout_bottom = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  margin: "auto",
  marginTop: "10px",
};
const contentsDisplay = {
  height: "300px",
  backgroundColor: "white",
  padding: "10px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
};

