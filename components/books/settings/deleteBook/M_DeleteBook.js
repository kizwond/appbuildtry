import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Alert, message } from "antd";
import { MUTATION_DELETE_MY_BOOK } from "../../../../graphql/mutation/myBook";
import { useRouter } from "next/router";
import {
  QUERY_USER_BOOKS_BY_BOOK_IDS,
  QUERY_USER_BOOKS,
} from "../../../../graphql/query/allQuery";

const DeleteBook = ({ book_id }) => {
  const { push, back } = useRouter();

  const [mybook_delete] = useMutation(MUTATION_DELETE_MY_BOOK, {
    onCompleted: async (_data) => {
      if (_data.mybook_deleteMybook.status === "200") {
        console.log("책 삭제 후 받은 데이터", _data);
        await message.success("책이 삭제되었습니다.", 0.7);
        back();
      } else if (_data.mybook_deleteMybook.status === "401") {
        push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  async function deleteBook() {
    try {
      await mybook_delete({
        variables: {
          mybook_id: book_id,
        },
        update(cache, { data }) {
          const bookData = cache.readQuery({
            query: QUERY_USER_BOOKS,
          });
          const bookData2 = cache.readQuery({
            query: QUERY_USER_BOOKS_BY_BOOK_IDS,
            variables: {
              mybook_ids: [book_id],
            },
          });
          cache.writeQuery({
            query: QUERY_USER_BOOKS,
            data: {
              ...bookData,
              mybook_getMybookByUserID: {
                ...bookData.mybook_getMybookByUserID,
                mybooks: bookData.mybook_getMybookByUserID.mybooks.filter(
                  (book) => book._id !== book_id
                ),
              },
            },
          });
          cache.writeQuery({
            query: QUERY_USER_BOOKS_BY_BOOK_IDS,
            variables: {
              mybook_ids: [book_id],
            },
            data: {
              ...bookData2,
              mybook_getMybookByMybookIDs: {
                ...bookData2.mybook_getMybookByMybookIDs,
                mybooks: null,
              },
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Alert
      message={
        // data &&
        <>
          <div>
            <b>
              {/* {data && data.mybook_getbyMybookid.mybooks[0].mybook_info.title} */}
            </b>
            을 삭제하시겠습니까?
          </div>
          <div>삭제시, 영구 삭제되오니 신중히 결정하세요</div>
        </>
      }
      description={
        <i>
          ※ 구매한 책의 경우, My Page - 구매 목록에서 원본 책을 불러 올 수
          있습니다. (본인이 추가한 카드는 복원할 수 없습니다.)
        </i>
      }
      action={<Button onClick={deleteBook}>삭제</Button>}
      type="error"
    />
  );
};

export default DeleteBook;
