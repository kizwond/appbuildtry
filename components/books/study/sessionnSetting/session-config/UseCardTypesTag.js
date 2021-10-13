import React, { memo } from "react";
import { Tag } from "antd";
import styled from "styled-components";

const tags = [
  { option: "read", title: "읽기카드" },
  { option: "flip", title: "뒤집기카드" },
];
const UseCardTypeTag = ({ mode, selected, changeUseCardType }) => {
  const [read, flip, exam] = selected;
  const selectedUseCardType = mode === "read" ? read : mode === "flip" ? flip : mode === "exam" ? exam : "오류";
  return (
    <div>
      {tags.map((tag) => (
        <StyledTag key={tag.option} checked={selectedUseCardType.includes(tag.option)}>
          <Tag.CheckableTag
            checked={selectedUseCardType.includes(tag.option)}
            onChange={(checked) => {
              if (checked) {
                const newArr = [...selectedUseCardType, tag.option];
                changeUseCardType(mode, newArr);
              }
              if (!checked) {
                const newArr = selectedUseCardType.filter((type) => type !== tag.option);
                changeUseCardType(mode, newArr);
              }
            }}
          >
            {tag.title}
          </Tag.CheckableTag>
        </StyledTag>
      ))}
    </div>
  );
};

export default memo(UseCardTypeTag);

const StyledTag = styled.div`
  display: inline-block;
  & > span {
    border: ${(props) => (props.checked ? "1px solid #1890ff" : "1px solid #d9d9d9")};
  }
`;
