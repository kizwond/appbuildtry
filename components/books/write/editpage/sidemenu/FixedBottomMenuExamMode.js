import React, { useEffect, useState } from "react";
import { message, Space, Drawer } from "antd";
import { HighlightOutlined, UnderlineOutlined, EyeInvisibleOutlined, DashOutlined, SoundOutlined } from "@ant-design/icons";

import StudyToolSetting from "../../../study/mode/StudyToolSetting";
import StudyGeneralSetting from "../../../study/mode/StudyGeneralSetting";

const FloatingMenu = ({ cardTypeSets }) => {
  const [bottomVisible, setBottomVisible] = useState(false);

  function hideAll() {
    setBottomVisible(!bottomVisible);
  }
  const onClose = () => {
    setBottomVisible(false);
  };
  return (
    <>
      <div style={{ width:"100%", position: "fixed", bottom: 0}}>
        <div style={{ margin:"auto", width: "100%", maxWidth:"1024px", alignItems: "center", zIndex: 3, fontSize: "0.8rem" }}>
          <div
            style={{
              margin: "auto",
              background: "#484848",
              // background: "#e9e9e9",
              // borderBottom: "none",
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              // padding: 5,
              boxShadow: "0px -1px 2px 0px #b4b4b4",
              alignItems: "center",
              color: "#c6c6c6",
              // color: "#5b5b5b",
              borderRadius: "13px 13px 0 0",
            }}
          >
            <div
              style={{
                margin: 0,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                listStyle: "none",
                alignItems: "center",
                justifyContent: "space-around",
                height:"40px"
              }}
            >
              {/* <div onClick={hideAll} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <DashOutlined style={{ fontSize: "1.5rem" }} />
                더보기
              </div> */}

              <Drawer className="moreBottomDrawer" maskStyle={{ marginTop: "40px" }} height="300px" placement="bottom" closable={false} onClose={onClose} visible={bottomVisible}>
                <Space
                  size={16}
                  style={{ padding: 20, display: "flex", flexDirection: "flex-start", justifyContent: "flex-start", flexWrap: "wrap", fontSize: "0.8rem", color: "#7a7a7a" }}
                >
                  
                </Space>
              </Drawer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FloatingMenu;
