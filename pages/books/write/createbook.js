import React, { useState } from "react";
import Layout from "../../../components/layout/Layout";
import { Form, Input, Button } from "antd";
import Footer from "../../../components/index/Footer";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "../../../redux/actions";
import Router from "next/router";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";

const CreateBookMutation = gql`
  mutation CreateBookMutation($title: String!) {
    createMybook(title: $title) {
      status
      msg
      mybook {
        title
        user_id
      }
    }
  }
`;

const GetCategory = gql`
  query {
    getBookcategory {
      status
      msg
      bookcategory {
        _id
        name
        seq
      }
    }
  }
`;

const CreateBookComponent = () => {
  const [createMybook] = useMutation(CreateBookMutation, { onCompleted: showdata });
  const { loading, error, categoryData } = useQuery(GetCategory);
    if(categoryData !== undefined){
        console.log(categoryData.getBookcategory.bookcategory[0].name)
    }
  
  function showdata(data) {
    console.log("data", data);
    if (data.createMybook.msg === "책 생성 성공적!") {
      alert("책 만들기 성공!!!!");
      // Router.push("/");
      window.location.reload();
    } else {
      alert("뭔가 잘못되었네요. 다시 해봐요.");
    }
  }

  async function postbook(book_title) {
    try {
      await createMybook({
        variables: {
          title: book_title,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinish = (values) => {
    const book_title = values.book_title;
    // const category = values.category;

    postbook(book_title);
  };

  return (
    <div>
      <Form name="write-book" className="write-book-form" initialValues={{ category: "미지정" }} onFinish={onFinish}>
        <Form.Item name="book_title" rules={[{ required: true, message: "책제목을 입력해주세요!!!" }]}>
          <Input placeholder="책제목" />
        </Form.Item>
        <Form.Item name="category">
          <Input placeholder="카테고리" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            만들기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

const CreateBook = () => {
    return (
      <Layout>
        <CreateBookComponent />
        <Footer />
      </Layout>
    );
  };
  
  export default CreateBook;
