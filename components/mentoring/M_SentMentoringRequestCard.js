import { Card, Input } from "antd";
import Image from "next/image";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { MUTATION_UPDATE_MENTORING_REQUEST } from "../../graphql/mutation/mentoring";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const M_SentMentoringRequestCard = ({ mentor, declineMentoring }) => {
  const router = useRouter();

  const { comment, menteeUser_id, mentorName, mentorUser_id, mentorUsername, mybookTitle, mybook_id, reqDate } = mentor;
  const textAreaRef = useRef();
  const [textAreaDisabled, setTextAreaDisabled] = useState(true);
  const [textArearInputValue, setTextArearInputValue] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setTextArearInputValue(comment), [comment]);

  // 멘토링 수정 요청 api아직
  const [updateMentoringRequest] = useMutation(MUTATION_UPDATE_MENTORING_REQUEST, {
    onCompleted: (data) => {
      console.log("멘토링 요청 수정 후 받은 데이터", data);
      // if (data.mentoring_updateMentoringReq.status === "200") {
      // } else if (data.mentoring_updateMentoringReq.status === "401") {
      //   router.push("/m/account/login");
      // } else {
      //   console.log("어떤 문제가 발생함");
      // }
    },
  });

  async function updateRequest() {
    try {
      await updateMentoringRequest({
        variables: {
          forUpdateMentoringReq: {
            comment: textArearInputValue,
            menteeUser_id,
            mentorUser_id,
            mybook_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <StyledCard
      size="small"
      actions={[
        <div
          key="revise"
          onClick={() => {
            if (textAreaDisabled) {
              setTextAreaDisabled(false);
              console.log(textAreaRef);
              textAreaRef.current.focus({
                cursor: "end",
              });
            }
            if (!textAreaDisabled) {
              // 서버에 수정 요청 보내기 - 통신 완료시 textAreaDisabled 코드는 onCompleted에 작성
              if (comment !== textArearInputValue) {
                updateRequest();
              }
              setTextAreaDisabled(true);
            }
          }}
        >
          {textAreaDisabled ? "요청 수정" : "수정 완료"}
        </div>,
        <div
          key="cancel"
          onClick={() => {
            if (textAreaDisabled) {
              declineMentoring({ menteeUser_id, mentorUser_id, mybook_id, response: "cancelled" });
            }
            if (!textAreaDisabled) {
              setTextAreaDisabled(true);
              setTextArearInputValue(comment);
            }
          }}
        >
          {textAreaDisabled ? "요청 취소" : "수정 취소"}
        </div>,
      ]}
      style={{ margin: "10px", borderRadius: "10px" }}
      bordered={false}
      hoverable
    >
      <Card.Meta
        avatar={<Image src="/image/bookcover/bookcover2.png" alt={mybookTitle} width={60} height={85} />}
        description={
          <>
            <div>책이름: {mybookTitle}</div>
            <div>멘토: {`${mentorName}(${mentorUsername})`}</div>
            <div>요청 날짜: {moment(new Date(Number(reqDate))).format("YY-MM-DD")}</div>
            <div>요청메세지:</div>
            <Input.TextArea ref={textAreaRef} disabled={textAreaDisabled} value={textArearInputValue} placeholder="안녕하세요. 멘토링 요청 드립니다." onChange={(e) => setTextArearInputValue(e.target.value)} />
          </>
        }
      />
    </StyledCard>
  );
};

export default M_SentMentoringRequestCard;

const StyledCard = styled(Card)`
  & * {
    font-size: 0.8rem;
  }

  & .ant-input.ant-input-disabled {
    color: rgba(0, 0, 0, 0.6);
    background-color: #eeeeee;
  }
`;
