import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button, Space, Divider } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { ToolOutlined } from "@ant-design/icons";

const RightDrawer = ({cardTypeSets}) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div onClick={showDrawer} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ToolOutlined style={{ fontSize: "1.3rem" }} />
        도구설정
      </div>
      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>학습도구설정</span>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        mask={true}
        width={250}
        style={{zIndex:1031}}
        
      >
        <Space direction="vertical">
          <div >hello</div>
        </Space>
      </Drawer>
    </>
  );
};

export default RightDrawer;
