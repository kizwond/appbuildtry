/* eslint-disable react/display-name */
import Head from "next/head";
import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import { QUERY_USER_BOOKS_BY_BOOK_IDS__WITH_USER_CATEGORIES } from "../../../graphql/query/allQuery";

import { useRouter } from "next/router";

import { Space, Avatar } from "antd";
import {
  AppstoreAddOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileSyncOutlined,
  FlagOutlined,
  FundViewOutlined,
  RiseOutlined,
} from "@ant-design/icons";

import styled from "styled-components";
import { StyledTwoLinesEllipsis } from "../../../components/common/styledComponent/page";

import Layout from "../../../components/layout/Layout";
import M_FlagSetting from "../../../components/books/settings/flagSetting/M_FlagSetting";
import M_DeleteBook from "../../../components/books/settings/deleteBook/M_DeleteBook";
import M_LevelAndCycleSetting from "../../../components/books/settings/levelAndCycleSetting/M_LevelAndCycleSetting";
import M_ReAssignBookToAnotherCategory from "../../../components/books/settings/reasignBookToAnotherCategory/M_ReAssignBookToAnotherCategory";

const BookSetting = () => {
  const { query, push, back } = useRouter();

  const [selectedMenu, setSelectedMenu] = useState("");

  const { data, loading, error } = useQuery(
    QUERY_USER_BOOKS_BY_BOOK_IDS__WITH_USER_CATEGORIES,
    {
      onCompleted: (_data) => {
        if (
          _data.mybookcateset_getMybookcatesetByUserID.status === "200" &&
          _data.mybook_getMybookByMybookIDs.status === "200"
        ) {
          console.log("책 1권 정보 및 모든 책 카테 정보 받음", _data);
        } else if (
          _data.mybookcateset_getMybookcatesetByUserID.status === "401"
        ) {
          push("/account/login");
        } else {
          console.log("어떤 문제가 발생함");
        }
      },
      variables: {
        mybook_ids: [query.book_id],
      },
    }
  );

  if (loading) <div>로딩 중..</div>;
  if (error) <div>에러 남</div>;

  const content = (menu_item) => {
    switch (menu_item) {
      case "study_data_detail":
        return null;
        break;
      case "set_flags":
        return (
          <div>
            <div className="BookSettingContentTitle">플래그 설정</div>
            <M_FlagSetting />
          </div>
        );
        break;
      case "cards_progress":
        return null;
        break;
      case "set_level_and_cycle":
        return <M_LevelAndCycleSetting book_id={query.book_id} />;
        break;
      case "select_category":
        return (
          <div>
            <div className="BookSettingContentTitle">카테고리 이동</div>
            <M_ReAssignBookToAnotherCategory
              book_id={query.book_id}
              cateIdNow={
                data.mybook_getMybookByMybookIDs.mybooks[0].mybook_info
                  .mybookcate_id
              }
              categories={
                data.mybookcateset_getMybookcatesetByUserID.mybookcatesets[0]
                  .mybookcates
              }
              bookTitle={
                data.mybook_getMybookByMybookIDs.mybooks[0].mybook_info.title
              }
            />
          </div>
        );
        break;
      case "delete_book":
        return (
          <div>
            <div className="BookSettingContentTitle">책 삭제</div>
            <M_DeleteBook book_id={query.book_id} />
          </div>
        );
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Head>
        <title>{"책 상세 설정 - I'mTheBook"}</title>
        <meta charSet="utf-8" />
      </Head>
      {data &&
        data.mybook_getMybookByMybookIDs.mybooks &&
        data.mybook_getMybookByMybookIDs.mybooks.length === 1 && (
          <>
            <Layout>
              <StyledDiv>
                <StyledForHeader>
                  <div className="ForMainTitle">상세 설정</div>

                  <button
                    type="button"
                    aria-
                    className="ForCloseButton"
                    onClick={() => {
                      back();
                    }}
                  >
                    <div className="subTitleForSetting">
                      <CloseOutlined />
                    </div>
                  </button>
                </StyledForHeader>
                <div className="FlexWith8Gap">
                  <div className="BookSettingSiderMenu">
                    <EllipsisTwoLinesForTitle>
                      책 제목:{" "}
                      {
                        data.mybook_getMybookByMybookIDs.mybooks[0].mybook_info
                          .title
                      }
                    </EllipsisTwoLinesForTitle>

                    <div
                      className="subTitleForSettingWrapper"
                      onClick={() => {
                        setSelectedMenu("study_data_detail");
                      }}
                    >
                      <Space>
                        <Avatar>
                          <RiseOutlined />
                        </Avatar>
                        <div className="subTitleForSetting">
                          학습 상세 정보 보기
                        </div>
                      </Space>
                    </div>
                    <div
                      className="subTitleForSettingWrapper"
                      onClick={() => {
                        setSelectedMenu("set_flags");
                      }}
                    >
                      <Space>
                        <Avatar>
                          <FlagOutlined />
                        </Avatar>
                        <div className="subTitleForSetting">플래그 설정</div>
                      </Space>
                    </div>
                    <div
                      className="subTitleForSettingWrapper"
                      onClick={() => {
                        setSelectedMenu("cards_progress");
                      }}
                    >
                      <Space>
                        <Avatar>
                          <FundViewOutlined />
                        </Avatar>
                        <div className="subTitleForSetting">
                          카드 학습 상태 관리
                        </div>
                      </Space>
                    </div>
                    <div
                      className="subTitleForSettingWrapper"
                      onClick={() => {
                        setSelectedMenu("set_level_and_cycle");
                      }}
                    >
                      <Space>
                        <Avatar>
                          <FileSyncOutlined />
                        </Avatar>
                        <div className="subTitleForSetting">
                          레벨 및 복습 주기 설정
                        </div>
                      </Space>
                    </div>
                    <div
                      className="subTitleForSettingWrapper"
                      onClick={() => {
                        setSelectedMenu("select_category");
                      }}
                    >
                      <Space>
                        <Avatar>
                          <AppstoreAddOutlined />
                        </Avatar>
                        <div className="subTitleForSetting">카테고리 이동</div>
                      </Space>
                    </div>
                    <div
                      className="subTitleForSettingWrapper"
                      onClick={() => {
                        setSelectedMenu("delete_book");
                      }}
                    >
                      <Space>
                        <Avatar>
                          <DeleteOutlined />
                        </Avatar>
                        <div className="subTitleForSetting">책 삭제</div>
                      </Space>
                    </div>
                  </div>
                  <div className="BookSettingContentArea">
                    {content(selectedMenu)}
                  </div>
                </div>
              </StyledDiv>
            </Layout>
          </>
        )}
    </div>
  );
};
export default BookSetting;

const StyledDiv = styled.div`
  width: 1024px;
  margin: 0 auto;
  padding: 0 8px;
  & * {
    font-size: 13px;
  }

  .ForMainTitle {
    font-size: 25px;
    font-weight: 500;
  }

  .subTitleForSetting {
    font-size: 16px;
    font-weight: 400;
  }

  .FlexWith8Gap {
    display: flex;
    gap: 8px;
  }

  .BookSettingSiderMenu {
    width: 230px;
    height: calc(100vh - 80px);
    border-right: 1px solid lightgray;
    display: flex;
    flex-direction: column;
    gap: 25px;
  }

  .subTitleForSettingWrapper {
    cursor: pointer;
  }

  .BookSettingContentArea {
    width: 770px;
  }

  .BookSettingContentTitle {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 4px;
  }

  &.ant-card-small > .ant-card-head {
    border-bottom: none;
    padding: 0 8px;
  }

  & .compact-picker {
    width: 280px !important;
  }

  /* ColorPicker 그림자 설정용 서식 지움 */
  & .ForSelectColorPicker + div > div:nth-child(2) > div:nth-child(1) {
    display: none;
  }
  .ant-table table {
    // ColorPicker 잘리는 문제 해결
    overflow: unset;
  }

  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastEvenNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastEvenNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastEvenNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastOddNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastOddNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.LastOddNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.EvenNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.EvenNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.EvenNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.OddNumberRow
    > .TableFirstColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.OddNumberRow
    > .TableMiddleColumn
    > div,
  .ant-table.ant-table-small
    .ant-table-tbody
    > tr.OddNumberRow
    > .TableLastColumn
    > div,
  .ant-table.ant-table-small .ant-table-thead > tr > th {
    font-size: 13px;
  }
`;

const StyledForHeader = styled.div`
  display: flex;
  height: 40px;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 4px;
  border-bottom: 1px solid lightgray;

  & .ForCloseButton {
    display: inline-block;
    color: rgba(0, 0, 0, 0.45);
    font-weight: 700;
    font-size: 16px;
    font-style: normal;
    line-height: 1;
    text-align: center;
    text-transform: none;
    text-decoration: none;
    background: transparent;
    border: 0;
    outline: 0;
    cursor: pointer;
    -webkit-transition: color 0.3s;
    transition: color 0.3s;
    text-rendering: auto;
  }
`;
const EllipsisTwoLinesForTitle = styled(StyledTwoLinesEllipsis)`
  font-size: 16px;
  color: #747474;
  padding: 4px;
`;
