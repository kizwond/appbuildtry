import React, { useState } from "react";
import { Modal, Button, Popover, Form, Input, Space } from "antd";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import { IndexCreateMutation } from "../../../../graphql/query/writemain";
import { SettingOutlined, PlusOutlined, ArrowUpOutlined, ArrowDownOutlined, EditOutlined } from "@ant-design/icons";

const IndexSettingModal = ({ indexinfo, onFinish }) => {
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

  if(indexinfo){
      console.log(indexinfo)
    var indexList = indexinfo.map((item) => (
        <>
          <IndexList onFinish={onFinish} index={item} />
        </>
      ));
  }
  

  return (
    <>
      <Button type="primary" onClick={showModal}>
        목차설정
      </Button>
      <Modal title="목차설정" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {indexList}
      </Modal>
    </>
  );
};

const IndexList = ({ index, onFinish }) => {
    const [newInput, setNewInput] = useState(false);
    const newIndexTitle = <span style={{ fontSize: "11px" }}>새로운 목차의 이름을 입력해 주세요.</span>;
    const createIndex = (mybook_id, current_index_id, current_seq, current_level) => (
        <Form
          layout={"inline"}
          size="small"
          initialValues={{
            mybook_id: mybook_id,
            current_index_id:current_index_id,
            current_seq:current_seq,
            current_level:current_level
          }}
          onFinish={onFinish}
          className="change_book_title_input_form"
        >
          <Space>
            <Form.Item name={["name"]} rules={[{ required: true }]}>
              <Input placeholder="" />
            </Form.Item>
            <Form.Item name={["mybook_id"]} hidden={true} rules={[{ required: true }]}>
              <Input placeholder={mybook_id} />
            </Form.Item>
            <Form.Item name={["current_index_id"]} hidden={true} rules={[{ required: true }]}>
              <Input placeholder={current_index_id} />
            </Form.Item>
            <Form.Item name={["current_seq"]} hidden={true} rules={[{ required: true }]}>
              <Input placeholder={current_seq} />
            </Form.Item>
            <Form.Item name={["current_level"]} hidden={true} rules={[{ required: true }]}>
              <Input placeholder={current_level} />
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

  return (
    <>
      <div>
      <Popover placement="rightTop" title={newIndexTitle} visible={newInput} content={createIndex(index.index_info.mybook_id, index._id, index.index_info.seq, index.index_info.level)} trigger="click">
            <PlusOutlined onClick={() => setNewInput(true)} style={{ fontSize: "13px" }} />
          </Popover>
      </div>
      <div>{index.index_info.name}</div>
    </>
  );
};

export default IndexSettingModal;
