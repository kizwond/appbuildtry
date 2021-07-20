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
import { GetCategory, BookDeleteMutation, BookUpdateMutation, PositioningBookMutation, BookLikeMutation,PositioningLikeBookMutation } from "../../../graphql/query/writemain";

const WriteComponent = () => {
  const dispatch = useDispatch();
  const { loading, error, data } = useQuery(GetCategory);
  const [category, setCategory] = useState();
  const [books, setBooks] = useState();
  const [mybook_delete] = useMutation(BookDeleteMutation, { onCompleted: showdatadelete });
  const [mybook_update] = useMutation(BookUpdateMutation, { onCompleted: showdataupdate });
  const [mybook_changeorder] = useMutation(PositioningBookMutation, { onCompleted: showdatareposition });
  const [mybook_changewritelike] = useMutation(BookLikeMutation, { onCompleted: showdataupdatelike });
  const [mybook_changewritelikeorder] = useMutation(PositioningLikeBookMutation, { onCompleted: showdatarepositionlike });

  //카테고리내에 책 순서 변경
  function showdatareposition(data) {
    console.log("data", data);
    setBooks(data.mybook_changeorder.mybooks);
  }

  async function positionBooks(direction, id) {
    try {
      await mybook_changeorder({
        variables: {
          direction: direction,
          mybook_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinishPositionBook = (direction, id) => {
    console.log(direction, id);
    positionBooks(direction, id);
  };

  //좋아요 책 순서 변경
  function showdatarepositionlike(data) {
    console.log("data", data);
    setBooks(data.mybook_changewritelikeorder.mybooks);
  }

  async function positionBooksLike(direction, id) {
    try {
      await mybook_changewritelikeorder({
        variables: {
          direction: direction,
          mybook_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinishPositionBookLike = (direction, id) => {
    console.log(direction, id);
    positionBooksLike(direction, id);
  };

  // 책이름 변경 뮤테이션
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

  // 책 삭제 뮤테이션
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

 // 좋아요 기능
  function showdataupdatelike(data) {
    console.log("data", data);
    setBooks(data.mybook_changewritelike.mybooks);
  }
  async function updateBookLike(id, like) {
    try {
      await mybook_changewritelike({
        variables: {
          mybook_id: id,
          writelike: like,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onClickLike = (id, like) => {
    console.log(id, like)
    updateBookLike(id, like);
  }
  //useEffect
  useEffect(() => {
    if (data) {
      console.log(data);
      setCategory(data.mybookcate_get.mybookcates);
      setBooks(data.mybook_get.mybooks);
    }
    console.log(category);
    console.log(books);
  });

  // 카테고리 설정 모달 visible
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
      <LikeBookList onClickLike={onClickLike} category={category} books={books} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} onFinishPositionBookLike={onFinishPositionBookLike} />
      <button onClick={showModal}>카테고리 설정</button>
      <CategorySettingModal isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} />
      <Link href="/books/write/createbook">
        <a>
          <button>새책만들기</button>
        </a>
      </Link>
      <BookList onClickLike={onClickLike} category={category} books={books} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} onFinishPositionBook={onFinishPositionBook} />
    </div>
  );
};

//책 리스트 컨테이너
const BookList = ({ category, books, deleteBook, onFinishUpdate, onFinishPositionBook, onClickLike }) => {
  if (category) {
    var categoryList = category.map((category) => (
      <Fragment key={category._id}>
        <div>
          <BooksInCategory onClickLike={onClickLike} cateName={category.mybookcate_info.name} categoryId={category._id} books={books} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} onFinishPositionBook={onFinishPositionBook} />
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

//카테고리내에 책 리스트 컴퍼넌트
const BooksInCategory = ({ cateName, books, categoryId, deleteBook, onFinishUpdate, onFinishPositionBook, onClickLike }) => {
  if (books) {
    console.log(books);
    const seq = books.filter((book) => book.mybook_info.mybookcate_id === categoryId);
    const lastSeq = seq.length - 1;
    if (lastSeq === 0) {
      var totalLength = 0;
    }
    var list = books.map((book) => {
      if (book.mybook_info.mybookcate_id === categoryId) {
        return (
          <Fragment key={book._id}>
            <ListItem onClickLike={onClickLike} cateName={cateName} totalLength={totalLength} lastSeq={lastSeq} book={book} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} onFinishPositionBook={onFinishPositionBook} />
          </Fragment>
        );
      }
    });
  }
  return <>{list}</>;
};

const ListItem = ({ book, deleteBook, onFinishUpdate, onFinishPositionBook, lastSeq, totalLength,cateName, onClickLike }) => {
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
  return (
    <>
      <ul style={{ display: "flex", justifyContent: "space-between", listStyle: "none" }}>
        {book.mybook_info.seq_in_category === 0 && <li>{cateName}</li>}
        {book.mybook_info.seq_in_category !== 0 && <li style={{visibility:"hidden"}}>{cateName}</li>}
        
        <li>{book.mybook_info.title}</li>
        <li>
          <Popover placement="rightTop" title={updateNameText} visible={updatenewInput} content={updatecontent(book._id, book.mybook_info.hide_or_show)} trigger="click">
            <button onClick={() => setupdateNewInput(true)} style={{ fontSize: "11px" }}>
              이름바꾸기
            </button>
          </Popover>
        </li>
        <li>책정보 블라블라{lastSeq}</li>
        <li>
          {totalLength === 0 && (
            <>
              <button disabled>up</button>
              <button disabled>down</button>
            </>
          )}
          {totalLength !== 0 && book.mybook_info.seq_in_category === 0 && (
            <>
              <button disabled>up</button>
              <button onClick={() => onFinishPositionBook("down", book._id)}>down</button>
            </>
          )}
          {totalLength !== 0 && book.mybook_info.seq_in_category === lastSeq && (
            <>
              <button onClick={() => onFinishPositionBook("up", book._id)}>up</button>
              <button disabled>down</button>
            </>
          )}
        </li>
        <li>
          {book.mybook_info.writelike === true &&  <button onClick={() => onClickLike(book._id, false)}>해제</button>}
          {book.mybook_info.writelike === false && <button onClick={() => onClickLike(book._id, true)}>좋아요</button>}
        </li>
        <li>
          <button>숨기기</button>
        </li>
        <li>
          <button onClick={() => deleteBook(book._id)}>삭제</button>
        </li>
      </ul>
    </>
  );
};


const LikeBookList = ({ category, books, deleteBook, onFinishUpdate, onFinishPositionBookLike, onClickLike }) => {
  if (category) {
    var categoryList = category.map((category) => (
      <Fragment key={category._id}>
        <div>
          <LikeBooksInCategory categoryName={category.mybookcate_info.name} categoryId={category._id} books={books} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} onFinishPositionBookLike={onFinishPositionBookLike} />
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
      {/* {categoryList} */}
      <LikeBooksInCategory category={category} books={books} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} onFinishPositionBookLike={onFinishPositionBookLike} onClickLike={onClickLike}/>
    </div>
  );
};

//카테고리내에 책 리스트 컴퍼넌트
const LikeBooksInCategory = ({ category, books, deleteBook, onFinishUpdate, onFinishPositionBookLike, onClickLike }) => {
  if (books) {
    console.log(books);
    const likebooks = books.filter((book) => book.mybook_info.writelike === true);
    likebooks.sort(function (a, b) { 
      return a.mybook_info.seq_in_writelike < b.mybook_info.seq_in_writelike ? -1 : a.mybook_info.seq_in_writelike > b.mybook_info.seq_in_writelike ? 1 : 0;  
    });
    const lastSeq = likebooks.length;

    var list = likebooks.map((book) => {
        const categoryNameFilter = category.filter((item)=>{
          return item._id === book.mybook_info.mybookcate_id
        })
        const categoryName = categoryNameFilter[0].mybookcate_info.name;
        return (
          <Fragment key={book._id}>
            <LikeListItem lastSeq={lastSeq} categoryName={categoryName} book={book} deleteBook={deleteBook} onFinishUpdate={onFinishUpdate} onFinishPositionBookLike={onFinishPositionBookLike} onClickLike={onClickLike} />
          </Fragment>
        );
      
    });
  }
  return <>{list}</>;
};

const LikeListItem = ({ categoryName, book, deleteBook, onFinishUpdate, onFinishPositionBookLike, onClickLike, lastSeq }) => {
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
  return (
    <>
      <ul style={{ display: "flex", justifyContent: "space-between", listStyle: "none" }}>
        <li>{categoryName}</li>
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
          
          {book.mybook_info.seq_in_writelike === 0 && (
            <>
              <button disabled>up</button>
              <button onClick={() => onFinishPositionBookLike("down", book._id)}>down</button>
            </>
          )}
          {book.mybook_info.seq_in_writelike === lastSeq-1 && (
            <>
              <button onClick={() => onFinishPositionBookLike("up", book._id)}>up</button>
              <button disabled>down</button>
            </>
          )}
          {book.mybook_info.seq_in_writelike !== lastSeq-1 && book.mybook_info.seq_in_writelike !== 0 && (
            <>
              <button onClick={() => onFinishPositionBookLike("up", book._id)}>up</button>
              <button onClick={() => onFinishPositionBookLike("down", book._id)}>down</button>
            </>
          )}
        </li>
        <li>
          {book.mybook_info.writelike === true &&  <button onClick={() => onClickLike(book._id, false)}>해제</button>}
          {book.mybook_info.writelike === false && <button onClick={() => onClickLike(book._id, true)}>좋아요</button>}
        </li>
        <li>
          <button>숨기기</button>
        </li>
        <li>
          <button onClick={() => deleteBook(book._id)}>삭제</button>
        </li>
      </ul>
    </>
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
