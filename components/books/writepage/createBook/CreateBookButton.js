import { FormOutlined } from "@ant-design/icons";
import React, { useCallback, useState } from "react";
import CreateBookModal from "./CreateBookModal";

const CreateBookButton = ({ category }) => {
  const [visible, setVisible] = useState(false);

  const changeVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      <button
        className="customButtonForMainPage"
        type="button"
        style={{
          width: "34px",
          height: "16px",
          borderRadius: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          border: "none",
        }}
        onClick={() => {
          setVisible(!visible);
        }}
      >
        <FormOutlined className="writeUnliked" style={{ color: "#DEE2E6" }} />
      </button>
      {visible && <CreateBookModal visible={visible} changeVisible={changeVisible} category={category} />}
    </>
  );
};

export default CreateBookButton;
