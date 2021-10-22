import React, { memo } from "react";
import styled from "styled-components";
import { Switch } from "antd";
import { StyledDivConfigColStartCards, StyledDivConfigRow, StyledSpanConfigTitle } from "./common/StyledComponent";
import NumStartCards from "./NumStartCards";
import StudyTimeCondition from "./StudyTimeCondition";
import ToggleTags from "./common/ToggleTags";
import tags from "./common/tags";

const ModeSessionConfig = ({ children, detailedOption, changeProps }) => {
  const { changeSortOption, changeNeedStudyTimeRange, changeNeedStudyTimeCondition, changeUseCardType, changeUseStatus, changeNumStartCards } = changeProps;
  const { sortOption, useCardtype, useStatus, needStudyTimeCondition, needStudyTimeRange, numStartCards } = detailedOption;
  const { sortOptionTags, useCardTypeTags, useStatusTags } = tags;
  return (
    <StyledDivConfigWrapper>
      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">보기 순서</span>
        </div>
        <div>
          <ToggleTags changeValue={changeSortOption} value={sortOption} tags={sortOptionTags} />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">카드종류</span>
        </div>
        <div>
          <ToggleTags changeValue={changeUseCardType} value={useCardtype} tags={useCardTypeTags} />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">카드상태</span>
        </div>
        <div>
          <div>
            <ToggleTags changeValue={changeUseStatus} value={useStatus} tags={useStatusTags} tagname />

            {/* <UseStatusTag changeUseStatus={changeUseStatus} useStatus={useStatus} /> */}
          </div>
          {useStatus.includes("ing") && (
            <StyledDivToggleStudying>
              <StudyTimeCondition
                needStudyTimeCondition={needStudyTimeCondition}
                changeNeedStudyTimeCondition={changeNeedStudyTimeCondition}
                needStudyTimeRange={needStudyTimeRange}
                changeNeedStudyTimeRange={changeNeedStudyTimeRange}
              />
            </StyledDivToggleStudying>
          )}
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <StyledDivConfigColStartCards>
          <StyledSpanConfigTitle onOff={numStartCards.onOff === "on"}>학습량</StyledSpanConfigTitle>
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
          <NumStartCards numStartCards={numStartCards} changeNumStartCards={changeNumStartCards} />
        </div>
      </StyledDivConfigRow>
      {children}
    </StyledDivConfigWrapper>
  );
};

export default memo(ModeSessionConfig);

const StyledDivConfigWrapper = styled.div`
  border-left: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  padding: 5px 5px 0 5px;
  background-color: white;
  display: flex;
  flex-direction: column;

  & > div:last-child {
    margin-bottom: 0px;
  }
`;

const StyledDivToggleStudying = styled.div`
  margin-left: 20px;
  background-color: #f5cdbf;
  padding: 1px 6px 3px 4px;
  margin-bottom: 3px;
  border-radius: 2px;
`;
