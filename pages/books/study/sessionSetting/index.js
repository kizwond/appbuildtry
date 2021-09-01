import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID } from '../../../../graphql/query/studySessionSetting';
import Layout from '../../../../components/layout/Layout';
import Footer from '../../../../components/index/Footer';
import IndexTree from '../../../../components/books/study/sessionnSetting/IndexTree';
import { Tabs } from 'antd';

const SessionSetting = () => {
  const [cardsList, setCardsList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const counter = useRef(0);
  const [bookList, setBookList] = useState([]);
  const [responsiveUI, setResponsiveUI] = useState(false);

  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem('books_selected'));
    console.log('북아이디리스트 설정 - 유즈 이펙트');

    const book_list = booklist.map((book, index) => ({
      book_id: book.book_id,
      book_title: book.book_title,
      seq: index,
    }));
    setBookList(book_list);
  }, []);

  const { loading, error, data, variables } = useQuery(
    GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
    {
      variables: {
        mybook_id: bookList[counter.current]?.book_id,
      },
      onCompleted: (received_data) => {
        console.log('통신완료 후 onCompleted 코드 시작');
        if (counter.current < bookList.length - 1) {
          console.log('카운터설정');
          counter.current += 1;
        }

        // const bookIndexIdsList =
        //   received_data.session_getNumCardsbyIndex.indexsets[0].indexes.map(
        //     (item) => item._id
        //   );
        // setCheckedKeys({
        //   ...checkedKeys,
        //   [received_data.session_getNumCardsbyIndex.indexsets[0].indexset_info
        //     .mybook_id]: bookIndexIdsList,
        // });

        console.log('카테고리설정');
        setCardsList([...cardsList, received_data]);
        console.log(received_data);
        console.log('통신완료 후 onCopleted 코드 종료');
      },
    }
  );

  useEffect(() => {
    if (data?.session_getNumCardsbyIndex?.indexsets[0]) {
      const bookIndexIdsList =
        data.session_getNumCardsbyIndex.indexsets[0].indexes.map(
          (item) => item._id
        );
      setCheckedKeys({
        ...checkedKeys,
        [data.session_getNumCardsbyIndex.indexsets[0].indexset_info.mybook_id]:
          bookIndexIdsList,
      });
    }
  }, [data]);

  if (error) {
    console.log('에러', error);
    console.log(variables);
    return <div>에러발생</div>;
  }

  console.log(cardsList);

  const onCheckIndexesCheckedKeys = (
    checkedKeysValueOfBook,
    selectedBookId
  ) => {
    setCheckedKeys({
      ...checkedKeys,
      [selectedBookId]: checkedKeysValueOfBook,
    });
  };

  return (
    <Layout>
      <Tabs type="card" tabPosition={responsiveUI ? 'top' : 'left'}>
        {bookList.map((book, index) => (
          <Tabs.TabPane tab={book.book_title} key={book.book_id}>
            {cardsList[0] && (
              <IndexTree
                bookIndexInfo={
                  cardsList[index]?.session_getNumCardsbyIndex?.indexsets[0]
                    ?.indexes
                }
                checkedKeys={checkedKeys[book.book_id]}
                selectedbookId={book.book_id}
                onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>

      {/* {cardsList[0] && (
        <IndexTree
          bookIndexInfo={
            cardsList[selectedBook.seq]?.session_getNumCardsbyIndex
              ?.indexsets[0]?.indexes
          }
          checkedKeys={checkedKeys[selectedBook.book_id]}
          selectedbookId={selectedBook.boo_id}
          onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
        />
      )} */}

      <button onClick={() => console.log(checkedKeys)}>
        체크된 아이디 확인
      </button>
      <button onClick={() => setResponsiveUI(!responsiveUI)}>반응형</button>
    </Layout>
  );
};
export default SessionSetting;
