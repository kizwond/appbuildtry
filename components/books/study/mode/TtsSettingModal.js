import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const TtsSettingModal = () => {
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
        읽어주기설정
      </Button>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contentsㄹㄹㄹㄹㄹㄹ...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default TtsSettingModal;