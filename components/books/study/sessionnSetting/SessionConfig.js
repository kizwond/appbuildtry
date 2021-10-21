import React, { useState, useCallback, memo } from "react";
import { useQuery } from "@apollo/client";
import { Switch, InputNumber, Card, Col, Row, Button, Typography } from "antd";
import { GET_SESSTION_CONFIG } from "../../../../graphql/query/studySessionSetting";
import GetFilteredIndexButton from "./GetFilteredIndexButton";
import styled from "styled-components";
import SortOptionTag from "./session-config/SortOptionTag";
import UseCardTypesTag from "./session-config/UseCardTypesTag";
import UseStatusTag from "./session-config/UseStatusTag";
import StudyTimeCondition from "./session-config/StudyTimeCondition";
import NumStartCards from "./session-config/NumStartCards";
import FlagTags from "./session-config/FlagTags";
import FilterSubMenu from "./session-config/common/FilterSubMenu";
import RecentStudyTime from "./session-config/RecentStudyTime";
import CardLevel from "./session-config/CardLevel";
import StudyTimes from "./session-config/StudyTimes";
import { StyledDivConfigRow, StyledDivConfigColStartCards, StyledSpanConfigTitle } from "./session-config/common/StyledComponent";
import useSessionConfig from "./session-config/useHook/useSessionConfig";
import { Tabs } from "../../../../node_modules/antd/lib/index";
import ModeSessionConfig from "./session-config/ModeSessionConfig";
import AdvancedFilter from "./session-config/AdvancedFilter";

const SessionConfig = ({
  submitCreateSessionConfigToServer,
  book_ids,
  onToggleIsAFilter,
  onChangeAFCardList,
  AFCardList,
  advancedFilteredCheckedIndexes,
  onChangeIndexesOfAFCardList,
  mode,
  changeMode,
  modeOption,
  advancedFilter,
  changeAdvancedFilter,
}) => {
  const { readDetailedOption, changeReadProps, flipDetailedOption, changeFlipProps, examDetailedOption, changeExamProps } = modeOption;

  const advancedFilterComponet = (
    <AdvancedFilter
      book_ids={book_ids}
      advancedFilteredCheckedIndexes={advancedFilteredCheckedIndexes}
      onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
      onChangeAFCardList={onChangeAFCardList}
      AFCardList={AFCardList}
      onToggleIsAFilter={onToggleIsAFilter}
      changeAdvancedFilter={changeAdvancedFilter}
      advancedFilter={advancedFilter}
    />
  );

  return (
    <div>
      <Tabs activeKey={mode} type="card" size="small" onTabClick={(key) => changeMode(key)} tabBarStyle={{ margin: 0 }}>
        <Tabs.TabPane tab="읽기모드" key="read">
          <ModeSessionConfig detailedOption={readDetailedOption} changeProps={changeReadProps}></ModeSessionConfig>
        </Tabs.TabPane>
        <Tabs.TabPane tab="뒤집기모드" key="flip">
          <ModeSessionConfig detailedOption={flipDetailedOption} changeProps={changeFlipProps}></ModeSessionConfig>
        </Tabs.TabPane>
        <Tabs.TabPane tab="시험모드" key="exam">
          <ModeSessionConfig detailedOption={examDetailedOption} changeProps={changeExamProps}></ModeSessionConfig>
        </Tabs.TabPane>
      </Tabs>
      <AdvancedFilter
        book_ids={book_ids}
        advancedFilteredCheckedIndexes={advancedFilteredCheckedIndexes}
        onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
        onChangeAFCardList={onChangeAFCardList}
        AFCardList={AFCardList}
        onToggleIsAFilter={onToggleIsAFilter}
        changeAdvancedFilter={changeAdvancedFilter}
        advancedFilter={advancedFilter}
      />
    </div>
  );
};

export default memo(SessionConfig);
