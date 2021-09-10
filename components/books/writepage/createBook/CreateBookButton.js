import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import CreateBookModal from './CreateBookModal';

const CreateBookButton = ({ category, handleToGetMyBook }) => {
  const [visible, setVisible] = useState(false);

  const changeVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      {console.log('CreateBookButton 랜더링')}
      <Button size="small" type="primary" onClick={() => changeVisible(true)}>
        새 책 만들기
      </Button>

      <CreateBookModal
        visible={visible}
        changeVisible={changeVisible}
        category={category}
        handleToGetMyBook={handleToGetMyBook}
      />
    </>
  );
};

export default CreateBookButton;
