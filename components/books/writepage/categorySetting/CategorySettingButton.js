import { OrderedListOutlined } from "@ant-design/icons";
import React, { forwardRef, useCallback, useState } from "react";
import { StyledButtonForMainPage } from "../../../common/styledComponent/buttons";
import CategorySettingModal from "./CategorySettingModal";

// eslint-disable-next-line react/display-name
const CategorySettingButton = forwardRef(({ category }, ref) => {
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
        <OrderedListOutlined className="IconForButton" />
      </StyledButtonForMainPage>
      <CategorySettingModal
        visible={visible}
        ref={ref}
        changeVisible={changeVisible}
        category={category}
      />
    </>
  );
});

export default CategorySettingButton;
