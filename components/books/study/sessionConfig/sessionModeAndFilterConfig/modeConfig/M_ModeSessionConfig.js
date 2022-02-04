import React, { memo } from "react";
import styled from "styled-components";
import { Switch, Tag } from "antd";
import {
  StyledDivConfigColStartCards,
  StyledDivConfigRow,
  StyledSpanConfigTitle,
} from "../common/styledComponent/StyledComponent";
import M_InputNumberForStudyCard from "./M_InputNumberForStudyCard";
import M_ConditionOfReviewTime from "./M_ConditionOfReviewTime";
import ToggleTags from "../common/ToggleTags";
import { tags } from "../common/dataForContainer";
import { useEffect } from "react";

const M_ModeSessionConfig = ({
  children,
  detailedOption,
  changeProps,
  isPc,
  isExamMode,
  isReadMode,
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

  useEffect(() => {
    if (isExamMode) {
      changeUseCardType(["flip"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExamMode]);

  return (
    <StyledDivConfigWrapper>
      {!isReadMode && (
        <StyledDivConfigRow is_pc={(isPc || false).toString()}>
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
      )}

      <StyledDivConfigRow is_pc={(isPc || false).toString()}>
        <div>
          <span className="ConfigTitle">카드종류</span>
        </div>
        <div>
          {isExamMode ? (
            <RowForLevelTwo>
              <CheckableTag checked={true}>뒤집기카드</CheckableTag>
            </RowForLevelTwo>
          ) : (
            <ToggleTags
              changeValue={changeUseCardType}
              value={useCardtype}
              tags={useCardTypeTags}
            />
          )}
        </div>
      </StyledDivConfigRow>

      <StyledDivConfigRow is_pc={(isPc || false).toString()}>
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

      {!isReadMode && (
        <StyledDivConfigRow is_pc={(isPc || false).toString()}>
          <StyledDivConfigColStartCards>
            <StyledSpanConfigTitle
              onOff={numStartCards.onOff === "on"}
              is_pc={(isPc || false).toString()}
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
              selectedCardStatus={useStatus}
              numStartCards={numStartCards}
              changeNumStartCards={changeNumStartCards}
            />
          </div>
        </StyledDivConfigRow>
      )}
      {children}
    </StyledDivConfigWrapper>
  );
};

export default memo(M_ModeSessionConfig);

const CheckableTag = styled(Tag.CheckableTag)`
  border: 1px solid #1890ff;
  margin: 2px 2px 2px 2px;
`;

const RowForLevelTwo = styled.div`
  margin-left: 6px;
`;

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
