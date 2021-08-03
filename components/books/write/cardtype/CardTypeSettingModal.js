import React, { useState } from "react";
import { Modal, Button, Popover, Form, Input, Space } from "antd";

const CreateCardType = () => {
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
  
    return (
      <>
        <Button type="primary" onClick={showModal}>
         카드타입만들기
        </Button>
        <Modal title="목차설정" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <ul style={{ display: "flex", listStyle: "none", justifyContent: "space-between" }}>
            <li></li>
            <li>목차명</li>
            <li>이름변경</li>
            <li>레벨변경</li>
            <li>삭제</li>
          </ul>
        </Modal>
      </>
    );
  };
export default CreateCardType;