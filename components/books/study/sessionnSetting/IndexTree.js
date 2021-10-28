import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { Progress } from "../../../../node_modules/antd/lib/index";
import styled from "styled-components";

const IndexTree = ({ bookIndexInfo, summaryAll, onCheckIndexesCheckedKeys, checkedKeys, selectedbookId, selectedCardsInfo, changeSelectedCardsInfo }) => {
  const [treeData, setTreeData] = useState([]);
  console.log("필터인덱스트리");
  useEffect(() => {
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
      progress_for_total_card: item.num_cards.total.progress,
      total_cards_number_for_total_card: item.num_cards.total.total,
      yet_cards_number_for_total_card: item.num_cards.total.yet,
      total_on_study_cards_number_for_total_card: item.num_cards.total.ing.total,
      until_today_on_study_cards_number_for_total_card: item.num_cards.total.ing.untilToday,
      until_now_on_study_cards_number_for_total_card: item.num_cards.total.ing.untilNow,
      from_tomorrow_on_study_cards_number_for_total_card: item.num_cards.total.ing.afterTomorrow,
      completed_cards_number_for_total_card: item.num_cards.total.completed,
      holding_cards_number_for_total_card: item.num_cards.total.hold,
      selectedIndex: checkedKeys.includes(item._id),
    }));

    const cccc = rawIndexes
      .filter((bookIndex) => bookIndex.selectedIndex)
      .reduce(sumOfObjects, {
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
    let data_for_tree_level_one = rawIndexes.filter((item) => item.level == 1);
    let data_for_tree_level_two = rawIndexes.filter((item) => item.level == 2);
    let data_for_tree_level_three = rawIndexes.filter((item) => item.level == 3);
    let data_for_tree_level_four = rawIndexes.filter((item) => item.level == 4);
    let data_for_tree_level_five = rawIndexes.filter((item) => item.level == 5);
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

    const getIndexes = async () => {
      const level4 = await generatorForChildrens(data_for_tree_level_four, data_for_tree_level_five);
      const level3 = await generatorForChildrens(data_for_tree_level_three, level4);
      const level2 = await generatorForChildrens(data_for_tree_level_two, level3);
      const level1 = await generatorForChildrens(data_for_tree_level_one, level2);
      const summaryIndexes = {
        ...cccc,
        title: "현재 책 기준",
        key: "selectedIndexCardsInfo",
        progress_for_total_card: cccc.progress_for_total_card / cccc.length,
      };
      changeSelectedCardsInfo({ ...selectedCardsInfo, [selectedbookId]: summaryIndexes });
      setTreeData([{ ...summaryAll, key: "allSummary", title: "전체 책 기준" }, summaryIndexes, ...level1]);
    };

    const wrappUp = getIndexes();

    return wrappUp;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookIndexInfo, checkedKeys]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log("selectedRowKeys: ", selectedRowKeys);
      onCheckIndexesCheckedKeys(selectedRowKeys, selectedbookId);
      console.log("selectedRows: ", selectedRows);
    },

    getCheckboxProps: (record) => {
      return {
        style: { display: record.key === "selectedIndexCardsInfo" ? "none" : record.key === "allSummary" ? "none" : null },
      };
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
    selectedRowKeys: checkedKeys,
  };

  return (
    <>
      {treeData.length > 0 ? (
        <Table
          columns={columns}
          dataSource={treeData}
          rowSelection={{ ...rowSelection, checkStrictly: true }}
          size="small"
          pagination={false}
          title={() => (
            <StyledDivTitle>
              <div>
                <span className="TableMainTitle">목차 내 카드 정보</span>
              </div>
              <div>괄호 안 숫자는 현재 시각 기준으로 산출한 복습 필요 카드 수량입니다.</div>
            </StyledDivTitle>
          )}
        />
      ) : null}
    </>
  );
};

export default IndexTree;

const columns = [
  {
    title: "목차",
    dataIndex: "title",
    key: "title",
    width: 120,
    className: "TableRowTitle",
    // eslint-disable-next-line react/display-name
  },
  {
    title: (
      <>
        <div>학습</div>
        <div>완료율</div>
      </>
    ),
    dataIndex: "progress_for_total_card",
    key: "progress_for_total_card",
    width: 120,
    // eslint-disable-next-line react/display-name
    render: (text) => (
      <>
        <Progress percent={text} strokeWidth={15} strokeLinecap="square" trailColor="darkgray" />
      </>
    ),
  },
  {
    title: (
      <>
        <div>전체</div>
        <div>카드</div>
      </>
    ),
    dataIndex: "total_cards_number_for_total_card",
    key: "total_cards_number_for_total_card",
    width: 80,
  },
  {
    title: (
      <>
        <div>미학습</div>
        <div>카드</div>
      </>
    ),
    dataIndex: "yet_cards_number_for_total_card",
    key: "yet_cards_number_for_total_card",
    width: 80,
  },
  {
    title: "학습 중 카드",
    children: [
      {
        title: (
          <>
            <div>전체</div>
            <div>학습 중 카드</div>
          </>
        ),
        dataIndex: "yet_cards_number_for_total_card",
        key: "yet_cards_number_for_total_card",
        width: 95,
      },
      {
        title: (
          <>
            <div>금일 이전</div>
            <div>복습 필요*</div>
          </>
        ),
        dataIndex: "until_today_on_study_cards_number_for_total_card",
        key: "until_today_on_study_cards_number_for_total_card",
        width: 95,
        // eslint-disable-next-line react/display-name
        render: (text, record) => <div>{`${text}(${record.until_now_on_study_cards_number_for_total_card})`}</div>,
      },
      {
        title: (
          <>
            <div>내일 이후</div>
            <div>복습 필요</div>
          </>
        ),
        dataIndex: "from_tomorrow_on_study_cards_number_for_total_card",
        key: "from_tomorrow_on_study_cards_number_for_total_card",
        width: 95,
      },
    ],
  },
  {
    title: (
      <>
        <div>학습</div>
        <div>완료</div>
        <div>카드</div>
      </>
    ),
    dataIndex: "completed_cards_number_for_total_card",
    key: "completed_cards_number_for_total_card",
    width: 80,
  },
  {
    title: (
      <>
        <div>학습</div>
        <div>보류</div>
        <div>카드</div>
      </>
    ),
    dataIndex: "holding_cards_number_for_total_card",
    key: "holding_cards_number_for_total_card",
    width: 80,
  },
];

const StyledDivTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  & .TableMainTitle {
    font-size: 0.9rem;
    font-weight: 700;
  }
`;
