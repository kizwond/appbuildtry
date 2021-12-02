/* eslint-disable react/display-name */
import styled from "styled-components";

import { Table, Card, Popover, Button, Input, Space, Form } from "antd";
import { DollarCircleFilled } from "@ant-design/icons";

import {
  StyledFlexSpaceBetween,
  StyledTwoLinesEllipsis,
} from "../common/styledComponent/page";
import { MUTATION_CREATE_BUY_BOOK_FROM_MY_BOOK } from "../../graphql/mutation/buyBook";
import { GET_ALL_BUY_BOOKS } from "../../graphql/query/allQuery";
import { useMutation } from "@apollo/client";

const M_MyBooksTable = ({ bookData, loading, error }) => {
  const [form] = Form.useForm();
  const { resetFields, submit } = form;

  const [createBuyBookFromMyBook] = useMutation(
    MUTATION_CREATE_BUY_BOOK_FROM_MY_BOOK,
    {
      onCompleted: (_data) => {
        if (_data.buybook_createBuybook.msg == "책 생성 성공적!") {
          console.log("receivedData", _data);
          resetFields();
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
            query: GET_ALL_BUY_BOOKS,
          });
          console.log({ _data, buybook_createBuybook });
          cache.writeQuery({
            query: GET_ALL_BUY_BOOKS,
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

  if (error) <div>에러</div>;
  if (loading) <div>에러</div>;

  const { Search } = Input;

  const myBook2 = bookData && bookData.mybook_getMybookByUserID.mybooks;

  const dataSource =
    myBook2 &&
    bookData.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0].mybookcates
      .map((_cate, _categoryIndex) => {
        const { name, seq } = _cate;
        const _categoryBooksList = myBook2.filter(
          (_book) => _cate._id === _book.mybook_info.mybookcate_id
        );
        if (_categoryBooksList.length === 0) {
          return null;
        }

        const categoryBooksList = _categoryBooksList.sort(
          (a, b) => a.mybook_info.seqInCategory - b.mybook_info.seqInCategory
        );

        const data = categoryBooksList.map((_book, _index) => ({
          ..._book.mybook_info,
          ..._book.stats?.numCards,
          relationship: _index === 0 ? "parent" : "children",
          classType:
            _index + 1 === categoryBooksList.length && _index % 2 === 0
              ? "last-odd-book"
              : _index + 1 === categoryBooksList.length && _index % 2 !== 0
              ? "last-even-book"
              : _index % 2 !== 0
              ? "even-book"
              : "odd-book",
          categoryOrder: seq,
          categoryName: name,
          isLastBook: categoryBooksList.length === _index + 1,
          key: _book._id,
          _id: _book._id,
        }));
        return data;
      })
      .filter((cate) => cate !== null)
      .flat();

  const columns = [
    {
      title: "카테고리",
      key: "categoryName",
      className: "TableGroupingColumn",
      align: "center",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) =>
        _record.relationship === "parent" ? (
          <StyledTwoLinesEllipsis style={{ marginLeft: "2px" }}>
            {_value}
          </StyledTwoLinesEllipsis>
        ) : null,
    },
    {
      title: "책 제목",
      key: "title",
      dataIndex: "title",
      className: "TableFirstColumn",
      align: "center",
      width: 140,
      render: (value, _record, index) => (
        <StyledTwoLinesEllipsis>
          <DollarCircleFilled style={{ marginRight: "3px", color: "aqua" }} />
          {value}
        </StyledTwoLinesEllipsis>
      ),
    },
    {
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "TableMiddleColumn TableCardCounterColumn",
      align: "center",
      width: 35,
      render: (_value, _record) => (
        <div style={{ width: "100%" }}>
          <Popover
            arrowPointAtCenter
            content={
              <>
                <StyledFlexSpaceBetween>
                  <div>읽기카드:</div>
                  <div>{_record.read}</div>
                </StyledFlexSpaceBetween>
                <StyledFlexSpaceBetween>
                  <div>뒤집기카드:</div>
                  <div>{_record.flip}</div>
                </StyledFlexSpaceBetween>
                <StyledFlexSpaceBetween>
                  <div>목차카드:</div>
                  <div>수정必</div>
                </StyledFlexSpaceBetween>
                <StyledFlexSpaceBetween>
                  <div>일반카드:</div>
                  <div>수정必</div>
                </StyledFlexSpaceBetween>
              </>
            }
            trigger="click"
            overlayClassName="M-Popover-NumberOfCards"
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                width: "100%",
              }}
            >
              {_value}
            </div>
          </Popover>
        </div>
      ),
    },

    {
      // title: "상설",
      className: "TableLastColumn",
      align: "center",
      width: 60,
      render: (value, _record, index) => (
        <div>
          <Button type="link" size="small">
            책 등록하기
          </Button>
        </div>
      ),
    },
  ];

  return (
    <StyledCard bordered={false} size="small">
      {myBook2 && (
        <Table
          dataSource={dataSource}
          tableLayout="fixed"
          loading={loading}
          columns={columns}
          size="small"
          pagination={false}
          rowClassName={(record, index) =>
            record.classType === "last-odd-book"
              ? "LastOddNumberRow"
              : record.classType === "last-even-book"
              ? "LastEvenNumberRow"
              : record.classType === "even-book"
              ? "EvenNumberRow"
              : "OddNumberRow"
          }
          expandable={{
            expandRowByClick: true,
            // expandIcon: () => null,
            expandIconColumnIndex: -1,
            expandedRowRender: (_record, _index) => (
              <Card
                style={{ margin: "8px 0 8px", minWidth: 320 }}
                actions={[
                  <div
                    key="accept"
                    onClick={() => {
                      submit();
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
                    createBuyBook({ mybook_id: _record._id, ...values });
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
                    rules={[
                      { required: true, message: "판매 책 제목은 필수입니다" },
                    ]}
                  >
                    <Input size="small" allowClear />
                  </Form.Item>
                </Form>
              </Card>
            ),
          }}
        />
      )}
    </StyledCard>
  );
};

export default M_MyBooksTable;

const StyledCard = styled(Card)`
  /* 모든 폰트 사이즈 */
  /* & * {
    font-size: 0.8rem;
  } */
  & div,
  & button,
  & span,
  & object,
  & iframe,
  & h1,
  & h2,
  & h3,
  & h4,
  & h5,
  & h6,
  & p,
  & blockquote,
  & pre,
  & abbr,
  & address,
  & cite,
  & code,
  & del,
  & dfn,
  & em,
  & img,
  & ins,
  & kbd,
  & q,
  & samp,
  & small,
  & strong,
  & sub,
  & sup,
  & var,
  & b,
  & i,
  & dl,
  & dt,
  & dd,
  & ol,
  & ul,
  & li,
  & fieldset,
  & form,
  & label,
  & legend,
  & table,
  & caption,
  & tbody,
  & tfoot,
  & thead,
  & tr,
  & th,
  & td,
  & article,
  & aside,
  & canvas,
  & details,
  & figcaption,
  & figure,
  & footer,
  & header,
  & hgroup,
  & menu,
  & nav,
  & section,
  & summary,
  & time,
  & mark,
  & audio,
  & video,
  & input {
    font-size: 0.8rem;
  }

  & .ant-input.ant-input-sm {
    height: 24px;
  }

  & > .ant-card-body {
    padding: 3px;
  }
`;
