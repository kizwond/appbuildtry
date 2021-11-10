import React from "react";
import M_Layout from "../../../components/layout/M_Layout";
import { Form, Input, Button, message } from "antd";
import M_Footer from "../../../components/index/M_Footer";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMutation } from "@apollo/client";
import { SignInMutation } from "../../../graphql/query/account";

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

      window.location.href = "/m";
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
      alert("회원정보가 일치하지 않아요~");
      
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
          <Link href="/m/account/find/userid">
            <a>아이디 찾기 / </a>
          </Link>
          <Link href="/m/account/find/password">
            <a>비밀번호 찾기 / </a>
          </Link>
          <Link href="/m/account/register">
            <a>회원가입 </a>
          </Link>
        </div>
      </Form>
    </div>
  );
};

const Login = () => {
  return (
    <M_Layout>
      <LoginComponent />
      <M_Footer />
    </M_Layout>
  );
};

const login_container = {
  width: "200px",
  margin: "auto",
  textAlign: "center",
  marginTop: "100px",
  marginBottom: "100px",
  fontSize: "0.8rem",
};

export default Login;
