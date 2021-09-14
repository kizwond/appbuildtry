import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import CategorySettingModal from './CategorySettingModal';

const CategorySettingButton = ({ category }) => {
  const [visible, setVisible] = useState(false);

  const changeVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      {console.log('CategorySettingButton 랜더링')}
      <Button size="small" type="primary" onClick={() => changeVisible(true)}>
        카테고리 관리
      </Button>

      <CategorySettingModal
        visible={visible}
        changeVisible={changeVisible}
        category={category}
      />
    </>
  );
};

export default CategorySettingButton;
