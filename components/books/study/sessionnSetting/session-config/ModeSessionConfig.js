import React, { memo } from "react";
import styled from "styled-components";
import { Switch } from "antd";
import { StyledDivConfigColStartCards, StyledDivConfigRow, StyledSpanConfigTitle } from "./common/StyledComponent";
import NumStartCards from "./NumStartCards";
import SortOptionTag from "./SortOptionTag";
import StudyTimeCondition from "./StudyTimeCondition";
import UseCardTypesTag from "./UseCardTypesTag";
import UseStatusTag from "./UseStatusTag";

const ModeSessionConfig = ({ children, detailedOption, changeProps }) => {
  const { changeSortOption, changeNeedStudyTimeRange, changeNeedStudyTimeCondition, changeUseCardType, changeUseStatus, changeNumStartCards } = changeProps;
  const { sortOption, useCardtype, useStatus, needStudyTimeCondition, needStudyTimeRange, numStartCards } = detailedOption;
  return (
    <StyledDivConfigWrapper>
      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">보기 순서</span>
        </div>
        <div>
          <SortOptionTag changeSortOption={changeSortOption} sortOption={sortOption} />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">카드종류</span>
        </div>
        <div>
          <UseCardTypesTag changeUseCardType={changeUseCardType} useCardtype={useCardtype} />
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow>
        <div>
          <span className="ConifgTitle">카드상태</span>
        </div>
        <div>
          <div>
            <UseStatusTag changeUseStatus={changeUseStatus} useStatus={useStatus} />
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
  & .ant-tag {
    margin: 3px 3px 0 3px;
    line-height: 16px;
  }
`;

const StyledDivTitleRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1) {
    flex: none;
    width: 115px;
  }
  & > div:nth-child(2) {
    flex: auto;
  }
`;

const StyledDivToggleStudying = styled.div`
  background-color: #e6f7ff;
  padding: 5px;
  border-top-right-radius: 5px;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
`;
