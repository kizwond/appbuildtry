import { Tag } from "antd";
import { DoubleRightOutlined } from "@ant-design/icons";
import _ from "lodash";
import { StyledFlexAlignCenter } from "../../common/styledComponent/page";
import styled from "styled-components";

export default function makeDataSource(
  myBook,
  category,
  isShowedHiddenBook,
  changeIsShowedHiddenBook
) {
  const studyLikedBoooks = myBook.filter(
    (book) => book.mybook_info.isStudyLike
  );
  const studyLikeLength =
    studyLikedBoooks.length === 0
      ? 1
      : Math.max(
          ...studyLikedBoooks.map((book) => book.mybook_info.seqInStudyLike)
        ) + 1;
  const writeLikedBooks = myBook.filter((book) => book.mybook_info.isWriteLike);
  const writeLikeLength =
    writeLikedBooks.length === 0
      ? 1
      : Math.max(
          ...writeLikedBooks.map((book) => book.mybook_info.seqInWriteLike)
        ) + 1;

  const dataSource = category.map((_cate, _categoryIndex) => {
    const { name } = _cate;
    const _categoryBooksList = myBook.filter(
      (_book) => _cate._id === _book.mybook_info.mybookcate_id
    );
    const categoryBooksList = _categoryBooksList.sort(
      (a, b) => a.mybook_info.seqInCategory - b.mybook_info.seqInCategory
    );
    const categoryBooksLength = categoryBooksList.length;
    if (categoryBooksLength === 0) {
      return {
        relationship: "parent",
        classType: "empty-category",
        categoryName: name,
        key: `KEY:${_cate._id}INDEX:0`,
        writeHistory: [],
        mybookcate_id: _cate._id,
      };
    }

    const markedShowList = categoryBooksList.filter(
      (_book) => _book.mybook_info.hideOrShow == "show"
    );
    const markedShowListLength = markedShowList.length;
    const markedHideList = categoryBooksList.filter(
      (_book) => _book.mybook_info.hideOrShow == "hide"
    );
    const markedHideListLength = markedHideList.length;

    const isShowedAllBooks = isShowedHiddenBook.includes(_cate._id);

    const showList = markedShowList.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      ..._book.stats?.overall,
      studyHistory: _book.stats?.studyHistory,
      writeHistory: _book.stats?.writeHistory,
      classType:
        markedHideListLength === 0 &&
        markedShowListLength > 0 &&
        markedShowListLength === _index + 1 &&
        _index % 2 !== 0
          ? "last-even-book"
          : markedHideListLength === 0 &&
            markedShowListLength > 0 &&
            markedShowListLength === _index + 1 &&
            _index % 2 === 0
          ? "last-odd-book"
          : _index % 2 !== 0
          ? "even-book"
          : "odd-book",
      categoryName: name,
      isFirstBook: _index === 0,
      isLastBook: markedShowListLength === _index + 1,
      key: `KEY:${_cate._id}INDEX:${_index + 1}`,
      _id: _book._id,
      aboveAndBelowBooks: {
        aboveBook: {
          mybook_id:
            markedShowList[_index - 1] && markedShowList[_index - 1]._id,
          seqInCategory:
            markedShowList[_index - 1] &&
            markedShowList[_index - 1].mybook_info.seqInCategory,
        },
        belowBook: {
          mybook_id:
            markedShowList[_index + 1] && markedShowList[_index + 1]._id,
          seqInCategory:
            markedShowList[_index + 1] &&
            markedShowList[_index + 1].mybook_info.seqInCategory,
        },
      },
      studyLikeLength,
      writeLikeLength,
    }));

    const hiddenList = markedHideList.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      ..._book.stats?.overall,
      studyHistory: _book.stats?.studyHistory,
      writeHistory: _book.stats?.writeHistory,
      classType:
        markedHideListLength > 0 &&
        isShowedAllBooks &&
        markedHideListLength === _index + 1 &&
        _index % 2 !== 0
          ? "last-even-book"
          : markedHideListLength > 0 &&
            isShowedAllBooks &&
            markedHideListLength === _index + 1 &&
            _index % 2 === 0
          ? "last-odd-book"
          : _index % 2 !== 0
          ? "even-book"
          : "odd-book",
      categoryName: name,
      isFirstBook: _index === 0,
      isLastBook: markedHideListLength === _index + 1,
      key: `KEY:${_cate._id}INDEX_HIDDEN:${_index}`,
      _id: _book._id,
      studyLikeLength,
      writeLikeLength,
    }));

    const hiddenBar = {
      key: `KEY:${_cate._id}HIDDENBAR`,
      classType: "hiddenBar",
      writeHistory: [],
      title: (
        <div
          style={{ width: "100%" }}
          onClick={() => {
            changeIsShowedHiddenBook(
              isShowedAllBooks,
              isShowedHiddenBook,
              _cate._id
            );
          }}
        >
          <StyledFlexAlignCenterWidth100>
            <div
              style={{ marginRight: "20px", textAlign: "start" }}
            >{`??? ${markedHideListLength} ?????? ?????? ?????? ????????????.`}</div>

            <DoubleRightOutlined
              className="HiddenBooksBar"
              rotate={isShowedAllBooks ? 270 : 90}
            />
          </StyledFlexAlignCenterWidth100>
        </div>
      ),
    };

    let showedList;

    // ?????? ?????? 1???
    if (categoryBooksLength === 1) {
      //?????? ?????? 0??? ??????
      if (markedHideListLength === 0) {
        showedList = [...showList];
      }
      // ?????? ?????? 1??? ?????? (?????? ??? 0???)
      else if (markedHideListLength === 1) {
        showedList = !isShowedAllBooks
          ? [{ ...hiddenBar, classType: "OnlyShowHiddenBar" }]
          : [{ ...hiddenBar, classType: "firstHiddenBar" }, ...hiddenList];
      }
    }
    // ?????? ?????? 2??? ??????
    else if (categoryBooksLength >= 2) {
      // ?????? ?????? 0?????????, ?????? ?????? 2??? ????????? ???
      if (markedHideListLength === 0) {
        showedList = [...showList];
      }
      // ?????? ?????? ?????? ??? ?????? 1??? ????????? ???
      else if (markedShowListLength >= 1 && markedHideListLength >= 1) {
        showedList = !isShowedAllBooks
          ? [...showList, { ...hiddenBar }]
          : [
              ...showList,
              { ...hiddenBar, classType: "middle-hiddenBar" },
              ...hiddenList,
            ];
      }
      // ?????? ?????? 0??? ??????
      else if (markedShowListLength === 0) {
        showedList = !isShowedAllBooks
          ? [{ ...hiddenBar, classType: "OnlyShowHiddenBar" }]
          : [{ ...hiddenBar, classType: "firstHiddenBar" }, ...hiddenList];
      }
    }

    const parentBooks = showedList[0];
    const childrenBooks = showedList.filter((_, _index) => _index !== 0);
    const parent = {
      ...parentBooks,
      key: `KEY:${_cate._id}INDEX:0`,
      categoryName: name,
      relationship: "parent",
      children: childrenBooks,
      totalBooksNum: categoryBooksLength,
      totalHiddenBooksNum: markedHideListLength,
    };

    return parent;
  });

  return dataSource;
}

const StyledFlexAlignCenterWidth100 = styled(StyledFlexAlignCenter)`
  width: 100%;
  & .HiddenBooksBar > svg {
    font-size: 1.16667rem;
    color: #a3a3a3;
  }
`;
