import { Tooltip, Tag } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";

export default function makeDataSource(myBook, category, isShowedHiddenBook, changeIsShowedHiddenBook) {
  const noCategoryId = category.find((_cate) => _cate.mybookcate_info.isFixed === "yes")._id;
  const noCategoryBooksLength = myBook.filter((_book) => _book.mybook_info.mybookcate_id === noCategoryId).length;
  const filteredCategory = noCategoryBooksLength > 0 ? category : category.filter((_cate) => _cate.mybookcate_info.name !== "(미지정)");

  const dataSource = filteredCategory.map((_cate, _categoryIndex) => {
    console.log({ category });
    const { name, seq } = _cate.mybookcate_info;
    const categoryBooksList = myBook.filter((_book) => _cate._id === _book.mybook_info.mybookcate_id);
    const categoryBooksLength = categoryBooksList.length;
    if (categoryBooksLength === 0) {
      return {
        relationship: "parent",
        classType: "empty-category",
        categoryOrder: seq,
        categoryName: name,
        key: `KEY:${_cate._id}INDEX:0`,
      };
    }

    const markedShowList = categoryBooksList.filter((_book) => _book.mybook_info.hide_or_show == "show");
    const markedShowListLength = markedShowList.length;
    const markedHideList = categoryBooksList.filter((_book) => _book.mybook_info.hide_or_show == "hide");
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
        markedHideListLength === 0 && markedShowListLength > 0 && markedShowListLength === _index + 1 && _index % 2 !== 0
          ? "last-even-book"
          : markedHideListLength === 0 && markedShowListLength > 0 && markedShowListLength === _index + 1 && _index % 2 === 0
          ? "last-odd-book"
          : _index % 2 !== 0
          ? "even-book"
          : "odd-book",
      categoryOrder: seq,
      categoryName: name,
      isFirstBook: _index === 0,
      isLastBook: markedShowListLength === _index + 1,
      key: `KEY:${_cate._id}INDEX:${_index + 1}`,
      _id: _book._id,
    }));

    const hiddenList = markedHideList.map((_book, _index) => ({
      ..._book.mybook_info,
      ..._book.stats?.numCards,
      ..._book.stats?.recent,
      ..._book.stats?.overall,
      studyHistory: _book.stats?.studyHistory,
      writeHistory: _book.stats?.writeHistory,
      classType:
        markedHideListLength > 0 && isShowedAllBooks && markedHideListLength === _index + 1 && _index % 2 !== 0
          ? "last-even-book"
          : markedHideListLength > 0 && isShowedAllBooks && markedHideListLength === _index + 1 && _index % 2 === 0
          ? "last-odd-book"
          : _index % 2 !== 0
          ? "even-book"
          : "odd-book",
      categoryOrder: seq,
      categoryName: name,
      isFirstBook: _index === 0,
      isLastBook: markedHideListLength === _index + 1,
      key: `KEY:${_cate._id}INDEX_HIDDEN:${_index}`,
      _id: _book._id,
    }));

    const hiddenBar = {
      key: `KEY:${_cate._id}HIDDENBAR`,
      classType: "hiddenBar",
      title: (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "40px" }}>{`총 ${markedHideListLength} 권의 숨김 책이 있습니다.`}</div>
            <Tooltip
              title={isShowedAllBooks ? "숨긴 책 감추기" : "숨긴 책 표시"}
              color="rgba(7, 164, 237, 0.522)"
              overlayInnerStyle={{ fontSize: "0.65rem", minWidth: "0", minHeight: "0" }}
              overlayStyle={{ alignSelf: "middle" }}
            >
              <Tag
                className="HandleOnOffShow"
                size="small"
                style={{ fontSize: "0.7rem" }}
                color={isShowedAllBooks ? "#cec8c8" : "#a9a7a7"}
                icon={<VerticalAlignBottomOutlined rotate={isShowedAllBooks ? 180 : 0} />}
                onClick={() => {
                  changeIsShowedHiddenBook(isShowedAllBooks, isShowedHiddenBook, _cate._id);
                }}
              >
                {isShowedAllBooks ? "접기" : "보기"}
              </Tag>
            </Tooltip>
          </div>
        </>
      ),
    };

    let showedList;

    // 전체 책이 1권
    if (categoryBooksLength === 1) {
      //숨긴 책이 0권 일때
      if (markedHideListLength === 0) {
        showedList = [...showList];
      }
      // 숨긴 책이 1권 일때 (표시 책 0권)
      else if (markedHideListLength === 1) {
        showedList = !isShowedAllBooks ? [{ ...hiddenBar }] : [{ ...hiddenBar, classType: "middle-hiddenBar" }, ...hiddenList];
      }
    }
    // 전체 책이 2권 이상
    else if (categoryBooksLength >= 2) {
      // 숨긴 책이 0권이며, 표시 책이 2권 이상일 때
      if (markedHideListLength === 0) {
        showedList = [...showList];
      }
      // 숨긴 책과 표시 책 각각 1권 이상일 때
      else if (markedShowListLength >= 1 && markedHideListLength >= 1) {
        showedList = !isShowedAllBooks ? [...showList, { ...hiddenBar }] : [...showList, { ...hiddenBar, classType: "middle-hiddenBar" }, ...hiddenList];
      }
      // 표시 책이 0권 일때
      else if (markedShowListLength === 0) {
        showedList = !isShowedAllBooks ? [{ ...hiddenBar }] : [{ ...hiddenBar, classType: "middle-hiddenBar" }, ...hiddenList];
      }
    }

    const parentBooks = showedList[0];
    const childrenBooks = showedList.filter((_, _index) => _index !== 0);
    const parent = {
      ...parentBooks,
      key: `KEY:${_cate._id}INDEX:0`,
      categoryOrder: seq,
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
