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
        <div
          className="customCircleButton"
          onClick={() => {
            updateBook("hide");
          }}
        >
          <EyeOutlined />
        </div>
      ) : (
        <div
          className="customCircleButton"
          onClick={() => {
            updateBook("show");
          }}
        >
          <EyeInvisibleOutlined />
        </div>
      )}
    </>
  );
};

export default memo(HideOrShowButton);
