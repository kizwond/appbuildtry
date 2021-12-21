import React from "react";
import { InputNumber, Space } from "antd";
import { StyledDivConfigMenuWrapper } from "../common/styledComponent/StyledComponent";

const StudyTimes = ({ onOff, studyTimes, changeStudyTimes }) => {
  const isOn =
    onOff === "on"
      ? true
      : onOff === "off"
      ? false
      : new Error("Unhandled CardLevel OnOff");

  const onChangeFrist = (value) => {
    const newRange = [value, studyTimes[1]];
    changeStudyTimes(newRange);
  };
  const onChangeSecond = (value) => {
    const newRange = [studyTimes[0], value];
    changeStudyTimes(newRange);
  };
  return (
    <StyledDivConfigMenuWrapper>
      <Space>
        <InputNumber
          disabled={!isOn}
          size="small"
          min={0}
          max={studyTimes[1] == null ? 99 : studyTimes[1] - 1}
          value={studyTimes[0]}
          onChange={onChangeFrist}
        />
        ~
        <InputNumber
          disabled={!isOn}
          size="small"
          min={studyTimes[1] == null ? 2 : studyTimes[0] + 1}
          max={100}
          value={studyTimes[1]}
          onChange={onChangeSecond}
        />
      </Space>
    </StyledDivConfigMenuWrapper>
  );
};

export default StudyTimes;
