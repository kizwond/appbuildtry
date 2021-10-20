import React, { memo } from "react";
import styled from "styled-components";
import { InputNumber } from "antd";

const tags = [
  { option: "yet", title: "미학습" },
  { option: "ing", title: "학습중" },
  { option: "completed", title: "학습완료" },
  { option: "hold", title: "학습보류" },
];
const NumStartCards = ({ numStartCards, changeNumStartCards }) => {
  return (
    <div>
      {tags.map((tag) => (
        <StyledDiv key={tag.option}>
          {`${tag.title}: `}
          <InputNumber
            disabled={numStartCards.onOff === "off"}
            size="small"
            value={numStartCards[`${tag.option}`]}
            onChange={(value) => {
              const copy = { ...numStartCards, [`${tag.option}`]: value };
              changeNumStartCards(copy);
            }}
          />
        </StyledDiv>
      ))}
    </div>
  );
};

export default memo(NumStartCards);

const StyledDiv = styled.div`
  display: inline-block;
  margin: 4px;
`;
