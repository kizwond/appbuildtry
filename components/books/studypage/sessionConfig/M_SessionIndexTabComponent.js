import { Tabs } from "antd";
import React from "react";
import styled from "styled-components";
import { StyledAntTabs } from "../../../common/styledComponent/antd/StyledAntdTabs";
import IndexTree from "../../study/sessionnSetting/IndexTree";

const M_SessionIndexTabComponent = () => {
  return (
    <StyledDivSecond activatedComponent={activatedComponent}>
      <StyledAntTabs
        width="20%"
        type="card"
        tabPosition="top"
        size="small"
        tabBarStyle={{ margin: 0 }}
        defaultActiveKey={bookList[0].book_id}
      >
        <Tabs.TabPane tab={bookList[0].book_title} key={bookList[0].book_id}>
          <div className="SessionTabContentWrapper">
            <IndexTree
              bookIndexInfo={
                cardsList[0]?.session_getNumCardsbyIndex?.indexsets[0]?.indexes
              }
              checkedKeys={checkedKeys[bookList[0].book_id]}
              summaryAll={summary}
              selectedbookId={bookList[0].book_id}
              onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
              selectedCardsInfo={selectedCardsInfo}
              changeSelectedCardsInfo={changeSelectedCardsInfo}
            />
          </div>
        </Tabs.TabPane>
        {!isAdvancedFilteredCardListShowed &&
          counter === cardsList.length - 1 &&
          restBooks.map((book, index) => (
            <Tabs.TabPane tab={book.book_title} key={book.book_id}>
              <div className="SessionTabContentWrapper">
                <IndexTree
                  bookIndexInfo={
                    cardsList[index + 1]?.session_getNumCardsbyIndex
                      ?.indexsets[0]?.indexes
                  }
                  checkedKeys={checkedKeys[book.book_id]}
                  summaryAll={summary}
                  selectedbookId={book.book_id}
                  onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
                  selectedCardsInfo={selectedCardsInfo}
                  changeSelectedCardsInfo={changeSelectedCardsInfo}
                />
              </div>
            </Tabs.TabPane>
          ))}
        {isAdvancedFilteredCardListShowed &&
          bookList.map((book, index) => (
            <Tabs.TabPane tab={book.book_title} key={book.book_id}>
              <div className="SessionTabContentWrapper">
                <IndexTree
                  bookIndexInfo={
                    advancedFilteredCardsList[index]?.session_getNumCardsbyIndex
                      ?.indexsets[0]?.indexes
                  }
                  checkedKeys={checkedKeys[book.book_id]}
                  selectedbookId={book.book_id}
                  onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
                  selectedCardsInfo={selectedCardsInfo}
                  changeSelectedCardsInfo={changeSelectedCardsInfo}
                />
              </div>
            </Tabs.TabPane>
          ))}
      </StyledAntTabs>
    </StyledDivSecond>
  );
};

export default M_SessionIndexTabComponent;

const StyledDivSecond = styled.div`
  display: ${(props) =>
    props.activatedComponent === "index" ? "block" : "none"};
  margin: 8px;

  .ant-table.ant-table-small .ant-table-title {
    padding: reset;
    padding: 0px 8px 3px 8px;
  }

  .ant-table-tbody > tr.ant-table-row-selected > td {
    background: white;
  }
  .ant-table-tbody > tr.SelectedIndexCardsInfo > td {
    border-bottom: 1px solid #f0f0f0;
  }

  .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding: 4px;
  }

  .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }
`;
