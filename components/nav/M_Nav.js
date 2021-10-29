import Link from "next/link";
import Image from "next/image";
import profilePic from "../../public/image/logo2.png";
import { ShoppingCartOutlined, BellOutlined, UserOutlined, MenuOutlined, ReadOutlined, FormOutlined, TeamOutlined, ShopOutlined, FileTextOutlined } from "@ant-design/icons";
import { Input, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { Drawer, Button } from "antd";
import { useMutation } from "@apollo/client";

import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../../graphql/query/account";

const backgroundColor = "black";
const fontColor = "white";

const Nav = () => {
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
    console.log("here");
    window.location.href = "/";
  };
  const burgerSize = "1rem";
  return (
    <>
      <div
        style={{
          position: "relative",
          background: backgroundColor,
          width: "100%",
          height: 40,
          padding: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
          position: "fixed",
          top: "0",
          zIndex: 3,
        }}
      >
        <div style={{ flexBasis: "33%" }}>
          <MenuOutlined style={{ fontSize: burgerSize, color: fontColor }} onClick={showDrawer} />
          <Drawer
            title={
              <>
                <div style={{ height: "100%", padding: "0" }}>
                  <Avatar size="small" icon={<UserOutlined />} /> <span style={{ fontSize: "0.8rem" }}>user name</span>
                </div>
              </>
            }
            placement="left"
            closable={false}
            onClose={onClose}
            visible={visible}
            width={170}
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
                  {!isLogged && (
                    <>
                      <Link href="/account/login">
                        <a style={linkStyleDrawer}>
                          <UserOutlined style={{ marginRight: 5, color: "black" }} />
                          로그인
                        </a>
                      </Link>
                      <Link href="/account/register">
                        <a style={linkStyleDrawer}>
                          <FileTextOutlined style={{ marginRight: 5, color: "black" }} />
                          회원가입
                        </a>
                      </Link>
                    </>
                  )}
                  <Link href="/books/studypage">
                    <a style={linkStyleDrawer}>
                      <ReadOutlined style={{ marginRight: 10 }} />
                      학습
                    </a>
                  </Link>
                  <Link href="/books/writepage">
                    <a style={linkStyleDrawer}>
                      <FormOutlined style={{ marginRight: 10 }} />
                      만들기
                    </a>
                  </Link>
                  <Link href="/mentoring">
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
                {isLogged && (
                  <>
                    <Button size="large" shape="round" style={{ fontSize: "0.8rem" }} onClick={() => onClickLogout()}>
                      로그아웃
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Drawer>
        </div>
        <Link href="/">
          <a
            style={{
              // position: "absolute",
              // left: "50%",
              // transform: "translate(-50%)",
              flexBasis: "33%",
              textAlign: "center",
              fontFamily: `Architects Daughter, cursive`,
              fontWeight: 900,
              color: fontColor,
              // textShadow: "rgb(189 189 189 / 73%) 3px 2px 5px",
            }}
          >
            {/* <Image src={profilePic} width="80px" height="40px" alt="logo" /> */}
            CogBook
          </a>
        </Link>
        <div style={{ flexBasis: "33%", textAlign: "right", fontSize: "0.8rem" }}></div>
      </div>
    </>
  );
};

export default Nav;

const linkStyle = {
  color: fontColor,
  paddingLeft: 10,
  paddingRight: 10,
  fontSize: "0.8rem",
};

const linkStyleDrawer = {
  color: "black",
  padding: 10,
  fontSize: "0.8rem",
};
