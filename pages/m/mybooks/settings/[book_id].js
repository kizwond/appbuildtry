/* eslint-disable react/display-name */
import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { Card, Select } from "antd";
import styled from "styled-components";

import M_Layout from "../../../../components/layout/M_Layout";
import M_FlagSetting from "../../../../components/books/settings/flagSetting/M_FlagSetting";
import LevelAndCycleSetting from "../../../../components/books/study/LevelAndCycleSetting";
import CategorySetting from "../../../../components/books/study/CategorySetting";
import DeleteBook from "../../../../components/books/study/DeleteBook";
import { StyledFlexSpaceBetween } from "../../../../components/common/styledComponent/page";

const BookSetting = () => {
  const { query } = useRouter();

  const [selectedMenu, setSelectedMenu] = useState("study_data_detail");

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
        return <LevelAndCycleSetting book_id={query.book_id} />;
        break;
      case "select_category":
        return <CategorySetting book_id={query.book_id} />;
        break;
      case "delete_book":
        return <DeleteBook book_id={query.book_id} />;
        break;

      default:
        break;
    }
  };
  const title = (menu_item) => {
    switch (menu_item) {
      case "study_data_detail":
        return "학습 상세 정보 보기";
        break;
      case "set_flags":
        return "플래그 설정";
        break;
      case "cards_progress":
        return "카드 학습 상태 관리";
        break;
      case "set_level_and_cycle":
        return "레벨 및 복습 주기 설정";
        break;
      case "select_category":
        return "카테고리 이동";
        break;
      case "delete_book":
        return "책 삭제";
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
      <M_Layout>
        <StyledMainPageCard
          bordered={false}
          size="small"
          title={
            <StyledFlexSpaceBetween>
              <div
              // onClick={() => setVisible((_prev) => !_prev)}
              >
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  책 상세 설정
                </span>
              </div>
              <div>
                <Select
                  className="aside-container"
                  defaultValue="study_data_detail"
                  onChange={setSelectedMenu}
                  size="small"
                  style={{ width: 180 }}
                >
                  <Select.Option value="study_data_detail">
                    학습 상세 정보 보기
                  </Select.Option>
                  <Select.Option value="set_flags">플래그 설정</Select.Option>
                  <Select.Option value="cards_progress">
                    카드 학습 상태 관리
                  </Select.Option>
                  <Select.Option value="set_level_and_cycle">
                    레벨 및 복습 주기 설정
                  </Select.Option>
                  <Select.Option value="select_category">
                    카테고리 이동
                  </Select.Option>
                  <Select.Option value="delete_book">책 삭제</Select.Option>
                </Select>
              </div>
            </StyledFlexSpaceBetween>
          }
        >
          {content(selectedMenu)}
        </StyledMainPageCard>
      </M_Layout>
    </div>
  );
};
export default BookSetting;

const StyledMainPageCard = styled(Card)`
  margin: 0 auto;
  position: absolute;
  top: 40px;
  width: 100%;
  & * {
    font-size: 1rem;
  }

  &.ant-card-small > .ant-card-head {
    border-bottom: none;
    padding: 0 8px;
  }

  &.ant-card-small > .ant-card-body {
    padding: 0px 8px 12px 8px;
    width: 100%;
  }
`;
