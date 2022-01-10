import React, { memo } from "react";
import styled from "styled-components";
import { InputNumber } from "antd";

import { tags } from "../common/dataForContainer";

const { useStatusTags } = tags;

const M_InputNumberForStudyCard = ({
  numStartCards,
  changeNumStartCards,
  selectedCardStatus,
}) => {
  return (
    <RowForLevelTwo>
      {useStatusTags.map((tag, i) => (
        <div className="InputNumberForStudy" key={tag.option}>
          {`${tag.title}: `}
          <InputNumber
            disabled={
              numStartCards.onOff === "off" ||
              !selectedCardStatus.includes(tag.option)
            }
            size="small"
            value={numStartCards[`${tag.option}`]}
            onChange={(value) => {
              const copy = { ...numStartCards, [`${tag.option}`]: value };
              changeNumStartCards(copy);
            }}
          />
        </div>
      ))}
    </RowForLevelTwo>
  );
};

export default memo(M_InputNumberForStudyCard);

const RowForLevelTwo = styled.div`
  margin-left: 6px;

  .InputNumberForStudy {
    display: inline-block;
    margin: 2px 3px 2px 3px;
    text-align: center;
    &:first-child {
      margin: 2px 3px 2px 0;
    }
  }
`;
