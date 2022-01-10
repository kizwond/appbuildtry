import React, { memo, useState } from "react";
import { useMutation } from "@apollo/client";
import {
  MUTATION_CHANGE_MY_BOOK_TITLE,
  MUTATION_REASSIGN_MY_BOOK_TO_ANOTHER_CATEGORY,
} from "../../../../graphql/mutation/myBook";

import { Button, Alert, Space, message, Input } from "antd";
import { useRouter } from "next/router";

const M_ChangeBookTitle = ({ book_id, bookTitle }) => {
  const { push } = useRouter();
  const [newBookTitle, setNewBookTitle] = useState(null);

  const [mybook_updateMybookInfo] = useMutation(MUTATION_CHANGE_MY_BOOK_TITLE, {
    onCompleted: showSuccessMessage,
  });

  async function showSuccessMessage(_data) {
    if (_data.mybook_updateMybookInfo.status === "200") {
      console.log("책 이름 변경 성공", _data);

      await message.success(` ${newBookTitle}로 제목이 변경되었습니다.`, 0.7);
    } else if (_data.mybook_updateMybookInfo.status === "401") {
      push("/m/account/login");
    } else {
      console.log("어떤 문제가 발생함");
    }
  }

  async function changeBookTitle({ mybook_id, title }) {
    try {
      await mybook_updateMybookInfo({
        variables: {
          mybook_id,
          title,
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
              onChange={(e) => setNewBookTitle(e.target.value)}
              placeholder="변경하려는 이름을 입력하세요"
            />

            <Button
              onClick={() => {
                if (newBookTitle) {
                  changeBookTitle({ mybook_id: book_id, title: newBookTitle });
                }
              }}
              disabled={bookTitle === newBookTitle || !newBookTitle}
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
