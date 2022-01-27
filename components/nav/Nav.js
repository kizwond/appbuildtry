import Link from "next/link";
import {
  ShoppingCartOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";
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
  console.log(isLogged);
  const [logout] = useMutation(LOGOUT);

  const onClickLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    console.log("here");
    window.location.href = "/";
  };

  return (
    <>
      <div style={{ padding: "10px", background: backgroundColor }}>
        <div
          style={{
            width: "1024px",
            display: "flex",
            margin: "auto",
            alignItems: "center",
          }}
        >
          <Link href="/">
            <a
              style={{
                marginRight: "30px",
                marginLeft: "8px",
                fontFamily: `Architects Daughter, cursive`,
                fontWeight: 900,
                color: fontColor,
              }}
            >
              {/* <Image src={profilePic} width="100px" height="50px" alt="logo" /> */}
              CogBook
            </a>
          </Link>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <Link href="/mybooks">
                <a style={linkStyle}>마이북</a>
              </Link>
              <Link href="/mentoring">
                <a style={linkStyle}>멘토링</a>
              </Link>
              <Link href="/bookstore">
                <a style={linkStyle}>서점</a>
              </Link>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              {isLogged && (
                <>
                  <Button
                    size="small"
                    shape="round"
                    style={{ fontSize: "0.75rem" }}
                    onClick={() => onClickLogout()}
                  >
                    로그아웃
                  </Button>
                </>
              )}
              {!isLogged && (
                <>
                  <Link href="/account/login">
                    <a style={linkStyle}>
                      <UserOutlined style={{ marginRight: 10 }} />
                      로그인
                    </a>
                  </Link>
                  <Link href="/account/register">
                    <a style={linkStyle}>회원가입</a>
                  </Link>
                </>
              )}

              <Link href="/cart">
                <a style={linkStyle}>
                  <ShoppingCartOutlined />
                </a>
              </Link>
              <Link href="/notification">
                <a style={linkStyle}>
                  <BellOutlined />
                </a>
              </Link>
              <Link href="/account">
                <a style={linkStyle}>
                  <UserOutlined />
                </a>
              </Link>
            </div>
          </div>
        </div>
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
