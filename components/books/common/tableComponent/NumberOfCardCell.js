import React from "react";
import styled from "styled-components";
import { Popover } from "antd";
import {
  StyledFlexAllCenterDimension100Percent,
  StyledFlexSpaceBetween,
} from "../../../common/styledComponent/page";
const NumberOfCardCell = ({ value, read, flip, isPc }) => {
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
              <div>수정必</div>
            </StyledFlexSpaceBetween>
            <StyledFlexSpaceBetween>
              <div>일반카드:</div>
              <div>수정必</div>
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
      </Popover>
    </StyledWrapper>
  );
};

export default NumberOfCardCell;

const StyledWrapper = styled.div`
  width: 100%;

  .M-Popover-NumberOfCards
    > .ant-popover-content
    > .ant-popover-inner
    > .ant-popover-inner-content {
    font-size: ${({ is_pc }) => (is_pc === "true" ? "15px" : " 0.8rem")};
  }
`;
