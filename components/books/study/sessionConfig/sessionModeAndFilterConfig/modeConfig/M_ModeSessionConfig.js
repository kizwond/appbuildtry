import React, { memo } from "react";
import styled from "styled-components";
import { Switch } from "antd";
import {
  StyledDivConfigColStartCards,
  StyledDivConfigRow,
  StyledSpanConfigTitle,
} from "../common/styledComponent/StyledComponent";
import M_InputNumberForStudyCard from "./M_InputNumberForStudyCard";
import M_ConditionOfReviewTime from "./M_ConditionOfReviewTime";
import ToggleTags from "../common/ToggleTags";
import { tags } from "../common/dataForContainer";

const M_ModeSessionConfig = ({
  children,
  detailedOption,
  changeProps,
  isPc,
}) => {
  const {
    changeSortOption,
    changeNeedStudyTimeRange,
    changeNeedStudyTimeCondition,
    changeUseCardType,
    changeUseStatus,
    changeNumStartCards,
  } = changeProps;
  const {
    sortOption,
    useCardtype,
    useStatus,
    needStudyTimeCondition,
    needStudyTimeRange,
    numStartCards,
  } = detailedOption;
  const { sortOptionTags, useCardTypeTags, useStatusTags } = tags;
  return (
    <StyledDivConfigWrapper>
      <StyledDivConfigRow isPc={isPc}>
        <div>
          <span className="ConfigTitle">보기 순서</span>
        </div>
        <div>
          <ToggleTags
            changeValue={changeSortOption}
            value={sortOption}
            tags={sortOptionTags}
          />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow isPc={isPc}>
        <div>
          <span className="ConfigTitle">카드종류</span>
        </div>
        <div>
          <ToggleTags
            changeValue={changeUseCardType}
            value={useCardtype}
            tags={useCardTypeTags}
          />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow isPc={isPc}>
        <div>
          <span className="ConfigTitle">카드상태</span>
        </div>
        <div>
          <div>
            <ToggleTags
              changeValue={changeUseStatus}
              value={useStatus}
              tags={useStatusTags}
              tagname
            />

            {/* <UseStatusTag changeUseStatus={changeUseStatus} useStatus={useStatus} /> */}
          </div>
          {useStatus.includes("ing") && (
            <StyledDivToggleStudying>
              <div className="HelperForConditionOfReviewTime">
                ※ 복습 필요 시점이 ...
              </div>
              <M_ConditionOfReviewTime
                needStudyTimeCondition={needStudyTimeCondition}
                changeNeedStudyTimeCondition={changeNeedStudyTimeCondition}
                needStudyTimeRange={needStudyTimeRange}
                changeNeedStudyTimeRange={changeNeedStudyTimeRange}
              />
            </StyledDivToggleStudying>
          )}
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow isPc={isPc}>
        <StyledDivConfigColStartCards>
          <StyledSpanConfigTitle
            onOff={numStartCards.onOff === "on"}
            isPc={isPc}
          >
            학습량
          </StyledSpanConfigTitle>
          <Switch
            className="TitleSwitchButton"
            size="small"
            checked={numStartCards.onOff === "on"}
            onChange={(checked) => {
              if (checked) {
                const copyNumStartCards = { ...numStartCards, onOff: "on" };
                changeNumStartCards(copyNumStartCards);
              } else {
                const copyNumStartCards = { ...numStartCards, onOff: "off" };
                changeNumStartCards(copyNumStartCards);
              }
            }}
          />
        </StyledDivConfigColStartCards>
        <div>
          <M_InputNumberForStudyCard
            numStartCards={numStartCards}
            changeNumStartCards={changeNumStartCards}
          />
        </div>
      </StyledDivConfigRow>
      {children}
    </StyledDivConfigWrapper>
  );
};

export default memo(M_ModeSessionConfig);

const StyledDivConfigWrapper = styled.div`
  /* border-left: 1px solid #9bcfff;
  border-right: 1px solid #9bcfff; */
  padding: 5px 5px 0 5px;
  background-color: white;
  display: flex;
  flex-direction: column;

  & > div:last-child {
    margin-bottom: 0px;
  }
`;

const StyledDivToggleStudying = styled.div`
  margin-left: 6px;
  background-color: #f5cdbf;
  padding: 1px 6px 3px 4px;
  margin-bottom: 3px;
  border-radius: 2px;

  .HelperForConditionOfReviewTime {
    margin-left: 3px;
    color: #797979;
  }
`;
