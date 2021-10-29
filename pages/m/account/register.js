import React from "react";
import M_Layout from "../../../components/layout/M_Layout";
import { Form, Input, Button, message } from "antd";
import M_Footer from "../../../components/index/M_Footer";
import Router from "next/router";
import { useMutation } from "@apollo/client";
import { SignUpMutation } from "../../../graphql/query/account";

function routerToLogin() {
  Router.push("/m/account/login")
}

const LoginComponent = () => {
  const key = "updatable";
  const openMessage = async () => {
    message.success({
      content: "로그인 페이지로 이동합니다.",
      key,
      style: {
        marginTop: "20vh",
      },
      duration: 1,
    });
  };
  const error = () => {
    message.error("ID 중복이네요. 다른 아이디를 사용해주세요");
  };

  const [signup] = useMutation(SignUpMutation, { onCompleted: showdata });

  function showdata(data) {
    console.log(data);
    if (data.signup.msg === "ID 중복이네요. 다른 아이디를 사용해주세요") {
      error();
    } else {
      openMessage();
      setTimeout(routerToLogin, 2000);
    }
  }

  async function postuser(username, password) {
    try {
      await signup({
        variables: {
          username: username,
          password: password,
          name: "yoon",
          email: "test@test.com",
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
    <div style={register_container}>
      <Form
        className="register_form"
        id="register_form"
        name="register"
        onFinish={onFinish}
        scrollToFirstError
        style={{fontSize:"0.8rem"}}
      >
        <Form.Item
          name="user_id"
          label="아이디"
          rules={[
            {
              required: true,
              message: "사용할 아이디를 입력해주세요.",
            },
          ]}
          style={{fontSize:"0.8rem"}}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="비밀번호"
          rules={[
            {
              required: true,
              message: "비밀번호를 입력해 주세요.",
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label="비밀번호 확인"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "비밀번호를 다시한번 입력해 주세요.",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("비밀번호가 일치하지 않습니다.");
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{fontSize:"0.8rem"}}>
            회원가입
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const Register = () => {
  return (
    <M_Layout>
        <LoginComponent />
        <M_Footer />
    </M_Layout>
  );
};

const register_container = {
  width: "200px",
  margin: "auto",
  textAlign: "center",
  marginTop: "100px",
  marginBottom: "100px",
  fontSize:"0.8rem"
};

export default Register;
