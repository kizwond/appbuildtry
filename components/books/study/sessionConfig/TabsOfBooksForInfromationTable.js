import { Tabs } from "antd";
import React from "react";
import { StyledAntTabs } from "../../../common/styledComponent/antd/StyledAntdTabs";
import M_InformationTableForIndexesOfBooks from "./M_InformationTableForIndexesOfBooks";

const M_TabsOfBooksForInfromationTable = ({
  bookList,
  checkedKeys,
  onCheckIndexesCheckedKeys,
  bookData,
  isPc,
}) => {
  return (
    <StyledAntTabs
      width="20%"
      type="card"
      tabPosition="top"
      size="small"
      tabBarStyle={{ margin: 0 }}
      isPc={isPc || false}
    >
      {bookList.map((book) => (
        <Tabs.TabPane tab={book.book_title} key={book.book_id}>
          <div className="SessionTabContentWrapper">
            <M_InformationTableForIndexesOfBooks
              checkedKeys={checkedKeys[book.book_id]}
              selectedbookId={book.book_id}
              onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
              bookData={bookData[book.book_id]}
            />
          </div>
        </Tabs.TabPane>
      ))}
    </StyledAntTabs>
  );
};

export default M_TabsOfBooksForInfromationTable;
