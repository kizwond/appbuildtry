import React, { memo } from "react";
import FilterTag from "./common/FilterTag";
import StyledInactivatedTag from "./common/StyledInactivatedTag";

const flags = [
  { value: 0, name: "No flag" },
  { value: 1, name: "flag1" },
  { value: 2, name: "flag2" },
  { value: 3, name: "flag3" },
  { value: 4, name: "flag4" },
  { value: 5, name: "flag5" },
];
const recentDifficulty = [
  { value: "none", name: "결과없음" },
  { value: "diffi1", name: "모름" },
  { value: "diffi2", name: "어려움" },
  { value: "diffi3", name: "애매함" },
  { value: "diffi4", name: "쉬움" },
  { value: "diffi5", name: "알고있음" },
];
const examResult = [
  { value: "none", name: "결과없음" },
  { value: "right", name: "맞춘카드" },
  { value: "wrong", name: "틀린카드" },
];
const FlagTags = ({ menu, array, setState, onOff }) => {
  const tags = menu === "flags" ? flags : menu === "recentDifficulty" ? recentDifficulty : menu === "examResult" ? examResult : new Error("잘못된 선택");
  return (
    <>
      {onOff
        ? tags.map((tag, index) => <FilterTag key={`${tag.name}${index}`} name={tag.name} array={array} value={tag.value} setState={setState} />)
        : tags.map((tag, index) => <StyledInactivatedTag key={`${tag.name}${index}`} name={tag.name} />)}
    </>
  );
};

export default memo(FlagTags);
