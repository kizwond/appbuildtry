import React, { memo } from "react";

import { Tabs } from "antd";
import M_ModeSessionConfig from "./modeConfig/M_ModeSessionConfig";
import M_AdvancedFilter from "./advancedFilter/M_AdvancedFilter";
import { StyledAntTabs } from "../../../../common/styledComponent/antd/StyledAntdTabs";

const M_SessionModeAndFilterConfig = ({
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
  const {
    readDetailedOption,
    changeReadProps,
    flipDetailedOption,
    changeFlipProps,
    examDetailedOption,
    changeExamProps,
  } = modeOption;

  return (
    <div>
      <StyledAntTabs
        activeKey={mode}
        type="card"
        size="small"
        onTabClick={(key) => changeMode(key)}
        tabBarStyle={{ margin: 0 }}
      >
        <Tabs.TabPane tab="읽기모드" key="read">
          <M_ModeSessionConfig
            detailedOption={readDetailedOption}
            changeProps={changeReadProps}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="뒤집기모드" key="flip">
          <M_ModeSessionConfig
            detailedOption={flipDetailedOption}
            changeProps={changeFlipProps}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="시험모드" key="exam">
          <M_ModeSessionConfig
            detailedOption={examDetailedOption}
            changeProps={changeExamProps}
          />
        </Tabs.TabPane>
      </StyledAntTabs>
      <M_AdvancedFilter
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

export default memo(M_SessionModeAndFilterConfig);
