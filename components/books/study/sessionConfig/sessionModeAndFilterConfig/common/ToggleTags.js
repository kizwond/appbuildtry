import React, { memo, useCallback } from "react";
import styled from "styled-components";
import { Tag } from "antd";

// eslint-disable-next-line react/display-name
const ToggleTag = memo((props) => {
  const attr = useCallback(
    ({ tagname, checked }) => tagname && checked && { tagname, checked },
    []
  );
  return (
    <Wrapper {...attr(props)}>
      <CheckableTag className="CheckableTag" {...props} />
    </Wrapper>
  );
});

const NewToggleTag = ({
  children,
  option,
  index,
  value,
  changeValue,
  tagname,
}) => {
  const isArray = Array.isArray(value);
  const verifyIsChecked = useCallback(
    (option) => (isArray ? value.includes(option) : value === option),
    [value, isArray]
  );
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
    <ToggleTag checked={verifyIsChecked(option)} {...attr2} {...attrTagName}>
      {children}
    </ToggleTag>
  );
};

const ToggleTags = ({ value, changeValue, tagname, tags, af }) => {
  const makeAttrTagName = (option) =>
    tagname && option === "ing" && { tagname };
  const makeAttrAF = af && { forfilter: "yes" };
  return (
    <RowForLevelTwo {...makeAttrAF}>
      {tags.map((tag, i) => (
        <NewToggleTag
          key={tag.option}
          option={tag.option}
          index={i}
          value={value}
          changeValue={changeValue}
          {...makeAttrTagName(tag.option)}
        >
          {tag.title}
        </NewToggleTag>
      ))}
    </RowForLevelTwo>
  );
};

export default memo(ToggleTags);

const CheckableTag = styled(Tag.CheckableTag)`
  border: ${({ checked }) =>
    checked ? "1px solid #1890ff" : "1px solid #d9d9d9"};
  margin: 2px 2px 2px 2px;
`;
const Wrapper = styled.div`
  background-color: ${({ checked, tagname }) =>
    checked && tagname === "ing" ? "#f5cdbf" : "transparent"};
  display: inline-block;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  &:first-of-type > .CheckableTag {
    margin: 2px 2px 2px 0;
  }
`;

const RowForLevelTwo = styled.div`
  margin-left: ${({ forfilter }) => (forfilter === "yes" ? "0" : "6px")};
`;
