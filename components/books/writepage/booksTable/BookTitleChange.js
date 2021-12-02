import React, { useState, memo } from "react";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { UPDATE_BOOK_TITLE_AND_HIDE } from "../../../../graphql/query/writePage";

import { Popconfirm, Tooltip, Button, Form, Input } from "antd";
import { EditFilled } from "@ant-design/icons";

const BookTitleChange = ({
  handleToGetMyBook,
  mybook_id,
  title,
  hide_or_show,
}) => {
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const { resetFields } = form;

  const router = useRouter();
  const [updateBookTitle, { variables }] = useMutation(
    UPDATE_BOOK_TITLE_AND_HIDE,
    {
      onCompleted: (received_data) => {
        console.log("received_data", received_data);
        if (received_data.mybook_update.status === "200") {
          handleToGetMyBook(received_data.mybook_update.mybooks);
        } else if (received_data.mybook_update.status === "401") {
          router.push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );
  async function updateBook(_title) {
    try {
      await updateBookTitle({
        variables: {
          mybook_id,
          title: _title,
          hide_or_show,
        },
      });
    } catch (error) {
      console.log(error);
      console.log(variables);
    }
  }

  return (
    <Popconfirm
      icon={<EditFilled style={{ color: "#1890ff" }} />}
      visible={visible}
      title={
        <Form
          colon={false}
          form={form}
          id={mybook_id}
          onFinish={(values) => {
            updateBook(values.book_title);
          }}
          onFinishFailed={(values, errorFields, outOfDate) => {
            console.log("values", values);
            setVisible(true);
          }}
          requiredMark={false}
        >
          <Form.Item
            name="book_title"
            label="책제목"
            rules={[
              {
                required: true,
                message: "책 제목을 입력해주세요!",
              },
            ]}
          >
            <Input placeholder={title} />
          </Form.Item>
        </Form>
      }
      okText="변경"
      cancelText="취소"
      onVisibleChange={(visible) => {
        if (!visible) {
          setVisible(visible);
        }
        if (visible) {
          resetFields();
          setVisible(visible);
        }
      }}
      okButtonProps={{
        form: mybook_id,
        key: "submit",
        htmlType: "submit",
      }}
    >
      {!visible ? (
        <Button type="text" shape="circle" size="small" icon={<EditFilled />} />
      ) : (
        <Button
          type="primary"
          shape="circle"
          size="small"
          icon={<EditFilled />}
        />
      )}
    </Popconfirm>
  );
};

export default memo(BookTitleChange);
