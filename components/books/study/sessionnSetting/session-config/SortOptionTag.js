import React, { memo } from "react";
import { Tag } from "antd";
import styled from "styled-components";

const tags = [
  { option: "standard", title: "원본 그대로" },
  { option: "time", title: "복습 시점 빠른순" },
  { option: "random", title: "랜덤" },
];

const SortOptionTag = ({ mode, selected, changeSortOption }) => {
  const [read, flip, exam] = selected;
  const selectedSortOption = mode === "read" ? read : mode === "flip" ? flip : mode === "exam" ? exam : "오류";

  return (
    <div>
      {tags.map((tag) => (
        <StyledTag key={tag.option} checked={selectedSortOption === tag.option}>
          <Tag.CheckableTag
            checked={selectedSortOption === tag.option}
            onClick={() => {
              changeSortOption(mode, tag.option);
            }}
          >
            {tag.title}
          </Tag.CheckableTag>
        </StyledTag>
      ))}
    </div>
  );
};

export default memo(SortOptionTag);

const StyledTag = styled.div`
  display: inline-block;
  & > span {
    border: ${(props) => (props.checked ? "1px solid #1890ff" : "1px solid #d9d9d9")};
  }
`;
