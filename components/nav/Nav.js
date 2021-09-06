import Link from 'next/link';
import Image from 'next/image';
import profilePic from '../../public/image/logo2.png';
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
} from '@ant-design/icons';
import { Input, Avatar } from 'antd';
import React, { useEffect, useState } from 'react';
import { Drawer } from 'antd';

// import useWindowSize from "../../utils/useWindowSize";
import { useWindowSize } from 'react-use';
import { useMutation } from '@apollo/client';

import { useSelector, useDispatch } from 'react-redux';
import { LOGOUT } from '../../graphql/query/account';

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

  if (windowWith < 1025 && windowWith > 769) {
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
    document.cookie = name + '=; expires=Thu, 01 Jan 1999 00:00:10 GMT;';
  };

  const onClickLogout = () => {
    logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('here');
    window.location.href = '/';
  };

  return (
    <>
      {windowWith < 426 && (
        <>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingRight: 10,
              paddingLeft: 10,
              height: 40,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                position: 'absolute',
                top: '50%',
                transform: 'translate(0,-50%)',
              }}
            >
              <MenuOutlined style={{ fontSize: '25px' }} onClick={showDrawer} />
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
                    width: '100%',
                    height: 50,
                    display: 'flex',
                    margin: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Link href="/books/study">
                        <a style={linkStyle}>
                          <ReadOutlined style={{ marginRight: 10 }} />
                          학습
                        </a>
                      </Link>
                      <Link href="/books/write">
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
                      <Link href="/bookstore">
                        <a style={linkStyle}>
                          <ShopOutlined style={{ marginRight: 10 }} />
                          서점
                        </a>
                      </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {isLogged && (
                        <>
                          <button onClick={() => onClickLogout()}>
                            로그아웃
                          </button>
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
                        </>
                      )}
                      <Link href="/account/register">
                        <a style={linkStyle}>
                          <FileTextOutlined style={{ marginRight: 10 }} />
                          회원가입
                        </a>
                      </Link>
                      <Link href="/cart">
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
              <a
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translate(-50%)',
                }}
              >
                <Image src={profilePic} width="80px" height="40px" alt="logo" />
              </a>
            </Link>
          </div>
        </>
      )}
      {tablet && (
        <>
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingRight: 10,
              paddingLeft: 10,
              height: 40,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                position: 'absolute',
                top: '50%',
                transform: 'translate(0,-50%)',
              }}
            >
              <MenuOutlined style={{ fontSize: '25px' }} onClick={showDrawer} />
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
                    width: '100%',
                    height: 50,
                    display: 'flex',
                    margin: 'auto',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      justifyContent: 'space-between',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Link href="/books/study">
                        <a style={linkStyle}>
                          <ReadOutlined style={{ marginRight: 10 }} />
                          학습
                        </a>
                      </Link>
                      <Link href="/books/write">
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
                      <Link href="/bookstore">
                        <a style={linkStyle}>
                          <ShopOutlined style={{ marginRight: 10 }} />
                          서점
                        </a>
                      </Link>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {isLogged && (
                        <>
                          <button onClick={() => onClickLogout()}>
                            로그아웃
                          </button>
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
                        </>
                      )}
                      <Link href="/account/register">
                        <a style={linkStyle}>
                          <FileTextOutlined style={{ marginRight: 10 }} />
                          회원가입
                        </a>
                      </Link>
                      <Link href="/cart">
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
              <a
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translate(-50%)',
                }}
              >
                <Image src={profilePic} width="80px" height="40px" alt="logo" />
              </a>
            </Link>
          </div>
        </>
      )}
      {laptop && (
        <>
          <div style={{ borderBottom: '1px solid lightgrey' }}>
            <div
              style={{
                width: '100%',
                height: 50,
                display: 'flex',
                margin: 'auto',
              }}
            >
              <Link href="/">
                <a style={{ marginRight: '30px' }}>
                  <Image
                    src={profilePic}
                    width="100px"
                    height="50px"
                    alt="logo"
                  />
                </a>
              </Link>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Link href="/books/study">
                    <a style={linkStyle}>학습</a>
                  </Link>
                  <Link href="/books/write">
                    <a style={linkStyle}>만들기</a>
                  </Link>
                  <Link href="/mentoring">
                    <a style={linkStyle}>멘토링</a>
                  </Link>
                  <Link href="/bookstore">
                    <a style={linkStyle}>서점</a>
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isLogged && (
                    <>
                      <button onClick={() => onClickLogout()}>로그아웃</button>
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
                    </>
                  )}
                  <Link href="/account/register">
                    <a style={linkStyle}>회원가입</a>
                  </Link>
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
          <div style={{ borderBottom: '1px solid lightgrey' }}>
            <div
              style={{
                width: 1200,
                height: 50,
                display: 'flex',
                margin: 'auto',
              }}
            >
              <Link href="/">
                <a style={{ marginRight: '30px' }}>
                  <Image
                    src={profilePic}
                    width="100px"
                    height="50px"
                    alt="logo"
                  />
                </a>
              </Link>
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Link href="/books/study">
                    <a style={linkStyle}>학습</a>
                  </Link>
                  <Link href="/books/write">
                    <a style={linkStyle}>만들기</a>
                  </Link>
                  <Link href="/mentoring">
                    <a style={linkStyle}>멘토링</a>
                  </Link>
                  <Link href="/bookstore">
                    <a style={linkStyle}>서점</a>
                  </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {isLogged && (
                    <>
                      <button onClick={() => onClickLogout()}>로그아웃</button>
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
                    </>
                  )}
                  <Link href="/account/register">
                    <a style={linkStyle}>회원가입</a>
                  </Link>
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
  color: 'black',
  padding: 10,
  fontSize: '1rem',
};
