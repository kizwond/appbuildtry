import { useMutation } from "@apollo/client";
import { memo } from "react";
import { useRouter } from "next/router";
import { MUTATION_CHANGE_BOOK_ORDER } from "../../../../graphql/mutation/myBook";

import { Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const FavoriteBookOrderButton = ({ _record, tableType, changeFoldedMenu }) => {
  const router = useRouter();
  let timer;
  const [rePosition, { loading }] = useMutation(MUTATION_CHANGE_BOOK_ORDER, {
    onCompleted: (received_data) => {
      if (received_data.mybook_modifySeq.status === "200") {
        console.log("즐겨찾기 책순서 변경후 받은 데이터", received_data);
        clearTimeout(timer);
        timer = setTimeout(() => {
          changeFoldedMenu("");
        }, 200);
      } else if (received_data.mybook_modifySeq.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  async function positionBooks(forModifySeq) {
    try {
      await rePosition({
        variables: {
          forModifySeq: forModifySeq,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Space size={2}>
      {_record.isFirstBook ? (
        <div
          className="FirstBookCustom"
          style={{
            width: "34px",
            height: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowUpOutlined />
        </div>
      ) : (
        <div
          className="customCircleButton"
          onClick={() => {
            const forModifySeq = [
              {
                mybook_id: _record.aboveAndBelowBooks.aboveBook.mybook_id,
                seqType: tableType === "study" ? "StudyLike" : "WriteLike",
                seq:
                  tableType === "study"
                    ? _record.seqInStudyLike
                    : _record.seqInWriteLike,
              },
              {
                mybook_id: _record._id,
                seqType: tableType === "study" ? "StudyLike" : "WriteLike",
                seq:
                  tableType === "study"
                    ? _record.aboveAndBelowBooks.aboveBook.seqInStudyLike
                    : _record.aboveAndBelowBooks.aboveBook.seqInWriteLike,
              },
            ];
            positionBooks(forModifySeq);
          }}
        >
          <ArrowUpOutlined />
        </div>
      )}
      {_record.isLastBook ? (
        <div
          className="LastBookCustom"
          style={{
            width: "34px",
            height: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ArrowDownOutlined />
        </div>
      ) : (
        <div
          className="customCircleButton"
          onClick={() => {
            const forModifySeq = [
              {
                mybook_id: _record.aboveAndBelowBooks.belowBook.mybook_id,
                seqType: tableType === "study" ? "StudyLike" : "WriteLike",
                seq:
                  tableType === "study"
                    ? _record.seqInStudyLike
                    : _record.seqInWriteLike,
              },
              {
                mybook_id: _record._id,
                seqType: tableType === "study" ? "StudyLike" : "WriteLike",
                seq:
                  tableType === "study"
                    ? _record.aboveAndBelowBooks.belowBook.seqInStudyLike
                    : _record.aboveAndBelowBooks.belowBook.seqInWriteLike,
              },
            ];
            positionBooks(forModifySeq);
          }}
        >
          <ArrowDownOutlined />
        </div>
      )}
    </Space>
  );
};

export default memo(FavoriteBookOrderButton);
