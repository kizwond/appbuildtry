import { Button, Form, Input } from "antd";
import React, { useCallback } from "react";

const CommentForm = ({ post }) => {
  const onSubmitComment = (v) => {
    console.log(v);
  };
  return (
    <Form onFinish={onSubmitComment}>
      <div className="relative">
        <Form.Item name="대댓글">
          <Input.TextArea placeholder="리뷰 작성시 광고 및 욕설, 비속어나 타인을 비방하는 문구를 사용하시면 비공개될 수 있습니다." />
        </Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          style={{ position: "absolute", right: 0, bottom: -40, zIndex: 1 }}
        >
          댓글 달기
        </Button>
      </div>
    </Form>
  );
};

export default CommentForm;
