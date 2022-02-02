import Link from "next/link";
import {
  ShoppingCartOutlined,
  BellOutlined,
  UserOutlined,
  MenuOutlined,
  ReadOutlined,
  FormOutlined,
  TeamOutlined,
  ShopOutlined,
  FileTextOutlined,
  CrownOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Divider, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import { useMutation } from "@apollo/client";

import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../../graphql/query/account";
import Image from "next/image";
import M_LeftDrawerDirectRead from "../../components/books/write/editpage/M_LeftDrawerDirectRead";

const backgroundColor = "#4466d1";
const fontColor = "white";
const burgerSize = "1.3rem";

const StudyNav = ({ mode,indexChanged, index_changed, indexSets }) => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var usernameTemp = localStorage.getItem("username");
    if (usernameTemp) {
      var username = usernameTemp;
    } else {
      var username = null;
    }
  } else {
    var username = "로그인을 해주세요";
  }

  const isLogged = useSelector((state) => state.isLogged);
  const [logout] = useMutation(LOGOUT);

  const onClickLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    console.log("here");
    window.location.href = "/m";
  };
  const goToResult = () => {
    window.location.href = "/m/study/readresult";
  };
  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          position: "fixed",
          top: "0",
          zIndex: 999,
        }}
      >
        <div
          style={{
            margin: "auto",
            width: "100%",
            maxWidth: "1024px",
            background: "rgb(68,102,209)",
            background: "linear-gradient(145deg, rgba(68,102,209,1) 0%, rgba(150,189,214,1) 94%, rgba(150,189,214,1) 100%)",
            height: 40,
            padding: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
          }}
        >
          <div style={{ flexBasis: "33%", textAlign: "left", fontSize: "1rem", cursor: "pointer" }}>
            {/* <Button style={{ backgroundColor: "#ffffff00", border: "none" }} onClick={goToHome} icon={<HomeOutlined style={{ fontSize: burgerSize, color: fontColor }} />}></Button> */}
            <M_LeftDrawerDirectRead index_changed={index_changed} indexSets={indexSets}/>
          </div>
          <div
            style={{
              flexBasis: "33%",
              textAlign: "center",
              // fontFamily: `Architects Daughter, cursive`,
              fontWeight: 400,
              color: fontColor,
              position: "relative",
            }}
          >
            {mode} 모드
          </div>

          <div style={{ flexBasis: "33%", textAlign:"right" }}>
            <Button
            size="small"
              onClick={goToResult}
              style={{fontSize:"1rem", borderRadius:"5px" }}
              type="primary"
            >학습종료</Button>
            
          </div>
        </div>
      </div>
    </>
  );
};

export default StudyNav;

const linkStyleDrawer = {
  width: "150px",
  color: "#5b5b5b",
  padding: 5,
  fontSize: "1rem",
};
