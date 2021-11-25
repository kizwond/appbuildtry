/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import CardDetailSetting from "./CardDetailSetting";
import CardFaceSetting from "./CardFaceSetting";
import CardRowSetting from "./CardRowSetting";
import CardFontSetting from "./CardFontSetting";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const CardTypeContainer = ({ cardTypeId, cardTypeSetId, cardTypeDetail, getUpdatedCardTypeList }) => {
  return (
    <>
      <div style={{ padding: "0px 10px 0px 10px" }}>
        <Tabs className="card_setting_tab" defaultActiveKey="1" type="card" size="small">
          <TabPane tab={<><span style={{fontSize:"0.8rem"}}>면설정</span></>} key="1">
            <CardFaceSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />
          </TabPane>
          <TabPane tab={<><span style={{fontSize:"0.8rem"}}>행설정</span></>}  key="2">
            <CardRowSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />
          </TabPane>
          <TabPane tab={<><span style={{fontSize:"0.8rem"}}>폰트설정</span></>}  key="3">
            <CardFontSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};
export default CardTypeContainer;
