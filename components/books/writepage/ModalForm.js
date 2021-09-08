import React from 'react';
import { Modal, Form, Input, Select } from 'antd';

const ModalForm = ({ category, visible, onToggleVisible }) => {
  return (
    <Modal
      visible={visible}
      title="새 책 만들기"
      cancelText="취소"
      onCancel={() => onToggleVisible(false)}
      okButtonProps={{
        form: 'category-editor-form',
        key: 'submit',
        htmlType: 'submit',
      }}
      mask={false}
      okText="새 책 만들기 완료"
    >
      <Form
        layout="vertical"
        id="category-editor-form"
        initialValues={{ category: '미지정' }}
        onFinish={(values) => console.log(values)}
      >
        <Form.Item
          name="book_title"
          label="책제목"
          rules={[
            {
              required: true,
              message: '책 제목을 입력해주세요!',
            },
          ]}
        >
          <Input placeholder="책 제목" />
        </Form.Item>
        <Form.Item
          name="category"
          label="카테고리 선택"
          rules={[
            {
              required: true,
              message: '책 제목을 입력해주세요!',
            },
          ]}
        >
          <Select
            style={{ width: '100%' }}
            placeholder="카테고리를 선택해 주세요."
          >
            <Select.Option>카테고리선택</Select.Option>
            {category &&
              category.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.mybookcate_info.name}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
