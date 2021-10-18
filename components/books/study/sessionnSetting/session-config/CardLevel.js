import React from "react";
import { InputNumber, Space } from "antd";
import { StyledDivConfigMenuWrapper } from "./common/StyledComponent";

const CardLevel = ({ onOff, level, changeLevel }) => {
  const isOn = onOff === "on" ? true : onOff === "off" ? false : new Error("Unhandled CardLevel OnOff");

  const onChangeFrist = (value) => {
    const newRange = [value, level[1]];
    changeLevel(newRange);
  };
  const onChangeSecond = (value) => {
    const newRange = [level[0], value];
    changeLevel(newRange);
  };
  return (
    <StyledDivConfigMenuWrapper>
      <Space>
        <InputNumber disabled={!isOn} size="small" min={1} max={level[1] == null ? null : level[1] - 1} value={level[0]} onChange={onChangeFrist} />
        ~
        <InputNumber disabled={!isOn} size="small" min={level[0] == null ? null : level[0] + 1} max={10} value={level[1]} onChange={onChangeSecond} />
      </Space>
    </StyledDivConfigMenuWrapper>
  );
};

export default CardLevel;
