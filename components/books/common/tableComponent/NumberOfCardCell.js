import React from "react";
import styled from "styled-components";
import { Popover } from "antd";
import {
  StyledFlexAllCenterDimension100Percent,
  StyledFlexSpaceBetween,
} from "../../../common/styledComponent/page";
const NumberOfCardCell = ({
  value,
  read,
  flip,
  general,
  common,
  subject,
  isPc,
}) => {
  return (
    <StyledWrapper className={isPc ? "PcPagePopOver" : null}>
      <Popover
        arrowPointAtCenter
        content={
          <>
            <StyledFlexSpaceBetween>
              <div>읽기카드:</div>
              <div>{read}</div>
            </StyledFlexSpaceBetween>
            <StyledFlexSpaceBetween>
              <div>뒤집기카드:</div>
              <div>{flip}</div>
            </StyledFlexSpaceBetween>
            <StyledFlexSpaceBetween>
              <div>목차카드:</div>
              <div>{subject}</div>
            </StyledFlexSpaceBetween>
            <StyledFlexSpaceBetween>
              <div>일반카드:</div>
              <div>{general}</div>
            </StyledFlexSpaceBetween>
            <StyledFlexSpaceBetween>
              <div>공유카드:</div>
              <div>{common}</div>
            </StyledFlexSpaceBetween>
          </>
        }
        trigger="click"
        overlayClassName={
          isPc ? "Pc-Popover-NumberOfCards" : "M-Popover-NumberOfCards"
        }
      >
        <StyledFlexAllCenterDimension100Percent>
          {value}
        </StyledFlexAllCenterDimension100Percent>
        <StyledFlexAllCenterDimension100Percent>
          {`(${flip + read})`}
        </StyledFlexAllCenterDimension100Percent>
      </Popover>
    </StyledWrapper>
  );
};

export default NumberOfCardCell;

const StyledWrapper = styled.div`
  width: 100%;
`;
