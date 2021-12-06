import React, { useState, useEffect } from "react";
import { Drawer, Tree, Divider } from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { GetIndex } from "../../../../graphql/query/allQuery";
import { IndexCreateMutation, IndexRenameMutation, IndexLevelMutation, IndexDeleteMutation } from "../../../../graphql/mutation/indexSet";
import IndexSettingModal from "../index/IndexSettingModal";
import { UnorderedListOutlined } from "@ant-design/icons";

const LeftDrawer = ({ index_changed, indexSets }) => {
  
  const [visible, setVisible] = useState(false);

  var indexinfos = indexSets;

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onSelect = (selectedKeys, info) => {
      console.log(info)
    localStorage.removeItem("first_index");
    localStorage.setItem("first_index", info.node.index_id);
    // index_changed(info.node.index_id);
  };
  if(indexinfos){
      console.log("here")
    var treeDatas = indexinfos.map((indexinfo)=>{
        console.log(indexinfo)
        let level_all = [];
        indexinfo.indexes.forEach((table, index) => {
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
        return level_all;
      })
    
      console.log(treeDatas)
  }
  
//   if (indexinfo) {
//     let level_all = [];
//     indexinfo.forEach((table, index) => {
//       if (table) {
//         if (table.level === 1) {
//           let level = {
//             title: table.name,
//             index_id: table._id,
//             key: table._id,
//             level: 1,
//             // icon: <CarryOutOutlined />,
//             children: [],
//           };
//           level_all.push(level);
//         } else if (table.level === 2) {
//           let level = {
//             title: table.name,
//             index_id: table._id,
//             key: table._id,
//             level: 2,
//             // icon: <CarryOutOutlined />,
//             children: [],
//           };
//           level_all.push(level);
//         } else if (table.level === 3) {
//           let level = {
//             title: table.name,
//             index_id: table._id,
//             key: table._id,
//             level: 3,
//             // icon: <CarryOutOutlined />,
//             children: [],
//           };
//           level_all.push(level);
//         } else if (table.level === 4) {
//           let level = {
//             title: table.name,
//             index_id: table._id,
//             key: table._id,
//             level: 4,
//             // icon: <CarryOutOutlined />,
//             children: [],
//           };
//           level_all.push(level);
//         } else if (table.level === 5) {
//           let level = {
//             title: table.name,
//             index_id: table._id,
//             key: table._id,
//             level: 5,
//             // icon: <CarryOutOutlined />,
//             children: [],
//           };
//           level_all.push(level);
//         }
//       }
//     });

//     const level_5 = (obj) => obj.level === 5;
//     const level_4 = (obj) => obj.level === 4;
//     const level_3 = (obj) => obj.level === 3;
//     const level_2 = (obj) => obj.level === 2;
//     if (level_all.length > 0) {
//       let level_5_exist = level_all.some(level_5);
//       let level_4_exist = level_all.some(level_4);
//       let level_3_exist = level_all.some(level_3);
//       let level_2_exist = level_all.some(level_2);

//       //level_5 exist
//       if (level_5_exist === true) {
//         let temp_data_4 = [];

//         for (var i = 0; i < level_all.length; i += 1) {
//           if (level_all[i]["level"] === 4) {
//             temp_data_4.push(level_all[i]);
//           } else if (level_all[i]["level"] === 5 && temp_data_4.length > 0) {
//             for (var a = 0; a < temp_data_4.length; a += 1) {
//               temp_data_4[temp_data_4.length - 1]["children"].push(level_all[i]);
//               break;
//             }
//           }
//         }
//         i = 0;
//         while (i < level_all.length) {
//           if (level_all[i]["level"] === 5) {
//             level_all.splice(i, 1);
//           } else {
//             ++i;
//           }
//         }

//         if (temp_data_4.length > 0) {
//           let temp_data_3 = [];
//           for (i = 0; i < level_all.length; i += 1) {
//             if (level_all[i]["level"] === 3) {
//               temp_data_3.push(level_all[i]);
//             } else if (level_all[i]["level"] === 4) {
//               for (a = 0; a < temp_data_3.length; a += 1) {
//                 temp_data_3[temp_data_3.length - 1]["children"].push(level_all[i]);
//                 break;
//               }
//             }
//           }

//           if (temp_data_3.length > 0) {
//             i = 0;
//             while (i < level_all.length) {
//               if (level_all[i]["level"] === 4) {
//                 level_all.splice(i, 1);
//               } else {
//                 ++i;
//               }
//             }
//           }

//           let temp_data_2 = [];
//           for (i = 0; i < level_all.length; i += 1) {
//             if (level_all[i]["level"] === 2) {
//               temp_data_2.push(level_all[i]);
//             } else if (level_all[i]["level"] === 3) {
//               for (a = 0; a < temp_data_2.length; a += 1) {
//                 temp_data_2[temp_data_2.length - 1]["children"].push(level_all[i]);
//                 break;
//               }
//             }
//           }

//           if (temp_data_2.length > 0) {
//             i = 0;
//             while (i < level_all.length) {
//               if (level_all[i]["level"] === 3) {
//                 level_all.splice(i, 1);
//               } else {
//                 ++i;
//               }
//             }
//           }

//           let temp_data_1 = [];
//           for (i = 0; i < level_all.length; i += 1) {
//             if (level_all[i]["level"] === 1) {
//               temp_data_1.push(level_all[i]);
//             } else if (level_all[i]["level"] === 2) {
//               for (a = 0; a < temp_data_1.length; a += 1) {
//                 temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
//                 break;
//               }
//             }
//           }

//           if (temp_data_1.length > 0) {
//             i = 0;
//             while (i < level_all.length) {
//               if (level_all[i]["level"] === 2) {
//                 level_all.splice(i, 1);
//               } else {
//                 ++i;
//               }
//             }
//           }
//         }

//         console.log("result:", level_all);
//         //level_4 exist
//       } else if (level_4_exist === true) {
//         let temp_data_3 = [];
//         for (i = 0; i < level_all.length; i += 1) {
//           if (level_all[i]["level"] === 3) {
//             temp_data_3.push(level_all[i]);
//           } else if (level_all[i]["level"] === 4) {
//             for (a = 0; a < temp_data_3.length; a += 1) {
//               temp_data_3[temp_data_3.length - 1]["children"].push(level_all[i]);
//               break;
//             }
//           }
//         }

//         if (temp_data_3.length > 0) {
//           i = 0;
//           while (i < level_all.length) {
//             if (level_all[i]["level"] === 4) {
//               level_all.splice(i, 1);
//             } else {
//               ++i;
//             }
//           }

//           let temp_data_2 = [];
//           for (i = 0; i < level_all.length; i += 1) {
//             if (level_all[i]["level"] === 2) {
//               temp_data_2.push(level_all[i]);
//             } else if (level_all[i]["level"] === 3) {
//               for (a = 0; a < temp_data_2.length; a += 1) {
//                 temp_data_2[temp_data_2.length - 1]["children"].push(level_all[i]);
//                 break;
//               }
//             }
//           }

//           if (temp_data_2.length > 0) {
//             i = 0;
//             while (i < level_all.length) {
//               if (level_all[i]["level"] === 3) {
//                 level_all.splice(i, 1);
//               } else {
//                 ++i;
//               }
//             }
//           }

//           let temp_data_1 = [];
//           for (i = 0; i < level_all.length; i += 1) {
//             if (level_all[i]["level"] === 1) {
//               temp_data_1.push(level_all[i]);
//             } else if (level_all[i]["level"] === 2) {
//               for (a = 0; a < temp_data_1.length; a += 1) {
//                 temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
//                 break;
//               }
//             }
//           }

//           if (temp_data_1.length > 0) {
//             i = 0;
//             while (i < level_all.length) {
//               if (level_all[i]["level"] === 2) {
//                 level_all.splice(i, 1);
//               } else {
//                 ++i;
//               }
//             }
//           }
//         }
//         console.log("result:", level_all);
//         //level_3 exist
//       } else if (level_3_exist === true) {
//         let temp_data_2 = [];
//         for (i = 0; i < level_all.length; i += 1) {
//           if (level_all[i]["level"] === 2) {
//             temp_data_2.push(level_all[i]);
//           } else if (level_all[i]["level"] === 3) {
//             for (a = 0; a < temp_data_2.length; a += 1) {
//               temp_data_2[temp_data_2.length - 1]["children"].push(level_all[i]);
//               break;
//             }
//           }
//         }

//         if (temp_data_2.length > 0) {
//           i = 0;
//           while (i < level_all.length) {
//             if (level_all[i]["level"] === 3) {
//               level_all.splice(i, 1);
//             } else {
//               ++i;
//             }
//           }

//           let temp_data_1 = [];
//           for (i = 0; i < level_all.length; i += 1) {
//             if (level_all[i]["level"] === 1) {
//               temp_data_1.push(level_all[i]);
//             } else if (level_all[i]["level"] === 2) {
//               for (a = 0; a < temp_data_1.length; a += 1) {
//                 temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
//                 break;
//               }
//             }
//           }

//           if (temp_data_1.length > 0) {
//             i = 0;
//             while (i < level_all.length) {
//               if (level_all[i]["level"] === 2) {
//                 level_all.splice(i, 1);
//               } else {
//                 ++i;
//               }
//             }
//           }
//         }
//         //level_2 exist
//       } else if (level_2_exist === true) {
//         let temp_data_1 = [];
//         for (i = 0; i < level_all.length; i += 1) {
//           if (level_all[i]["level"] === 1) {
//             temp_data_1.push(level_all[i]);
//           } else if (level_all[i]["level"] === 2) {
//             for (a = 0; a < temp_data_1.length; a += 1) {
//               temp_data_1[temp_data_1.length - 1]["children"].push(level_all[i]);
//               break;
//             }
//           }
//         }

//         if (temp_data_1.length > 0) {
//           i = 0;
//           while (i < level_all.length) {
//             if (level_all[i]["level"] === 2) {
//               level_all.splice(i, 1);
//             } else {
//               ++i;
//             }
//           }
//         }
//       }
//     }

//     if (level_all.length > 0) {
//       var treeData = level_all;
//     }
//   }

  return (
    <>
    
        <div onClick={showDrawer} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <UnorderedListOutlined style={{ fontSize: "1.3rem" }}/>
            목차보기
          </div>
      
      {indexinfos && (
        <>
          <Drawer
            width={200}
            title={
              <>
                <div style={{display:"flex", alignItems:"center"}}>
                  <span style={{ fontSize: "1rem", marginRight:"5px" }}>목차</span>
                </div>
              </>
            }
            placement="left"
            closable={false}
            onClose={onClose}
            visible={visible}
            mask={true}
          >
              {treeDatas.map(treedata=>(
                  <>
                  <Tree showLine={true} showIcon={false} defaultExpandAll={true} onSelect={onSelect} treeData={treedata} />
                  <Divider style={{margin:"5px"}} dashed />
                  </>
              ))}
            
          </Drawer>
        </>
      )}
    </>
  );
};

export default LeftDrawer;
