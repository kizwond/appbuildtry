import React, { memo } from "react";
import { Switch } from "antd";

const SubTitleSwitch = ({ changeOnOff, onOff }) => {
  const onToggleChange = (checked) => {
    if (checked) {
      changeOnOff("on");
    } else if (!checked) {
      changeOnOff("off");
    }
  };
  return <Switch size="small" className="SubTitleSwitchButton" checked={onOff} onChange={onToggleChange} />;
};

export default memo(SubTitleSwitch);
