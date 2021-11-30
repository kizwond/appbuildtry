import { StyledOverFlowHidden, StyledTwoLinesEllipsis } from "./page";

const DoubleLinesEllipsisContainer = (props) => {
  return (
    <StyledOverFlowHidden {...props}>
      <StyledTwoLinesEllipsis>{props.children}</StyledTwoLinesEllipsis>
    </StyledOverFlowHidden>
  );
};

export default DoubleLinesEllipsisContainer;
