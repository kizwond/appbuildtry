import { useLazyQuery, useQuery } from "@apollo/client";
import { Card, Col, Input, Row } from "antd";
import React, { useRef, useState } from "react";
import { GET_USER_MINIMUM_INFORMATION_BY_USER_NAME } from "../../graphql/query/allQuery";

const { Search, TextArea } = Input;

const M_RequestMetoringCard = () => {
  const [visibleNoMentoId, setVisibleNoMentoId] = useState(false);
  const [mentorIdInput, setMentorIdInput] = useState("");

  const [requestUserInfomation, { data, loading, error }] = useLazyQuery(GET_USER_MINIMUM_INFORMATION_BY_USER_NAME, {
    onCompleted: (data) => console.log("유저 정보는", data),
  });

  return (
    <Card
      style={{ margin: "8px 0 8px", minWidth: 320 }}
      actions={[
        <div
          key="accept"
          onClick={() => {
            // acceptMentroingRequest({
            //   variables: {
            //     forAcceptMentoringReq: {
            //       menteeGroup_id: selectorRef.current,
            //       menteeUser_id,
            //       mentorUser_id,
            //       mybook_id,
            //     },
            //   },
            // });
          }}
        >
          취소
        </div>,
        <div key="decline">신청</div>,
      ]}
      size="small"
    >
      <Row gutter={[8, 12]}>
        <Col span={5}>아이디:</Col>
        <Col span={19}>
          <Search
            size="small"
            allowClear
            onSearch={(value) => {
              if (value.length > 0) {
                requestUserInfomation({
                  variables: {
                    username: value,
                  },
                });
              }
            }}
            onChange={(e) => {
              setMentorIdInput(e.target.value);
            }}
            enterButton={false}
            placeholder="요청할 멘토의 아이디를 입력하세요"
          />
          {visibleNoMentoId && data && data.user_getUserMinInfo.status === "400" && <span style={{ color: "red" }}>입력하신 아이디는 존재하지 않습니다.</span>}
        </Col>

        <Col span={5}>소속(정보):</Col>
        <Col span={19}>한국대학교 영문학과</Col>

        <Col span={5}>요청 메세지:</Col>
        <Col span={19}>
          <TextArea size="small" allowClear showCount autoSize placeholder="요청 메세지를 입력하세요" />
          <span style={{ color: "red" }}>10자 이상을 입력해주세요.</span>
        </Col>
      </Row>
    </Card>
  );
};

export default M_RequestMetoringCard;
