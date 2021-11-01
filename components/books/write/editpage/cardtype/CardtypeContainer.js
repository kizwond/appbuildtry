/* eslint-disable react/display-name */
import React, { useState, useEffect } from "react";
import CardDetailSetting from "./CardDetailSetting";
import CardFaceSetting from "./CardFaceSetting";
import CardRowSetting from "./CardRowSetting";
import CardFontSetting from "./CardFontSetting";
import { Form, Input, Button, Radio, Select, Cascader, DatePicker, Space, TreeSelect, Switch } from "antd";

const CardTypeContainer = ({ cardTypeId, cardTypeSetId, cardTypeDetail, getUpdatedCardTypeList }) => {
  const [selectedMenu, setSelectedMenu] = useState("face_setting");
  const [cardType, setCardType] = useState();

  const content = (menu_item) => {
    switch (menu_item) {
      case "card_setting":
        return <CardDetailSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />;
        break;
      case "face_setting":
        return <CardFaceSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />;
        break;
      case "row_setting":
        return <CardRowSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />;
        break;
      case "font_setting":
        return <CardFontSetting cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />;
        break;
      default:
        break;
    }
  };
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
      <div>
        {/* <button onClick={() => onClickMenu("card_setting")}>카드설정</button> */}
        <Space direction="horizontal">
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={() => onClickMenu("face_setting")}>
            면설정
          </Button>
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={() => onClickMenu("row_setting")}>
            행설정
          </Button>
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={() => onClickMenu("font_setting")}>
            폰트설정
          </Button>
        </Space>
      </div>
      <div>{content(selectedMenu)}</div>
    </>
  );
};
export default CardTypeContainer;
