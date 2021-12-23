import React, { memo, useState } from "react";
import { Switch } from "antd";
import styled from "styled-components";
import {
  StyledDivConfigColStartCards,
  StyledSpanConfigTitle,
} from "../common/styledComponent/StyledComponent";
import GetFilteredIndexButton from "./GetFilteredIndexButton";
import FilterSubMenu from "./FilterSubMenu";
import M_RecentStudyTime from "./M_RecentStudyTime";
import CardLevel from "./CardLevel";
import StudyTimes from "./StudyTimes";
import ToggleTags from "../common/ToggleTags";
import { filterTags } from "../common/dataForContainer";
import InactivatedTags from "../common/InactivatedTags";

const M_AdvancedFilter = ({
  book_ids,
  advancedFilteredCheckedIndexes,
  onChangeIndexesOfAFCardList,
  onChangeAFCardList,
  AFCardList,
  onToggleIsAFilter,
  changeAdvancedFilter,
  advancedFilter,
}) => {
  const [counterForButtonClick, setCounterForButtonClick] = useState(false);
  const onChangeAFButtonClick = (_falsy) => {
    setCounterForButtonClick(_falsy);
  };

  const {
    changeAdvancedFilterOnOff,
    changeUserFlag,
    changeUserFlagOnOff,
    changeCardMaker,
    changeCardMakerOnOff,
    changeMakerFlag,
    changeMakerFlagOnOff,
    changeExamResult,
    changeExamResultOnOff,
    changeRecentDifficulty,
    changeRecentDifficultyOnOff,
    changeRecentStudyTime,
    changeRecentStudyTimeOnOff,
    changeLevel,
    changeLevelOnOff,
    changeStudyTimes,
    changeStudyTimesOnOff,
  } = changeAdvancedFilter;

  const {
    onOff,
    cardMaker,
    examResult,
    level,
    makerFlag,
    userFlag,
    recentDifficulty,
    recentStudyTime,
    studyTimes,
  } = advancedFilter;

  const { flagTags, recentDifficultyTags, examResultTags } = filterTags;
  return (
    <StyledDivWrapper>
      <StyledDivTitleRow>
        <StyledDivConfigColStartCards>
          <StyledSpanConfigTitle onOff={onOff === "on"}>
            고급필터
          </StyledSpanConfigTitle>
          <Switch
            className="TitleSwitchButton"
            size="small"
            checked={
              onOff === "on"
                ? true
                : onOff === "off"
                ? false
                : new Error("고급필터 스위치 에러")
            }
            onChange={(checked) => {
              if (checked) {
                changeAdvancedFilterOnOff("on");
                if (counterForButtonClick) {
                  onToggleIsAFilter(true);
                }
              } else {
                changeAdvancedFilterOnOff("off");
                onToggleIsAFilter(false);
              }
            }}
          />
        </StyledDivConfigColStartCards>
        {onOff === "on" && (
          <RowForLevelTwo>
            <GetFilteredIndexButton
              book_ids={book_ids}
              advancedFilter={advancedFilter}
              onChangeAFCardList={onChangeAFCardList}
              AFCardList={AFCardList}
              onToggleIsAFilter={onToggleIsAFilter}
              advancedFilteredCheckedIndexes={advancedFilteredCheckedIndexes}
              onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
              onChangeAFButtonClick={onChangeAFButtonClick}
            />
          </RowForLevelTwo>
        )}
      </StyledDivTitleRow>
      {onOff === "on" && (
        <>
          <FilterSubMenu
            title="사용자 플래그"
            changeOnOff={changeUserFlagOnOff}
            onOff={userFlag.onOff}
          >
            {userFlag.onOff === "on" ? (
              <ToggleTags
                changeValue={changeUserFlag}
                value={userFlag.value}
                tags={flagTags}
                af
              />
            ) : (
              <InactivatedTags tags={flagTags} />
            )}
          </FilterSubMenu>
          <FilterSubMenu
            title="제작자 플래그"
            changeOnOff={changeMakerFlagOnOff}
            onOff={makerFlag.onOff}
          >
            {makerFlag.onOff === "on" ? (
              <ToggleTags
                changeValue={changeMakerFlag}
                value={makerFlag.value}
                tags={flagTags}
                af
              />
            ) : (
              <InactivatedTags tags={flagTags} />
            )}
          </FilterSubMenu>
          <FilterSubMenu
            title="최근 학습 시점"
            changeOnOff={changeRecentStudyTimeOnOff}
            onOff={recentStudyTime.onOff}
          >
            <M_RecentStudyTime
              onOff={recentStudyTime.onOff}
              recentStudyTime={recentStudyTime.value}
              changeRecentStudyTime={changeRecentStudyTime}
            />
          </FilterSubMenu>
          <FilterSubMenu
            title="카드 레벨"
            changeOnOff={changeLevelOnOff}
            onOff={level.onOff}
          >
            <CardLevel
              onOff={level.onOff}
              level={level.value}
              changeLevel={changeLevel}
            />
          </FilterSubMenu>
          <FilterSubMenu
            title="학습 횟수"
            changeOnOff={changeStudyTimesOnOff}
            onOff={studyTimes.onOff}
          >
            <StudyTimes
              onOff={studyTimes.onOff}
              studyTimes={studyTimes.value}
              changeStudyTimes={changeStudyTimes}
            />
          </FilterSubMenu>

          <FilterSubMenu
            title="최근 선택 난이도"
            changeOnOff={changeRecentDifficultyOnOff}
            onOff={recentDifficulty.onOff}
          >
            {recentDifficulty.onOff === "on" ? (
              <ToggleTags
                changeValue={changeRecentDifficulty}
                value={recentDifficulty.value}
                tags={recentDifficultyTags}
                af
              />
            ) : (
              <InactivatedTags tags={recentDifficultyTags} />
            )}
          </FilterSubMenu>
          <FilterSubMenu
            title="최근 시험 결과"
            changeOnOff={changeExamResultOnOff}
            onOff={examResult.onOff}
          >
            {examResult.onOff === "on" ? (
              <ToggleTags
                changeValue={changeExamResult}
                value={examResult.value}
                tags={examResultTags}
                af
              />
            ) : (
              <InactivatedTags tags={examResultTags} />
            )}
          </FilterSubMenu>
        </>
      )}
    </StyledDivWrapper>
  );
};

export default memo(M_AdvancedFilter);

const StyledDivTitleRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  & > div:nth-child(1) {
    flex: none;
    width: 104px;
  }
  & > div:nth-child(2) {
    flex: auto;
  }
`;

const StyledDivWrapper = styled.div`
  border-left: 1px solid #9bcfff;
  border-right: 1px solid #9bcfff;
  border-bottom: 1px solid #9bcfff;
  padding: 0 5px 5px 5px;
  background-color: white;
`;

const RowForLevelTwo = styled.div`
  margin-left: 6px;
`;
