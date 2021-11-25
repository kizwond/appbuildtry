import React, { useState, useEffect } from "react";
import { Drawer } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { FlagOutlined } from "@ant-design/icons";
import FlagStyleContainer from "./flagstyle/FlagStyleContainer";

const M_FlagSettingDrawer = ({ cardTypeSets, cardTypeSetId }) => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = localStorage.getItem("book_id");
    console.log(book_id);
    if (book_id !== null) {
      localStorage.removeItem("book_id");
      localStorage.setItem("book_id", book_id);
    } else {
      localStorage.setItem("book_id", book_id);
    }
  }
  const [visible, setVisible] = useState(false);

  const [cardTypes, setCardTypes] = useState([]);

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남??");
    if (cardTypeSets) {
      console.log("cardtypesetting page", cardTypeSets);
    }
  }, [cardTypeSets]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div onClick={showDrawer} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <FlagOutlined style={{ fontSize: "1.3rem" }} />
        플래그설정
      </div>

      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>플래그 세팅</span>
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
          <FlagStyleContainer cardTypeSets={cardTypeSets} cardTypeSetId={cardTypeSetId} />
        </div>
      </Drawer>
    </>
  );
};

export default M_FlagSettingDrawer;
