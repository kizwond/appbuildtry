import React, { useEffect, useState } from "react";
import { Button, Popover, Space } from "antd";
import M_LeftDrawerDirectRead from "../M_LeftDrawerDirectRead";

const FloatingMenu = ({
  index_changed,
  indexSets
}) => {

  return (
    <div style={{ width: "100%", alignItems: "center", position: "fixed", bottom: 0, left:0, zIndex: 3, fontSize: "0.8rem" }}>
      <div
        style={{
          margin: "auto",
          background: "white",
          // borderRadius: "5px 5px 0 0",
          borderBottom: "none",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 5,
          boxShadow: "0px -1px 6px -1px #999999",
          alignItems: "center",
          color: "#5b5b5b",
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
          }}
        >
          <M_LeftDrawerDirectRead index_changed={index_changed} indexSets={indexSets}/>
         </div>
      </div>
    </div>
  );
};

export default FloatingMenu;
