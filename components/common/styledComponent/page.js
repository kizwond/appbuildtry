import styled from "styled-components";
import { Row } from "antd";

export const StyledRowMaxWidth = styled(Row)`
  max-width: 1440px;
  margin: 0 auto;
  @media screen and (min-width: 100px) and (max-width: 767px) {
    margin-top: ${props=> props.top === true ? '40px': '0'};
  }
`;

export const StyledDivEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
