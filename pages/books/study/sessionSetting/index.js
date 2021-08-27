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
      // variables 변경 감지하려면 component가 re-render되어야 한다.
      //  useRef로 variables의 값으로 됐을 때 useRef가 업데이트되어도 component가 재랜더링되지 않기 때문에
      //  apollo에서는 variables의 값이 변경됨을 감지할 기회가 없다(재랜더링 되지 않기 때문)
      //  하지만 아래 setCardList(state값)가 변경되어 재랜더링 될 때
      //  useQuery에서 variables 값이 변경됨을 감지하고 refetch를 수행한다.
      //  onCompleted에서  any state를 변경해야 refetch수행

      //  또는 useQuery의 updateQuery 를 메서드를 사용하여 refetch를 수행할 수도 있을 것 같으나
      //  다음 기회에 연구
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
