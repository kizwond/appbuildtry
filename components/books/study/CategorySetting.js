import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  BOOK_CHANGE_CATEGORY_MUTATION,
  GET_My_BOOK_CATEGORY_AND_MY_BOOK_CATEGORIES,
} from '../../../graphql/query/studyCategory';
import { Select, Button, Alert, Space } from 'antd';

const CategorySetting = ({ book_id }) => {
  const [categories, setCategories] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const { loading, error, data } = useQuery(
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
  const [mybook_movetoothercate] = useMutation(BOOK_CHANGE_CATEGORY_MUTATION, {
    onCompleted: showdatarebookmovecategory,
  });

  function showdatarebookmovecategory(_data) {
    console.log('use mutation', _data);
    if (_data.mybook_movetoothercate.msg !== '카테고리 이동 성공적!') {
      alert('서버 오류 발생 하였습니다');
    }
    console.log('usequery', data);
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
    <Alert
      message={
        data && (
          <>
            <b>
              {data && data.mybook_getbyMybookid.mybooks[0].mybook_info.title}
            </b>
            이 이동할 카테고리를 선택하십시오.
          </>
        )
      }
      description={
        <>
          <div style={{ marginBottom: '15px' }}>
            <i>※ 책은 이동할 카테고리 내 책 목록 중 제일 위에 표시됩니다.</i>
          </div>
          <Space align="center">
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
            <span>카테고리로</span>
            <Button onClick={bookMoveCategory}>이동</Button>
          </Space>
        </>
      }
      type="info"
    />
  );
};

export default CategorySetting;
