import React, { useState, useEffect } from "react";
import { Drawer, Tree } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GetIndex } from "../../../../graphql/query/allQuery";
import { IndexCreateMutation, IndexRenameMutation, IndexLevelMutation, IndexDeleteMutation } from "../../../../graphql/mutation/indexSet";
import IndexSettingModal from "../index/IndexSettingModal";
import { CarryOutOutlined } from "@ant-design/icons";

const backgroundColor = "black";
const buttonColor = "white";
const fontColor = "white";

const LeftDrawer = ({ index_changed }) => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = localStorage.getItem("book_id");
    console.log(book_id);
    if (book_id !== null) {
      localStorage.removeItem("book_id");
      localStorage.setItem("book_id", book_id);
    } else {
      localStorage.setItem("book_id", book_id);
    }
  }
  const [visible, setVisible] = useState(false);

  const { loading, error, data } = useQuery(GetIndex, {
    variables: { mybook_ids: [book_id] },
  });
  const [indexinfo, setIndexInfo] = useState();
  const [indexSetInfo, setIndexSetInfo] = useState();

  useEffect(() => {
    if (data) {
      console.log(data);
      setIndexInfo(data.indexset_getByMybookids.indexsets[0].indexes);
      setIndexSetInfo(data.indexset_getByMybookids.indexsets[0]);
    }
  }, [data]);
  
  //새 목차 추가
  const [indexset_addIndex] = useMutation(IndexCreateMutation, { onCompleted: showindexdata });

  function showindexdata(data) {
    console.log("data", data);
    setIndexInfo(data.indexset_addIndex.indexsets[0].indexes);
    setIndexSetInfo(data.indexset_addIndex.indexsets[0]);
  }

  async function postindex(name, current_index_id, indexset_id) {
    try {
      await indexset_addIndex({
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
  const [indexset_updateIndexName] = useMutation(IndexRenameMutation, { onCompleted: showindexdatarename });

  function showindexdatarename(data) {
    console.log("data", data);
    setIndexInfo(data.indexset_updateIndexName.indexsets[0].indexes);
    setIndexSetInfo(data.indexset_updateIndexName.indexsets[0]);
  }

  async function postindexrename(name, current_index_id, indexset_id) {
    try {
      await indexset_updateIndexName({
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
  const [indexset_updateIndexLevel] = useMutation(IndexLevelMutation, { onCompleted: showindexdatarelevel });

  function showindexdatarelevel(data) {
    console.log("data", data);
    setIndexInfo(data.indexset_updateIndexLevel.indexsets[0].indexes);
    setIndexSetInfo(data.indexset_updateIndexLevel.indexsets[0]);
  }

  async function postindexrelevel(direction, current_index_id, indexset_id) {
    try {
      await indexset_updateIndexLevel({
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
    console.log(values);
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
    console.log("selected---------------------->", selectedKeys, info);
    console.log(info.node.index_id);
    localStorage.removeItem("first_index");
    localStorage.setItem("first_index", info.node.index_id);
    index_changed(info.node.index_id);
  };

  if (indexinfo) {
    console.log(indexinfo);
    let level_all = [];
    indexinfo.forEach((table, index) => {
      if (table) {
        if (table.level === 1) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 1,
            icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 2) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 2,
            icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 3) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 3,
            icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 4) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 4,
            icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 5) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 5,
            icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        }
      }
    });
    console.log(level_all);

    const level_5 = (obj) => obj.level === 5;
    const level_4 = (obj) => obj.level === 4;
    const level_3 = (obj) => obj.level === 3;
    const level_2 = (obj) => obj.level === 2;
    if (level_all.length > 0) {
      let level_5_exist = level_all.some(level_5);
      let level_4_exist = level_all.some(level_4);
      let level_3_exist = level_all.some(level_3);
      let level_2_exist = level_all.some(level_2);

      //level_5 exist
      if (level_5_exist === true) {
        let temp_data_4 = [];

        for (var i = 0; i < level_all.length; i += 1) {
          if (level_all[i]["level"] === 4) {
            temp_data_4.push(level_all[i]);
          } else if (level_all[i]["level"] === 5 && temp_data_4.length > 0) {
            for (var a = 0; a < temp_data_4.length; a += 1) {
              temp_data_4[temp_data_4.length - 1]["children"].push(level_all[i]);
              break;
            }
          }
        }
        i = 0;
        while (i < level_all.length) {
          if (level_all[i]["level"] === 5) {
            level_all.splice(i, 1);
          } else {
            ++i;
          }
        }

        if (temp_data_4.length > 0) {
          let temp_data_3 = [];
          for (i = 0; i < level_all.length; i += 1) {
            if (level_all[i]["level"] === 3) {
              temp_data_3.push(level_all[i]);
            } else if (level_all[i]["level"] === 4) {
              for (a = 0; a < temp_data_3.length; a += 1) {
                temp_data_3[temp_data_3.length - 1]["children"].push(level_all[i]);
                break;
              }
            }
          }

          if (temp_data_3.length > 0) {
            i = 0;
            while (i < level_all.length) {
              if (level_all[i]["level"] === 4) {
                level_all.splice(i, 1);
              } else {
                ++i;
              }
            }
          }

          let temp_data_2 = [];
          for (i = 0; i < level_all.length; i += 1) {
            if (level_all[i]["level"] === 2) {
              temp_data_2.push(level_all[i]);
            } else if (level_all[i]["level"] === 3) {
              for (a = 0; a < temp_data_2.length; a += 1) {
                temp_data_2[temp_data_2.length - 1]["children"].push(level_all[i]);
                break;
              }
            }
          }

          if (temp_data_2.length > 0) {
            i = 0;
            while (i < level_all.length) {
              if (level_all[i]["level"] === 3) {
                level_all.splice(i, 1);
              } else {
                ++i;
              }
            }
          }

          let temp_data_1 = [];
          for (i = 0; i < level_all.length; i += 1) {
            if (level_all[i]["level"] === 1) {
              temp_data_1.push(level_all[i]);
            } else if (level_all[i]["level"] === 2) {
              for (a = 0; a < temp_data_1.length; a += 1) {
                temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
                break;
              }
            }
          }

          if (temp_data_1.length > 0) {
            i = 0;
            while (i < level_all.length) {
              if (level_all[i]["level"] === 2) {
                level_all.splice(i, 1);
              } else {
                ++i;
              }
            }
          }
        }

        console.log("result:", level_all);
        //level_4 exist
      } else if (level_4_exist === true) {
        let temp_data_3 = [];
        for (i = 0; i < level_all.length; i += 1) {
          if (level_all[i]["level"] === 3) {
            temp_data_3.push(level_all[i]);
          } else if (level_all[i]["level"] === 4) {
            for (a = 0; a < temp_data_3.length; a += 1) {
              temp_data_3[temp_data_3.length - 1]["children"].push(level_all[i]);
              break;
            }
          }
        }

        if (temp_data_3.length > 0) {
          i = 0;
          while (i < level_all.length) {
            if (level_all[i]["level"] === 4) {
              level_all.splice(i, 1);
            } else {
              ++i;
            }
          }

          let temp_data_2 = [];
          for (i = 0; i < level_all.length; i += 1) {
            if (level_all[i]["level"] === 2) {
              temp_data_2.push(level_all[i]);
            } else if (level_all[i]["level"] === 3) {
              for (a = 0; a < temp_data_2.length; a += 1) {
                temp_data_2[temp_data_2.length - 1]["children"].push(level_all[i]);
                break;
              }
            }
          }

          if (temp_data_2.length > 0) {
            i = 0;
            while (i < level_all.length) {
              if (level_all[i]["level"] === 3) {
                level_all.splice(i, 1);
              } else {
                ++i;
              }
            }
          }

          let temp_data_1 = [];
          for (i = 0; i < level_all.length; i += 1) {
            if (level_all[i]["level"] === 1) {
              temp_data_1.push(level_all[i]);
            } else if (level_all[i]["level"] === 2) {
              for (a = 0; a < temp_data_1.length; a += 1) {
                temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
                break;
              }
            }
          }

          if (temp_data_1.length > 0) {
            i = 0;
            while (i < level_all.length) {
              if (level_all[i]["level"] === 2) {
                level_all.splice(i, 1);
              } else {
                ++i;
              }
            }
          }
        }
        console.log("result:", level_all);
        //level_3 exist
      } else if (level_3_exist === true) {
        let temp_data_2 = [];
        for (i = 0; i < level_all.length; i += 1) {
          if (level_all[i]["level"] === 2) {
            temp_data_2.push(level_all[i]);
          } else if (level_all[i]["level"] === 3) {
            for (a = 0; a < temp_data_2.length; a += 1) {
              temp_data_2[temp_data_2.length - 1]["children"].push(level_all[i]);
              break;
            }
          }
        }

        if (temp_data_2.length > 0) {
          i = 0;
          while (i < level_all.length) {
            if (level_all[i]["level"] === 3) {
              level_all.splice(i, 1);
            } else {
              ++i;
            }
          }

          let temp_data_1 = [];
          for (i = 0; i < level_all.length; i += 1) {
            if (level_all[i]["level"] === 1) {
              temp_data_1.push(level_all[i]);
            } else if (level_all[i]["level"] === 2) {
              for (a = 0; a < temp_data_1.length; a += 1) {
                temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
                break;
              }
            }
          }

          if (temp_data_1.length > 0) {
            i = 0;
            while (i < level_all.length) {
              if (level_all[i]["level"] === 2) {
                level_all.splice(i, 1);
              } else {
                ++i;
              }
            }
          }
        }
        console.log("result:", level_all);
        //level_2 exist
      } else if (level_2_exist === true) {
        let temp_data_1 = [];
        for (i = 0; i < level_all.length; i += 1) {
          if (level_all[i]["level"] === 1) {
            temp_data_1.push(level_all[i]);
          } else if (level_all[i]["level"] === 2) {
            for (a = 0; a < temp_data_1.length; a += 1) {
              temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
              break;
            }
          }
        }

        if (temp_data_1.length > 0) {
          i = 0;
          while (i < level_all.length) {
            if (level_all[i]["level"] === 2) {
              level_all.splice(i, 1);
            } else {
              ++i;
            }
          }
        }
      }
    }

    if (level_all.length > 0) {
      var treeData = level_all;
    }
  }

  return (
    <>
      <div style={{ position: "fixed", top: 100, left: 0 }}>
        <button
          onClick={showDrawer}
          style={{
            color: fontColor,
            background: backgroundColor,
            fontSize: "0.8rem",
            border: "1px solid lightgrey",
            borderLeft: "none",
            width: "25px",
            borderRadius: "0 10px 10px 0",
          }}
        >
          목차
        </button>
      </div>
      <Drawer width={200} title="Basic Drawer" placement="left" closable={true} onClose={onClose} visible={visible} mask={false}>
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
