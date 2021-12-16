import React, { memo } from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import tags from "./common/tags";

const { useStatusTags } = tags;

const NumStartCards = ({ numStartCards, changeNumStartCards }) => {
  const attr = (i) => i === 0 && { first: "yes" };
  return (
    <RowForLevelTwo>
      {useStatusTags.map((tag, i) => (
        <StyledDiv key={tag.option} {...attr(i)}>
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
    </RowForLevelTwo>
  );
};

export default memo(NumStartCards);

const StyledDiv = styled.div`
  display: inline-block;
  margin: ${({ first }) =>
    first === "yes" ? "3px 3px 3px 0" : "3px 3px 3px 3px"};
`;

const RowForLevelTwo = styled.div`
  margin-left: 6px;
`;
