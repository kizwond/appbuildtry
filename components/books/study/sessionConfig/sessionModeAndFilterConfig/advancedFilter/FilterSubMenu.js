import React, { memo } from "react";
import { Card } from "antd";
import {
  StyledFilteMenuWrapper,
  StyledDivConfigRow,
  StyledDivConfigColStartCards,
  StyledDivConfigCol,
  StyledSpanFilterSubTitle,
} from "../common/styledComponent/StyledComponent";
import SubTitleSwitch from "./SubTitleSwitch";

const FilterSubMenu = ({ children, changeOnOff, onOff, title }) => {
  const booleanOnOff =
    onOff === "on" ? true : onOff === "off" ? false : new Error("에러발생");
  return (
    <StyledFilteMenuWrapper>
      <StyledDivConfigRow>
        <StyledDivConfigColStartCards className="FilterSubTitleCol">
          <StyledSpanFilterSubTitle onOff={booleanOnOff}>
            {title}
          </StyledSpanFilterSubTitle>
          <SubTitleSwitch changeOnOff={changeOnOff} onOff={booleanOnOff} />
        </StyledDivConfigColStartCards>
        <StyledDivConfigCol>{children}</StyledDivConfigCol>
      </StyledDivConfigRow>
    </StyledFilteMenuWrapper>
  );
};

export default memo(FilterSubMenu);
