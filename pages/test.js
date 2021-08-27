import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';

const Test = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [counter, setCounter] = useState(1);
  const { loading, error, data, refetch } = useQuery(
    GET_My_BOOK_CATEGORY_AND_MY_BOOK_CATEGORIES,
    {
      variables: { mybook_id: book_id },
      onCompleted: (_data) => {
        setCategories(_data.mybookcate_get.mybookcates);
        setSelectedCategory(
          _data.mybook_getbyMybookid.mybooks[0].mybook_info.mybookcate_id
        );
        console.log('카테고리 정보 불러옴', _data);
      },
    }
  );

  useEffect(() => {
    setSelectedCategory(
      data.mybook_getbyMybookid.mybooks[0].mybook_info.mybookcate_id
    );
    setCounter((prev) => prev + 1);
  }, [data]);

  return <div>{data && selectedCategory}</div>;
};

export default Test;
