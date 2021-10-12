import React from "react";
import Layout from "../../components/layout/Layout";
import { Form, Input, Button, message } from "antd";
import Footer from "../../components/index/Footer";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { SignInMutation } from "../../graphql/query/account";
import { useMediaQuery } from "react-responsive";

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};

const LoginComponent = () => {
  const key = "updatable";
  const openMessage = async () => {
    message.loading({
      content: "로그인...",
      key,
      style: {
        marginTop: "20vh",
      },
    });
  };
  const error = () => {
    message.error("뭔가 잘못되었네요. 다시 해봐요.");
  };

  const [login] = useMutation(SignInMutation, { onCompleted: showdata });

  function showdata(data) {
    console.log("data", data);
    if (data.login.msg === "로그인 성공") {
      openMessage();

      if (data.login.token !== null) {
        localStorage.setItem("accessToken", data.login.token.accessToken);
        localStorage.setItem("refreshToken", data.login.token.refreshToken);
      }

      window.location.href = "/";
    } else {
      error();
    }
  }

  async function postuser(username, password) {
    try {
      await login({
        variables: {
          username: username,
          password: password,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinish = (values) => {
    postuser(values.user_id, values.password);
  };

  return (
    <div style={login_container}>
      <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={onFinish}>
        <Form.Item name="user_id" rules={[{ required: true, message: "아이디를 입력해 주세요." }]}>
          <Input prefix={<UserOutlined />} placeholder="아이디" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "비밀번호를 입력해 주세요." }]}>
          <Input prefix={<LockOutlined />} type="password" placeholder="비밀번호" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%", fontSize: "0.8rem" }}>
            로그인
          </Button>
        </Form.Item>
        <div style={{ fontSize: "0.8rem" }}>
          <Link href="/account/find/userid">
            <a>아이디 찾기 / </a>
          </Link>
          <Link href="/account/find/password">
            <a>비밀번호 찾기 / </a>
          </Link>
          <Link href="/account/register">
            <a>회원가입 </a>
          </Link>
        </div>
      </Form>
    </div>
  );
};

const Login = () => {
  return (
    <Layout>
      <Desktop>
        <LoginComponent />
        <Footer />
      </Desktop>

      <Tablet>
        <div style={{ marginBottom: "150px" }}>
          <LoginComponent />
          <div style={{ position: "fixed", bottom: 0, zIndex: 3, width: "100%" }}>
            <Footer />
          </div>
        </div>
      </Tablet>

      <Mobile>
        <div style={{ marginBottom: "150px" }}>
          <LoginComponent />
          <div style={{ position: "fixed", bottom: 0, zIndex: 3, width: "100%" }}>
            <Footer />
          </div>
        </div>
      </Mobile>
    </Layout>
  );
};

const login_container = {
  width: "300px",
  margin: "auto",
  textAlign: "center",
  marginTop: "100px",
  marginBottom: "100px",
  fontSize: "0.8rem",
};

export default Login;
