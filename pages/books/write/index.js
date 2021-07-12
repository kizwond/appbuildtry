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
import CategorySettingModal from '../../../components/books/write/category/CategorySettingModal'
const GetCategory = gql`
  query {
    bookcategory_get {
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

const WriteComponent = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(GetCategory);
  console.log("category", data);

  const linkStyle = {
    color: "black",
    padding: 10,
    fontSize: "1rem",
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <LikeBookList />
      <button onClick={showModal}>카테고리 설정</button>
      <CategorySettingModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel}/>
      <Link href="/books/write/createbook">
        <a style={linkStyle}>
          <button>새책만들기</button>
        </a>
      </Link>
    </div>
  );
};

const LikeBookList = () => {
  return <div>book list</div>;
};
const Write = () => {
  return (
    <Layout>
      <WriteComponent />
      <Footer />
    </Layout>
  );
};

export default Write;
