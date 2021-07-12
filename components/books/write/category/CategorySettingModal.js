import React, { useState } from "react";
import { Modal, Button, Popover, Form, Input, Space } from "antd";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import { SettingOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from "@ant-design/icons";

const GetCategory = gql`
  query {
    bookcategory_get {
      status
      msg
      bookcategory {
        _id
        name
        seq
      }
    }
  }
`;

const CreateNewCategory = gql`
  mutation CreateNewCategory($name: String!, $current_bookcategory_id: String!) {
    bookcategory_create(name: $name, current_bookcategory_id:$current_bookcategory_id) {
      status
      msg
      bookcategory {
        _id
        name
        seq
      }
      mybook {
          book_info {
              title
          }
      }
    }
  }
`;
const CategorySettingModal = ({ isModalVisible, handleOk, handleCancel }) => {
  return (
    <>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <ModalContents />
      </Modal>
    </>
  );
};

const ModalContents = () => {
  const { loading, error, data } = useQuery(GetCategory);
  console.log("category", data);
  const [category, setCategory] = useState(data.bookcategory_get.bookcategory)
  const [newInput, setNewInput] = useState(false);
  const [createBookcategory] = useMutation(CreateNewCategory, { onCompleted: showdata });

  function showdata(data) {
    console.log("data", data)
    setCategory(data.bookcategory_create.bookcategory)
  }

  async function postCategory(name, id) {
    try {
      await createBookcategory({
        variables: {
            name: name,
            current_bookcategory_id: id
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinish = (values) => {
      console.log(values)
    postCategory(values.newCategory, values.id);
    setNewInput(false);
  };

  const text = <span style={{ fontSize: "11px" }}>새로운 카테고리 이름을 입력해 주세요.</span>;
  const content = (id) =>(
    <Form layout={"inline"} size="small" initialValues={{
        'id': id,
      }} onFinish={onFinish} className="change_book_title_input_form">
      <Space>
        <Form.Item name={["newCategory"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={["id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button type="primary" htmlType="submit">
            완료
          </Button>
          <Button type="primary" onClick={() => setNewInput(false)}>
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
  const categoryList = category.map((category) => {
    return (
      <>
        <ul key={category._id} style={{ ...category_columns, backgroundColor: "white" }}>
          <li style={{ width: "40px", textAlign: "left" }}>
            <Popover placement="rightTop" title={text} visible={newInput} content={content(category._id)} trigger="click">
              <PlusOutlined onClick={() => setNewInput(true)} style={{ fontSize: "14px" }} />
            </Popover>
          </li>
          <li>{category.name}</li>
          <li>이름바꾸기</li>
          <li>순서변경</li>
          <li>삭제</li>
          <li>00권</li>
          <li>블라블라</li>
        </ul>
      </>
    );
  });
  return (
    <>
      <div style={{ fontSize: "11px", border: "1px solid lightgrey" }}>
        <ul style={category_columns}>
          <li style={{ textAlign: "left" }}>추가</li>
          <li style={{ textAlign: "left" }}>카테고리 명</li>
          <li style={{}}>이름변경</li>
          <li style={{}}>표시순서 변경</li>
          <li style={{}}>삭제</li>
          <li style={{}}>총 책권수</li>
          <li style={{ textAlign: "left" }}>책 제목모음</li>
        </ul>
      </div>
      <div>{categoryList}</div>
    </>
  );
};

const category_columns = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  //   height: "30px",
  //   lineHeight: "13px",
  padding: "5px",
  backgroundColor: "#efefef",
  textAlign: "center",
  listStyle: "none",
  marginBottom: 0,
};

export default CategorySettingModal;
