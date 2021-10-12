import React, { memo } from "react";
import { Tag } from "antd";
import styled from "styled-components";

const UseStatusTag = ({ mode, selected, changeUseStatus }) => {
  const [read, flip, exam] = selected;
  const selectedUseStatus = mode === "read" ? read : mode === "flip" ? flip : mode === "exam" ? exam : "오류";
  const tags = [
    { option: "yet", title: "미학습" },
    { option: "ing", title: "학습중" },
    { option: "completed", title: "학습완료" },
    { option: "hold", title: "학습보류" },
  ];
  return (
    <>
      {tags.map((tag) => (
        <StyledTag
          key={tag.option}
          checked={selectedUseStatus.includes(tag.option)}
          option={tag.option}
          onChange={(checked) => {
            if (checked) {
              const newArr = [...selectedUseStatus, tag.option];
              changeUseStatus(mode, newArr);
            }
            if (!checked) {
              const newArr = selectedUseStatus.filter((type) => type !== tag.option);
              changeUseStatus(mode, newArr);
            }
          }}
        >
          {tag.title}
        </StyledTag>
      ))}
    </>
  );
};

export default memo(UseStatusTag);

const StyledTag = styled(Tag.CheckableTag)`
  border: ${(props) => (props.checked && props.option === "ing" ? "6px solid #e6f7ff" : props.checked ? "1px solid #1890ff" : "1px solid #d9d9d9")};
`;
