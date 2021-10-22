import Link from "next/link";
import Image from "next/image";
import profilePic from "../../public/image/logo2.png";
import { ShoppingCartOutlined, BellOutlined, UserOutlined, MenuOutlined, ReadOutlined, FormOutlined, TeamOutlined, ShopOutlined, FileTextOutlined } from "@ant-design/icons";
import { Input, Avatar } from "antd";
import React, { useEffect, useState } from "react";
import { Drawer, Button } from "antd";

// import useWindowSize from "../../utils/useWindowSize";
import { useWindowSize } from "react-use";
import { useMutation } from "@apollo/client";

import { useSelector, useDispatch } from "react-redux";
import { LOGOUT } from "../../graphql/query/account";

const backgroundColor = "black";
const buttonColor = "white";
const fontColor = "white";

const Nav = () => {
  const isLogged = useSelector((state) => state.isLogged);
  const { width } = useWindowSize();
  const [windowWith, setWindowWith] = useState(0);
  const [visible, setVisible] = useState(false);
  console.log(isLogged);
  // const [logout, { loading, error, data }] = useLazyQuery(LOGOUT);
  const [logout] = useMutation(LOGOUT);

  useEffect(() => {
    setWindowWith(width);
  }, [width]);
  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };
  if (windowWith < 769 && windowWith > 426) {
    var tablet = true;
  } else {
    tablet = false;
  }

  if (windowWith < 1025 && windowWith > 768) {
    var laptop = true;
  } else {
    laptop = false;
  }

  if (windowWith > 1024) {
    var desktop = true;
  } else {
    desktop = false;
  }
  var setCookie = function (name) {
    document.cookie = name + "=; expires=Thu, 01 Jan 1999 00:00:10 GMT;";
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
      {windowWith < 426 && (
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
            <div
              style={{
                // display: "inline-block",
                // position: "absolute",
                // top: "50%",
                // transform: "translate(0,-50%)",
                flexBasis: "33%",
              }}
            >
              <MenuOutlined style={{ fontSize: burgerSize, color: fontColor }} onClick={showDrawer} />
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
                      {isLogged && (
                        <>
                          <Button size="small" shape="round" style={{ fontSize: "0.75rem" }} onClick={() => onClickLogout()}>
                            로그아웃
                          </Button>
                        </>
                      )}
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
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
            <div style={{ flexBasis: "33%", textAlign: "right", fontSize: "0.75rem" }}></div>
          </div>
        </>
      )}
      {tablet && (
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
            <div
              style={{
                // display: "inline-block",
                // position: "absolute",
                // top: "50%",
                // transform: "translate(0,-50%)",
                flexBasis: "33%",
              }}
            >
              <MenuOutlined style={{ fontSize: burgerSize, color: fontColor }} onClick={showDrawer} />
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
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
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
            <div style={{ flexBasis: "33%", textAlign: "right", fontSize: "0.75rem" }}>
              {isLogged && (
                <div>
                  <Button size="small" shape="round" style={{ fontSize: "0.75rem" }} onClick={() => onClickLogout()}>
                    로그아웃
                  </Button>
                </div>
              )}
              {!isLogged && (
                <div>
                  <Link href="/account/login">
                    <a style={linkStyle}>
                      <UserOutlined style={{ marginRight: 5, color: fontColor }} />
                      로그인
                    </a>
                  </Link>
                  <Link href="/account/register">
                    <a style={linkStyle}>
                      <FileTextOutlined style={{ marginRight: 5, color: fontColor }} />
                      회원가입
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {laptop && (
        <>
          <div style={{ padding: "10px", background: backgroundColor }}>
            <div
              style={{
                width: "100%",
                // height: 50,
                display: "flex",
                margin: "auto",
                alignItems: "center",
              }}
            >
              <Link href="/">
                <a style={{ marginRight: "30px", fontFamily: `Architects Daughter, cursive`, fontWeight: 900, color: fontColor }}>
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
                  <Link href="/books/studypage">
                    <a style={linkStyle}>학습</a>
                  </Link>
                  <Link href="/books/writepage">
                    <a style={linkStyle}>만들기</a>
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
                      <Button size="small" shape="round" style={{ fontSize: "0.75rem" }} onClick={() => onClickLogout()}>
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
      )}
      {desktop && (
        <>
          <div style={{ background: backgroundColor }}>
            <div
              style={{
                width: 1200,
                height: 50,
                display: "flex",
                margin: "auto",
                alignItems:"center"
              }}
            >
              <Link href="/">
                <a style={{ marginRight: "30px", fontFamily: `Architects Daughter, cursive`, fontWeight: 900, color: fontColor }}>
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
                  <Link href="/books/studypage">
                    <a style={linkStyle}>학습</a>
                  </Link>
                  <Link href="/books/writepage">
                    <a style={linkStyle}>만들기</a>
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
                      <Button size="small" shape="round" style={{ fontSize: "0.75rem" }} onClick={() => onClickLogout()}>
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
      )}
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
