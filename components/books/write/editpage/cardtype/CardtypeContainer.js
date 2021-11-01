/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import CardDetailSetting from "./CardDetailSetting";
import CardFaceSetting from "./CardFaceSetting";
import CardRowSetting from "./CardRowSetting";
import CardFontSetting from "./CardFontSetting";
import { Form, Input, Button, Tabs, Select, Cascader, DatePicker, Space, TreeSelect, Switch } from "antd";
const { TabPane } = Tabs;

const CardTypeContainer = ({ cardTypeId, cardTypeSetId, cardTypeDetail, getUpdatedCardTypeList }) => {
  const [selectedMenu, setSelectedMenu] = useState("face_setting");
  const [cardType, setCardType] = useState();

  // const content = (menu_item) => {
  //   switch (menu_item) {
  //     case "face_setting":
  //       return <CardFaceSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />;
  //       break;
  //     case "row_setting":
  //       return <CardRowSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />;
  //       break;
  //     case "font_setting":
  //       return <CardFontSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />;
  //       break;
  //     default:
  //       break;
  //   }
  // };
  useEffect(() => {
    if (cardTypeDetail) {
      setCardType(cardTypeDetail[0]);
      console.log("CardTypeContainer", cardTypeId);
      console.log("CardTypeContainer", cardTypeSetId);
      console.log("cardTypeDetail", cardTypeDetail);
    }
  }, [cardTypeId, cardTypeSetId, cardTypeDetail]);

  const onClickMenu = (value) => {
    setSelectedMenu(value);

    console.log(cardType);
  };
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

        {/* <Space direction="horizontal">
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={() => onClickMenu("face_setting")}>
            면설정
          </Button>
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={() => onClickMenu("row_setting")}>
            행설정
          </Button>
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={() => onClickMenu("font_setting")}>
            폰트설정
          </Button>
        </Space> */}
      </div>
      {/* <div>{content(selectedMenu)}</div> */}
    </>
  );
};
export default CardTypeContainer;
