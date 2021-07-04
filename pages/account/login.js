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

const LoginComponent = () => {
  const dispatch = useDispatch()

  const onFinish = (values) => {
    axios.post('http://localhost:5000/api/user/login', {
      user_id:values.user_id,
      password:values.password
    })
    .then(res => {
      console.log(res)
      if(res.data.msg === "아이디가 없는 듯요"){
        alert('유저정보가 없습니다. 아이디와 비밀번호를 확인하여 주세요.')
      } else {
        dispatch(logIn(true))
        console.log(res.data.user)
        localStorage.setItem("user", JSON.stringify(res.data.user));
        Router.push("/")
      }
    })
    .catch(function (error) {
      console.log(error);
    });
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
          <Link href="/register">
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
