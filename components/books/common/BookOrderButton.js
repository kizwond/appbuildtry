import { memo } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { MUTATION_CHANGE_BOOK_ORDER } from "../../../graphql/mutation/myBook";

import { Space, Tooltip } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const BookOrderButton = ({ _record }) => {
  const router = useRouter();
  const [rePosition] = useMutation(MUTATION_CHANGE_BOOK_ORDER, {
    onCompleted: (received_data) => {
      if (received_data.mybook_modifySeq.status === "200") {
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
                seqType: "Category",
                seq: _record.seqInCategory,
              },
              {
                mybook_id: _record._id,
                seqType: "Category",
                seq: _record.aboveAndBelowBooks.aboveBook.seqInCategory,
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
                seqType: "Category",
                seq: _record.seqInCategory,
              },
              {
                mybook_id: _record._id,
                seqType: "Category",
                seq: _record.aboveAndBelowBooks.belowBook.seqInCategory,
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
