import React, { memo } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { UPDATE_BOOK_HIDE } from "../../../graphql/query/writePage";

import { Tooltip } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const HideOrShowButton = ({ record }) => {
  const { title, _id, hide_or_show } = record;
  const isShowed = hide_or_show === "show";

  const router = useRouter();
  const [updateBookTitle, { variables }] = useMutation(UPDATE_BOOK_HIDE, {
    onCompleted: (received_data) => {
      console.log("책 수정함", received_data);
      if (received_data.mybook_update.status === "200") {
      } else if (received_data.mybook_update.status === "401") {
        router.push("/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });
  async function updateBook(hide) {
    try {
      await updateBookTitle({
        variables: {
          mybook_id: _id,
          title,
          hide_or_show: hide,
        },
        update: (cache, { data: { mybook_update } }) => {
          cache.writeFragment({
            id: `Mybook:${_id}`,
            fragment: gql`
              fragment MyBook on Mybook {
                mybook_info {
                  hide_or_show
                }
              }
            `,
            data: {
              mybook_info: { hide_or_show: hide, __typename: "Mybook_info" },
            },
          });
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
