import { Button } from 'antd';
import React, { useCallback, useState } from 'react';
import ModalForm from './ModalForm';

const CreateBookComponent = ({ category }) => {
  const [visible, setVisible] = useState(false);

  const onToggleVisible = useCallback((_boolean) => {
    setVisible(_boolean);
  }, []);

  return (
    <>
      <Button type="primary" onClick={() => onToggleVisible(true)}>
        새 책 만들기
      </Button>

      <ModalForm
        visible={visible}
        onToggleVisible={onToggleVisible}
        category={category}
      />
    </>
  );
};

export default CreateBookComponent;
