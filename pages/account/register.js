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
    <div style={register_container}>
      <Form
        className="register_form"
        id='register_form'
        name="register"
        onFinish={onFinish}
        initialValues={{
          prefix: '82',
        }}
        scrollToFirstError
      >
        <Form.Item
          name="user_id"
          label="아이디"
          rules={[
            {
              required: true,
              message: '사용할 아이디를 입력해주세요.',
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: '비밀번호를 입력해 주세요.',
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="비밀번호 확인"
          dependencies={['password']}
          hasFeedback
          rules={[
            {
              required: true,
              message: '비밀번호를 다시한번 입력해 주세요.',
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }

                return Promise.reject('비밀번호가 일치하지 않습니다.');
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const Register = () => {
  return (
    <Layout>
      <LoginComponent />
      <Footer />
    </Layout>
  );
};

const register_container = {
  width: "300px",
  margin: "auto",
  textAlign: "center",
  marginTop: "100px",
  marginBottom: "100px",
};

export default Register;
