import { useMutation } from "@apollo/client";
import { Card, Drawer, Form, Input } from "antd";
import React, { useState } from "react";
import styled from "styled-components";

import { MUTATION_CREATE_BUY_BOOK_FROM_MY_BOOK } from "../../graphql/mutation/buyBook";
import { QUERY_BUY_BOOKS } from "../../graphql/query/allQuery";

const M_registerBuyBookDrawer = ({ mybook_id, visible, closeDrawer }) => {
  const [form] = Form.useForm();
  const { resetFields, submit } = form;

  const [createBuyBookFromMyBook] = useMutation(
    MUTATION_CREATE_BUY_BOOK_FROM_MY_BOOK,
    {
      onCompleted: (_data) => {
        if (_data.buybook_createBuybook.msg == "책 생성 성공적!") {
          console.log("receivedData", _data);
          resetFields();
          closeDrawer();
        } else if (_data.buybook_createBuybook.status === "401") {
          router.push("/m/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
    }
  );

  const createBuyBook = async ({
    mybook_id,
    buybookcateName,
    titleForSale,
  }) => {
    try {
      await createBuyBookFromMyBook({
        variables: {
          forCreateBuybook: {
            mybook_id,
            buybookcateName,
            titleForSale,
          },
        },
        update: (cache, { data: { buybook_createBuybook } }) => {
          const _data = cache.readQuery({
            query: QUERY_BUY_BOOKS,
          });
          console.log({ _data, buybook_createBuybook });
          cache.writeQuery({
            query: QUERY_BUY_BOOKS,
            data: {
              ..._data,
              buybook_getAllBuybook: {
                ..._data.buybook_getAllBuybook,
                buybooks: [
                  ..._data.buybook_getAllBuybook.buybooks,
                  ...buybook_createBuybook.buybooks,
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
            createBuyBook({ mybook_id, ...values });
          }}
        >
          <Form.Item
            label="카테고리 선택"
            name="buybookcateName"
            rules={[
              {
                required: true,
                message: "판매 카테고리를 설정해주세요",
              },
            ]}
          >
            <Input size="small" allowClear />
          </Form.Item>
          <Form.Item
            label="판매 책 제목 설정"
            name="titleForSale"
            rules={[{ required: true, message: "판매 책 제목은 필수입니다" }]}
          >
            <Input size="small" allowClear />
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
