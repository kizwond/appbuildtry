import React from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Select, Button, Alert, Space } from "antd";
import { MUTATION_DELETE_MY_BOOK } from "../../../graphql/mutation/myBook";
import { useRouter } from "next/router";

const DeleteBook = ({ book_id }) => {
  const { push } = useRouter();
  // const { data, error, loading } = useQuery(GET_SELECTED_BOOK_INFO_FOR_DELETE, {
  //   variables: { mybook_id: book_id },
  //   onCompleted: (_data) => {
  //     console.log("책정보 불러옴", _data);
  //   },
  // });

  const [mybook_delete] = useMutation(MUTATION_DELETE_MY_BOOK, {
    onCompleted: (_data) => {
      if (_data.mybook_deleteMybook.status === "200") {
        console.log("책 삭제 후 받은 데이터", _data);
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
