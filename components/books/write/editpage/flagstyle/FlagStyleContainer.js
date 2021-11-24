/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import { Form, Input, Button, Tabs, Select, Cascader, DatePicker, Space, TreeSelect, Switch } from "antd";
import FlagRowSetting from "./FlagRowSetting";
const { TabPane } = Tabs;

const FlagStyleContainer = ({cardTypeSets, cardTypeSetId }) => {
  const [cardType, setCardType] = useState();

  useEffect(() => {
    console.log("플래그 설정 텝들 화면 뿌려짐")
  }, []);

  return (
    <>
      <div style={{ padding: "0px 10px 0px 10px" }}>
        <Tabs className="card_setting_tab" defaultActiveKey="1" type="card" size="small">
          <TabPane tab={<><span style={{fontSize:"0.8rem"}}>행설정</span></>} key="1">
            <FlagRowSetting cardTypeSets={cardTypeSets} cardTypeSetId={cardTypeSetId}/>
          </TabPane>
          <TabPane tab={<><span style={{fontSize:"0.8rem"}}>플래그</span></>}  key="2">
          <div>플래그</div> </TabPane>
          <TabPane tab={<><span style={{fontSize:"0.8rem"}}>폰트설정</span></>}  key="3">
              <div>폰트설정</div>
            </TabPane>
        </Tabs>
      </div>

    </>
  );
};
export default FlagStyleContainer;
