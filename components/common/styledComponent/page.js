import styled from "styled-components";
import { Row } from "antd";

export const StyledRowMaxWidth = styled(Row)`
  max-width: 1440px;
  margin: 0 auto;
`;

export const StyledDivEllipsis = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
