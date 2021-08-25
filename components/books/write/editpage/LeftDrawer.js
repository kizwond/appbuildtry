import React, { useState, useEffect } from "react";
import { Drawer, Button, Tree, Modal } from "antd";
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";
import { GetIndex, IndexCreateMutation, IndexRenameMutation, IndexLevelMutation, IndexDeleteMutation } from "../../../../graphql/query/bookIndex";
import IndexSettingModal from "../index/IndexSettingModal";

const LeftDrawer = ({ book_id }) => {
  const [visible, setVisible] = useState(false);

  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_id: book_id },
  });
  const [indexinfo, setIndexInfo] = useState();
  const [indexSetInfo, setIndexSetInfo] = useState();

  useEffect(() => {
    if (data) {
      console.log(data);
      setIndexInfo(data.indexset_getbymybookid.indexsets[0].indexes);
      setIndexSetInfo(data.indexset_getbymybookid.indexsets[0]);
    }
  }, [data]);

  //새 목차 추가
  const [indexset_addindex] = useMutation(IndexCreateMutation, { onCompleted: showindexdata });

  function showindexdata(data) {
    console.log("data", data);
    setIndexInfo(data.indexset_addindex.indexsets[0].indexes);
    setIndexSetInfo(data.indexset_addindex.indexsets[0]);
  }

  async function postindex(name, current_index_id, indexset_id) {
    try {
      await indexset_addindex({
        variables: {
          forAddIndex: {
            indexset_id: indexset_id,
            name: name,
            current_position_index_id: current_index_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinish = (values) => {
    console.log(values);
    postindex(values.name, values.current_index_id, values.indexset_id);
  };

  //목차 이름변경
  const [indexset_updateindexname] = useMutation(IndexRenameMutation, { onCompleted: showindexdatarename });

  function showindexdatarename(data) {
    console.log("data", data);
    setIndexInfo(data.indexset_updateindexname.indexsets[0].indexes);
    setIndexSetInfo(data.indexset_updateindexname.indexsets[0]);
  }

  async function postindexrename(name, current_index_id, indexset_id) {
    try {
      await indexset_updateindexname({
        variables: {
          forUpdateIndexName: {
            indexset_id: indexset_id,
            name: name,
            index_id: current_index_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinishRename = (values) => {
    console.log(values);
    postindexrename(values.name, values.current_index_id, values.indexset_id);
  };

  //목차 레벨변경변경
  const [indexset_updateindexlevel] = useMutation(IndexLevelMutation, { onCompleted: showindexdatarelevel });

  function showindexdatarelevel(data) {
    console.log("data", data);
    setIndexInfo(data.indexset_updateindexlevel.indexsets[0].indexes);
    setIndexSetInfo(data.indexset_updateindexlevel.indexsets[0]);
  }

  async function postindexrelevel(direction, current_index_id, indexset_id) {
    try {
      await indexset_updateindexlevel({
        variables: {
          forUpdateIndexLevel: {
            indexset_id: indexset_id,
            direction: direction,
            index_id: current_index_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinishChangeLevel = (direction, index_id, indexset_id) => {
    postindexrelevel(direction, index_id, indexset_id);
  };

  //목차 삭제
  const [indexset_deleteindex] = useMutation(IndexDeleteMutation, { onCompleted: showindexdatadelete });

  function showindexdatadelete(data) {
    console.log("data", data);
    setIndexInfo(data.indexset_deleteindex.indexsets[0].indexes);
    setIndexSetInfo(data.indexset_deleteindex.indexsets[0]);
  }

  async function postindexdelete(moveto_index_id, current_index_id, indexset_id) {
    try {
      await indexset_deleteindex({
        variables: {
          forDeleteIndex: {
            indexset_id: indexset_id,
            moveto_index_id: moveto_index_id,
            delete_index_id: current_index_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinishIndexDelete = (values) => {
    console.log(values)
    postindexdelete(values.moveto_index_id, values.current_index_id, values.indexset_id);
  };

  //
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
        <IndexSettingModal
          indexSetInfo={indexSetInfo}
          indexinfo={indexinfo}
          onFinish={onFinish}
          onFinishRename={onFinishRename}
          onFinishChangeLevel={onFinishChangeLevel}
          onFinishIndexDelete={onFinishIndexDelete}
        />
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
