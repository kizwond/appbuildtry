import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Card, Col, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { GET_USER_MINIMUM_INFORMATION_BY_USER_NAME } from "../../graphql/query/allQuery";
import { MUTATION_REQUEST_MENTORING } from "../../graphql/mutation/mentoring";

const { Search, TextArea } = Input;

const M_RequestMetoringCard = ({ resetExpandedRowKeys, mybook_id, mybookTitle, cardVisible }) => {
  const [mentorIdInputValue, setMentorIdInputValue] = useState("");
  const [visibleNoMentoId, setVisibleNoMentoId] = useState(false);

  const [requestMessageInput, setRequestMessageInput] = useState("");

  useEffect(() => {
    setMentorIdInputValue("");
    setRequestMessageInput("");
  }, [cardVisible]);

  const [requestUserInfomation, { data, loading, error }] = useLazyQuery(GET_USER_MINIMUM_INFORMATION_BY_USER_NAME, {
    onCompleted: (data) => console.log("유저 정보는", data),
  });

  const [requestMentoring] = useMutation(MUTATION_REQUEST_MENTORING, { onCompleted: (data) => console.log(data) });

  async function sendRequest() {
    try {
      await requestMentoring({
        variables: {
          forCreateMentoringReq: {
            mentorUser_id: data.user_getUserMinInfo._id,
            mentorUsername: data.user_getUserMinInfo.username,
            mentorName: data.user_getUserMinInfo.name,
            mentorOrganization: data.user_getUserMinInfo.organization,
            mybook_id,
            mybookTitle,
            comment: requestMessageInput === "" ? "안녕하세요. 멘토링 요청 드립니다." : "requestMessageInput",
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Card
      style={{ margin: "8px 0 8px", minWidth: 320 }}
      actions={[
        <div key="decline" onClick={resetExpandedRowKeys}>
          취소
        </div>,
        <div
          key="accept"
          style={{ color: data && data.user_getUserMinInfo.username == mentorIdInputValue ? "#1890ff" : "rgba(0, 0, 0, 0.45)" }}
          onClick={() => {
            if (data && data.user_getUserMinInfo.username == mentorIdInputValue) {
              sendRequest();
            }
          }}
        >
          신청
        </div>,
      ]}
      size="small"
    >
      <Row gutter={[8, 12]}>
        <Col span={5}>아이디:</Col>
        <Col span={19}>
          <Search
            size="small"
            allowClear
            value={mentorIdInputValue}
            loading={loading}
            onSearch={(value) => {
              if (value.length > 0) {
                requestUserInfomation({
                  variables: {
                    username: value,
                  },
                });
                setVisibleNoMentoId(true);
              }
            }}
            onChange={(e) => {
              setMentorIdInputValue(e.target.value);
              if (visibleNoMentoId) {
                setVisibleNoMentoId(false);
              }
            }}
            enterButton={false}
            placeholder="요청할 멘토의 아이디를 입력하세요"
          />
          {visibleNoMentoId && data && data.user_getUserMinInfo.status === "400" && <span style={{ color: "red" }}>입력하신 아이디는 존재하지 않습니다.</span>}
        </Col>
        {data && data.user_getUserMinInfo.username == mentorIdInputValue && (
          <>
            <Col span={5}>소속(정보):</Col>
            <Col span={19}>{data.user_getUserMinInfo.organiztion}</Col>

            <Col span={5}>요청 메세지:</Col>
            <Col span={19}>
              <TextArea
                size="small"
                allowClear
                showCount
                value={requestMessageInput}
                autoSize={{ minRows: 2, maxRows: 7 }}
                placeholder="안녕하세요. 멘토링 요청드립니다."
                maxLength={100}
                onChange={(e) => {
                  setRequestMessageInput(e.target.value);
                }}
              />
              {/* 메세지 입력안했을 때는 placeholder의 내용을 요청 메세지로 보낸다 */}
              <span style={{ color: "red" }}>10자 이상을 입력해주세요.</span>
            </Col>
          </>
        )}
      </Row>
    </Card>
  );
};

export default M_RequestMetoringCard;