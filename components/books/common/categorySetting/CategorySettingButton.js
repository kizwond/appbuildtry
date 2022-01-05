import { OrderedListOutlined } from "@ant-design/icons";
import React, { forwardRef, useCallback, useState } from "react";
import { StyledButtonForMainPage } from "../../../common/styledComponent/buttons";
import CategorySettingModal from "./CategorySettingModal";

// eslint-disable-next-line react/display-name
const CategorySettingButton = ({
  category,
  categorySetId,
  addNewCategoryIdOnExpandedRowKeys,
  isPc,
}) => {
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
        is_pc={(isPc || false).toString()}
      >
        <OrderedListOutlined className="IconForButton" />
      </StyledButtonForMainPage>
      <CategorySettingModal
        visible={visible}
        addNewCategoryIdOnExpandedRowKeys={addNewCategoryIdOnExpandedRowKeys}
        changeVisible={changeVisible}
        categorySetId={categorySetId}
        category={category}
      />
    </>
  );
};

export default CategorySettingButton;
