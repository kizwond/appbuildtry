import { gql, useMutation } from "@apollo/client";
import { Modal, Form, Input, Select } from "antd";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { memo } from "react";
import styled from "styled-components";
import { FRAGMENT_MYBOOK } from "../../../../graphql/fragment/book";
import { MUTATION_CREATE_MY_BOOK } from "../../../../graphql/mutation/myBook";

const CreateBookModal = ({ category, visible, changeVisible }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { resetFields, getFieldInstance } = form;

  useEffect(() => {
    getFieldInstance("book_title").focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [mybook_create, { loading }] = useMutation(MUTATION_CREATE_MY_BOOK, {
    onCompleted: (_data) => {
      if (_data.mybook_createMybook.msg == "책 생성 성공적!") {
        console.log("receivedData", _data);
      } else if (_data.mybook_createMybook.status === "401") {
        router.push("/m/account/login");
      } else {
        console.log("어떤 문제가 발생함");
      }
    },
  });

  const postNewMyBook = async (book_title, id) => {
    try {
      await mybook_create({
        variables: {
          forCreateMybook: {
            mybookcateset_id: category._id,
            mybookcate_id: id,
            title: book_title,
          },
        },
        update: (cache, { data: { mybook_createMybook } }) => {
          const _data = cache.readQuery({
            query: gql`
              ${FRAGMENT_MYBOOK}
              query {
                mybook_getMybookByUserID {
                  status
                  msg
                  mybooks {
                    ...MyBookFragment
                  }
                }
              }
            `,
          });
          console.log({ _data, mybook_createMybook });
          cache.writeQuery({
            query: gql`
              ${FRAGMENT_MYBOOK}
              query {
                mybook_getMybookByUserID {
                  status
                  msg
                  mybooks {
                    ...MyBookFragment
                  }
                }
              }
            `,
            data: {
              ..._data,
              mybook_getMybookByUserID: {
                ..._data.mybook_getMybookByUserID,
                mybooks: [
                  ..._data.mybook_getMybookByUserID.mybooks,
                  ...mybook_createMybook.mybooks,
                ],
              },
            },
          });
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <StyledModal
        visible={visible}
        title={<div className="ForPageMainTitle">새 책 만들기</div>}
        cancelText="취소"
        onCancel={() => changeVisible(false)}
        okButtonProps={{
          form: "category-editor-form",
          key: "submit",
          htmlType: "submit",
          size: "small",
        }}
        cancelButtonProps={{
          size: "small",
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
            category: category.mybookcates.filter(
              (cate) => cate.name === "(미지정)"
            )[0]._id,
          }}
          onFinish={(values) => {
            changeVisible(false);
            postNewMyBook(values.book_title, values.category);
            resetFields();
          }}
          onFinishFailed={(values, errorFields, outOfDate) => {
            console.log("values", values);
            console.log("errorFields", errorFields);
            console.log("outOfDate", outOfDate);
          }}
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
            <Input placeholder="책 제목" />
          </Form.Item>
          <Form.Item
            name="category"
            label="카테고리 선택"
            rules={[
              {
                required: true,
                message: "책 제목을 입력해주세요!",
              },
            ]}
          >
            <Select placeholder="카테고리를 선택해 주세요." size="small">
              {category.mybookcates.map((_category) => (
                <Select.Option key={_category._id} value={_category._id}>
                  {_category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </StyledModal>
    </>
  );
};

export default memo(CreateBookModal);

const StyledModal = styled(Modal)`
  min-width: 300px;

  & .ant-modal-body {
    padding: 8px 24px 8px 24px;
    & * {
      font-size: 0.8rem;
    }
  }

  & .ant-form-item-label {
    padding: 0;
  }
  & .ant-form-item-label > label {
    height: auto;
    font-size: 0.9rem;
    font-weight: 500;
  }

  & .ant-row.ant-form-item {
    margin-bottom: 8px;
  }

  & .ant-modal-footer {
    padding: 10px 24px;
  }
`;
