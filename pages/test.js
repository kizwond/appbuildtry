import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_My_BOOK_CATEGORY_AND_MY_BOOK_CATEGORIES } from '../graphql/query/studyCategory';

const Test = () => {
  const [selectedCategory, setSelectedCategory] = useState([]);
  const counter = useRef(0);
  const bookIdsList = useRef([]);
  const [indexesList, setIndexesList] = useState([]);

  const { loading, error, data, refetch } = useQuery(
    GET_My_BOOK_CATEGORY_AND_MY_BOOK_CATEGORIES,
    {
      variables: { mybook_id: bookIdsList.current[counter.current] },
      onCompleted: (received_data) => {
        console.log('통신완료 후 onCompleted 코드 시작');
        if (counter.current < bookIdsList.current.length - 1) {
          console.log('카운터설정');
          counter.current += 1;
        }

        console.log('카테고리설정');
        setTimeout(() => {
          console.log(counter.current);
          setSelectedCategory([
            ...selectedCategory,
            received_data.mybook_getbyMybookid.mybooks[0].mybook_info
              .mybookcate_id,
          ]);
        }, 1000);
        console.log('통신완료 후 onCopleted 코드 종료');
      },
    }
  );

  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem('books_selected'));
    bookIdsList.current = booklist.map((book) => book.book_id);
  }, [bookIdsList]);

  // console.log(counter.current);

  return (
    <div>
      {bookIdsList.current[counter.current]} 그리고 카테고리 아이디:{' '}
      {selectedCategory.length > 0 &&
        selectedCategory.map((i) => {
          console.log('랜더링', i);
          return i;
        })[0]}
    </div>
  );
};

export default Test;
