import { memo, useCallback } from "react";
import styled from "styled-components";
import { Tag } from "antd";

const InactivatedTags = ({ tags }) => {
  const attr = useCallback((i) => i === 0 && { first: "yes" }, []);
  return (
    <div>
      {tags &&
        tags.map(({ option, title }, i) => (
          <Wrapper key={option}>
            <StyledTag {...attr(i)}>{title}</StyledTag>
          </Wrapper>
        ))}
    </div>
  );
};

export default memo(InactivatedTags);

const StyledTag = styled(Tag)`
  color: #00000071;
  margin: ${({ first }) =>
    first === "yes" ? "2px 2px 2px 0" : "2px 2px 2px 2px"};
  border: 1px solid #d9d9d9;
  cursor: not-allowed;
`;

const Wrapper = styled.div`
  display: inline-block;
`;
