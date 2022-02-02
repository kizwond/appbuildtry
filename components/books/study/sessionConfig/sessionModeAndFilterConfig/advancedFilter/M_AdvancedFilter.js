import React, { memo, useState } from "react";
import { InputNumber, Space, Switch, Tag } from "antd";
import styled from "styled-components";
import {
  StyledDivConfigColStartCards,
  StyledSpanConfigTitle,
} from "../common/styledComponent/StyledComponent";
import FilterSubMenu from "./FilterSubMenu";
import M_RecentStudyTime from "./M_RecentStudyTime";
import CardLevel from "./CardLevel";
import StudyTimes from "./StudyTimes";
import ToggleTags from "../common/ToggleTags";
import { filterTags } from "../common/dataForContainer";
import InactivatedTags from "../common/InactivatedTags";

const M_AdvancedFilter = ({ changeAdvancedFilter, advancedFilter, isPc }) => {
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

    changeRecentDifficultyOnOff,
    changeStartOfStudyRatioRange,
    changeEndOfStudyRatioRange,
    changeNonCurrentStudyRatioOnOff,
    changeCurrentStudyRatioOnOff,

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

  const [
    nonCurrentStudyRatioOnOff,
    currentStudyRatioOnOff,
    startOfStudyRatioRange,
    endOfStudyRatioRange,
  ] = recentDifficulty.value;
  return (
    <StyledDivWrapper>
      <StyledDivTitleRow is_pc={(isPc || false).toString()}>
        <StyledDivConfigColStartCards>
          <StyledSpanConfigTitle
            onOff={onOff === "on"}
            is_pc={(isPc || false).toString()}
          >
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
              } else {
                changeAdvancedFilterOnOff("off");
              }
            }}
          />
        </StyledDivConfigColStartCards>
      </StyledDivTitleRow>
      {onOff === "on" && (
        <>
          <FilterSubMenu
            isPc={isPc}
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
            isPc={isPc}
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
            isPc={isPc}
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
            isPc={isPc}
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
            isPc={isPc}
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
            isPc={isPc}
            title="최근 선택 난이도"
            changeOnOff={changeRecentDifficultyOnOff}
            onOff={recentDifficulty.onOff}
          >
            {recentDifficulty.onOff === "on" ? (
              // <ToggleTags
              //   changeValue={changeRecentDifficulty}
              //   value={recentDifficulty.value}
              //   tags={recentDifficultyTags}
              //   af
              // />

              //   const Wrapper = styled.div`
              //   background-color: ${({ checked, tagname }) =>
              //     checked && tagname === "ing" ? "#f5cdbf" : "transparent"};
              //   display: inline-block;
              //   border-top-left-radius: 2px;
              //   border-top-right-radius: 2px;
              //   &:first-of-type > .CheckableTag {
              //     margin: 2px 2px 2px 0;
              //   }
              // `;

              //           const CheckableTag = styled(Tag.CheckableTag)`
              // border: ${({ checked }) =>
              //   checked ? "1px solid #1890ff" : "1px solid #d9d9d9"};
              // margin: 2px 2px 2px 2px;
              // `;

              <div className="flex gap-[4px] py-[2px]">
                <Tag.CheckableTag
                  checked={nonCurrentStudyRatioOnOff === "on"}
                  //  " border border-solid border-[#1890ff] "
                  className={`${
                    nonCurrentStudyRatioOnOff === "on"
                      ? "border border-solid !border-[#1890ff]"
                      : "border border-solid !border-[#d9d9d9]"
                  } !m-[0px]`}
                  onChange={(checked) => {
                    if (checked) {
                      changeNonCurrentStudyRatioOnOff("on");
                    } else {
                      changeNonCurrentStudyRatioOnOff("off");
                    }
                  }}
                >
                  결과없음
                </Tag.CheckableTag>
                <Tag.CheckableTag
                  checked={currentStudyRatioOnOff === "on"}
                  className={`${
                    currentStudyRatioOnOff === "on"
                      ? "border border-solid !border-[#1890ff]"
                      : "border border-solid !border-[#d9d9d9]"
                  } !m-[0px]`}
                  onChange={(checked) => {
                    if (checked) {
                      changeCurrentStudyRatioOnOff("on");
                    } else {
                      changeCurrentStudyRatioOnOff("off");
                    }
                  }}
                >
                  결과있음
                </Tag.CheckableTag>

                {currentStudyRatioOnOff === "on" && (
                  <Space>
                    <InputNumber
                      className="AdvancedFilterInputNumber"
                      size="small"
                      min={0}
                      max={
                        endOfStudyRatioRange == null
                          ? 99
                          : endOfStudyRatioRange - 1
                      }
                      value={startOfStudyRatioRange}
                      onChange={changeStartOfStudyRatioRange}
                    />
                    ~
                    <InputNumber
                      className="AdvancedFilterInputNumber"
                      size="small"
                      min={
                        endOfStudyRatioRange == null
                          ? 2
                          : startOfStudyRatioRange + 1
                      }
                      max={100}
                      value={endOfStudyRatioRange}
                      onChange={changeEndOfStudyRatioRange}
                    />
                  </Space>
                )}
              </div>
            ) : (
              <InactivatedTags tags={recentDifficultyTags} />
            )}
          </FilterSubMenu>
          <FilterSubMenu
            isPc={isPc}
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
    width: ${(props) => (props.is_pc === "true" ? "158px" : "148px")};
    /* width: 104px; */
  }
  & > div:nth-child(2) {
    flex: auto;
  }
`;

const StyledDivWrapper = styled.div`
  /* border-left: 1px solid #9bcfff;
  border-right: 1px solid #9bcfff;
  border-bottom: 1px solid #9bcfff; */
  /* height: calc(100vh - 433px); */
  padding: 0 5px 5px 5px;
  background-color: white;
  /* overflow: scroll; */
`;

const RowForLevelTwo = styled.div`
  margin-left: 6px;
`;
