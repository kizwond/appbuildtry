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
  const goToHome = () => {
    window.location.href = "/m";
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
              onClick={showDrawer}
              style={{ backgroundColor: "#ffffff00", border: "none" }}
              icon={<MenuOutlined style={{ fontSize: burgerSize, color: fontColor }} />}
            ></Button>
            <Drawer
              title={
                <>
                  <div style={{ height: "100%", padding: "0" }}>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span style={{ fontSize: "1rem", color: "grey", marginLeft: "10px" }}>
                      <span style={{ color: "black" }}>{username}</span>
                      {username !== null ? "님!! 오셨쎄여?" : "로그인을 해주세요!!!"}
                    </span>
                  </div>
                </>
              }
              placement="right"
              closable={false}
              onClose={onClose}
              visible={visible}
              width={250}
              zIndex={20000}
              className="navDrawer"
              bodyStyle={{ backgroundColor: "#f0f0f0", padding: 10 }}
              headerStyle={{ backgroundColor: "#f0f0f0", borderBottom: "1px solid #e7e7e7" }}
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
                  <div style={{ ...linkStyleDrawer, paddingLeft: "0px", fontSize: "1rem", color: "grey" }}>HOME</div>
                  <div style={{ marginBottom: "10px", backgroundColor: "white", borderRadius: "5px", boxShadow: "1px 1px 2px 0px #c0c0c0" }}>
                    <div onClick={() => (location.href = "/m")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <Image src="/image/home_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                      <span style={{ marginLeft: "10px" }}>메인</span>
                    </div>
                  </div>
                  <div style={{ ...linkStyleDrawer, paddingLeft: "0px", fontSize: "1rem", color: "grey" }}>STUDY</div>
                  <div style={{ marginBottom: "10px", backgroundColor: "white", borderRadius: "5px", boxShadow: "1px 1px 2px 0px #c0c0c0" }}>
                    <div onClick={() => (location.href = "/m/mybooks")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <Image src="/image/book_shelf.png" width={"20px"} height={"20px"} alt="excel_export" />
                      <span style={{ marginLeft: "10px" }}>마이북</span>
                    </div>
                    <div onClick={() => (location.href = "/m/mentoring")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <Image src="/image/mentor_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                      <span style={{ marginLeft: "10px" }}>멘토링</span>
                    </div>
                  </div>
                  <div style={{ ...linkStyleDrawer, paddingLeft: "0px", fontSize: "1rem", color: "grey" }}>SHOP</div>
                  <div style={{ marginBottom: "10px", backgroundColor: "white", borderRadius: "5px", boxShadow: "1px 1px 2px 0px #c0c0c0" }}>
                    {/* <div onClick={() => (location.href = "/bookstore")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center" , cursor:"pointer"}}> */}
                    <div onClick={() => console.log("서점")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <Image src="/image/bookstore_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                      <span style={{ marginLeft: "10px" }}>서점</span>
                    </div>
                    <div
                      onClick={() => (location.href = "/m/challenges")}
                      style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}
                    >
                      <Image src="/image/ranking_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                      <span style={{ marginLeft: "10px" }}>도전출판</span>
                    </div>
                    {/* <div onClick={() => (location.href = "/cart")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center" , cursor:"pointer"}}>
                    <Image src="/image/basket_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                    <span style={{ marginLeft: "10px" }}>장바구니</span>
                  </div> */}
                  </div>
                  <div style={{ ...linkStyleDrawer, paddingLeft: "0px", fontSize: "1rem", color: "grey" }}>ACCOUNT</div>
                  <div style={{ marginBottom: "10px", backgroundColor: "white", borderRadius: "5px", boxShadow: "1px 1px 2px 0px #c0c0c0" }}>
                    {/* <div onClick={() => (location.href = "/notification")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center" , cursor:"pointer"}}> */}
                    <div onClick={() => console.log("알림")} style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}>
                      <Image src="/image/notification_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                      <span style={{ marginLeft: "10px" }}>알림</span>
                    </div>
                    {username == null && (
                      <>
                        <div
                          onClick={() => (location.href = "/m/account/login")}
                          style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}
                        >
                          <Image src="/image/login_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                          <span style={{ marginLeft: "10px" }}>로그인</span>
                        </div>
                        <div
                          onClick={() => (location.href = "/m/account/register")}
                          style={{ ...linkStyleDrawer, padding: "10px", display: "flex", alignItems: "center", cursor: "pointer" }}
                        >
                          <Image src="/image/register_icon.png" width={"20px"} height={"20px"} alt="excel_export" />
                          <span style={{ marginLeft: "10px" }}>회원가입</span>
                        </div>
                      </>
                    )}
                  </div>

                  {username !== null && (
                    <>
                      <div onClick={() => onClickLogout()} style={{ ...linkStyleDrawer, position: "fixed", bottom: 5, display: "flex", alignItems: "center", cursor: "pointer" }}>
                        <Image src="/image/logout_icon.png" width={"15px"} height={"15px"} alt="excel_export" />
                        <span style={{ marginLeft: "10px", fontSize: "1rem" }}>로그아웃</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Drawer>
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
