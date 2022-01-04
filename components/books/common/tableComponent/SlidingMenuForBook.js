import React from "react";

import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { Space } from "antd";

import { StyledBookSettingBarDrawer } from "../../../common/styledComponent/antd/StyledBookSettingBarDrawer";
import BookOrderButton from "../BookOrderButton";
import FavoriteBook from "../FavoriteBook";
import FavoriteBookOrderButton from "../FavoriteBookOrderButton";
import HideOrShowButton from "../HideOrShowButton";
import MoveToBookSetting from "../MoveToBookSetting";
import styled from "styled-components";

const SlidingMenuForBook = ({
  record,
  isFoldedMenu,
  changeFoldedMenu,
  isPc,
  favorite,
  tableType,
}) => {
  return (
    <StyledDiv>
      <div
        className="OpenMenuButton"
        onClick={() => {
          changeFoldedMenu(favorite ? `favorite:${record._id}` : record._id);
        }}
      >
        <div className="PullCustomCircleButton">
          <DoubleLeftOutlined />
        </div>
      </div>
      <StyledBookSettingBarDrawer
        booktype={record.type}
        destroyOnClose={true}
        className="BookDrawerMenu"
        placement="right"
        width={"250px"}
        closable={false}
        mask={false}
        visible={
          (favorite ? `favorite:${record._id}` : record._id) === isFoldedMenu
        }
        getContainer={false}
      >
        <Space size={3}>
          {favorite ? (
            <FavoriteBookOrderButton
              record={record}
              changeFoldedMenu={changeFoldedMenu}
              tableType={tableType}
              isPc
            />
          ) : (
            <BookOrderButton
              record={record}
              changeFoldedMenu={changeFoldedMenu}
              isPc={isPc || false}
            />
          )}
          |
          <FavoriteBook
            record={record}
            changeFoldedMenu={changeFoldedMenu}
            tableType={tableType}
            isPc={isPc || false}
          />
          |
          <HideOrShowButton
            record={record}
            changeFoldedMenu={changeFoldedMenu}
            isPc={isPc || false}
          />
          |
          <MoveToBookSetting mybook_id={record._id} isPc={isPc || false} />
        </Space>
        <div
          className="PushCustomCircleButton"
          onClick={() => {
            changeFoldedMenu("");
          }}
        >
          <DoubleRightOutlined />
        </div>
      </StyledBookSettingBarDrawer>
    </StyledDiv>
  );
};

export default SlidingMenuForBook;

const StyledDiv = styled.div`
  position: relative;
  & > .OpenMenuButton {
    width: 100%;
    cursor: pointer;
    display: flex;
    justify-content: end;
    & > .PullCustomCircleButton {
      width: 44px;
      height: 3rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
