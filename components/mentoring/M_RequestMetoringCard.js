import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Card, Col, Form, Input, Row } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { GET_USER_MINIMUM_INFORMATION_BY_USER_NAME } from "../../graphql/query/allQuery";
import { MUTATION_REQUEST_MENTORING } from "../../graphql/mutation/mentoring";

const { Search, TextArea } = Input;

const M_RequestMetoringCard = ({ resetExpandedRowKeys, mybook_id, mybookTitle, cardVisible }) => {
  const router = useRouter();

  const [form] = Form.useForm();
  const { getFieldInstance, validateFields, scrollToField } = form;

  const textAreaRef = useRef();

  const [mentorIdInputValue, setMentorIdInputValue] = useState("");

  const [requestMessageInput, setRequestMessageInput] = useState("");

  let timer;
  useEffect(() => {
    setMentorIdInputValue("");
    setRequestMessageInput("");
    if (cardVisible) {
      clearTimeout(timer);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      timer = setTimeout(() => {
        getFieldInstance("lookupName").focus();
        document.getElementById(`requestMentoring:${mybook_id}`).scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardVisible]);

  const [requestUserInfomation, { data, loading, error, variables }] = useLazyQuery(GET_USER_MINIMUM_INFORMATION_BY_USER_NAME, {
    onCompleted: (data) => {
      if (data.user_getUserMinInfo.status === "200") {
        console.log("유저 정보 요청후 받은 데이터", data);
        textAreaRef.current.focus();
      } else if (data.user_getUserMinInfo.status === "400") {
        // 없는 사용자일때
        getFieldInstance("lookupName").focus({
          cursor: "all",
        });
      } else if (data.user_getUserMinInfo.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const [requestMentoring] = useMutation(MUTATION_REQUEST_MENTORING, {
    onCompleted: (data) => {
      if (data.mentoring_createMentoringReq.status === "200") {
        console.log("멘토링 요청후 받은 데이터", data);
        resetExpandedRowKeys();
      } else if (data.mentoring_createMentoringReq.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

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
            comment: requestMessageInput === "" ? "안녕하세요. 멘토링 요청 드립니다." : requestMessageInput,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (data) {
      validateFields(["lookupName"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <Card
      style={{ margin: "0 0 8px", minWidth: 320 }}
      bordered={false}
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
          멘토링 요청
        </div>,
      ]}
      size="small"
    >
      <Row gutter={[8]}>
        <Col span={6}>아이디:</Col>
        <Col span={18}>
          <Form
            form={form}
            id="newMenteeGroupForm"
            size="small"
            onFinish={(v) => {
              requestUserInfomation({
                variables: {
                  username: v.lookupName,
                },
              });
            }}
          >
            <Form.Item
              name="lookupName"
              rules={[
                {
                  required: true,
                  message: "id를 입력하세요",
                },
                {
                  validator: (_, value) =>
                    !data ? Promise.resolve() : variables.username === value && data.user_getUserMinInfo.status === "400" ? Promise.reject(new Error("입력하신 아이디는 존재하지 않습니다.")) : Promise.resolve(),
                },
              ]}
            >
              <Search
                size="small"
                allowClear
                value={mentorIdInputValue}
                loading={loading}
                onSearch={form.submit}
                onChange={(e) => {
                  setMentorIdInputValue(e.target.value);
                }}
                enterButton={false}
                placeholder="요청할 멘토의 아이디를 입력하세요"
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row gutter={[8, 12]}>
        <Col span={6}>멘토 이름:</Col>
        <Col span={18}>{data && data.user_getUserMinInfo.name}</Col>

        <Col span={6}>소속(정보):</Col>
        <Col span={18}>{data && data.user_getUserMinInfo.organiztion}</Col>

        <Col span={6}>요청 메세지:</Col>
        <Col span={18}>
          <TextArea
            ref={textAreaRef}
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
        </Col>
      </Row>
    </Card>
  );
};

export default M_RequestMetoringCard;
