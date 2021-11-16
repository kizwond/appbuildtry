import React, { memo } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

import { Tooltip } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { MUTATION_SET_MY_BOOK_HIDE_OR_SHOW } from "../../../graphql/mutation/myBook";

const HideOrShowButton = ({ record }) => {
  const { _id, hideOrShow } = record;
  const isShowed = hideOrShow === "show";

  const router = useRouter();
  const [updateBookTitle, { variables }] = useMutation(MUTATION_SET_MY_BOOK_HIDE_OR_SHOW, {
    onCompleted: (received_data) => {
      console.log("책 수정함", received_data);
      if (received_data.mybook_setHideOrShow.status === "200") {
      } else if (received_data.mybook_setHideOrShow.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });
  async function updateBook(hide) {
    console.log({ hide });
    try {
      await updateBookTitle({
        variables: {
          mybook_id: _id,
          hideOrShow: hide,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(variables);
    }
  }

  return (
    <>
      {isShowed ? (
        <Tooltip mouseEnterDelay={0.3} mouseLeaveDelay={0} title="숨기기" overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }} overlayStyle={{ alignSelf: "middle" }}>
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
              updateBook("hide");
            }}
          >
            <EyeOutlined />
          </div>
        </Tooltip>
      ) : (
        <Tooltip mouseEnterDelay={0.3} mouseLeaveDelay={0} title="표시하기" overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }} overlayStyle={{ alignSelf: "middle" }}>
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
              updateBook("show");
            }}
          >
            <EyeInvisibleOutlined />
          </div>
        </Tooltip>
      )}
    </>
  );
};

export default memo(HideOrShowButton);
