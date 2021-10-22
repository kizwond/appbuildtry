import React, { memo, useCallback } from "react";
import styled from "styled-components";
import ToggleTag from "./ToggleTag";

const attr = (i) => i === 0 && { first: "yes" };

const NewToggleTag = ({ children, option, index, value, changeValue, tagname }) => {
  const isArray = Array.isArray(value);
  const verifyIsChecked = useCallback((option) => (isArray ? value.includes(option) : value === option), [value, isArray]);
  const attrTagName = tagname && { tagname: "ing" };

  const attr2 = isArray
    ? {
        onChange: (checked) => {
          if (checked) {
            const newArr = [...value, option];
            changeValue(newArr);
          }
          if (!checked) {
            const newArr = value.filter((_option) => _option !== option);
            changeValue(newArr);
          }
        },
      }
    : { onClick: () => changeValue(option) };

  return (
    <ToggleTag checked={verifyIsChecked(option)} {...attr(index)} {...attr2} {...attrTagName}>
      {children}
    </ToggleTag>
  );
};

const ToggleTags = ({ value, changeValue, tagname, tags, af }) => {
  const makeAttrTagName = (option) => tagname && option === "ing" && { tagname };
  const makeAttrAF = af && { forfilter: "yes" };
  return (
    <RowForLevelTwo {...makeAttrAF}>
      {tags.map((tag, i) => (
        <NewToggleTag key={tag.option} option={tag.option} index={i} value={value} changeValue={changeValue} {...makeAttrTagName(tag.option)}>
          {tag.title}
        </NewToggleTag>
      ))}
    </RowForLevelTwo>
  );
};

export default memo(ToggleTags);

const RowForLevelTwo = styled.div`
  margin-left: ${({ forfilter }) => (forfilter === "yes" ? "0" : "10px")};
`;
