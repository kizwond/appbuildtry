import { FormOutlined } from "@ant-design/icons";
import React, { useCallback, useState } from "react";
import { StyledButtonForMainPage } from "../../../common/styledComponent/buttons";
import CreateBookModal from "./CreateBookModal";

const CreateBookButton = ({ category }) => {
  const [visible, setVisible] = useState(false);

  const changeVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      <StyledButtonForMainPage
        onClick={() => {
          setVisible(!visible);
        }}
      >
        <FormOutlined className="IconForButton" />
      </StyledButtonForMainPage>
      {visible && (
        <CreateBookModal
          visible={visible}
          changeVisible={changeVisible}
          category={category}
        />
      )}
    </>
  );
};

export default CreateBookButton;