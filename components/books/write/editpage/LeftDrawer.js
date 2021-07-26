import React, { useState, useEffect } from "react";
import { Drawer, Button, Tree } from "antd";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import {
  GetIndex
} from "../../../../graphql/query/writemain";

const LeftDrawer = ({book_id}) => {
  const [visible, setVisible] = useState(false);
  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_id : book_id },
  });
  const [index, setIndex] = useState();

  useEffect(() => {
    if (data) {
      console.log(data);
      setIndex(data.index_get.indexes);
    }
console.log(index)
  });


  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        목차
      </Button>
      <Drawer title="Basic Drawer" placement="left" closable={true} onClose={onClose} visible={visible} mask={false}>
        <p><button>목차설정모달</button></p>
        <p>
          <Tree showLine={true} showIcon={true} defaultExpandAll={true} onSelect={onSelect} treeData={treeData} />
        </p>
      </Drawer>
    </>
  );
};

export default LeftDrawer;

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: (
              <span
                style={{
                  color: '#1890ff',
                }}
              >
                sss
              </span>
            ),
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
];