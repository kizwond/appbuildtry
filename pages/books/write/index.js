import React, { useState, useEffect } from "react";
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
import CategorySettingModal from "../../../components/books/write/category/CategorySettingModal";

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
    mybook_get {
      status
      msg
      mybook {
        book_info {
          title
          user_id
          bookcategory_id
          seq_in_category
        }
      }
    }
  }
`;

const WriteComponent = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(GetCategory);
  const [category, setCategory] = useState();
  const [books, setBooks] = useState();

  // const [books, setBooks] = useState(data.bookcategory_get.mybook.bookinfo);
  console.log(category);

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");

    if (data) {
      console.log(data);
      setCategory(data.bookcategory_get.bookcategory);
      setBooks(data.mybook_get.mybook);
    }
    console.log(category);
    console.log(books);
  });

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
      <CategorySettingModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
      <Link href="/books/write/createbook">
        <a style={linkStyle}>
          <button>새책만들기</button>
        </a>
      </Link>
      <BookList category={category} books={books} />
    </div>
  );
};

const LikeBookList = () => {
  return <div>like book list</div>;
};

const BookList = ({ category, books }) => {
  if (category) {
    var categoryList = category.map((category) => (
      <>
        <div>{category.name}</div>
        <ul>
          <BooksInCategory categoryId={category._id} books={books} />
        </ul>
      </>
    ));
  }

  return <div>{categoryList}</div>;
};

const BooksInCategory = ({ books, categoryId }) => {
  if (books) {
    var list = books.map((book) => {
      if (book.book_info.bookcategory_id === categoryId) {
        return (
          <>
            <li>{book.book_info.title}</li>
          </>
        );
      }
    });
  }
  return (
    <ul>
      <li>{list}</li>
    </ul>
  );
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
