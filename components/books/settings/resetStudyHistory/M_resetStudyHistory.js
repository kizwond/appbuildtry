import React from "react";
import { useMutation } from "@apollo/client";
import { Button, Alert, message, Popconfirm, Modal } from "antd";
import { MUTATION_RESET_MY_BOOK_STUDY_HISTORY } from "../../../../graphql/mutation/myBook";
import { useRouter } from "next/router";

const M_resetStudyHistory = ({ book_id, bookTitle }) => {
  const { push } = useRouter();
  const [visible, setVisible] = React.useState(false);

  const showPopconfirm = () => {
    setVisible(true);
  };
  const closePopconfirm = () => {
    setVisible(false);
  };
  const [resetMyBookStudyHistory] = useMutation(
    MUTATION_RESET_MY_BOOK_STUDY_HISTORY,
    {
      onCompleted: async (_data) => {
        if (_data.levelconfig_resetStudyResult.status === "200") {
          console.log("책 학습 이력 초기화 후 받은 데이터", _data);
          closePopconfirm();
          await message.success("학습 이력이 초기화 되었습니다.", 0.7);
        } else if (_data.levelconfig_resetStudyResult.status === "401") {
          push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  async function resetBook() {
    try {
      await resetMyBookStudyHistory({
        variables: {
          mybook_id: book_id,
        },
        update(cache, { data }) {
          cache.modify({
            id: cache.identify({
              __ref: `Mybook:${book_id}`,
              __typename: "Mybook",
            }),
            fields: {
              stats(manies) {
                return {
                  ...manies,
                  studyHistory: [],
                };
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
            <b>{bookTitle}</b>의 학습이력을 초기화 합니다.
          </div>
        </>
      }
      description={
        <i>
          ※ 그 동안의 학습 이력을 초기화 합니다. 카드별 학습 레벨이 모두 0으로
          설정되며, 그 동안의 학습 이력들도 모두 삭제됩니다.
        </i>
      }
      action={
        <>
          <Button onClick={showPopconfirm}>초기화 적용</Button>
          <Modal
            onOk={resetBook}
            visible={visible}
            onCancel={closePopconfirm}
            okText="초기화"
            cancelText="취소"
            mask={false}
          >
            <div>정말 초기화 하시겠습니까?</div>
          </Modal>
        </>
      }
      type="error"
    />
  );
};

export default M_resetStudyHistory;
