import React, { useState, useEffect } from "react";
import { Drawer, Button, Tree, Modal } from "antd";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import { GetIndex, IndexCreateMutation } from "../../../../graphql/query/writemain";
import IndexSettingModal from "../index/IndexSettingModal";

const LeftDrawer = ({ book_id }) => {
  const [visible, setVisible] = useState(false);

  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_id: book_id },
  });
  const [indexinfo, setIndexInfo] = useState();

  useEffect(() => {
    if (data) {
      console.log(data);
      setIndexInfo(data.index_get.indexes);
    }
  },[data]);

  //새 목차 추가
  const [index_create] = useMutation(IndexCreateMutation, { onCompleted: showindexdata });

  function showindexdata(data) {
    console.log("data", data);
    setIndexInfo(data.index_create.indexes);
  }

  async function postindex(mybook_id, name, current_index_id, current_seq, current_level) {
    try {
      await index_create({
        variables: {
          mybook_id: mybook_id,
          name: name,
          current_index_id: current_index_id,
          current_seq: Number(current_seq),
          current_level: Number(current_level),
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinish = (values) => {
    console.log(values);
    postindex(values.mybook_id, values.name, values.current_index_id, values.current_seq, values.current_level);
  };

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };

  

  return (
    <>
      <Button type="primary" onClick={showDrawer}>
        목차
      </Button>
      <Drawer title="Basic Drawer" placement="left" closable={true} onClose={onClose} visible={visible} mask={false}>
        <IndexSettingModal indexinfo={indexinfo} onFinish={onFinish} />
        <Tree showLine={true} showIcon={true} defaultExpandAll={true} onSelect={onSelect} treeData={treeData} />
      </Drawer>
    </>
  );
};

export default LeftDrawer;

const treeData = [
  {
    title: "parent 1",
    key: "0-0",
    children: [
      {
        title: "parent 1-0",
        key: "0-0-0",
        disabled: true,
        children: [
          {
            title: "leaf",
            key: "0-0-0-0",
            disableCheckbox: true,
          },
          {
            title: "leaf",
            key: "0-0-0-1",
          },
        ],
      },
      {
        title: "parent 1-1",
        key: "0-0-1",
        children: [
          {
            title: (
              <span
                style={{
                  color: "#1890ff",
                }}
              >
                sss
              </span>
            ),
            key: "0-0-1-0",
          },
        ],
      },
    ],
  },
];
