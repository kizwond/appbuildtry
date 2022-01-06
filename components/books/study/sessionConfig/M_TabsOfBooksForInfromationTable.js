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
  console.log(checkedKeys);
  return (
    <StyledAntTabs
      width="20%"
      type="card"
      tabPosition="top"
      size="small"
      tabBarStyle={{ margin: 0 }}
      is_pc={(isPc || false).toString()}
    >
      {bookList.map((book) => (
        <Tabs.TabPane tab={book.book_title} key={book.book_id}>
          <div className="SessionTabContentWrapper">
            <M_InformationTableForIndexesOfBooks
              checkedKeys={checkedKeys[book.book_id]}
              selectedbookId={book.book_id}
              onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
              bookData={bookData[book.book_id]}
              isPc={isPc || false}
            />
          </div>
        </Tabs.TabPane>
      ))}
    </StyledAntTabs>
  );
};

export default M_TabsOfBooksForInfromationTable;
