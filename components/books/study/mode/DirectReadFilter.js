import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button, Space, Divider } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { DiffOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
const { TabPane } = Tabs;

const RightDrawer = ({ setBottomVisible }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
    setBottomVisible(false);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div onClick={showDrawer} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <DiffOutlined style={{ fontSize: "1.5rem" }} />
        필터설정
      </div>
      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>필터설정</span>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        mask={true}
        width={250}
        style={{ zIndex: 1031 }}
      >
        <div style={{ padding: "0px 10px 0px 10px" }}>
          필터들...
        </div>
      </Drawer>
    </>
  );
};

export default RightDrawer;
