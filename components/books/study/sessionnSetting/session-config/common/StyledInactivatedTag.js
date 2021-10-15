import { memo } from "react";
import styled from "styled-components";
import { Tag } from "antd";

const StyledInactivatedTag = ({ name }) => {
  return <StyledTag>{name}</StyledTag>;
};

export default memo(StyledInactivatedTag);

const StyledTag = styled(Tag)`
  color: #00000071;
  border: 1px solid #d9d9d9;
`;
