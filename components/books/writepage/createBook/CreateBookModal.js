import { useMutation } from '@apollo/client';
import { CREATE_MY_BOOK } from '../../../../graphql/query/writePage';
import { Modal, Form, Input, Select } from 'antd';
import { memo } from 'react';

const CreateBookModal = ({ category, visible, changeVisible, handleToGetMyBook }) => {
  const [form] = Form.useForm();
  const { resetFields } = form;

  const [mybook_create, { data, loading, error }] = useMutation(CREATE_MY_BOOK, {
    onCompleted: (_data) => {
      if (_data.mybook_create.msg == '책 생성 성공적!') {
        handleToGetMyBook(_data.mybook_create.mybooks);
        console.log('receivedData', _data);
      }
    },
  });

  const onCompleted = () => {};

  const postNewMyBook = async (book_title, id) => {
    try {
      await mybook_create({
        variables: {
          title: book_title,
          mybookcate_id: id,
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {console.log('CreateBookModal 랜더링')}

      <Modal
        visible={visible}
        title="새 책 만들기"
        cancelText="취소"
        onCancel={() => changeVisible(false)}
        okButtonProps={{
          form: 'category-editor-form',
          key: 'submit',
          htmlType: 'submit',
        }}
        mask={false} // 모달 바깥 전체화면 덮기 기능
        okText="새 책 만들기 완료"
        confirmLoading={loading}
      >
        <Form
          form={form}
          id="category-editor-form"
          requiredMark={false}
          initialValues={{
            category: category.filter((cate) => cate.mybookcate_info.name === '(미지정)')[0]._id,
          }}
          onFinish={(values) => {
            changeVisible(false);
            postNewMyBook(values.book_title, values.category);
            resetFields();
          }}
          onFinishFailed={(values, errorFields, outOfDate) => {
            console.log('values', values);
            console.log('errorFields', errorFields);
            console.log('outOfDate', outOfDate);
          }}
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
            <Select placeholder="카테고리를 선택해 주세요.">
              <Select.Option>카테고리선택</Select.Option>
              {category.map((category) => (
                <Select.Option key={category._id} value={category._id}>
                  {category.mybookcate_info.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default memo(CreateBookModal);
