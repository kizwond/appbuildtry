import React from "react";
import Layout from "../../components/layout/Layout";
import { Form, Input, Button } from "antd";
import Footer from "../../components/index/Footer";
import Router from "next/router";
import { useMutation } from "@apollo/client";
import { SignUpMutation } from "../../graphql/query/account";

const LoginComponent = () => {
  const [signup] = useMutation(SignUpMutation, { onCompleted: showdata });

  function showdata(data) {
    console.log(data);
    if (data.signup.msg === "ID 중복") {
      alert("동일 아이디가 이미 사용중임 다시 ㄱㄱ");
    } else {
      alert("회원가입완료!!! 로그인페이지로 이동합니다!!!");
      Router.push("/account/login");
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
        initialValues={{
          prefix: "82",
        }}
        scrollToFirstError
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
