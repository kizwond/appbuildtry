import styled from "styled-components";
import { Row } from "antd";

// flex 관련 컴포
export const StyledFlexAlignCenter = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledFlexSpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;
// flex 관련 컴포 끝

export const StyledOverFlowHidden = styled.div`
  overflow: hidden;
`;

export const StyledRowMaxWidth = styled(Row)`
  max-width: 1440px;
  margin: 0 auto;
  @media screen and (min-width: 100px) and (max-width: 767px) {
    margin-top: ${(props) => (props.topcompo === "true" ? "40px" : "0")};
  }
`;

export const StyledDivEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledTwoLinesEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-wrap: break-word;
  white-space: normal;
  word-break: keep-all;
  text-align: left;
`;
