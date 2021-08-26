import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  BOOK_CHANGE_CATEGORY_MUTATION,
  GET_My_BOOK_CATEGORY_AND_MY_BOOK_CATEGORIES,
} from '../../../graphql/query/studyCategory';
import { Select, Button } from 'antd';
import { BookChangeCategoryMutation } from '../../../graphql/query/writemain';
import produce from 'immer';

const CategorySetting = ({ book_id }) => {
  const [categories, setCategories] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { loading, error, data } = useQuery(
    GET_My_BOOK_CATEGORY_AND_MY_BOOK_CATEGORIES,
    {
      variables: { mybook_id: book_id },
      onCompleted: (data) => {
        const newData = produce(data, (draft) => {
          draft.mybookcate_get.mybookcates.map((_item) => {
            delete _item.__typename;
            delete _item.mybookcate_info.__typename;
            // return _item;
          });
          draft.mybook_getbyid.mybooks.map((_item) => {
            delete _item.__typename;
            delete _item.mybook_info.__typename;
            // return _item;
            console.log('동작');
          });
        });
        setCategories(newData.mybookcate_get.mybookcates);
        setSelectedCategory(
          newData.mybook_getbyid.mybooks[0].mybook_info.mybookcate_id
        );
        // console.log('카테고리 정보 불러옴', newData);
      },
    }
  );
  const [mybook_movetoothercate] = useMutation(BOOK_CHANGE_CATEGORY_MUTATION, {
    onCompleted: showdatarebookmovecategory,
  });

  function showdatarebookmovecategory(data) {
    console.log('data', data);
    if (data.mybook_movetoothercate.msg !== '카테고리 이동 성공적!') {
      alert('서버 오류 발생 하였습니다');
    }
    // setBooks(data.mybook_movetoothercate.mybooks);
  }

  async function bookMoveCategory() {
    try {
      await mybook_movetoothercate({
        variables: {
          mybook_id: book_id,
          target_mybookcate_id: selectedCategory,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    // <div>ㅎㅇ</div>
    <>
      <Select
        value={selectedCategory}
        style={{ width: 120 }}
        onChange={(v) => setSelectedCategory(v)}
      >
        <Select.Option value="info">선택</Select.Option>
        {categories &&
          categories.map((category) => (
            <Select.Option key={category._id}>
              {category.mybookcate_info.name}
            </Select.Option>
          ))}
      </Select>
      <Button onClick={bookMoveCategory}>변경하기</Button>
    </>
  );
};

export default CategorySetting;
