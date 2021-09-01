import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID } from '../graphql/query/studySessionSetting';
import { Tree, Table } from 'antd';

const Test = () => {
  const [treeData, setTreeData] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const { loading, error, data } = useQuery(
    GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
    {
      variables: { mybook_id: '612842d0914b6216d4733866' },
    }
  );

  if (loading) <div>loading...</div>;
  if (error) <div>loading...</div>;

  useEffect(() => {
    if (data) {
      const rawIndexes =
        data.session_getNumCardsbyIndex.indexsets[0].indexes.map(
          (item, index) => ({
            title: item.name,
            key: item._id,
            level: item.level,
            index: index,
            progress_for_total_card: item.num_cards.total.progress,
            total_cards_number_for_total_card: item.num_cards.total.total,
            yet_cards_number_for_total_card: item.num_cards.total.yet,
            completed_cards_number_for_total_card:
              item.num_cards.total.completed,
            holding_cards_number_for_total_card: item.num_cards.total.hold,
          })
        );
      let data_for_tree_level_one = rawIndexes.filter(
        (item) => item.level == 1
      );
      let data_for_tree_level_two = rawIndexes.filter(
        (item) => item.level == 2
      );
      let data_for_tree_level_three = rawIndexes.filter(
        (item) => item.level == 3
      );
      let data_for_tree_level_four = rawIndexes.filter(
        (item) => item.level == 4
      );
      let data_for_tree_level_five = rawIndexes.filter(
        (item) => item.level == 5
      );

      const generatorForChildrens = (parents, son) => {
        for (let i = 0; i < parents.length; i++) {
          for (let k = 0; k < son.length; k++) {
            if (parents[i].index < son[k].index) {
              if (i + 1 == parents.length) {
                if (parents[i].children == undefined) {
                  parents[i].children = [son[k]];
                } else {
                  parents[i].children = [...parents[i].children, son[k]];
                }
              } else if (parents[i + 1].index > son[k].index) {
                if (parents[i].children == undefined) {
                  parents[i].children = [son[k]];
                } else {
                  parents[i].children = [...parents[i].children, son[k]];
                }
              }
            }
          }
        }
      };

      const getIndexes = async () => {
        await generatorForChildrens(
          data_for_tree_level_four,
          data_for_tree_level_five
        );
        await generatorForChildrens(
          data_for_tree_level_three,
          data_for_tree_level_four
        );
        await generatorForChildrens(
          data_for_tree_level_two,
          data_for_tree_level_three
        );
        await generatorForChildrens(
          data_for_tree_level_one,
          data_for_tree_level_two
        );
        setTreeData(data_for_tree_level_one);
      };

      getIndexes();
    }
  }, [data]);

  console.log(treeData);
  console.log(data);

  const columns = [
    {
      title: '목차',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: (
        <>
          <div>학습</div>
          <div>완료율</div>
        </>
      ),
      dataIndex: 'progress_for_total_card',
      key: 'progress_for_total_card',
    },
    {
      title: (
        <>
          <div>전체</div>
          <div>카드</div>
        </>
      ),
      dataIndex: 'total_cards_number_for_total_card',
      key: 'total_cards_number_for_total_card',
    },
    {
      title: (
        <>
          <div>미학습</div>
          <div>카드</div>
        </>
      ),
      dataIndex: 'yet_cards_number_for_total_card',
      key: 'yet_cards_number_for_total_card',
    },
    {
      title: (
        <>
          <div>학습</div>
          <div>완료</div>
          <div>카드</div>
        </>
      ),
      dataIndex: 'completed_cards_number_for_total_card',
      key: 'completed_cards_number_for_total_card',
    },
    {
      title: (
        <>
          <div>학습</div>
          <div>보류</div>
          <div>카드</div>
        </>
      ),
      dataIndex: 'holding_cards_number_for_total_card',
      key: 'holding_cards_number_for_total_card',
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows
      );
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={treeData}
        rowSelection={{ ...rowSelection, checkStrictly: true }}
        bordered
      />
    </>
  );
};

export default Test;
