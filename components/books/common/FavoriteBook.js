import React, { useState, memo, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { CHANGE_STUDY_LIKE } from "../../../graphql/query/studyPage";
import { CHANGE_WRITE_LIKE } from "../../../graphql/query/writePage";

import { Tooltip } from "antd";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { MUTATION_SET_MY_BOOK_LIKE } from "../../../graphql/mutation/myBook";

const FavoriteBook = ({ record, changeFoldedMenu, tableType }) => {
  const { _id, isWriteLike, isStudyLike, studyLikeLength, writeLikeLength } =
    record;

  const router = useRouter();
  const [changeLike] = useMutation(MUTATION_SET_MY_BOOK_LIKE, {
    onCompleted: (received_data) => {
      if (received_data.mybook_setLike.status === "200") {
        changeFoldedMenu("");
        console.log("책 즐겨찾기 설정 후 받은 데이터", received_data);
      } else if (received_data.mybook_setLike.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });
  async function updateBook(_boolean, seq) {
    try {
      await changeLike({
        variables: {
          forSetLike: {
            mybook_id: _id,
            likeType: tableType === "study" ? "StudyLike" : "WriteLike",
            isLike: _boolean,
            seq: seq,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const like = useMemo(
    () => (tableType === "study" ? isStudyLike : isWriteLike),
    [tableType]
  );

  return (
    <>
      {like ? (
        <div
          className="customCircleButton"
          onClick={() => {
            updateBook(false, null);
          }}
        >
          <StarFilled className="writeLiked" />
        </div>
      ) : (
        <div
          className="customCircleButton"
          onClick={() => {
            console.log({ studyLikeLength });
            updateBook(
              true,
              tableType === "study" ? studyLikeLength : writeLikeLength
            );
          }}
        >
          <StarOutlined className="writeUnliked" />
        </div>
      )}
    </>
  );
};

export default memo(FavoriteBook);
