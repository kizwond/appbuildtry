import React, { memo } from "react";
import { Tag } from "antd";
import styled from "styled-components";

const tags = [
  { option: "read", title: "읽기카드" },
  { option: "flip", title: "뒤집기카드" },
];
const UseCardTypeTag = ({ useCardtype, changeUseCardType }) => {
  return (
    <div>
      {tags.map((tag) => (
        <StyledDiv key={tag.option} checked={useCardtype.includes(tag.option)}>
          <Tag.CheckableTag
            checked={useCardtype.includes(tag.option)}
            onChange={(checked) => {
              if (checked) {
                const newArr = [...useCardtype, tag.option];
                changeUseCardType(newArr);
              }
              if (!checked) {
                const newArr = useCardtype.filter((type) => type !== tag.option);
                changeUseCardType(newArr);
              }
            }}
          >
            {tag.title}
          </Tag.CheckableTag>
        </StyledDiv>
      ))}
    </div>
  );
};

export default memo(UseCardTypeTag);

const StyledDiv = styled.div`
  display: inline-block;
  & > span {
    border: ${(props) => (props.checked ? "1px solid #1890ff" : "1px solid #d9d9d9")};
  }
`;
