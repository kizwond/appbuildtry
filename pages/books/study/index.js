import React, { useState, useEffect, Fragment } from 'react';
import Layout from '../../../components/layout/Layout';
import { Form, Input, Button, Space, Checkbox, Select } from 'antd';
import Footer from '../../../components/index/Footer';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useQuery, useMutation } from '@apollo/client';
import CategorySettingModal from '../../../components/books/write/category/CategorySettingModal';
import {
  GetCategory,
  BookDeleteMutation,
  BookUpdateMutation,
  PositioningBookMutation,
  BookLikeMutation,
  PositioningLikeBookMutation,
  BookChangeCategoryMutation,
} from '../../../graphql/query/writemain';
import { useRouter } from 'next/router';

const { Option } = Select;

const BoomListMain = () => {
  const router = useRouter();

  const { loading, error, data } = useQuery(GetCategory);
  const [category, setCategory] = useState();
  const [books, setBooks] = useState();
  const [mybook_delete] = useMutation(BookDeleteMutation, {
    onCompleted: showdatadelete,
  });
  const [mybook_update] = useMutation(BookUpdateMutation, {
    onCompleted: showdataupdate,
  });
  const [mybook_changeorder] = useMutation(PositioningBookMutation, {
    onCompleted: showdatareposition,
  });
  const [mybook_changewritelike] = useMutation(BookLikeMutation, {
    onCompleted: showdataupdatelike,
  });
  const [mybook_changewritelikeorder] = useMutation(PositioningLikeBookMutation, { onCompleted: showdatarepositionlike });
  const [mybook_movetoothercate] = useMutation(BookChangeCategoryMutation, {
    onCompleted: showdatarebookmovecategory,
  });

  //다른 카테고리로 책 이동
  function showdatarebookmovecategory(data) {
    console.log('data', data);
    setBooks(data.mybook_movetoothercate.mybooks);
  }

  async function bookMoveCategory(mybook_id, target_mybookcate_id) {
    try {
      await mybook_movetoothercate({
        variables: {
          mybook_id: mybook_id,
          target_mybookcate_id: target_mybookcate_id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  function onFinishBookMoveCategory(mybook_id, target_mybookcate_id) {
    console.log(mybook_id, target_mybookcate_id);
    bookMoveCategory(mybook_id, target_mybookcate_id);
  }

  //카테고리내에 책 순서 변경
  function showdatareposition(data) {
    console.log('data', data);
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
    console.log('data', data);
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
    console.log('data', data);
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
    console.log('data', item);
    if (item.mybook_delete.msg === '책 삭제 성공적!') {
      alert('책 삭제 성공!!!!!');
      // Router.push("/");
      window.location.href = '/books/write';
    } else {
      alert('뭔가 잘못되었네요. 다시 해봐요.');
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
    console.log('data', data);
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
    console.log(id, like);
    updateBookLike(id, like);
  };
  //useEffect
  useEffect(() => {
    sessionStorage.removeItem('books_selected');
    sessionStorage.removeItem('session_Id');
    if (data) {
      console.log(data);
      if (data.mybook_getAllMybook.status === '401') {
        router.push('/account/login');
      }
      setCategory(data.mybookcate_get.mybookcates);
      setBooks(data.mybook_getAllMybook.mybooks);
    }
    console.log(category);
    console.log(books);
  }, [data, category, books, router]);

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
  const sesstionStart = () => {
    console.log('session start button clicked!!');
    router.push('/books/study/sessionSetting');
  };
  return (
    <>
      <div>
        <button onClick={() => sesstionStart()}>세션시작</button>
      </div>
      <div>
        좋아요리스트
        <LikeBookList
          onClickLike={onClickLike}
          category={category}
          books={books}
          deleteBook={deleteBook}
          onFinishUpdate={onFinishUpdate}
          onFinishPositionBookLike={onFinishPositionBookLike}
          onFinishBookMoveCategory={onFinishBookMoveCategory}
        />
        책리스트
        <BookList
          onClickLike={onClickLike}
          category={category}
          books={books}
          deleteBook={deleteBook}
          onFinishUpdate={onFinishUpdate}
          onFinishPositionBook={onFinishPositionBook}
          onFinishBookMoveCategory={onFinishBookMoveCategory}
        />
      </div>
    </>
  );
};

//책 리스트 컨테이너
const BookList = ({ category, books, deleteBook, onFinishUpdate, onFinishPositionBook, onClickLike, onFinishBookMoveCategory }) => {
  if (category) {
    var categoryList = category.map((item) => (
      <Fragment key={item._id}>
        <div>
          <BooksInCategory
            onClickLike={onClickLike}
            cateName={item.mybookcate_info.name}
            categoryId={item._id}
            books={books}
            deleteBook={deleteBook}
            onFinishUpdate={onFinishUpdate}
            onFinishPositionBook={onFinishPositionBook}
            category={category}
            onFinishBookMoveCategory={onFinishBookMoveCategory}
          />
        </div>
      </Fragment>
    ));
  }

  return (
    <div>
      <div>
        <ul
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            listStyle: 'none',
          }}
        >
          <li>카테고리</li>
          <li>책이름</li>
          <li>책정보</li>
          <li>순서변경</li>
          <li>좋아요</li>
          <li>숨김</li>
          <li>카테고리이동</li>
          <li>삭제</li>
        </ul>
      </div>
      {categoryList}
    </div>
  );
};

//카테고리내에 책 리스트 컴퍼넌트
const BooksInCategory = ({
  category,
  cateName,
  books,
  categoryId,
  deleteBook,
  onFinishUpdate,
  onFinishPositionBook,
  onClickLike,
  onFinishBookMoveCategory,
}) => {
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
            <ListItem
              onClickLike={onClickLike}
              cateName={cateName}
              totalLength={totalLength}
              lastSeq={lastSeq}
              book={book}
              deleteBook={deleteBook}
              onFinishUpdate={onFinishUpdate}
              onFinishPositionBook={onFinishPositionBook}
              onFinishBookMoveCategory={onFinishBookMoveCategory}
              category={category}
            />
          </Fragment>
        );
      }
    });
  }
  return <>{list}</>;
};

const ListItem = ({
  category,
  book,
  deleteBook,
  onFinishUpdate,
  onFinishPositionBook,
  lastSeq,
  totalLength,
  cateName,
  onClickLike,
  onFinishBookMoveCategory,
}) => {
  const [updatenewInput, setupdateNewInput] = useState(false);
  const updateNameText = <span style={{ fontSize: '11px' }}>변경할 이름을 입력해 주세요.</span>;
  const updatecontent = (id, hide_or_show) => (
    <Form
      layout={'inline'}
      size="small"
      initialValues={{
        id: id,
        hide_or_show: hide_or_show,
      }}
      onFinish={onFinishUpdate}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={['title']} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={['id']} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={id} />
        </Form.Item>
        <Form.Item name={['hide_or_show']} hidden={true} rules={[{ required: true }]}>
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

  const hide_or_show = (title, id, status) => {
    const values = { title: title, id: id, hide_or_show: status };
    onFinishUpdate(values);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);

    onFinishBookMoveCategory(book._id, value);
  }

  function onChangeCheckBox(e) {
    console.log(`selected ${e.target.checked}`);
    console.log(`selected ${book.mybook_info.title}`);
    const session_books = JSON.parse(sessionStorage.getItem('books_selected'));
    console.log(session_books);
    console.log(book._id);
    const value = [{ book_id: book._id, book_title: book.mybook_info.title }];
    const value2 = { book_id: book._id, book_title: book.mybook_info.title };
    if (e.target.checked === true) {
      if (session_books === null) {
        sessionStorage.setItem('books_selected', JSON.stringify(value));
      } else {
        const revalue = session_books.concat(value2);
        sessionStorage.setItem('books_selected', JSON.stringify(revalue));
        console.log('hello');
      }
    } else {
      const filtered = session_books.filter((item) => item.book_id !== book._id);
      console.log(filtered);
      sessionStorage.setItem('books_selected', JSON.stringify(filtered));
    }
  }

  const router = useRouter();

  return (
    <>
      <Checkbox onChange={onChangeCheckBox} />
      <ul
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          listStyle: 'none',
        }}
      >
        {book.mybook_info.seq_in_category === 0 && <li>{cateName}</li>}
        {book.mybook_info.seq_in_category !== 0 && <li style={{ visibility: 'hidden' }}>{cateName}</li>}
        <li>
          <button>{book.mybook_info.title}</button>
          {/* <button onClick={() => router.push(`/books/study/${book._id}`)}>{book.mybook_info.title}</button> */}
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
              <button onClick={() => onFinishPositionBook('down', book._id)}>down</button>
            </>
          )}
          {totalLength !== 0 && book.mybook_info.seq_in_category === lastSeq && (
            <>
              <button onClick={() => onFinishPositionBook('up', book._id)}>up</button>
              <button disabled>down</button>
            </>
          )}
          {book.mybook_info.seq_in_category !== lastSeq && book.mybook_info.seq_in_category !== 0 && (
            <>
              <button onClick={() => onFinishPositionBook('up', book._id)}>up</button>
              <button onClick={() => onFinishPositionBook('down', book._id)}>down</button>
            </>
          )}
        </li>
        <li>
          {book.mybook_info.writelike === true && <button onClick={() => onClickLike(book._id, false)}>해제</button>}
          {book.mybook_info.writelike === false && <button onClick={() => onClickLike(book._id, true)}>좋아요</button>}
        </li>
        <li>
          {book.mybook_info.hide_or_show === 'show' && <button onClick={() => hide_or_show(book.mybook_info.title, book._id, 'hide')}>숨기기</button>}
          {book.mybook_info.hide_or_show === 'hide' && <button onClick={() => hide_or_show(book.mybook_info.title, book._id, 'show')}>해제</button>}
        </li>
        <li>
          <Select defaultValue="info" style={{ width: 120 }} onChange={handleChange}>
            <Option value="info">선택</Option>
            {category &&
              category.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.mybookcate_info.name}
                </Option>
              ))}
          </Select>
        </li>
        <li>
          <button onClick={() => deleteBook(book._id)}>삭제</button>
        </li>
        <li>
          <button onClick={() => router.push(`/books/study/setting/${book._id}`)}>설정</button>
        </li>
      </ul>
    </>
  );
};

const LikeBookList = ({ category, books, deleteBook, onFinishUpdate, onFinishPositionBookLike, onClickLike, onFinishBookMoveCategory }) => {
  return (
    <div>
      <div>
        <ul
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            listStyle: 'none',
          }}
        >
          <li>카테고리</li>
          <li>책이름</li>
          <li>책정보</li>
          <li>순서변경</li>
          <li>좋아요</li>
          <li>숨김</li>
          <li>카테고리이동</li>
          <li>삭제</li>
          <li>설정</li>
        </ul>
      </div>
      {/* {categoryList} */}
      <LikeBooksInCategory
        category={category}
        books={books}
        deleteBook={deleteBook}
        onFinishUpdate={onFinishUpdate}
        onFinishPositionBookLike={onFinishPositionBookLike}
        onClickLike={onClickLike}
        onFinishBookMoveCategory={onFinishBookMoveCategory}
      />
    </div>
  );
};

//카테고리내에 책 리스트 컴퍼넌트
const LikeBooksInCategory = ({ category, books, deleteBook, onFinishUpdate, onFinishPositionBookLike, onClickLike, onFinishBookMoveCategory }) => {
  if (books) {
    console.log(books);
    const likebooks = books.filter((book) => book.mybook_info.writelike === true);
    likebooks.sort(function (a, b) {
      return a.mybook_info.seq_in_writelike < b.mybook_info.seq_in_writelike ? -1 : a.mybook_info.seq_in_writelike > b.mybook_info.seq_in_writelike ? 1 : 0;
    });
    const lastSeq = likebooks.length;

    var list = likebooks.map((book) => {
      const categoryNameFilter = category.filter((item) => {
        return item._id === book.mybook_info.mybookcate_id;
      });
      const categoryName = categoryNameFilter[0].mybookcate_info.name;
      return (
        <Fragment key={book._id}>
          <LikeListItem
            lastSeq={lastSeq}
            categoryName={categoryName}
            book={book}
            deleteBook={deleteBook}
            onFinishUpdate={onFinishUpdate}
            onFinishPositionBookLike={onFinishPositionBookLike}
            onClickLike={onClickLike}
            category={category}
            onFinishBookMoveCategory={onFinishBookMoveCategory}
          />
        </Fragment>
      );
    });
  }
  return <>{list}</>;
};

const LikeListItem = ({
  category,
  categoryName,
  book,
  deleteBook,
  onFinishUpdate,
  onFinishPositionBookLike,
  onClickLike,
  lastSeq,
  onFinishBookMoveCategory,
}) => {
  const [updatenewInput, setupdateNewInput] = useState(false);
  const updateNameText = <span style={{ fontSize: '11px' }}>변경할 이름을 입력해 주세요.</span>;
  const updatecontent = (id, hide_or_show) => (
    <Form
      layout={'inline'}
      size="small"
      initialValues={{
        id: id,
        hide_or_show: hide_or_show,
      }}
      onFinish={onFinishUpdate}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={['title']} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={['id']} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={id} />
        </Form.Item>
        <Form.Item name={['hide_or_show']} hidden={true} rules={[{ required: true }]}>
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
  const hide_or_show = (title, id, status) => {
    const values = { title: title, id: id, hide_or_show: status };
    onFinishUpdate(values);
  };

  function handleChange(value) {
    console.log(`selected ${value}`);

    onFinishBookMoveCategory(book._id, value);
  }

  return (
    <>
      <ul
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          listStyle: 'none',
        }}
      >
        <li>{categoryName}</li>
        <li>{book.mybook_info.title}</li>
        <li>책정보 블라블라</li>
        <li>
          {book.mybook_info.seq_in_writelike === 0 && lastSeq - 1 === 0 && (
            <>
              <button disabled>up</button>
              <button disabled>down</button>
            </>
          )}
          {book.mybook_info.seq_in_writelike === 0 && lastSeq - 1 !== 0 && (
            <>
              <button disabled>up</button>
              <button onClick={() => onFinishPositionBookLike('down', book._id)}>down</button>
            </>
          )}
          {book.mybook_info.seq_in_writelike === lastSeq - 1 && lastSeq - 1 !== 0 && (
            <>
              <button onClick={() => onFinishPositionBookLike('up', book._id)}>up</button>
              <button disabled>down</button>
            </>
          )}
          {book.mybook_info.seq_in_writelike !== lastSeq - 1 && book.mybook_info.seq_in_writelike !== 0 && (
            <>
              <button onClick={() => onFinishPositionBookLike('up', book._id)}>up</button>
              <button onClick={() => onFinishPositionBookLike('down', book._id)}>down</button>
            </>
          )}
        </li>
        <li>
          {book.mybook_info.writelike === true && <button onClick={() => onClickLike(book._id, false)}>해제</button>}
          {book.mybook_info.writelike === false && <button onClick={() => onClickLike(book._id, true)}>좋아요</button>}
        </li>
        <li>
          {book.mybook_info.hide_or_show === 'show' && <button onClick={() => hide_or_show(book.mybook_info.title, book._id, 'hide')}>숨기기</button>}
          {book.mybook_info.hide_or_show === 'hide' && <button onClick={() => hide_or_show(book.mybook_info.title, book._id, 'show')}>해제</button>}
        </li>
        <li>
          <Select defaultValue="info" style={{ width: 120 }} onChange={handleChange}>
            <Option value="info">선택</Option>
            {category &&
              category.map((category) => (
                <Option key={category._id} value={category._id}>
                  {category.mybookcate_info.name}
                </Option>
              ))}
          </Select>
        </li>
        <li>
          <button onClick={() => deleteBook(book._id)}>삭제</button>
        </li>
        <li>
          <button onClick={() => router.push(`/books/study/setting/${book._id}`)}>설정</button>
        </li>
      </ul>
    </>
  );
};

const StudyMain = () => {
  return (
    <Layout>
      <BoomListMain />
      <Footer />
    </Layout>
  );
};

export default StudyMain;
