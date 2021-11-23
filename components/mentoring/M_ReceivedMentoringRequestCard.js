import { Card, Input, Select } from "antd";
import Image from "next/image";
import moment from "moment";
import React, { useMemo, useRef } from "react";
import styled from "styled-components";
import { MUTATION_ACCEPT_MENTOR_REQUEST } from "../../graphql/mutation/mentoring";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";

const M_ReceivedMentoringRequestCard = ({ mentee, declineMentoring, menteeGroup }) => {
  const router = useRouter();
  const selectorRef = useRef("");

  const { comment, menteeUser_id, menteeName, mentorUser_id, menteeUsername, mybookTitle, mybook_id, reqDate } = mentee;

  const menteeGroupSelector = useMemo(() => {
    return (
      menteeGroup && (
        <>
          <Select defaultValue={menteeGroup[0]._id} size="small" onChange={(v) => (selectorRef.current = v)}>
            {menteeGroup.map((group) => (
              <Select.Option key={group._id} value={group._id}>
                {group.name}
              </Select.Option>
            ))}
          </Select>
        </>
      )
    );
  }, [menteeGroup]);

  const [acceptMentroingRequest] = useMutation(MUTATION_ACCEPT_MENTOR_REQUEST, {
    onCompleted: (data) => {
      if (data.mentoring_acceptMentoringReq.status === "200") {
        console.log("멘토링 요청 수락 후 받은 데이터", data);
      } else if (data.mentoring_acceptMentoringReq.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  async function acceptRequest() {
    try {
      await acceptMentroingRequest({
        variables: {
          forAcceptMentoringReq: {
            menteeGroup_id: selectorRef.current === "" ? menteeGroup[0]._id : selectorRef.current,
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
        menteeGroupSelector,
        <div
          key="accept"
          onClick={() => {
            acceptRequest();
          }}
        >
          수락
        </div>,
        <div key="decline" onClick={() => {}}>
          거절
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
            <div>멘티: {`${menteeName}(${menteeUsername})`}</div>
            <div>요청 날짜: {moment(new Date(Number(reqDate))).format("YY-MM-DD")}</div>
            <div>요청메세지:</div>
            <Input.TextArea disabled bordered={false} value={comment} />
          </>
        }
      />
    </StyledCard>
  );
};

export default M_ReceivedMentoringRequestCard;

const StyledCard = styled(Card)`
  & * {
    font-size: 0.8rem;
  }

  & .ant-input.ant-input-disabled {
    color: rgba(0, 0, 0, 0.604);
    background-color: #fafafa;
  }
`;
