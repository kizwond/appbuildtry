import React, { memo } from "react";
import { Tag } from "antd";
import styled from "styled-components";

const UseStatusTag = ({ useStatus, changeUseStatus }) => {
  const tags = [
    { option: "yet", title: "미학습" },
    { option: "ing", title: "학습중" },
    { option: "completed", title: "학습완료" },
    { option: "hold", title: "학습보류" },
  ];
  return (
    <div>
      {tags.map((tag) => (
        <StyledTag key={tag.option} checked={useStatus.includes(tag.option)} option={tag.option}>
          <Tag.CheckableTag
            checked={useStatus.includes(tag.option)}
            onChange={(checked) => {
              if (checked) {
                const newArr = [...useStatus, tag.option];
                changeUseStatus(newArr);
              }
              if (!checked) {
                const newArr = useStatus.filter((type) => type !== tag.option);
                changeUseStatus(newArr);
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

export default memo(UseStatusTag);

const StyledTag = styled.div`
  display: inline-block;
  background-color: ${(props) => (props.checked && props.option === "ing" ? "#e6f7ff" : "#fff")};

  & > span {
    border: ${(props) => (props.checked ? "1px solid #1890ff" : "1px solid #d9d9d9")};
  }
`;
