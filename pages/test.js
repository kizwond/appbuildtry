import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID } from '../graphql/query/studySessionSetting';
import { Tree } from 'antd';
import produce from 'immer';

const Test = () => {
  const [treeData, setTreeData] = useState([]);
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
            children: [],
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
                parents[i].children = [...parents[i].children, son[k]];
              } else if (parents[i + 1].index > son[k].index) {
                parents[i].children = [...parents[i].children, son[k]];
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

  const onCheck = (checkedKeysValue) => {
    console.log('onCheck', checkedKeysValue);
  };

  return (
    <>
      {treeData.length > 0 ? (
        <Tree checkable checkStrictly onCheck={onCheck} treeData={treeData} />
      ) : null}
    </>
  );
};

export default Test;
