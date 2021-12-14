/* eslint-disable react/display-name */
import React, { useState } from "react";

import { useQuery } from "@apollo/client";
import { GET_MY_BOOK_BY_BOOK_IDS__AND_ALL_BOOK_CATEGORIES } from "../../../../graphql/query/allQuery";

import { useRouter } from "next/router";
import Head from "next/head";

import { Card, Select, Space, Avatar } from "antd";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  FileSyncOutlined,
  FlagOutlined,
  FundViewOutlined,
  RiseOutlined,
} from "@ant-design/icons";

import styled from "styled-components";
import { StyledDivEllipsis } from "../../../../components/common/styledComponent/page";

import M_Layout from "../../../../components/layout/M_Layout";
import M_FlagSetting from "../../../../components/books/settings/flagSetting/M_FlagSetting";
import M_DeleteBook from "../../../../components/books/settings/deleteBook/M_DeleteBook";
import M_LevelAndCycleSetting from "../../../../components/books/settings/levelAndCycleSetting/M_LevelAndCycleSetting";
import M_ReAssignBookToAnotherCategory from "../../../../components/books/settings/reasignBookToAnotherCategory/M_ReAssignBookToAnotherCategory";

const BookSetting = () => {
  const { query, push } = useRouter();

  const [selectedMenu, setSelectedMenu] = useState("");

  const { data, loading, error } = useQuery(
    GET_MY_BOOK_BY_BOOK_IDS__AND_ALL_BOOK_CATEGORIES,
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
        return null;
        break;
      case "set_flags":
        return <M_FlagSetting />;
        break;
      case "cards_progress":
        return null;
        break;
      case "set_level_and_cycle":
        return <M_LevelAndCycleSetting book_id={query.book_id} />;
        break;
      case "select_category":
        return (
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
        );
        break;
      case "delete_book":
        return <M_DeleteBook book_id={query.book_id} />;
        break;

      default:
        break;
    }
  };

  return (
    <div>
      <Head>
        <title>콕북 - 책 상세 설정</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
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
                    <StyledDivEllipsis
                      style={{
                        fontSize: "1rem",
                        fontWeight: "bolder",
                        color: "#747474",
                        borderBottom: "1px dashed lightgray",
                        marginBottom: "4px",
                        paddingBottom: "4px",
                        // textAlign: "center",
                      }}
                    >
                      책 제목:{" "}
                      {
                        data.mybook_getMybookByMybookIDs.mybooks[0].mybook_info
                          .title
                      }
                    </StyledDivEllipsis>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: "14px",
                      }}
                    >
                      <div className="ForPageMainTitle">상세 설정</div>
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
                    <Select.Option
                      value="study_data_detail"
                      label="학습 상세 정보 보기"
                    >
                      <Space>
                        <Avatar>
                          <RiseOutlined />
                        </Avatar>
                        학습 상세 정보 보기
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
                      label="카드 학습 상태 관리"
                    >
                      <Space>
                        <Avatar>
                          <FundViewOutlined />
                        </Avatar>
                        카드 학습 상태 관리
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
                    <Select.Option
                      value="select_category"
                      label="카테고리 이동"
                    >
                      <Space>
                        <Avatar>
                          <AppstoreAddOutlined />
                        </Avatar>
                        카테고리 이동
                      </Space>
                    </Select.Option>
                    <Select.Option value="delete_book" label="책 삭제">
                      <Space>
                        <Avatar>
                          <DeleteOutlined />
                        </Avatar>
                        책 삭제
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
  margin: 0 auto;
  position: absolute;
  top: 40px;
  width: 100%;

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
