import { OrderedListOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { forwardRef, useCallback, useState } from "react";
import CategorySettingModal from "./CategorySettingModal";

// eslint-disable-next-line react/display-name
const CategorySettingButton = forwardRef(({ category }, ref) => {
  const [visible, setVisible] = useState(false);
  const changeVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      <div
        className="customCircleButton-CategoryManager"
        style={{
          width: "34px",
          height: "16px",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          setVisible(!visible);
        }}
      >
        <OrderedListOutlined className="writeUnliked" style={{ color: "#DEE2E6" }} />
      </div>
      <CategorySettingModal visible={visible} ref={ref} changeVisible={changeVisible} category={category} />
    </>
  );
});

export default CategorySettingButton;
