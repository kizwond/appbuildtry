import React, { useState, useEffect } from "react";
import { Checkbox, Table } from "antd";
import { Progress } from "../../../../node_modules/antd/lib/index";
import styled from "styled-components";
import { StyledProgress } from "../../../common/styledComponent/StyledProgress";
import { StyledTwoLinesEllipsis } from "../../../common/styledComponent/page";

const IndexTree = ({
  bookIndexInfo,
  summaryAll,
  onCheckIndexesCheckedKeys,
  checkedKeys,
  selectedbookId,
  selectedCardsInfo,
  changeSelectedCardsInfo,
}) => {
  const [treeData, setTreeData] = useState([]);

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      const getIndexes = async () => {
        function sumOfObjects(Obj1, Obj2) {
          var finalObj = {};
          Object.keys(Obj1).forEach((value) => {
            if (Obj2.hasOwnProperty(value)) {
              finalObj[value] = Obj1[value] + Obj2[value];
            }
          });

          return finalObj;
        }
        const rawIndexes = bookIndexInfo.map((item, index) => ({
          title: item.name,
          key: item._id,
          level: item.level,
          index: index,
          progress_for_total_card: item.numCards.total.progress,
          total_cards_number_for_total_card: item.numCards.total.total,
          yet_cards_number_for_total_card: item.numCards.total.yet,
          total_on_study_cards_number_for_total_card:
            item.numCards.total.ing.total,
          until_today_on_study_cards_number_for_total_card:
            item.numCards.total.ing.untilToday,
          until_now_on_study_cards_number_for_total_card:
            item.numCards.total.ing.untilNow,
          from_tomorrow_on_study_cards_number_for_total_card:
            item.numCards.total.ing.afterTomorrow,
          completed_cards_number_for_total_card: item.numCards.total.completed,
          holding_cards_number_for_total_card: item.numCards.total.hold,
          selectedIndex: checkedKeys.includes(item._id),
        }));

        const selectedIndexes = rawIndexes.filter(
          (bookIndex) => bookIndex.selectedIndex
        );
        const summaryData = selectedIndexes.reduce(sumOfObjects, {
          title: 0,
          key: 0,
          level: 0,
          index: 0,
          progress_for_total_card: 0,
          total_cards_number_for_total_card: 0,
          yet_cards_number_for_total_card: 0,
          total_on_study_cards_number_for_total_card: 0,
          until_today_on_study_cards_number_for_total_card: 0,
          until_now_on_study_cards_number_for_total_card: 0,
          from_tomorrow_on_study_cards_number_for_total_card: 0,
          completed_cards_number_for_total_card: 0,
          holding_cards_number_for_total_card: 0,
          selectedIndex: 0,
        });
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
          return parents;
        };

        const level4 = generatorForChildrens(
          data_for_tree_level_four,
          data_for_tree_level_five
        );
        const level3 = generatorForChildrens(data_for_tree_level_three, level4);
        const level2 = generatorForChildrens(data_for_tree_level_two, level3);
        const level1 = generatorForChildrens(data_for_tree_level_one, level2);
        const summaryIndexes = {
          ...summaryData,
          title: "현재 책 기준",
          key: "selectedIndexCardsInfo",
          progress_for_total_card:
            summaryData.progress_for_total_card / selectedIndexes.length || 0,
        };
        return {
          cardsInfo: {
            ...selectedCardsInfo,
            [selectedbookId]: summaryIndexes,
          },
          treeData: [
            { ...summaryAll, key: "allSummary", title: "전체 책 기준" },
            summaryIndexes,
            ...level1,
          ],
        };
      };

      const result = getIndexes();

      result
        .then((data) => {
          setTreeData(data.treeData);
          changeSelectedCardsInfo(data.cardsInfo);
        })
        .catch((e) => console.log(e));
    }

    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookIndexInfo, checkedKeys]);

  return (
    <>
      {treeData.length > 0 ? (
        <Table
          sticky
          columns={[
            {
              title: "목차",
              dataIndex: "title",
              key: "title",
              width: 140,
              className: "TableRowTitle",
              fixed: true,
              align: "center",
              // eslint-disable-next-line react/display-name
              render: (v, record) => (
                <>
                  {record.key === "allSummary" ||
                  record.key === "selectedIndexCardsInfo" ? (
                    <div style={{ textAlign: "left" }}>{v}</div>
                  ) : (
                    // <div style={{ display: "flex", alignItems: "center" }}>
                    //   <Checkbox checked={checkedKeys.includes(record.key)} />
                    <StyledTwoLinesEllipsis
                      onClick={() => {
                        if (checkedKeys.includes(record.key)) {
                          onCheckIndexesCheckedKeys(
                            checkedKeys.filter((k) => k !== record.key),
                            selectedbookId
                          );
                        }
                        if (!checkedKeys.includes(record.key)) {
                          onCheckIndexesCheckedKeys(
                            [...checkedKeys, record.key],
                            selectedbookId
                          );
                        }
                      }}
                    >
                      {v}
                    </StyledTwoLinesEllipsis>
                    // </div>
                  )}
                </>
              ),
            },
            {
              // title: "목차",
              dataIndex: "key",
              key: "key",
              width: 30,
              className: "TableRowTitle",
              fixed: true,
              onCell: (record, rowIndex) => {
                return {
                  onClick: () => {
                    if (checkedKeys.includes(record.key)) {
                      onCheckIndexesCheckedKeys(
                        checkedKeys.filter((k) => k !== record.key),
                        selectedbookId
                      );
                    }
                    if (!checkedKeys.includes(record.key)) {
                      onCheckIndexesCheckedKeys(
                        [...checkedKeys, record.key],
                        selectedbookId
                      );
                    }
                  },
                };
              },
              align: "center",
              render: function ForDisplayName(v, record) {
                return (
                  <>
                    {!(
                      record.key === "allSummary" ||
                      record.key === "selectedIndexCardsInfo"
                    ) && (
                      <Checkbox checked={checkedKeys.includes(record.key)} />
                    )}
                  </>
                );
              },
            },
            {
              title: "진도율",
              dataIndex: "progress_for_total_card",
              key: "progress_for_total_card",
              width: 80,
              align: "center",
              // eslint-disable-next-line react/display-name
              render: (text) => (
                <>
                  <StyledProgress booktype="any" percent={text} />
                </>
              ),
            },
            {
              title: "합계",
              dataIndex: "total_cards_number_for_total_card",
              key: "total_cards_number_for_total_card",
              align: "center",
              width: 60,
            },
            {
              title: "미학습",
              dataIndex: "yet_cards_number_for_total_card",
              key: "yet_cards_number_for_total_card",
              align: "center",
              width: 60,
            },
            {
              title: "학습중",
              children: [
                {
                  title: "합계",
                  dataIndex: "total_on_study_cards_number_for_total_card",
                  key: "total_on_study_cards_number_for_total_card",
                  align: "center",
                  width: 60,
                },
                {
                  title: "현재이전",
                  dataIndex: "until_now_on_study_cards_number_for_total_card",
                  key: "until_now_on_study_cards_number_for_total_card",
                  align: "center",
                  width: 60,
                },
                {
                  title: "오늘이전",
                  dataIndex: "until_today_on_study_cards_number_for_total_card",
                  key: "until_today_on_study_cards_number_for_total_card",
                  align: "center",
                  width: 60,
                },
                {
                  title: "내일이후",
                  dataIndex:
                    "from_tomorrow_on_study_cards_number_for_total_card",
                  key: "from_tomorrow_on_study_cards_number_for_total_card",
                  align: "center",
                  width: 60,
                },
              ],
            },
            {
              title: "완료",
              dataIndex: "completed_cards_number_for_total_card",
              key: "completed_cards_number_for_total_card",
              align: "center",
              width: 60,
            },
            {
              title: "보류",
              dataIndex: "holding_cards_number_for_total_card",
              key: "holding_cards_number_for_total_card",
              align: "center",
              width: 60,
            },
          ]}
          dataSource={treeData}
          rowClassName={(record) =>
            record.key === "selectedIndexCardsInfo"
              ? "SelectedIndexCardsInfo"
              : null
          }
          rowSelection={{
            // onChange: (selectedRowKeys, selectedRows) => {
            //   console.log("selectedRowKeys: ", selectedRowKeys);
            //   onCheckIndexesCheckedKeys(
            //     selectedRowKeys.filter(
            //       (key) =>
            //         key !== "selectedIndexCardsInfo" || key !== "allSummary"
            //     ),
            //     selectedbookId
            //   );
            //   console.log("selectedRows: ", selectedRows);
            // },

            // getCheckboxProps: (record) => {
            //   return {
            //     style: {
            //       display:
            //         record.key === "selectedIndexCardsInfo"
            //           ? "none"
            //           : record.key === "allSummary"
            //           ? "none"
            //           : null,
            //     },
            //   };
            // },
            onSelectAll: (selected, selectedRows, changeRows) => {
              console.log(selected, selectedRows, changeRows);
            },
            selectedRowKeys: checkedKeys,
            checkStrictly: false, // 부모 체크박스 누르면 아래도 다 선택
            columnWidth: 0,
            hideSelectAll: true,
            renderCell: () => null,
          }}
          size="small"
          scroll={{ x: 720 }}
          pagination={false}
          title={() => (
            <StyledDivTitle>
              <div className="FirstRow">
                <div className="TableMainTitle">목차 정보</div>
              </div>
              <div className="SecondRow">
                <div className="HelpDescription">
                  * 카드 개수는 학습 카드(읽기 카드와 뒤집기 카드)의 개수만
                  표시됩니다.
                </div>
                <div className="HelpDescription">
                  * 학습중 카드는 복습 필요 시점 기준으로 개수를 확인하실 수
                  있습니다.
                </div>
                <div className="HelpDescription">
                  * 오늘이전 복습 필요 카드는 현재 이전 복습 필요 카드를
                  포함합니다.
                </div>
              </div>
            </StyledDivTitle>
          )}
        />
      ) : null}
    </>
  );
};

export default IndexTree;

const StyledDivTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & .FirstRow {
    min-width: 100px;
  }
  & .SecondRow {
    width: 100%;
    /* margin-left: 10px; */
  }
  & .TableMainTitle {
    font-weight: 500;
  }
  & .HelpDescription {
    font-size: 10px;
    color: darkgray;
  }
`;
