import { Tag } from "antd";
import { memo, useCallback } from "react";
import styled from "styled-components";

const CheckableTag = styled(Tag.CheckableTag)`
  border: ${({ checked }) => (checked ? "1px solid #1890ff" : "1px solid #d9d9d9")};
  margin: ${({ first }) => (first === "yes" ? "3px 3px 3px 0" : "3px 3px 3px 3px")};
`;
const Wrapper = styled.div`
  background-color: ${({ checked, tagname }) => (checked && tagname === "ing" ? "#f5cdbf" : "transparent")};
  display: inline-block;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
`;

const ToggleTag = (props) => {
  const attr = useCallback(({ tagname, checked }) => tagname && checked && { tagname, checked }, []);
  return (
    <Wrapper {...attr(props)}>
      <CheckableTag {...props} />
    </Wrapper>
  );
};

export default memo(ToggleTag);
