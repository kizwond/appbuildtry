import { useMutation } from "@apollo/client";
import { Card, Drawer, Form, Input } from "antd";
import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { MUTATION_CREATE_CANDIDATE_BOOK_FROM_MY_BOOK } from "../../graphql/mutation/candidateBook";
import UploadBookcover from "./uploadBookcover";

const M_registerBuyBookDrawer = ({ mybook_id, visible, closeDrawer }) => {
  const router = useRouter();
  const [form] = Form.useForm();
  const { resetFields, submit } = form;

  const imgRef = useRef();

  const [createCandiBookFromMyBook] = useMutation(
    MUTATION_CREATE_CANDIDATE_BOOK_FROM_MY_BOOK,
    {
      onCompleted: (_data) => {
        if (_data.candibook_createCandibook.status == "200") {
          console.log("캔디북 생성 성공적", _data);
          resetFields();
          closeDrawer();
        } else if (_data.candibook_createCandibook.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  const createCandiBook = async ({
    mybook_id,
    titleForSale,
    publisher,
    authorName,
    introductionOfBook,
    introductionOfAuthor,
    listOfIndex,
    hashtag,
  }) => {
    try {
      await createCandiBookFromMyBook({
        variables: {
          forCreateCandibook: {
            originalMybook_id: mybook_id,
            title: titleForSale,
            authorName,
            authorCompany: publisher,
            hashtag,
            coverImage: imgRef.current,
            introductionOfBook,
            introductionOfAuthor,
            listOfIndex,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DrawerWrapper
      title={
        <span
          className="ForMobilePageMainTitle"
          style={{
            marginRight: "10px",
          }}
        >
          도전 출판 책 등록
        </span>
      }
      placement="right"
      width={"100%"}
      visible={visible}
      onClose={closeDrawer}
      headerStyle={{ padding: "8px 12px 8px 12px" }}
      bodyStyle={{ backgroundColor: "#e9e9e9" }}
      mask={false}
    >
      <Card
        style={{ margin: "8px 0 8px", minWidth: 320 }}
        actions={[
          <div
            key="accept"
            onClick={() => {
              resetFields();
              closeDrawer();
            }}
          >
            취소
          </div>,
          <div
            onClick={() => {
              submit();
            }}
            key="decline"
          >
            신청
          </div>,
        ]}
        size="small"
      >
        <Form
          form={form}
          name="requestMentoringForm"
          size="small"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          onFinish={(values) => {
            console.log(values);
            createCandiBook({ mybook_id, ...values });
          }}
        >
          <div className="flex justify-center items-center">
            <UploadBookcover ref={(ref) => (imgRef.current = ref)} />
          </div>
          <Form.Item
            label="판매 책 제목 설정"
            name="titleForSale"
            rules={[{ required: true, message: "판매 책 제목은 필수입니다" }]}
          >
            <Input size="small" allowClear />
          </Form.Item>

          <Form.Item
            label="출판사"
            name="publisher"
            rules={[{ required: false, message: "출판사 이름을 입력하세요" }]}
          >
            <Input size="small" allowClear />
          </Form.Item>
          <Form.Item
            label="저자"
            name="authorName"
            rules={[{ required: true, message: "저자 이름은 필수입니다" }]}
          >
            <Input size="small" allowClear />
          </Form.Item>
          <Form.Item
            label="책소개"
            name="introductionOfBook"
            rules={[{ required: false, message: "책 소개 부탁 드려요" }]}
          >
            <Input.TextArea size="small" allowClear />
          </Form.Item>
          <Form.Item
            label="해쉬태그"
            name="hashtag"
            rules={[{ required: false, message: "해쉬태그 부탁 드려요" }]}
          >
            <Input.TextArea size="small" allowClear />
          </Form.Item>
          <Form.Item
            label="저자소개"
            name="introductionOfAuthor"
            rules={[{ required: false, message: "저자 소개 부탁 드려요" }]}
          >
            <Input.TextArea size="small" allowClear />
          </Form.Item>
          <Form.Item
            label="목차"
            name="listOfIndex"
            rules={[{ required: false, message: "목차 정보 입력 부탁 드려요" }]}
          >
            <Input.TextArea size="small" allowClear />
          </Form.Item>
        </Form>
      </Card>
    </DrawerWrapper>
  );
};

export default M_registerBuyBookDrawer;

const DrawerWrapper = styled(Drawer)`
  top: 40px;
  & .ant-drawer-title {
    line-height: 16px;
  }

  & .ant-card-actions {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    & > li {
      margin: 4px 0;
    }
  }
  & .ant-card-actions > li > span {
    font-size: 0.8rem;
    line-height: 1.5715;
  }
`;
