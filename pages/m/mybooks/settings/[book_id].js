/* eslint-disable react/display-name */
import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import { QUERY_USER_BOOKS_BY_BOOK_IDS__WITH_USER_CATEGORIES } from "../../../../graphql/query/allQuery";

import { useRouter } from "next/router";
import Head from "next/head";

import { Card, Select, Space, Avatar } from "antd";
import {
  AppstoreAddOutlined,
  CloseOutlined,
  DeleteOutlined,
  FileSyncOutlined,
  FlagOutlined,
  FundViewOutlined,
  RiseOutlined,
  ScissorOutlined,
} from "@ant-design/icons";

import styled from "styled-components";
import { StyledDivEllipsis } from "../../../../components/common/styledComponent/page";

import M_Layout from "../../../../components/layout/M_Layout";
import M_FlagSetting from "../../../../components/books/settings/flagSetting/M_FlagSetting";
import M_DeleteBook from "../../../../components/books/settings/deleteBook/M_DeleteBook";
import M_LevelAndCycleSetting from "../../../../components/books/settings/levelAndCycleSetting/M_LevelAndCycleSetting";
import M_ReAssignBookToAnotherCategory from "../../../../components/books/settings/reasignBookToAnotherCategory/M_ReAssignBookToAnotherCategory";
import M_ChangeBookTitle from "../../../../components/books/settings/reasignBookToAnotherCategory/M_ChangeBookTitle";

import StudyHistoryPerBook from "../../../../components/common/studyHistoryPerBook/StudyHistoryPerBook";
import M_resetStudyHistory from "../../../../components/books/settings/resetStudyHistory/M_resetStudyHistory";

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
          push("/m/account/login");
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
        return <StudyHistoryPerBook mybook_id={query.book_id} forWhom="me" />;
        break;
      case "set_flags":
        return <M_FlagSetting />;
        break;
      case "cards_progress":
        return (
          <div>
            <div className="BookSettingContentTitle">책 삭제</div>
            <M_resetStudyHistory
              book_id={query.book_id}
              bookTitle={
                data.mybook_getMybookByMybookIDs.mybooks[0].mybook_info.title
              }
            />
          </div>
        );
        break;
      case "set_level_and_cycle":
        return <M_LevelAndCycleSetting book_id={query.book_id} />;
        break;
      case "generalSettings":
        return (
          <Space direction="vertical">
            <div>
              <div className="BookSettingContentTitle">이름수정</div>
              <M_ChangeBookTitle
                book_id={query.book_id}
                bookTitle={
                  data.mybook_getMybookByMybookIDs.mybooks[0].mybook_info.title
                }
              />
            </div>
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
            <div>
              <div className="BookSettingContentTitle">책 삭제</div>
              <M_DeleteBook
                book_id={query.book_id}
                bookTitle={
                  data.mybook_getMybookByMybookIDs.mybooks[0].mybook_info.title
                }
              />
            </div>
          </Space>
        );
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Head>
        <title>책 설정 - CogBook</title>
        <meta charSet="utf-8" />
      </Head>
      {data &&
        data.mybook_getMybookByMybookIDs.mybooks &&
        data.mybook_getMybookByMybookIDs.mybooks.length === 1 && (
          <>
            <M_Layout>
              <StyledMainPageCard
                bordered={false}
                size="small"
                title={
                  <>
                    <StyledForHeader>
                      <EllipsisTitle>
                        책 제목:{" "}
                        {
                          data.mybook_getMybookByMybookIDs.mybooks[0]
                            .mybook_info.title
                        }
                      </EllipsisTitle>
                      <button
                        type="button"
                        aria-label="Close"
                        className="ForCloseButton"
                        onClick={() => {
                          back();
                        }}
                      >
                        <CloseOutlined />
                      </button>
                    </StyledForHeader>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "14px",
                      }}
                    >
                      <div className="ForMobilePageMainTitle">상세 설정</div>
                    </div>
                  </>
                }
              >
                <div>
                  <Select
                    className="BookSettingSelector"
                    onChange={setSelectedMenu}
                    optionLabelProp="label"
                    placeholder="메뉴를 선택해주세요"
                    listHeight={400}
                    style={{ width: "240px", marginBottom: "8px" }}
                  >
                    <Select.Option value="generalSettings" label="일반">
                      <Space>
                        <Avatar>
                          <ScissorOutlined />
                        </Avatar>
                        일반
                      </Space>
                    </Select.Option>

                    <Select.Option value="study_data_detail" label="학습 통계">
                      <Space>
                        <Avatar>
                          <RiseOutlined />
                        </Avatar>
                        학습 통계
                      </Space>
                    </Select.Option>
                    <Select.Option value="set_flags" label="플래그 설정">
                      <Space>
                        <Avatar>
                          <FlagOutlined />
                        </Avatar>
                        플래그 설정
                      </Space>
                    </Select.Option>
                    <Select.Option
                      value="cards_progress"
                      label="학습 상태 관리"
                    >
                      <Space>
                        <Avatar>
                          <FundViewOutlined />
                        </Avatar>
                        학습 상태 관리
                      </Space>
                    </Select.Option>
                    <Select.Option
                      value="set_level_and_cycle"
                      label="레벨 및 복습 주기 설정"
                    >
                      <Space>
                        <Avatar>
                          <FileSyncOutlined />
                        </Avatar>
                        레벨 및 복습 주기 설정
                      </Space>
                    </Select.Option>
                  </Select>
                </div>
                {content(selectedMenu)}
              </StyledMainPageCard>
            </M_Layout>
          </>
        )}
    </div>
  );
};
export default BookSetting;

const StyledMainPageCard = styled(Card)`
  position: relative;
  top: 40px;

  &.ant-card-small > .ant-card-head {
    border-bottom: none;
    padding: 0 8px;
  }

  &.ant-card-small > .ant-card-body {
    padding: 0px 8px 12px 8px;
    width: 100%;
    & * {
      font-size: 1rem;
    }
  }

  & .fa-layers.fa-fw {
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
`;

const StyledForHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  padding-bottom: 4px;
  border-bottom: 1px dashed lightgray;
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
const EllipsisTitle = styled(StyledDivEllipsis)`
  font-size: 1rem;
  color: #747474;
`;
