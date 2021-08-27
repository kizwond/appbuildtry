import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID } from '../../../../graphql/query/studySessionSetting';
import Layout from '../../../../components/layout/Layout';
import Footer from '../../../../components/index/Footer';

const SessionSetting = () => {
  const [cardsList, setCardsList] = useState([]);
  const counter = useRef(0);
  const bookIdsList = useRef([]);
  const [indexesList, setIndexesList] = useState([]);
  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem('books_selected'));
    console.log('북아이디리스트 설정 - 유즈 이펙트');
    bookIdsList.current = booklist.map((book) => book.book_id);
  }, [bookIdsList]);

  const { loading, error, data, variables } = useQuery(
    GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
    {
      variables: { mybook_id: bookIdsList.current[counter.current] },
      onCompleted: (received_data) => {
        console.log('통신완료 후 onCompleted 코드 시작');
        if (counter.current < bookIdsList.current.length - 1) {
          console.log('카운터설정');
          counter.current += 1;
        }

        console.log('카테고리설정');
        setCardsList([...cardsList, received_data]);
        console.log(received_data);
        console.log('통신완료 후 onCopleted 코드 종료');
      },
    }
  );

  if (error) {
    console.log('에러', error);
    console.log(variables);
    return <div>에러발생</div>;
  }

  console.log(bookIdsList.current[counter.current]);
  console.log(cardsList);
  return (
    <Layout>
      <div>
        {'책아이디 아이디 : ' + bookIdsList.current[counter.current]}
        {/* {cardsList.length > 0
          ? cardsList[0].session_getNumCardsbyIndex?.indexsets[0]?.indexset_info
              .mybook_id
          : null} */}
      </div>
      <div
        style={{
          marginLeft: '30px',
          marginRight: '30px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {JSON.stringify(cardsList)}
      </div>
      <Footer />
    </Layout>
  );
};
export default SessionSetting;
