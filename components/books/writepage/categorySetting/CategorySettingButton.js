import { Button } from 'antd';
import React, { forwardRef, useCallback, useState } from 'react';
import CategorySettingModal from './CategorySettingModal';

// eslint-disable-next-line react/display-name
const CategorySettingButton = forwardRef(({ category, handleToGetMyCategory, handleToGetMyBook }, ref) => {
  const [visible, setVisible] = useState(false);
  console.log(ref);
  const changeVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      <Button size="small" type="primary" onClick={() => changeVisible(true)}>
        카테고리 관리
      </Button>

      <CategorySettingModal
        visible={visible}
        ref={ref}
        changeVisible={changeVisible}
        category={category}
        handleToGetMyCategory={handleToGetMyCategory}
        handleToGetMyBook={handleToGetMyBook}
      />
    </>
  );
});

export default CategorySettingButton;
