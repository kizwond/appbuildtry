import { useMutation } from '@apollo/client';
import { memo } from 'react';
import { Modal, Button } from 'antd';
import styled from 'styled-components';
import { Divider, Table } from '../../../../node_modules/antd/lib/index';
import { PlusOutlined } from '@ant-design/icons';

const CategorySettingModal = ({ category, visible, changeVisible }) => {
  const dataSource = category.map((_cate) => ({
    ..._cate.mybookcate_info,
    _id: _cate._id,
    key: _cate._id,
  }));

  const columns = [
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>카테고리 이름</div>,
      key: 'name',
      dataIndex: 'name',
    },
    {
      title: <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>순서</div>,
      key: 'seq',
      dataIndex: 'seq',
    },
  ];

  return (
    <>
      {console.log('CategorySettingModal 랜더링')}
      <StyledModal
        visible={visible}
        title="카테고리 관리"
        onCancel={() => changeVisible(false)}
        mask={false} // 모달 바깥 전체화면 덮기 기능
        footer={[
          <Button key="close" onClick={() => changeVisible(false)} size="small">
            닫기
          </Button>,
        ]}
      >
        <Table dataSource={dataSource} tableLayout="fixed" columns={columns} size="small" rowKey={(record) => record.key} pagination={false} />
        <Divider orientation="left">
          <PlusOutlined />
        </Divider>
      </StyledModal>
    </>
  );
};

export default memo(CategorySettingModal);

const StyledModal = styled(Modal)`
  & * {
    font-size: 0.8rem;
  }
`;
