/* eslint-disable react/display-name */
import styled from "styled-components";

import { Table, Card, Popover, Button, Input, Space, Form } from "antd";
import { DollarCircleFilled } from "@ant-design/icons";

import { StyledDivEllipsis } from "../common/styledComponent/page";
import { MUTATION_CREATE_BUY_BOOK_FROM_MY_BOOK } from "../../graphql/mutation/buyBook";
import { GET_ALL_BUY_BOOKS } from "../../graphql/query/allQuery";
import { useMutation } from "@apollo/client";

const M_MyBooksTable = ({ bookData, loading, error }) => {
  const [form] = Form.useForm();
  const { resetFields, submit } = form;

  const [createBuyBookFromMyBook] = useMutation(MUTATION_CREATE_BUY_BOOK_FROM_MY_BOOK, {
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
  });

  const createBuyBook = async ({ mybook_id, buybookcateName, titleForSale }) => {
    try {
      await createBuyBookFromMyBook({
        variables: {
          forCreateBuybook: {
            mybook_id,
            buybookcateName,
            titleForSale,
          },
        },
        // update: (cache, { data: { buybook_createBuybook } }) => {
        //   const _data = cache.readQuery({
        //     query: GET_ALL_BUY_BOOKS,
        //   });
        //   console.log({ _data, buybook_createBuybook });
        //   cache.writeQuery({
        //     query: GET_ALL_BUY_BOOKS,
        //     data: {
        //       ..._data,
        //       buybook_getAllBuybook: {
        //         ..._data.buybook_getAllBuybook,
        //         buybooks: [..._data.buybook_getAllBuybook.buybooks, ...buybook_createBuybook.buybooks],
        //       },
        //     },
        //   });
        // },
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
        const _categoryBooksList = myBook2.filter((_book) => _cate._id === _book.mybook_info.mybookcate_id);
        if (_categoryBooksList.length === 0) {
          return null;
        }

        const categoryBooksList = _categoryBooksList.sort((a, b) => a.mybook_info.seqInCategory - b.mybook_info.seqInCategory);

        const data = categoryBooksList.map((_book, _index) => ({
          ..._book.mybook_info,
          ..._book.stats?.numCards,
          relationship: _index === 0 ? "parent" : "children",
          classType:
            _index + 1 === categoryBooksList.length && _index % 2 === 0 ? "last-odd-book" : _index + 1 === categoryBooksList.length && _index % 2 !== 0 ? "last-even-book" : _index % 2 !== 0 ? "even-book" : "odd-book",
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
      className: "categoryCol",
      align: "center",
      width: 50,
      dataIndex: "categoryName",
      render: (_value, _record) => (_record.relationship === "parent" ? <StyledDivEllipsis style={{ marginLeft: "2px" }}>{_value}</StyledDivEllipsis> : null),
    },
    {
      title: "책 제목",
      key: "title",
      dataIndex: "title",
      className: "Row-First-Left",
      align: "center",
      width: 140,
      render: (value, _record, index) => (
        <StyledDivEllipsis>
          <DollarCircleFilled style={{ marginRight: "3px", color: "aqua" }} />
          {value}
        </StyledDivEllipsis>
      ),
    },
    {
      title: "카드수",
      key: "total",
      dataIndex: "total",
      className: "normal",
      align: "center",
      ellipsis: true,
      width: 40,
      render: (_value, _record) => (
        <div style={{ width: "100%" }}>
          <Popover
            arrowPointAtCenter
            content={
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>읽기카드:</div>
                  <div>{_record.read}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>뒤집기카드:</div>
                  <div>{_record.flip}</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>목차카드:</div>
                  <div>수정必</div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>일반카드:</div>
                  <div>수정必</div>
                </div>
              </>
            }
            trigger="click"
            overlayClassName="M-Popover-NumberOfCards"
          >
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", cursor: "pointer", width: "100%" }}>{_value}</div>
          </Popover>
        </div>
      ),
    },

    {
      // title: "상설",
      className: "Row-Last-One",
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
            record.classType === "last-odd-book" ? "lastOddBook" : record.classType === "last-even-book" ? "lastEvenBook" : record.classType === "even-book" ? "EvenNumberRow" : "OddNumberRow"
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
                  <Form.Item label="카테고리 선택" name="buybookcateName" rules={[{ required: true, message: "판매 카테고리를 설정해주세요" }]}>
                    <Input size="small" allowClear />
                  </Form.Item>
                  <Form.Item label="판매 책 제목 설정" name="titleForSale" rules={[{ required: true, message: "판매 책 제목은 필수입니다" }]}>
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

  & .ant-table table {
    border-collapse: collapse;
    background-color: white;
    overflow: hidden;
  }
  & .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding: 0;
  }
  & .ant-table.ant-table-small .ant-table-thead > tr > th {
    padding: 4px 0px;
  }
  & .ant-table-thead > tr > th:not(:last-child):not(.ant-table-selection-column):not(.ant-table-row-expand-icon-cell):not([colspan])::before {
    display: none;
  }

  & .categoryCol {
    border-bottom: none;
  }

  & .Row-Last-One {
    position: relative;
    z-index: 3;
    background-color: white;
  }

  & .LastHiddenBar > .Row-First-Left > div {
    background: #e0e2f4;
    border-radius: 8px;
    margin: 3px 0px;
    display: flex;
    align-items: center;
    padding-left: 15px;
    height: 30px;
    font-size: 0.7rem;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .LastHiddenBar > .categoryCol,
  & .lastEvenBook > .categoryCol,
  & .lastOddBook > .categoryCol {
    border-bottom: 0.5px solid #dfdfdf;
  }

  & .LastHiddenBar > .Row-First-Left {
    border-bottom: 0.5px solid #dfdfdf;
  }

  & .lastEvenBook > .Row-First-Left,
  & .lastEvenBook > .normal,
  & .lastEvenBook > .Row-Last-One {
    border-bottom: 0.5px solid #dfdfdf;
  }

  & .lastEvenBook > .normal > div,
  & .lastEvenBook > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastEvenBook > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .lastEvenBook > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .lastEvenBook > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .lastOddBook > .Row-First-Left,
  & .lastOddBook > .normal,
  & .lastOddBook > .Row-Last-One {
    border-bottom: 0.5px solid #dfdfdf;
  }

  & .lastOddBook > .normal > div,
  & .lastOddBook > .Row-Last-One > div {
    background-color: #fff;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastOddBook > .Row-First-Left > div {
    background-color: #fff;
    height: 34px;

    margin-bottom: 3px;
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .lastOddBook > .normal > div.BookOrder {
    color: #fff;
  }

  & .lastOddBook > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .EvenNumberRow > .normal > div,
  & .EvenNumberRow > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .EvenNumberRow > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 34px;

    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .EvenNumberRow > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .EvenNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .OddNumberRow > .normal > div,
  & .OddNumberRow > .Row-Last-One > div {
    background-color: #fff;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .OddNumberRow > .Row-First-Left > div {
    background-color: #fff;
    height: 34px;

    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .OddNumberRow > .normal > div.BookOrder {
    color: #fff;
  }

  & .OddNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .ant-table-thead .categoryCol {
    border-bottom: 1px solid #f0f0f0;
  }

  & .ant-table-tbody > tr > td {
    border-bottom: none;
  }
`;
