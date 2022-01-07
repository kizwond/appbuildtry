import React, { memo, useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { MUTATION_REASSIGN_MY_BOOK_TO_ANOTHER_CATEGORY } from "../../../../graphql/mutation/myBook";

import { Select, Button, Alert, Space, message, Input } from "antd";
import { QUERY_USER_BOOKS } from "../../../../graphql/query/allQuery";
import _ from "lodash";
import { useRouter } from "next/router";

const M_ChangeBookTitle = ({ book_id, categories, bookTitle, cateIdNow }) => {
  const { push } = useRouter();
  const [newBookTitle, setNewBookTitle] = useState(null);

  useEffect(() => {
    setNewBookTitle(cateIdNow);
  }, [cateIdNow]);

  const { data } = useQuery(QUERY_USER_BOOKS, {
    onCompleted: (_data) => {
      if (_data.mybook_getMybookByUserID.status === "200") {
        console.log("모든 책 정보 받음", _data);
      } else if (_data.mybook_getMybookByUserID.status === "401") {
        push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const [mybook_movetoothercate] = useMutation(
    MUTATION_REASSIGN_MY_BOOK_TO_ANOTHER_CATEGORY,
    {
      onCompleted: showdatarebookmovecategory,
    }
  );

  async function showdatarebookmovecategory(_data) {
    if (_data.mybook_moveToOtherCate.status === "200") {
      console.log("책 카테고리 변경", _data);

      await message.success(
        `선택하신 ${
          _.find(categories, (cate) => cate._id === newBookTitle).name
        }카테고리로 ${bookTitle}책이 이동되었습니다.`,
        0.7
      );
    } else if (_data.mybook_moveToOtherCate.status === "401") {
      push("/m/account/login");
    } else {
      console.log("어떤 문제가 발생함");
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
          <b>{bookTitle}</b> 책의 이름을 변경하시려면 아래에 입력하시고 확인
          버튼을 누르세요.
        </>
      }
      description={
        <>
          <Space align="center">
            <Input
              onChange={setNewBookTitle}
              placeholder="변경하려는 이름을 입력하세요"
            />

            <Button
              onClick={() => {
                // if (newBookTitle !== cateIdNow) {
                //   bookMoveCategory({
                //     seq:
                //       _(data.mybook_getMybookByUserID.mybooks)
                //         .filter(
                //           (book) =>
                //             book.mybook_info.mybookcate_id === newBookTitle
                //         )
                //         .map((book) => book.mybook_info.seqInCategory)
                //         .max() + 1 || 0,
                //     mybook_id: book_id,
                //     newMybookcate_id: newBookTitle,
                //   });
                // }
              }}
            >
              변경
            </Button>
          </Space>
        </>
      }
      type="info"
    />
  );
};

export default memo(M_ChangeBookTitle);
