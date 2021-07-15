import React, { useState, useEffect } from "react";
import Layout from "../../../components/layout/Layout";
import { Form, Input, Button, Select } from "antd";
import Footer from "../../../components/index/Footer";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "../../../redux/actions";
import Router from "next/router";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";

const { Option } = Select;

const CreateBookMutation = gql`
  mutation CreateBookMutation($title: String!, $mybookcate_id: String) {
    mybook_create(title: $title, mybookcate_id: $mybookcate_id) {
      status
      msg
      mybooks {
        mybook_info {
          title
          user_id
          mybookcate_id
          seq_in_category
        }
      }
    }
  }
`;

const GetCategory = gql`
  query {
    mybookcate_get {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          user_id
          name
          seq
        }
      }
    }
  }
`;

const CreateBookComponent = () => {
  const [mybook_create] = useMutation(CreateBookMutation, { onCompleted: showdata });
  const [category, setCategory] = useState();
  const { loading, error, data } = useQuery(GetCategory);
  
  useEffect(() => {
    if(data){
      setCategory(data.mybookcate_get.mybookcates)
    }  
    console.log(category)
  });

  function showdata(item) {
    console.log("data", item);
    if (item.mybook_create.msg === "책 생성 성공적!") {
      alert("책 만들기 성공!!!!");
      // Router.push("/");
      window.location.href = "/books/write";
    } else {
      alert("뭔가 잘못되었네요. 다시 해봐요.");
    }
  }

  async function postbook(book_title, id) {
    try {
      await mybook_create({
        variables: {
          title: book_title,
          mybookcate_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinish = (values) => {
    console.log(values);
    postbook(values.book_title, values.category_id);
  };

  return (
    <div>
      <Form name="write-book" className="write-book-form" initialValues={{ category: "미지정" }} onFinish={onFinish}>
        <Form.Item name="book_title" rules={[{ required: true, message: "책제목을 입력해주세요!!!" }]}>
          <Input placeholder="책제목" />
        </Form.Item>
        <Form.Item name="category">
          <Form.Item className="category_select_naming" name="category_id" rules={[{ required: false, message: "카테고리를 선택해 주세요" }]}>
            <Select style={{ width: "100%" }} placeholder="카테고리를 선택해 주세요.">
              <Option>카테고리선택</Option>
              {category &&
                category.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.mybookcate_info.name}
                  </Option>
                ))}
            </Select>
          </Form.Item>
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
