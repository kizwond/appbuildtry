import React, { memo } from "react";

import { Tabs } from "../../../../node_modules/antd/lib/index";
import ModeSessionConfig from "./session-config/ModeSessionConfig";
import AdvancedFilter from "./session-config/AdvancedFilter";

const SessionConfig = ({
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
