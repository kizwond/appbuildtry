import React, { memo } from "react";
import styled from "styled-components";
import { InputNumber } from "antd";

const tags = [
  { option: "yet", title: "미학습" },
  { option: "ing", title: "학습중" },
  { option: "completed", title: "학습완료" },
  { option: "hold", title: "학습보류" },
];
const NumStartCards = ({ mode, selected, changeNumStartCards }) => {
  const [read, flip, exam] = selected;
  const selectedNum = mode === "read" ? read : mode === "flip" ? flip : mode === "exam" ? exam : new Error("UseStatus 에러");
  return (
    <div>
      {tags.map((tag) => (
        <StyledTag key={tag.option}>
          {`${tag.title}: `}
          <InputNumber
            disabled={selectedNum.onOff === "off"}
            size="small"
            value={selectedNum[`${tag.option}`]}
            onChange={(value) => {
              const copy = { ...selectedNum, [`${tag.option}`]: value };
              changeNumStartCards(mode, copy);
            }}
          ></InputNumber>
        </StyledTag>
      ))}
    </div>
  );
};

export default memo(NumStartCards);

const StyledTag = styled.div`
  display: inline-block;
  margin: 4px;
`;
