import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { BOOK_CHANGE_CATEGORY_MUTATION } from "../../../../graphql/query/studyCategory";
import { MUTATION_REASSIGN_MY_BOOK_TO_ANOTHER_CATEGORY } from "../../../../graphql/mutation/myBook";

import { Select, Button, Alert, Space } from "antd";
import { GET_USER_ALL_MY_BOOKS } from "../../../../graphql/query/allQuery";
import _ from "lodash";

const ReAssignBookToAnotherCategory = ({
  book_id,
  categories,
  bookTitle,
  cateIdNow,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setSelectedCategory(cateIdNow);
  }, [cateIdNow]);

  const { data } = useQuery(GET_USER_ALL_MY_BOOKS, {
    onCompleted: (d) => console.log(d),
  });

  const [mybook_movetoothercate] = useMutation(
    MUTATION_REASSIGN_MY_BOOK_TO_ANOTHER_CATEGORY,
    {
      onCompleted: showdatarebookmovecategory,
    }
  );

  function showdatarebookmovecategory(_data) {
    console.log("use mutation", _data);
    if (_data.mybook_moveToOtherCate.status !== "200") {
      alert("서버 오류 발생 하였습니다");
    }
  }

  console.log(
    _(data?.mybook_getMybookByUserID?.mybooks)
      .filter((book) => book.mybook_info.mybookcate_id === selectedCategory)
      .map((book) => book.mybook_info.seqInCategory)
      .max()
  );
  // console.log(data);
  console.log(selectedCategory);
  console.log(cateIdNow);

  async function bookMoveCategory() {
    if (selectedCategory !== cateIdNow) {
      try {
        await mybook_movetoothercate({
          variables: {
            forMoveToOtherCate: {
              mybook_id: book_id,
              newMybookcate_id: selectedCategory,
              seq:
                _(data?.mybook_getMybookByUserID?.mybooks)
                  .filter(
                    (book) =>
                      book.mybook_info.mybookcate_id === selectedCategory
                  )
                  .map((book) => book.mybook_info.seqInCategory)
                  .max() + 1 || 1,
            },
          },
        });
      } catch (error) {
        console.log(error);
      }
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
          <div style={{ marginBottom: "15px" }}>
            <i>※ 책은 이동할 카테고리 내 책 목록 중 제일 위에 표시됩니다.</i>
          </div>
          <Space align="center">
            <Select
              value={selectedCategory}
              style={{ width: 120 }}
              onChange={setSelectedCategory}
              placeholder="카테고리를 선택해 주세요."
            >
              {categories.map((category) => (
                <Select.Option key={category._id}>
                  {category.name}
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

export default ReAssignBookToAnotherCategory;
