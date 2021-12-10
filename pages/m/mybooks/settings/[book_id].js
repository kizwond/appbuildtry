/* eslint-disable react/display-name */
import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { Card, Select, Space } from "antd";
import styled from "styled-components";

import M_Layout from "../../../../components/layout/M_Layout";
import M_FlagSetting from "../../../../components/books/settings/flagSetting/M_FlagSetting";
import CategorySetting from "../../../../components/books/study/CategorySetting";
import DeleteBook from "../../../../components/books/study/DeleteBook";
import {
  StyledDivEllipsis,
  StyledFlexSpaceBetween,
  StyledTwoLinesEllipsis,
} from "../../../../components/common/styledComponent/page";
import M_LevelAndCycleSetting from "../../../../components/books/settings/levelAndCycleSetting/M_LevelAndCycleSetting";
import Avatar from "antd/lib/avatar/avatar";
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  FileSyncOutlined,
  FlagOutlined,
  FundViewOutlined,
  RiseOutlined,
} from "@ant-design/icons";

const BookSetting = () => {
  const { query } = useRouter();
  // const [isActive, setIsActive] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState("");

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

  const items = ["apple", "King of fruits", "Orange"];

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
                책 제목: 동해물과 백두산이 마르고 닳도록 하느님
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
              listHeight={300}
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
              <Select.Option value="cards_progress" label="카드 학습 상태 관리">
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
              <Select.Option value="select_category" label="카테고리 이동">
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
