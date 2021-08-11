import React, { useEffect } from 'react';
import { Table } from '../../../node_modules/antd/lib/index';
import { GET_LEVEL_CONFIG } from '../../../graphql/query/levelconfig';
import { useQuery } from '@apollo/client';

const LevelAndCycleSetting = ({ book_id }) => {
  const { loading, error, data } = useQuery(GET_LEVEL_CONFIG, {
    variables: { mybook_id: book_id },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <div>
      <div>레벨 및 복습 주기 설정</div>
      {/* <Table dataSource={dataSource} columns={columns} /> */}
    </div>
  );
};

export default LevelAndCycleSetting;

const columns = [
  {
    title: '구분',
    dataIndex: 'flag_number',
    key: 'flag_number',
  },
  {
    title: '별칭',
    dataIndex: 'shape',
    key: 'shape',
  },
  {
    title: '섹션 내 반복 주기',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: '단축키',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: '제스처',
    dataIndex: 'color',
    key: 'color',
  },
  {
    title: '사용 여부',
    dataIndex: 'color',
    key: 'color',
  },
];
