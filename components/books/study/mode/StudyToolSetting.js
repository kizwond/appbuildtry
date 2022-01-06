import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button, Space, Divider } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { ToolOutlined } from "@ant-design/icons";
import HiddenSetting from "./HiddenSetting";
import UnderlineSetting from "./UnderlineSetting";
import HighlightSetting from "./HighlightSetting";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const RightDrawer = ({ cardTypeSets, updateStudyToolApply, setBottomVisible }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
    setBottomVisible(false)
  };

  const onClose = () => {
    setVisible(false);
  };
  
  return (
    <>
      <div onClick={showDrawer} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ToolOutlined style={{ fontSize: "1.3rem" }} />
        도구설정
      </div>
      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>학습도구설정</span>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        mask={true}
        width={250}
        style={{ zIndex: 1031 }}
      >
        <div style={{ padding: "0px 10px 0px 10px" }}>
          <Tabs className="card_setting_tab" defaultActiveKey="1" type="card" size="small">
            <TabPane
              tab={
                <>
                  <span style={{ fontSize: "0.8rem" }}>가리기</span>
                </>
              }
              key="1"
              style={{paddingTop:10}}
            >
              <HiddenSetting cardTypeSets={cardTypeSets} updateStudyToolApply={updateStudyToolApply}/>
            </TabPane>
            <TabPane
              tab={
                <>
                  <span style={{ fontSize: "0.8rem" }}>밑줄</span>
                </>
              }
              key="2"
              style={{paddingTop:10}}
            >
              <UnderlineSetting cardTypeSets={cardTypeSets} updateStudyToolApply={updateStudyToolApply}/>
            </TabPane>
            <TabPane
              tab={
                <>
                  <span style={{ fontSize: "0.8rem" }}>형광펜</span>
                </>
              }
              key="3"
              style={{paddingTop:10}}
            >
              <HighlightSetting cardTypeSets={cardTypeSets} updateStudyToolApply={updateStudyToolApply}/>
            </TabPane>
          </Tabs>
        </div>
      </Drawer>
    </>
  );
};

export default RightDrawer;
