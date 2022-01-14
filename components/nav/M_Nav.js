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
} from "@ant-design/icons";
import { Input, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import { useMutation } from "@apollo/client";

import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../../graphql/query/account";

const backgroundColor = "#428545";
// const backgroundColor = "#565656";
const fontColor = "white";

const Nav = () => {
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
  const [visible, setVisible] = useState(false);
  const [logout] = useMutation(LOGOUT);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onClickLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    console.log("here");
    window.location.href = "/m";
  };
  const burgerSize = "1.3rem";
  return (
    <>
      <div
        style={{
          position: "relative",
          // background: backgroundColor,
          background: "rgb(68,102,209)",
          background:
            "linear-gradient(145deg, rgba(68,102,209,1) 0%, rgba(150,189,214,1) 94%, rgba(150,189,214,1) 100%)",
          width: "100%",
          height: 40,
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
          position: "fixed",
          top: "0",
          zIndex: 999,
        }}
      >
        <div style={{ flexBasis: "33%" }}>
          <Button onClick={showDrawer} style={{backgroundColor:"#ffffff00", border:"none"}} icon={<MenuOutlined
            style={{ fontSize: burgerSize, color: fontColor }}
          />}></Button>
          
          <Drawer
            title={
              <>
                <div style={{ height: "100%", padding: "0" }}>
                  <Avatar size="small" icon={<UserOutlined />} />{" "}
                  <span style={{ fontSize: "1rem" }}>
                    {username}
                    {username !== null
                      ? "님!! 오셨쎄여?"
                      : "로그인을 해주세요!!!"}
                  </span>
                </div>
              </>
            }
            placement="left"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={170}
            zIndex={20000}
          >
            <div
              style={{
                width: "100%",
                height: 50,
                display: "flex",
                margin: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  flexDirection: "column",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {username == null && (
                    <>
                      <Link href="/m/account/login">
                        <a style={linkStyleDrawer}>
                          <UserOutlined style={{ marginRight: 10 }} />
                          로그인
                        </a>
                      </Link>
                      <Link href="/m/account/register">
                        <a style={linkStyleDrawer}>
                          <FileTextOutlined style={{ marginRight: 10 }} />
                          회원가입
                        </a>
                      </Link>
                    </>
                  )}
                  <Link href="/m/mybooks">
                    <a style={linkStyleDrawer}>
                      <ReadOutlined style={{ marginRight: 10 }} />
                      마이북
                    </a>
                  </Link>

                  <Link href="/m/mentoring">
                    <a style={linkStyleDrawer}>
                      <TeamOutlined style={{ marginRight: 10 }} />
                      멘토링
                    </a>
                  </Link>
                  <Link href="/bookstore">
                    <a style={linkStyleDrawer}>
                      <ShopOutlined style={{ marginRight: 10 }} />
                      서점
                    </a>
                  </Link>
                  <Link href="/m/challenges">
                    <a style={linkStyleDrawer}>
                      <CrownOutlined style={{ marginRight: 10 }} />
                      도전출판
                    </a>
                  </Link>
                  <Link href="/cart">
                    <a style={linkStyleDrawer}>
                      <ShoppingCartOutlined style={{ marginRight: 10 }} />
                      장바구니
                    </a>
                  </Link>
                  <Link href="/notification">
                    <a style={linkStyleDrawer}>
                      <BellOutlined style={{ marginRight: 10 }} />
                      알림
                    </a>
                  </Link>
                </div>
                {username !== null && (
                  <>
                    <Button
                      size="medium"
                      shape="round"
                      style={{ width: "85%", fontSize: "1rem", margin: "auto" }}
                      onClick={() => onClickLogout()}
                    >
                      로그아웃
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Drawer>
        </div>
        <Link href="/m">
          <a
            style={{
              flexBasis: "33%",
              textAlign: "center",
              fontFamily: `Architects Daughter, cursive`,
              fontWeight: 400,
              color: fontColor,
              position: "relative",
            }}
          >
            <span
              style={{
                transform: "rotate(320deg)",
                transformOrigin: "left top",
                position: "absolute",
                left: 9,
                top: 3,
              }}
            >
              <sup style={{ fontSize: "11px" }}>I&#39;</sup>
              <sup style={{ fontSize: "7px" }}>m </sup>
            </span>
            <span style={{ fontSize: "16px", color: "white" }}>T</span>
            <span style={{ fontSize: "14px", color: "white" }}>h</span>
            <span style={{ fontSize: "14px", color: "white" }}>e</span>
            <span style={{ fontSize: "16px", color: "#ffe400" }}>B</span>
            <span style={{ fontSize: "13px", color: "white" }}>o</span>
            <span style={{ fontSize: "13px", color: "white" }}>o</span>
            <span style={{ fontSize: "14px", color: "white" }}>K</span>
          </a>
        </Link>
        <div
          style={{ flexBasis: "33%", textAlign: "right", fontSize: "1rem" }}
        ></div>
      </div>
    </>
  );
};

export default Nav;

const linkStyleDrawer = {
  color: "#5b5b5b",
  padding: 10,
  fontSize: "1rem",
};
