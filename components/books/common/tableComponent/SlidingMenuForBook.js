import React from "react";

import { DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import { Space } from "antd";

import { StyledBookSettingBarDrawer } from "../../../common/styledComponent/antd/StyledBookSettingBarDrawer";
import BookOrderButton from "../BookOrderButton";
import FavoriteBook from "../FavoriteBook";
import HideOrShowButton from "../HideOrShowButton";
import MoveToBookSetting from "../MoveToBookSetting";

const SlidingMenuForBook = ({
  _record,
  isFoldedMenu,
  changeFoldedMenu,
  isPc,
  favorite,
}) => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          cursor: "pointer",
          display: "flex",
          justifyContent: "end",
        }}
        onClick={() => {
          changeFoldedMenu(favorite ? `favorite:${_record._id}` : _record.id);
        }}
      >
        <div
          className="PullCustomCircleButton"
          style={{
            width: "44px",
            height: "3rem",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DoubleLeftOutlined />
        </div>
      </div>
      <StyledBookSettingBarDrawer
        booktype={_record.type}
        destroyOnClose={true}
        className="BookDrawerMenu"
        placement="right"
        width={"250px"}
        closable={false}
        mask={false}
        visible={
          (favorite ? `favorite:${_record._id}` : _record.id) === isFoldedMenu
        }
        getContainer={false}
      >
        <Space size={3}>
          <BookOrderButton
            _record={_record}
            changeFoldedMenu={changeFoldedMenu}
            isPc={isPc || false}
          />{" "}
          |
          <FavoriteBook
            record={_record}
            changeFoldedMenu={changeFoldedMenu}
            tableType="write"
            isPc={isPc || false}
          />{" "}
          |
          <HideOrShowButton
            record={_record}
            changeFoldedMenu={changeFoldedMenu}
            isPc={isPc || false}
          />{" "}
          |
          <MoveToBookSetting mybook_id={_record._id} isPc={isPc || false} />
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
    </div>
  );
};

export default SlidingMenuForBook;
