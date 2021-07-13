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
    bookcategory_create(name: $name, current_bookcategory_id: $current_bookcategory_id) {
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
const DeleteCategory = gql`
  mutation DeleteCategory($bookcategory_id: String!) {
    bookcategory_delete(bookcategory_id: $bookcategory_id) {
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
const UpdateCategory = gql`
  mutation UpdateCategory($name: String!, $bookcategory_id: String!) {
    bookcategory_update(name: $name, bookcategory_id: $bookcategory_id) {
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
const PositioningCategory = gql`
  mutation PositioningCategory($direction: String, $bookcategory_id: String!) {
    bookcategory_changeposition(direction: $direction, bookcategory_id: $bookcategory_id) {
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
  const [category, setCategory] = useState(data.bookcategory_get.bookcategory);
  const [createBookcategory] = useMutation(CreateNewCategory, { onCompleted: showdatacreate });
  const [bookcategory_delete] = useMutation(DeleteCategory, { onCompleted: showdatadelete });
  const [bookcategory_update] = useMutation(UpdateCategory, { onCompleted: showdataupdate });
  const [bookcategory_changeposition] = useMutation(PositioningCategory, { onCompleted: showdataposition });
    const lastSeq = category.length -1;
  function showdataposition(data) {
    console.log("data", data);
    setCategory(data.bookcategory_changeposition.bookcategory);
  }

  async function positionCategory(direction, id) {
    try {
      await bookcategory_changeposition({
        variables: {
          direction: direction,
          bookcategory_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinishPosition = (direction, id) => {
    console.log(direction, id);
    positionCategory(direction, id);
  };

  function showdatacreate(data) {
    console.log("data", data);
    setCategory(data.bookcategory_create.bookcategory);
  }

  async function postCategory(name, id) {
    try {
      await createBookcategory({
        variables: {
          name: name,
          current_bookcategory_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinish = (values) => {
    console.log(values);
    postCategory(values.newCategory, values.id);
  };

  function showdataupdate(data) {
    console.log("data", data);
    setCategory(data.bookcategory_update.bookcategory);
  }
  async function updateCategory(name, id) {
    try {
      await bookcategory_update({
        variables: {
          name: name,
          bookcategory_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const onFinishUpdate = (values) => {
    console.log(values);
    updateCategory(values.newCategory, values.id);
  };

  function showdatadelete(data) {
    console.log("data", data);
    setCategory(data.bookcategory_delete.bookcategory);
  }

  async function deleteCategory(id) {
    try {
      await bookcategory_delete({
        variables: {
          bookcategory_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const categoryDelete = (id) => {
    console.log(id);
    deleteCategory(id);
  };

  const categoryList = category.map((item) => (
    <CategoryList lastSeq={lastSeq} onFinishPosition={onFinishPosition} onFinishUpdate={onFinishUpdate} onFinish={onFinish} categoryDelete={categoryDelete} key={category._id} category={item} />
  ));
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

const CategoryList = ({ lastSeq, onFinish, category, categoryDelete, onFinishUpdate, onFinishPosition }) => {
  const [newInput, setNewInput] = useState(false);
  const [updatenewInput, setupdateNewInput] = useState(false);
  const newCategoryText = <span style={{ fontSize: "11px" }}>새로운 카테고리 이름을 입력해 주세요.</span>;
  const updateCategoryText = <span style={{ fontSize: "11px" }}>변경할 카테고리 이름을 입력해 주세요.</span>;

  const createcontent = (id) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        id: id,
      }}
      onFinish={onFinish}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["newCategory"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={["id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button type="primary" onClick={() => setNewInput(false)} htmlType="submit">
            완료
          </Button>
          <Button type="primary" onClick={() => setNewInput(false)}>
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
  const updatecontent = (id) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        id: id,
      }}
      onFinish={onFinishUpdate}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["newCategory"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={["id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button type="primary" onClick={() => setupdateNewInput(false)} htmlType="submit">
            완료
          </Button>
          <Button type="primary" onClick={() => setupdateNewInput(false)}>
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );

  return (
    <>
      <ul key={category._id} style={{ ...category_columns, backgroundColor: "white" }}>
        <li style={{ width: "40px", textAlign: "left" }}>
          <Popover placement="rightTop" title={newCategoryText} visible={newInput} content={createcontent(category._id)} trigger="click">
            <PlusOutlined onClick={() => setNewInput(true)} style={{ fontSize: "13px" }} />
          </Popover>
        </li>
        <li style={{ width: "10%" }}>{category.name}</li>
        <li>
          {category.name === "(미지정)" ? (
            <button disabled>
            이름바꾸기
          </button>
          ) : (
            <Popover placement="rightTop" title={updateCategoryText} visible={updatenewInput} content={updatecontent(category._id)} trigger="click">
              <button onClick={() => setupdateNewInput(true)} style={{ fontSize: "11px" }}>
                이름바꾸기
              </button>
            </Popover>
          )}
        </li>
        <li>
          {category.name === "(미지정)" ? (
            <><button disabled>up</button><button disabled>down</button></>
          ) : category.seq === 1 ? (
            <>
              <button disabled>up</button>
              <button onClick={() => onFinishPosition("down", category._id)}>down</button>
            </>
          ) : category.seq === lastSeq ? (
            <>
              <button onClick={() => onFinishPosition("up", category._id)}>up</button>
              <button disabled>down</button>
            </>
          ) : (
            <>
              <button onClick={() => onFinishPosition("up", category._id)}>up</button>
              <button onClick={() => onFinishPosition("down", category._id)}>down</button>
            </>
          )}
        </li>
        <li>{category.name === "(미지정)" ? <button disabled>삭제</button> : <button onClick={() => categoryDelete(category._id)}>삭제</button>}</li>
        <li>00권{lastSeq}</li>
        <li>블라블라</li>
      </ul>
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
  fontSize: "11px",
};

export default CategorySettingModal;
