import { Button } from "antd";
import React, { useCallback, useState } from "react";
import CreateBookModal from "./CreateBookModal";

const CreateBookButton = ({ category }) => {
  const [visible, setVisible] = useState(false);

  const changeVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      <Button size="small" type="primary" onClick={() => changeVisible(true)}>
        새 책 만들기
      </Button>

      <CreateBookModal visible={visible} changeVisible={changeVisible} category={category} />
    </>
  );
};

export default CreateBookButton;
