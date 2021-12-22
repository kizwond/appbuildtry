import { Tabs } from "antd";
import React from "react";
import { StyledAntTabs } from "../../../common/styledComponent/antd/StyledAntdTabs";
import summaryAll from "../sessionnSetting/session-config/common/business/getIndexesSummary";
import M_InformationTableForIndexesOfBooks from "./M_InformationTableForIndexesOfBooks";

const M_TabsOfBooksForInfromationTable = ({
  bookList,
  cardsList,
  checkedKeys,
  onCheckIndexesCheckedKeys,
  selectedCardsInfo,
  changeSelectedCardsInfo,
  isAdvancedFilteredCardListShowed,
  advancedFilteredCardsList,
  counter,
}) => {
  const [firstBook, ...restBooks] = bookList;

  const summary =
    counter === bookList.length - 1
      ? summaryAll(cardsList, checkedKeys)
      : {
          progress_for_total_card: 0,
          total_cards_number_for_total_card: 0,
          yet_cards_number_for_total_card: 0,
          total_on_study_cards_number_for_total_card: 0,
          until_today_on_study_cards_number_for_total_card: 0,
          until_now_on_study_cards_number_for_total_card: 0,
          from_tomorrow_on_study_cards_number_for_total_card: 0,
          completed_cards_number_for_total_card: 0,
          holding_cards_number_for_total_card: 0,
        };

  return (
    <StyledAntTabs
      width="20%"
      type="card"
      tabPosition="top"
      size="small"
      tabBarStyle={{ margin: 0 }}
      defaultActiveKey={firstBook.book_id}
    >
      <Tabs.TabPane tab={firstBook.book_title} key={firstBook.book_id}>
        <div className="SessionTabContentWrapper">
          <M_InformationTableForIndexesOfBooks
            bookIndexInfo={
              cardsList[0]?.session_getNumCardsbyIndex?.indexsets[0]?.indexes
            }
            checkedKeys={checkedKeys[firstBook.book_id]}
            summaryAll={summary}
            selectedbookId={firstBook.book_id}
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
              <M_InformationTableForIndexesOfBooks
                bookIndexInfo={
                  cardsList[index + 1]?.session_getNumCardsbyIndex?.indexsets[0]
                    ?.indexes
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
              <M_InformationTableForIndexesOfBooks
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
  );
};

export default M_TabsOfBooksForInfromationTable;
