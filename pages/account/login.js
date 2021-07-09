import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import { Form, Input, Button } from "antd";
import Footer from "../../components/index/Footer";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "../../redux/actions";
import Router from "next/router";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";


const SignInMutation = gql`
  mutation SignInMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      _id
      user_info {
        username
      }
      msg
    }
  }
`;

const LoginComponent = () => {
  const dispatch = useDispatch()

  const [login] = useMutation(SignInMutation, { onCompleted: showdata });

  function showdata(data) {
    console.log("data", data)
    if (data.login.msg === "로그인 성공") {
      alert("로그인성공!!! 메인화면으로 이동합니다.");
      // Router.push("/");
      window.location.href = "/"
    } else {
      alert("뭔가 잘못되었네요. 다시 해봐요.");
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
    const username = values.user_id;
    const password = values.password;

    postuser(username, password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            로그인
          </Button>
        </Form.Item>
        <div>
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
      <LoginComponent />
      <Footer />
    </Layout>
  );
};

const login_container = {
  width: "300px",
  margin: "auto",
  textAlign: "center",
  marginTop: "100px",
  marginBottom: "100px",
};

export default Login;
