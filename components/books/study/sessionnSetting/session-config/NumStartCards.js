import React, { memo } from "react";
import styled from "styled-components";
import { InputNumber } from "antd";
import tags from "./common/tags";

const { useStatusTags } = tags;

const NumStartCards = ({ numStartCards, changeNumStartCards }) => {
  return (
    <div>
      {useStatusTags.map((tag) => (
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
  margin: 3px;
`;
