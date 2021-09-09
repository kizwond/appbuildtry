import { useMutation } from '@apollo/client';
import { memo } from 'react';
import { Modal, Button } from 'antd';

const CategorySettingModal = ({ category, visible, onToggleVisible }) => {
  return (
    <>
      {console.log('CategorySettingModal 랜더링')}
      <Modal
        visible={visible}
        title="카테고리 관리"
        onCancel={() => onToggleVisible(false)}
        mask={false} // 모달 바깥 전체화면 덮기 기능
        footer={[
          <Button key="close" onClick={() => onToggleVisible(false)}>
            닫기
          </Button>,
        ]}
      ></Modal>
    </>
  );
};

export default memo(CategorySettingModal);
