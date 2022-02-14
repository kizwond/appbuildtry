/* eslint-disable react/display-name */
import React, { useState } from "react";
import { Tabs } from "antd";
import FlagRowSetting from "./FlagRowSetting";
import FlagFontSetting from "./FlagFontSetting";
import FlagShapeSetting from "./FlagShapeSetting";
const { TabPane } = Tabs;

const FlagStyleContainer = ({ cardTypeSets, cardTypeSetId }) => {
  const [tabValue, setTabValue] = useState("1");
  const onChange = (v) => {
    setTabValue(v);
  };

  return (
    <div style={{ padding: "0px 10px 0px 10px" }}>
      <Tabs
        className="card_setting_tab"
        defaultActiveKey="1"
        type="card"
        size="small"
        onChange={onChange}
      >
        <TabPane
          tab={<span style={{ fontSize: "0.8rem" }}>행설정</span>}
          key="1"
        >
          <FlagRowSetting
            rowStyle={cardTypeSets[0].makerFlag_style.row_style}
            cardTypeSetId={cardTypeSetId}
            tabValue={tabValue}
          />
        </TabPane>
        <TabPane
          tab={<span style={{ fontSize: "0.8rem" }}>플래그</span>}
          key="2"
        >
          <FlagShapeSetting
            figureStyle={cardTypeSets[0].makerFlag_style.figure_style}
            cardTypeSetId={cardTypeSetId}
            tabValue={tabValue}
          />{" "}
        </TabPane>
        <TabPane
          tab={<span style={{ fontSize: "0.8rem" }}>폰트설정</span>}
          key="3"
        >
          <FlagFontSetting
            fontStyle={cardTypeSets[0].makerFlag_style.comment_font}
            cardTypeSetId={cardTypeSetId}
            tabValue={tabValue}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default FlagStyleContainer;
