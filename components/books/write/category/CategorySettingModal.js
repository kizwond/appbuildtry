import React, { useState, useEffect } from "react";
import { Modal, Button, Popover, Form, Input, Space } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { PlusOutlined } from "@ant-design/icons";
import { GetCategory, CreateNewCategory, DeleteCategory, UpdateCategory, PositioningCategory } from "../../../../graphql/query/category";

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
  const [category, setCategory] = useState();
  const [lastSeq, setLastSeq] = useState();

  useEffect(() => {
    if (data) {
      setCategory(data.mybookcate_get.mybookcates);
      const lastSeq = data.mybookcate_get.mybookcates.length - 1;
      setLastSeq(Number(lastSeq));
    }

    console.log(lastSeq);
    console.log(category);
  },[data, lastSeq, category]);

  const [mybookcate_create] = useMutation(CreateNewCategory, { onCompleted: showdatacreate });
  const [mybookcate_delete] = useMutation(DeleteCategory, { onCompleted: showdatadelete });
  const [mybookcate_update] = useMutation(UpdateCategory, { onCompleted: showdataupdate });
  const [mybookcate_changeorder] = useMutation(PositioningCategory, { onCompleted: showdataposition });

  function showdataposition(data) {
    console.log("data", data);
    setCategory(data.mybookcate_changeorder.mybookcates);
  }

  async function positionCategory(direction, id) {
    try {
      await mybookcate_changeorder({
        variables: {
          direction: direction,
          mybookcate_id: id,
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
    setCategory(data.mybookcate_create.mybookcates);
  }

  async function postCategory(name, id) {
    try {
      await mybookcate_create({
        variables: {
          name: name,
          current_mybookcate_id: id,
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
    setCategory(data.mybookcate_update.mybookcates);
  }
  async function updateCategory(name, id) {
    try {
      await mybookcate_update({
        variables: {
          name: name,
          mybookcate_id: id,
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
    setCategory(data.mybookcate_delete.mybookcates);
  }

  async function deleteCategory(id) {
    try {
      await mybookcate_delete({
        variables: {
          mybookcate_id: id,
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
  if (category) {
    console.log("check", category);
    var categoryList = category.map((item) => (
      <CategoryList
        lastSeq={lastSeq}
        onFinishPosition={onFinishPosition}
        onFinishUpdate={onFinishUpdate}
        onFinish={onFinish}
        categoryDelete={categoryDelete}
        key={category._id}
        category={item}
      />
    ));
  }

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
        <li style={{ width: "10%" }}>{category.mybookcate_info.name}</li>
        <li>
          {category.mybookcate_info.name === "(미지정)" ? (
            <button disabled>이름바꾸기</button>
          ) : (
            <Popover placement="rightTop" title={updateCategoryText} visible={updatenewInput} content={updatecontent(category._id)} trigger="click">
              <button onClick={() => setupdateNewInput(true)} style={{ fontSize: "11px" }}>
                이름바꾸기
              </button>
            </Popover>
          )}
        </li>
        <li>
          {category.mybookcate_info.name === "(미지정)" ? (
            <>
              <button disabled>up</button>
              <button disabled>down</button>
            </>
          ) : category.mybookcate_info.seq === 1 ? (
            <>
              <button disabled>up</button>
              <button onClick={() => onFinishPosition("down", category._id)}>down</button>
            </>
          ) : category.mybookcate_info.seq === lastSeq ? (
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
        <li>{category.mybookcate_info.name === "(미지정)" ? <button disabled>삭제</button> : <button onClick={() => categoryDelete(category._id)}>삭제</button>}</li>
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
