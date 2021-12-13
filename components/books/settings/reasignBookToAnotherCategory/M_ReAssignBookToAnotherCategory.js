import React, { memo, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { BOOK_CHANGE_CATEGORY_MUTATION } from '../../../../graphql/query/studyCategory';
import { MUTATION_REASSIGN_MY_BOOK_TO_ANOTHER_CATEGORY } from '../../../../graphql/mutation/myBook';

import { Select, Button, Alert, Space, message } from 'antd';
import { GET_USER_ALL_MY_BOOKS } from '../../../../graphql/query/allQuery';
import _ from 'lodash';
import { useRouter } from 'next/router';

const M_ReAssignBookToAnotherCategory = ({ book_id, categories, bookTitle, cateIdNow }) => {
  const { push } = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setSelectedCategory(cateIdNow);
  }, [cateIdNow]);

  const { data } = useQuery(GET_USER_ALL_MY_BOOKS, {
    onCompleted: (_data) => {
      if (_data.mybook_getMybookByUserID.status === '200') {
        console.log('모든 책 정보 받음', _data);
      } else if (_data.mybook_getMybookByUserID.status === '401') {
        push('/m/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });

  const [mybook_movetoothercate] = useMutation(MUTATION_REASSIGN_MY_BOOK_TO_ANOTHER_CATEGORY, {
    onCompleted: showdatarebookmovecategory,
  });

  async function showdatarebookmovecategory(_data) {
    if (_data.mybook_moveToOtherCate.status === '200') {
      console.log('책 카테고리 변경', _data);
      await message.success('선택하신 카테고리로 책이 이동되었습니다. ', 0.7);
    } else if (_data.mybook_moveToOtherCate.status === '401') {
      push('/m/account/login');
    } else {
      console.log('어떤 문제가 발생함');
    }
  }

  async function bookMoveCategory({ mybook_id, newMybookcate_id, seq }) {
    try {
      await mybook_movetoothercate({
        variables: {
          forMoveToOtherCate: {
            mybook_id,
            newMybookcate_id,
            seq,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Alert
      message={
        <>
          <b>{bookTitle}</b>이 이동할 카테고리를 선택하십시오.
        </>
      }
      description={
        <>
          <div style={{ marginBottom: '15px' }}>
            <i>※ 책은 이동할 카테고리 내 책 목록 중 제일 위에 표시됩니다.</i>
          </div>
          <Space align="center">
            <Select value={selectedCategory} style={{ width: 120 }} onChange={setSelectedCategory} placeholder="카테고리를 선택해 주세요.">
              {categories.map((category) => (
                <Select.Option key={category._id}>{category.name}</Select.Option>
              ))}
            </Select>
            <span>카테고리로</span>
            <Button
              onClick={() => {
                if (selectedCategory !== cateIdNow) {
                  bookMoveCategory({
                    seq:
                      _(data.mybook_getMybookByUserID.mybooks)
                        .filter((book) => book.mybook_info.mybookcate_id === selectedCategory)
                        .map((book) => book.mybook_info.seqInCategory)
                        .max() + 1 || 0,
                    mybook_id: book_id,
                    newMybookcate_id: selectedCategory,
                  });
                }
              }}
            >
              이동
            </Button>
          </Space>
        </>
      }
      type="info"
    />
  );
};

export default memo(M_ReAssignBookToAnotherCategory);
