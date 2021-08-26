import React, { useState } from "react";
import { Modal, Button, Popover, Form, Input, Space, Select } from "antd";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import { IndexCreateMutation } from "../../../../graphql/query/writemain";
import { SettingOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from "@ant-design/icons";

const IndexSettingModal = ({ indexinfo, onFinish, onFinishRename, indexSetInfo, onFinishChangeLevel, onFinishIndexDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (indexinfo) {
    console.log(indexinfo);
    console.log(indexSetInfo);
    var indexList = indexinfo.map((item) => (
      <>
        <IndexList
          indexinfo={indexinfo}
          indexSetInfo={indexSetInfo}
          onFinish={onFinish}
          index={item}
          onFinishRename={onFinishRename}
          onFinishChangeLevel={onFinishChangeLevel}
          onFinishIndexDelete={onFinishIndexDelete}
        />
      </>
    ));
  }

  return (
    <>
      <Button type="primary" onClick={showModal}>
        목차설정
      </Button>
      <Modal title="목차설정" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <ul style={{ display: "flex", listStyle: "none", justifyContent: "space-between" }}>
          <li></li>
          <li>목차명</li>
          <li>이름변경</li>
          <li>레벨변경</li>
          <li>삭제</li>
        </ul>
        {indexList}
      </Modal>
    </>
  );
};

const IndexList = ({ indexinfo, index, onFinish, onFinishRename, indexSetInfo, onFinishChangeLevel, onFinishIndexDelete }) => {
  const [newInput, setNewInput] = useState(false);
  const [renameInput, setRenameInput] = useState(false);
  const [deleteInput, setDeleteInput] = useState(false);
  const newIndexTitle = <span style={{ fontSize: "11px" }}>새로운 목차의 이름을 입력해 주세요.</span>;
  const renameIndexTitle = <span style={{ fontSize: "11px" }}>변경할 목차 이름을 입력해 주세요.</span>;
  const deleteIndexTitle = <span style={{ fontSize: "11px" }}>삭제후 카드를 이동할 목차를 선택해주세요.</span>;
  const createIndex = (indexset_id, current_index_id, current_level) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        current_index_id: current_index_id,
        current_level: current_level,
        indexset_id: indexset_id,
      }}
      onFinish={onFinish}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["name"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={["current_index_id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={current_index_id} />
        </Form.Item>
        <Form.Item name={["current_level"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={current_level} />
        </Form.Item>
        <Form.Item name={["indexset_id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={indexset_id} />
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

  const renameIndex = (indexset_id, current_index_id) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        current_index_id: current_index_id,
        indexset_id: indexset_id,
      }}
      onFinish={onFinishRename}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["name"]} rules={[{ required: true }]}>
          <Input placeholder="" />
        </Form.Item>
        <Form.Item name={["current_index_id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={current_index_id} />
        </Form.Item>
        <Form.Item name={["indexset_id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={indexset_id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button type="primary" onClick={() => setRenameInput(false)} htmlType="submit">
            완료
          </Button>
          <Button type="primary" onClick={() => setRenameInput(false)}>
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );

  if (indexinfo) {
    console.log(indexinfo);
    var optionList = indexinfo.map((item) => {
      if (item._id === index._id) {
        return null;
      } else {
        return (
          <React.Fragment key={item._id}>
            <Select.Option value={item._id}>{item.name}</Select.Option>
          </React.Fragment>
        );
      }
    });
  }

  const deleteIndex = (indexset_id, current_index_id) => (
    <Form
      layout={"inline"}
      size="small"
      initialValues={{
        current_index_id: current_index_id,
        indexset_id: indexset_id,
      }}
      onFinish={onFinishIndexDelete}
      className="change_book_title_input_form"
    >
      <Space>
        <Form.Item name={["moveto_index_id"]} rules={[{ required: false }]}>
          <Select style={{ width: 120 }}>
            <Select.Option value="default">목차선택</Select.Option>
            {optionList}
          </Select>
        </Form.Item>
        <Form.Item name={["current_index_id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={current_index_id} />
        </Form.Item>
        <Form.Item name={["indexset_id"]} hidden={true} rules={[{ required: true }]}>
          <Input placeholder={indexset_id} />
        </Form.Item>
        <Form.Item className="change_book_title_buttons">
          <Button type="primary" onClick={() => setDeleteInput(false)} htmlType="submit">
            완료
          </Button>
          <Button type="primary" onClick={() => setDeleteInput(false)}>
            취소
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
  const levelChange = (direction, current_level) => {
    const prevItemIndex = indexinfo.findIndex((item) => item._id === index._id) - 1;
    console.log(prevItemIndex);
    if (prevItemIndex !== -1) {
      const prevItemLevel = indexinfo[prevItemIndex].level;
      console.log(prevItemLevel);
      if (current_level === 1 && direction === "up") {
        alert("1레벨짜리를 왜 0으로 만들라그랴");
      } else if (current_level === prevItemLevel + 1 && direction === "down") {
        alert("왜 부모없이 2레벨을 건너뛰냐");
      } else {
        onFinishChangeLevel(direction, index._id, indexSetInfo._id);
      }
    } else {
      alert("최상위 목차레벨변동 없어야지");
    }
  };

  return (
    <>
      <ul style={{ display: "flex", listStyle: "none", justifyContent: "space-between" }}>
        <li>
          <Popover placement="rightTop" title={newIndexTitle} visible={newInput} content={createIndex(indexSetInfo._id, index._id, index.level)} trigger="click">
            <PlusOutlined onClick={() => setNewInput(true)} style={{ fontSize: "13px" }} />
          </Popover>
        </li>
        <li>
          {index.name}, level : {index.level}
        </li>
        <li>
          <Popover placement="rightTop" title={renameIndexTitle} visible={renameInput} content={renameIndex(indexSetInfo._id, index._id)} trigger="click">
            <button onClick={() => setRenameInput(true)}>이름변경</button>
          </Popover>
        </li>
        <li>
          <button onClick={() => levelChange("up", index.level)}>좌</button>
          <button onClick={() => levelChange("down", index.level)}>우</button>
        </li>
        <li>
          <Popover placement="rightTop" title={deleteIndexTitle} visible={deleteInput} content={deleteIndex(indexSetInfo._id, index._id)} trigger="click">
            <button onClick={() => setDeleteInput(true)}>삭제</button>
          </Popover>
        </li>
      </ul>
    </>
  );
};

export default IndexSettingModal;
