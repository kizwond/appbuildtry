import React, { memo } from "react";

import { Tabs } from "antd";
import M_ModeSessionConfig from "./modeConfig/M_ModeSessionConfig";
import M_AdvancedFilter from "./advancedFilter/M_AdvancedFilter";
import { StyledAntTabs } from "../../../../common/styledComponent/antd/StyledAntdTabs";

const M_SessionModeAndFilterConfig = ({
  mode,
  changeMode,
  modeOption,
  advancedFilter,
  changeAdvancedFilter,
  isPc,
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
        width="28%"
        activeKey={mode}
        type="card"
        size="small"
        onTabClick={(key) => changeMode(key)}
        tabBarStyle={{ margin: 0 }}
        isPc={isPc}
      >
        <Tabs.TabPane tab="읽기모드" key="read">
          <div className="SessionTabContentWrapper">
            <M_ModeSessionConfig
              detailedOption={readDetailedOption}
              changeProps={changeReadProps}
              isPc={isPc || false}
            />
            <M_AdvancedFilter
              changeAdvancedFilter={changeAdvancedFilter}
              advancedFilter={advancedFilter}
              isPc={isPc || false}
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="뒤집기모드" key="flip">
          <div className="SessionTabContentWrapper">
            <M_ModeSessionConfig
              detailedOption={flipDetailedOption}
              changeProps={changeFlipProps}
              isPc={isPc || false}
            />
            <M_AdvancedFilter
              changeAdvancedFilter={changeAdvancedFilter}
              advancedFilter={advancedFilter}
              isPc={isPc || false}
            />
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="시험모드" key="exam">
          <div className="SessionTabContentWrapper">
            <M_ModeSessionConfig
              detailedOption={examDetailedOption}
              changeProps={changeExamProps}
              isPc={isPc || false}
            />
            <M_AdvancedFilter
              changeAdvancedFilter={changeAdvancedFilter}
              advancedFilter={advancedFilter}
              isPc={isPc || false}
            />
          </div>
        </Tabs.TabPane>
      </StyledAntTabs>
    </div>
  );
};

export default memo(M_SessionModeAndFilterConfig);
