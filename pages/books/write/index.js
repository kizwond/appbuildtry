import React, { useState, useEffect, Fragment } from "react";
import Layout from "../../../components/layout/Layout";
import { Form, Input, Button, Space, Popover } from "antd";
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
    mybook_get {
      status
      msg
      mybooks {
        _id
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;
const BookDeleteMutation = gql`
  mutation BookDeleteMutation($mybook_id: String!) {
    mybook_delete(mybook_id: $mybook_id) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
        }
      }
      mybooks {
        _id
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;
const BookUpdateMutation = gql`
  mutation BookUpdateMutation($mybook_id: String!, $title: String, $hide_or_show: String) {
    mybook_update(mybook_id: $mybook_id, title: $title, hide_or_show: $hide_or_show) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
        }
      }
      mybooks {
        _id
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
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
  const [mybook_delete] = useMutation(BookDeleteMutation, { onCompleted: showdatadelete });
  const [mybook_update] = useMutation(BookUpdateMutation, { onCompleted: showdataupdate });
  // const [books, setBooks] = useState(data.bookcategory_get.mybook.bookinfo);
  console.log(category);

  function showdataupdate(data) {
    console.log("data", data);
    setBooks(data.mybook_update.mybooks);
  }
  async function updateBookName(title, id, hide_or_show) {
    try {
      await mybook_update({
        variables: {
          title: title,
          mybook_id: id,
          hide_or_show: hide_or_show,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinishUpdate = (values) => {
    console.log(values);
    updateBookName(values.title, values.id, values.hide_or_show);
  };

  function showdatadelete(item) {
    console.log("data", item);
    if (item.mybook_delete.msg === "책 삭제 성공적!") {
      alert("책 삭제 성공!!!!!");
      // Router.push("/");
      window.location.href = "/books/write";
    } else {
      alert("뭔가 잘못되었네요. 다시 해봐요.");
    }
  }

  async function deleteBook(id) {
    try {
      await mybook_delete({
        variables: {
          mybook_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");

    if (data) {
      console.log(data);
      setCategory(data.mybookcate_get.mybookcates);
      setBooks(data.mybook_get.mybooks);
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
      <BookList category={category} books={books} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} />
    </div>
  );
};

const LikeBookList = () => {
  return <div>like book list</div>;
};

const BookList = ({ category, books, deleteBook, onFinishUpdate }) => {
  if (category) {
    var categoryList = category.map((category) => (
      <Fragment key={category._id}>
        <div>{category.mybookcate_info.name}</div>
        <div>
          <BooksInCategory categoryId={category._id} books={books} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} />
        </div>
      </Fragment>
    ));
  }

  return (
    <div>
      <div>
        <ul style={{ display: "flex", justifyContent: "space-between", listStyle: "none" }}>
          <li>카테고리</li>
          <li>책이름</li>
          <li>이름바꾸기</li>
          <li>책정보</li>
          <li>순서변경</li>
          <li>좋아요</li>
          <li>숨김</li>
          <li>삭제</li>
        </ul>
      </div>
      {categoryList}
    </div>
  );
};

const BooksInCategory = ({ books, categoryId, deleteBook, onFinishUpdate }) => {
  const [updatenewInput, setupdateNewInput] = useState(false);
  const updateNameText = <span style={{ fontSize: "11px" }}>변경할 이름을 입력해 주세요.</span>;
  const updatecontent = (id, hide_or_show) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        id: id,
        hide_or_show: hide_or_show,
      }}
      onFinish={onFinishUpdate}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["title"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={["id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={id} />
        </Form.Item>
        <Form.Item name={["hide_or_show"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={hide_or_show} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button type="primary" onClick={() => setupdateNewInput(false)} htmlType="submit">
            완료
          </Button>
          <Button type="primary" onClick={() => setupdateNewInput(false)}>
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );

  if (books) {
    console.log(books, "asdf");
    console.log(categoryId);
    var list = books.map((book) => {
      if (book.mybook_info.mybookcate_id === categoryId) {
        return (
          <Fragment key={book._id}>
            <ul style={{ display: "flex", justifyContent: "space-between", listStyle: "none" }}>
              <li>{book.mybook_info.title}</li>
              <li>
                <Popover placement="rightTop" title={updateNameText} visible={updatenewInput} content={updatecontent(book._id, book.mybook_info.hide_or_show)} trigger="click">
                  <button onClick={() => setupdateNewInput(true)} style={{ fontSize: "11px" }}>
                    이름바꾸기
                  </button>
                </Popover>
              </li>
              <li>책정보 블라블라</li>
              <li>
                <button>up</button>
                <button>down</button>
              </li>
              <li>
                <button>좋아요</button>
              </li>
              <li>
                <button>숨기기</button>
              </li>
              <li>
                <button onClick={() => deleteBook(book._id)}>삭제</button>
              </li>
            </ul>
          </Fragment>
        );
      }
    });
  }
  return <>{list}</>;
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
