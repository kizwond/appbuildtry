import React, { useCallback } from "react";
import styled from "styled-components";
import StyledDatePicker from "./common/StyledDatePicker";
import moment from "moment";
import { StyledDivConfigMenuWrapper } from "./common/StyledComponent";

const RecentStudyTime = ({ onOff, recentStudyTime, changeRecentStudyTime }) => {
  const onChange = useCallback(
    (date, dateString) => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const today = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

      const startYear = date[0]._d.getFullYear();
      const selectedStartDate = moment(`${startYear}-${dateString[0]}`, "YYYY-MM-DD");
      const differenceFromStart = moment.duration(selectedStartDate.diff(today)).asDays();
      console.log({ differenceFromStart });
      const endYear = date[1]._d.getFullYear();
      const selectedEndDate = moment(`${endYear}-${dateString[1]}`, "YYYY-MM-DD");
      const differenceFromEnd = moment.duration(selectedEndDate.diff(today)).asDays();
      console.log({ differenceFromEnd });

      changeRecentStudyTime([differenceFromStart, differenceFromEnd]);
    },
    [changeRecentStudyTime]
  );

  const isOn = onOff === "on" ? true : onOff === "off" ? false : new Error("Unhandled recentStudyTime OnOff");
  const valueArr = [recentStudyTime[0] == 0 ? moment() : moment().add(recentStudyTime[0], "days"), recentStudyTime[1] == 0 ? moment() : moment().add(recentStudyTime[1], "days")];

  return (
    <StyledDivConfigMenuWrapper>
      <StyledDatePicker disabled={!isOn} placeholder={["시작", "종료"]} format="MM-DD" value={valueArr} onChange={onChange} size="small" />
    </StyledDivConfigMenuWrapper>
  );
};

export default RecentStudyTime;
