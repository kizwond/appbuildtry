import { memo } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { CHANGE_POSITION_OF_BOOK } from "../../../graphql/query/writePage";
import { GET_CATEGORY_AND_BOOKS_INFO_STUDY } from "../../../graphql/query/studyPage";

import { Space, Tooltip } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

const BookOrderButton = ({ _record, handleToGetMyBook }) => {
  const router = useRouter();
  const [rePosition] = useMutation(CHANGE_POSITION_OF_BOOK, {
    onCompleted: (received_data) => {
      console.log("received_data", received_data);
      if (received_data.mybook_changeorder.status === "200") {
        // handleToGetMyBook(received_data.mybook_changeorder.mybooks);
      } else if (received_data.mybook_changeorder.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  async function positionBooks(direction, id) {
    try {
      await rePosition({
        variables: {
          direction: direction,
          mybook_id: id,
        },
        update: (cache, data) => {
          const queryData = cache.readQuery({ query: GET_CATEGORY_AND_BOOKS_INFO_STUDY });
          console.log(queryData);
          const selectedBook = queryData.mybook_getAllMybook.mybooks.find((book) => book._id === id);
          const swichedBook = queryData.mybook_getAllMybook.mybooks.find((book) => book._id === id);
          // cache.writeQuery({
          //   query: GET_CATEGORY_AND_BOOKS_INFO_STUDY,
          //   data: 1,
          // });
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Space size={2}>
      {_record.isFirstBook ? (
        <Tooltip mouseEnterDelay={0.5} mouseLeaveDelay={0} color="#4d4d4d" title="첫번째 책" overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }} overlayStyle={{ alignSelf: "middle" }}>
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
        </Tooltip>
      ) : (
        <Tooltip mouseEnterDelay={0.3} mouseLeaveDelay={0} title="위로 이동" overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }} overlayStyle={{ alignSelf: "middle" }}>
          <div
            className="customCircleButton"
            style={{
              width: "34px",
              height: "24px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("위로", { _record });

              positionBooks("up", _record._id);
            }}
          >
            <ArrowUpOutlined />
          </div>
        </Tooltip>
      )}
      {_record.isLastBook ? (
        <Tooltip mouseEnterDelay={0.5} mouseLeaveDelay={0} color="#4d4d4d" title="마지막 책" overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }} overlayStyle={{ alignSelf: "middle" }}>
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
        </Tooltip>
      ) : (
        <Tooltip mouseEnterDelay={0.3} mouseLeaveDelay={0} title="아래로 이동" overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }} overlayStyle={{ alignSelf: "middle" }}>
          <div
            className="customCircleButton"
            style={{
              width: "34px",
              height: "24px",
              borderRadius: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              console.log("아래로", { _record });
              positionBooks("down", _record._id);
            }}
          >
            <ArrowDownOutlined />
          </div>
        </Tooltip>
      )}
    </Space>
  );
};

export default memo(BookOrderButton);
