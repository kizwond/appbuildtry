import React, { useState } from "react";
import { Drawer } from "antd";
import { FlagOutlined } from "@ant-design/icons";
import FlagStyleContainer from "./flagstyle/FlagStyleContainer";

const M_FlagSettingDrawer = ({ cardTypeSets, cardTypeSetId }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div
        onClick={showDrawer}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <FlagOutlined style={{ fontSize: "1.3rem" }} />
        플래그설정
      </div>

      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>
              플래그 세팅
            </span>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        mask={true}
        width={250}
      >
        <div>
          <FlagStyleContainer
            cardTypeSets={cardTypeSets}
            cardTypeSetId={cardTypeSetId}
          />
        </div>
      </Drawer>
    </>
  );
};

export default M_FlagSettingDrawer;
