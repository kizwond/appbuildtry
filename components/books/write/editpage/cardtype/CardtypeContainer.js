/* eslint-disable react/display-name */
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Row, Col, Menu, Card, PageHeader } from "antd";
import styled from "styled-components";
import CardSetting from '../cardtype/CardTypeSetting'
const CardTypeContainer = () => {
  const { query } = useRouter();

  const [selectedMenu, setSelectedMenu] = useState("card_setting");

  const content = (menu_item) => {
    switch (menu_item) {
      case "card_setting":
        return <CardSetting/>;
        break;
      case "face_setting":
        return <div>면설정</div>;
        break;
      case "row_setting":
        return <div>행설정</div>;
        break;
      case "font_setting":
        return <div>폰트설정</div>;
        break;
      default:
        break;
    }
  };
  const title = (menu_item) => {
    switch (menu_item) {
      case "card_setting":
        return "카드설정";
        break;
      case "face_setting":
        return "면설정";
        break;
      case "row_setting":
        return "행설정";
        break;
      case "font_setting":
        return "폰트설정";
        break;
      default:
        break;
    }
  };

  return (
    <>
      <div>
        <Menu mode="inline" className="aside-container" onClick={(e) => setSelectedMenu(e.key)}>
          {/* <Menu.Divider /> */}
          <Menu.Item key="card_setting">카드설정</Menu.Item>
          <Menu.Item key="face_setting">면설정</Menu.Item>
          <Menu.Item key="row_setting">행설정</Menu.Item>
          <Menu.Item key="font_setting">폰트설정</Menu.Item>
        </Menu>
      </div>
      <div>
        <Card title={title(selectedMenu)}>{content(selectedMenu)}</Card>
      </div>
    </>
  );
};
export default CardTypeContainer;
