import { memo } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { MUTATION_CHANGE_BOOK_ORDER } from "../../../graphql/mutation/myBook";

import { Space } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const BookOrderButton = ({ record, changeFoldedMenu, isPc }) => {
  const router = useRouter();
  let timer;
  const [rePosition] = useMutation(MUTATION_CHANGE_BOOK_ORDER, {
    onCompleted: (received_data) => {
      if (received_data.mybook_modifySeq.status === "200") {
        console.log("책순서 변경 후 받은 데이터", received_data);
        clearTimeout(timer);
        timer = setTimeout(() => {
          changeFoldedMenu("");
        }, 300);
      } else if (received_data.mybook_modifySeq.status === "401") {
        router.push(isPc ? "/account/login" : "/m/account/login");
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
      {record.isFirstBook || record.hideOrShow === "hide" ? (
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
                mybook_id: record.aboveAndBelowBooks.aboveBook.mybook_id,
                seqType: "Category",
                seq: record.seqInCategory,
              },
              {
                mybook_id: record._id,
                seqType: "Category",
                seq: record.aboveAndBelowBooks.aboveBook.seqInCategory,
              },
            ];
            positionBooks(forModifySeq);
          }}
        >
          <ArrowUpOutlined />
        </div>
      )}
      {record.isLastBook || record.hideOrShow === "hide" ? (
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
                mybook_id: record.aboveAndBelowBooks.belowBook.mybook_id,
                seqType: "Category",
                seq: record.seqInCategory,
              },
              {
                mybook_id: record._id,
                seqType: "Category",
                seq: record.aboveAndBelowBooks.belowBook.seqInCategory,
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

export default memo(BookOrderButton);
