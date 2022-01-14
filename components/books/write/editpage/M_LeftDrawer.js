import React, { useState, useEffect } from "react";
import { Drawer, Tree } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GetIndex } from "../../../../graphql/query/allQuery";
import { IndexCreateMutation, IndexRenameMutation, IndexLevelMutation, IndexDeleteMutation, ExcelExportMutation } from "../../../../graphql/mutation/indexSet";
import IndexSettingModal from "../index/IndexSettingModal";
import { UnorderedListOutlined } from "@ant-design/icons";

const backgroundColor = "black";
const buttonColor = "white";
const fontColor = "white";

const LeftDrawer = ({ index_changed }) => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = localStorage.getItem("book_id");
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

  var indexinfo = data.indexset_getByMybookids.indexsets[0].indexes;
  var indexSetInfo = data.indexset_getByMybookids.indexsets[0];
  //엑셀 익스포트
  const [cardset_convertCardsetToExcelFile] = useMutation(ExcelExportMutation, { onCompleted: afterexport });

  function afterexport(data) {
    console.log(data)
  }

  async function excelexport(indexId) {
    try {
      await cardset_convertCardsetToExcelFile({
        variables: {
          index_id : indexId
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinishExcelExport = (value) => {
    console.log(value)
    excelexport(value);
  };

  //새 목차 추가
  const [indexset_addIndex] = useMutation(IndexCreateMutation, { onCompleted: showindexdata });

  function showindexdata(data) {
    indexinfo = data.indexset_addIndex.indexsets[0].indexes;
    indexSetInfo = data.indexset_addIndex.indexsets[0];
  }

  async function postindex(name, current_index_id, indexset_id) {
    try {
      await indexset_addIndex({
        variables: {
          forAddIndex: {
            indexset_id: indexset_id,
            name: name,
            currentPositionIndex_id: current_index_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinish = (values) => {
    postindex(values.name, values.current_index_id, values.indexset_id);
  };

  //목차 이름변경
  const [indexset_updateIndexName] = useMutation(IndexRenameMutation, { onCompleted: showindexdatarename });

  function showindexdatarename(data) {
    indexinfo = data.indexset_updateIndexName.indexsets[0].indexes;
    indexSetInfo = data.indexset_updateIndexName.indexsets[0];
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
    postindexrename(values.name, values.current_index_id, values.indexset_id);
  };

  //목차 레벨변경변경
  const [indexset_updateIndexLevel] = useMutation(IndexLevelMutation, { onCompleted: showindexdatarelevel });

  function showindexdatarelevel(data) {
    indexinfo = data.indexset_updateIndexLevel.indexsets[0].indexes;
    indexSetInfo = data.indexset_updateIndexLevel.indexsets[0];
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
  const [indexset_deleteIndex] = useMutation(IndexDeleteMutation, { onCompleted: showindexdatadelete });

  function showindexdatadelete(data) {
    console.log(data)
    indexinfo = data.indexset_deleteIndex.indexsets[0].indexes;
    indexSetInfo = data.indexset_deleteIndex.indexsets[0];
    console.log(indexinfo)
    console.log(indexSetInfo)
  }

  async function postindexdelete(moveto_index_id, current_index_id, indexset_id) {
    try {
      await indexset_deleteIndex({
        variables: {
          forDeleteIndex: {
            indexset_id: indexset_id,
            moveToIndex_id: moveto_index_id,
            deleteIndex_id: current_index_id,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  const onFinishIndexDelete = (values) => {
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
    localStorage.removeItem("first_index");
    localStorage.setItem("first_index", info.node.index_id);
    index_changed(info.node.index_id);
  };

  if (indexinfo) {
    let level_all = [];
    indexinfo.forEach((table, index) => {
      if (table) {
        if (table.level === 1) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 1,
            // icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 2) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 2,
            // icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 3) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 3,
            // icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 4) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 4,
            // icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        } else if (table.level === 5) {
          let level = {
            title: table.name,
            index_id: table._id,
            key: table._id,
            level: 5,
            // icon: <CarryOutOutlined />,
            children: [],
          };
          level_all.push(level);
        }
      }
    });

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
    
        <div onClick={showDrawer} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UnorderedListOutlined style={{ fontSize: "1.3rem" }}/>
            목차보기
          </div>
      
      {indexinfo && (
        <>
          <Drawer
            width={200}
            title={
              <>
                <div style={{display:"flex", alignItems:"center"}}>
                  <span style={{ fontSize: "1rem", marginRight:"5px" }}>목차</span>
                  <IndexSettingModal
                    indexSetInfo={indexSetInfo}
                    indexinfo={indexinfo}
                    onFinish={onFinish}
                    onFinishRename={onFinishRename}
                    onFinishChangeLevel={onFinishChangeLevel}
                    onFinishIndexDelete={onFinishIndexDelete}
                    onFinishExcelExport={onFinishExcelExport}
                  />
                </div>
              </>
            }
            placement="left"
            closable={false}
            onClose={onClose}
            visible={visible}
            mask={true}
          >
            <Tree showLine={true} showIcon={false} defaultExpandAll={true} onSelect={onSelect} treeData={treeData} />
          </Drawer>
        </>
      )}
    </>
  );
};

export default LeftDrawer;
