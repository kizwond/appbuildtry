import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import CreateBookModal from './CreateBookModal';

const CreateBookButton = ({ category }) => {
  const [visible, setVisible] = useState(false);

  const onToggleVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      {console.log('CreateBookButton 랜더링')}
      <Button size="small" type="primary" onClick={() => onToggleVisible(true)}>
        새 책 만들기
      </Button>

      <CreateBookModal
        visible={visible}
        onToggleVisible={onToggleVisible}
        category={category}
      />
    </>
  );
};

export default CreateBookButton;
