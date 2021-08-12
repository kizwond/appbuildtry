import React, { useEffect, useState } from 'react';
import { Table } from '../../../node_modules/antd/lib/index';
import { GET_LEVEL_CONFIG } from '../../../graphql/query/levelconfig';
import { useQuery } from '@apollo/client';

const LevelAndCycleSetting = ({ book_id }) => {
  const [levelConfig, setLevelConfig] = useState([]);

  const { loading, error, data } = useQuery(GET_LEVEL_CONFIG, {
    variables: { mybook_id: book_id },
    onCompleted: (data) => funcOnCompletedUseQuery(data),
  });

  const funcOnCompletedUseQuery = (data) => {
    const levelconfig = data.levelconfig_get.levelconfigs[0].restudy.option;
    const tableData = Object.keys(levelconfig)
      .filter((diffi) => diffi != '__typename')
      .map((diffi) => ({
        difficulty: diffi, //구분
        nick: levelconfig[diffi].nick,
        period: levelconfig[diffi].period, // 세션 내 반복 주기
        shortcutkey: levelconfig[diffi].shortcutkey, //단축키
        gesture: levelconfig[diffi].gesture, //제스처
        on_off: levelconfig[diffi].on_off, //사용여부
      }));
    console.log(tableData);
    setLevelConfig(tableData);
  };

  if (loading) <div>Loading...</div>;
  if (error) <div>Error : {erros}</div>;

  return (
    <div>
      <Table dataSource={levelConfig} columns={columns} />
    </div>
  );
};

export default LevelAndCycleSetting;

const columns = [
  {
    title: '구분',
    dataIndex: 'difficulty',
    key: 'difficulty',
  },
  {
    title: '별칭',
    dataIndex: 'nick',
    key: 'nick',
  },
  {
    title: '섹션 내 반복 주기',
    dataIndex: 'period',
    key: 'period',
  },
  {
    title: '단축키',
    dataIndex: 'shortcutkey',
    key: 'shortcutkey',
  },
  {
    title: '제스처',
    dataIndex: 'gesture',
    key: 'gesture',
  },
  {
    title: '사용 여부',
    dataIndex: 'on_off',
    key: 'on_off',
  },
];

const data1 = {
  diffi1: {
    on_off: 'on',
    nick: '5분 뒤 한번 더',
    period: 5,
    shortcutkey: null,
    gesture: null,
  },
  diffi2: {
    on_off: 'off',
    nick: '10분 뒤 한번 더',
    period: 10,
    shortcutkey: null,
    gesture: null,
  },
  diffi3: {
    on_off: 'on',
    nick: '20분 뒤 한번 더',
    period: 20,
    shortcutkey: null,
    gesture: null,
  },
  diffi4: {
    on_off: 'off',
    nick: '30분 뒤 한번 더',
    period: 30,
    shortcutkey: null,
    gesture: null,
  },
  diffi5: {
    on_off: 'on',
    nick: '세션 탈출',
    period: 10,
    shortcutkey: null,
    gesture: null,
  },
};
