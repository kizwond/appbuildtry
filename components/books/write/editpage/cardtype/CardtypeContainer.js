/* eslint-disable react/display-name */
import React, { useState, useEffect, useCallback } from "react";
import CardDetailSetting from "./CardDetailSetting";
import CardFaceSetting from "./CardFaceSetting";
import CardRowSetting from "./CardRowSetting";
import CardFontSetting from "./CardFontSetting";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const CardTypeContainer = ({
  cardTypeId,
  cardTypeSetId,
  cardTypeDetail,
  getUpdatedCardTypeList,
}) => {
  const [tabValue, setTabValue] = useState("1");

  const changeTabValue = useCallback((_tab) => {
    setTabValue(_tab);
  }, []);

  return (
    <>
      <div style={{ padding: "0px 10px 0px 10px" }}>
        <Tabs
          className="card_setting_tab"
          activeKey={tabValue}
          onChange={changeTabValue}
          type="card"
          size="small"
        >
          <TabPane
            tab={<span style={{ fontSize: "0.8rem" }}>면설정</span>}
            key="1"
          >
            <CardFaceSetting
              cardTypeId={cardTypeId}
              cardTypeSetId={cardTypeSetId}
              cardTypeDetail={cardTypeDetail}
              getUpdatedCardTypeList={getUpdatedCardTypeList}
              tabValue={tabValue}
            />
          </TabPane>
          <TabPane
            tab={<span style={{ fontSize: "0.8rem" }}>행설정</span>}
            key="2"
          >
            <CardRowSetting
              cardTypeId={cardTypeId}
              cardTypeSetId={cardTypeSetId}
              cardTypeDetail={cardTypeDetail}
              getUpdatedCardTypeList={getUpdatedCardTypeList}
              tabValue={tabValue}
            />
          </TabPane>
          <TabPane
            tab={<span style={{ fontSize: "0.8rem" }}>폰트설정</span>}
            key="3"
          >
            <CardFontSetting
              cardTypeId={cardTypeId}
              cardTypeSetId={cardTypeSetId}
              cardTypeDetail={cardTypeDetail}
              getUpdatedCardTypeList={getUpdatedCardTypeList}
              tabValue={tabValue}
            />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};
export default CardTypeContainer;
