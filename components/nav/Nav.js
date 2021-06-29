import Link from "next/link";
import Image from "next/image";
import profilePic from "../../public/image/logo2.png";
import { ShoppingCartOutlined, BellOutlined, UserOutlined, MenuOutlined, ReadOutlined, FormOutlined, TeamOutlined, ShopOutlined, FileTextOutlined } from "@ant-design/icons";
import { Input, Avatar } from "antd";
import React, { useState } from "react";
import { Drawer } from "antd";

import useWindowSize from "../../utils/useWindowSize";

const Nav = () => {
  const { width } = useWindowSize();
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
    {width > 500 && (<div>500이상</div>)}
      <div style={{ position: "relative", width: "100%", paddingRight: 10, paddingLeft: 10, height: 40 }}>
        <div style={{ display: "inline-block", position: "absolute", top: "50%", transform: "translate(0,-50%)" }}>
          <MenuOutlined style={{ fontSize: "25px" }} onClick={showDrawer} />
          <Drawer
            title={
              <>
                <Avatar icon={<UserOutlined />} /> <span>user name</span>
                <div>useremail@gmail.com</div>
              </>
            }
            placement="left"
            closable={true}
            onClose={onClose}
            visible={visible}
          >
            <div style={{ width: "100%", height: 50, display: "flex", margin: "auto" }}>
              <div style={{ display: "flex", width: "100%", justifyContent: "space-between", flexDirection: "column" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link href="/study">
                    <a style={linkStyle}>
                      <ReadOutlined style={{ marginRight: 10 }} />
                      학습
                    </a>
                  </Link>
                  <Link href="/write">
                    <a style={linkStyle}>
                      <FormOutlined style={{ marginRight: 10 }} />
                      만들기
                    </a>
                  </Link>
                  <Link href="/mentoring">
                    <a style={linkStyle}>
                      <TeamOutlined style={{ marginRight: 10 }} />
                      멘토링
                    </a>
                  </Link>
                  <Link href="/shop">
                    <a style={linkStyle}>
                      <ShopOutlined style={{ marginRight: 10 }} />
                      서점
                    </a>
                  </Link>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Link href="/login">
                    <a style={linkStyle}>
                      <UserOutlined style={{ marginRight: 10 }} />
                      로그인
                    </a>
                  </Link>
                  <Link href="/register">
                    <a style={linkStyle}>
                      <FileTextOutlined style={{ marginRight: 10 }} />
                      회원가입
                    </a>
                  </Link>
                  <Link href="/basket">
                    <a style={linkStyle}>
                      <ShoppingCartOutlined style={{ marginRight: 10 }} />
                      장바구니
                    </a>
                  </Link>
                  <Link href="/notification">
                    <a style={linkStyle}>
                      <BellOutlined style={{ marginRight: 10 }} />
                      알림
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </Drawer>
        </div>
        <Link href="/">
          <a style={{ position: "absolute", left: "50%", transform: "translate(-50%)" }}>
            <Image src={profilePic} width="80px" height="40px" alt="logo" />
          </a>
        </Link>
      </div>
    </>
  );
};

export default Nav;

const linkStyle = {
  color: "black",
  padding: 10,
  fontSize: "1rem",
};
