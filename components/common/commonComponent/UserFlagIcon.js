import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFlag,
  faStar,
  faHeart,
  faTag,
  faLock,
  faThumbtack,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";

import styled from "styled-components";

const UserFlagIcon = ({
  figure,
  color,
  textColor,
  flagNumber,
  iconRemSize,
}) => {
  return (
    <>
      {figure === "flag" && (
        <StyledDiv
          className="fa-layers fa-fw"
          textcolor={textColor}
          size={iconRemSize}
        >
          <FontAwesomeIcon icon={faFlag} color={color} />
          <span className="FlagNumber">{flagNumber}</span>
        </StyledDiv>
      )}
      {figure === "star" && (
        <StyledDiv
          className="fa-layers fa-fw"
          textcolor={textColor}
          size={iconRemSize}
        >
          <FontAwesomeIcon icon={faStar} color={color} />
          <span className="FlagNumber">{flagNumber}</span>
        </StyledDiv>
      )}
      {figure === "heart" && (
        <StyledDiv
          className="fa-layers fa-fw"
          textcolor={textColor}
          size={iconRemSize}
        >
          <FontAwesomeIcon icon={faHeart} color={color} />
          <span className="FlagNumber">{flagNumber}</span>
        </StyledDiv>
      )}
      {figure === "tag" && (
        <StyledDiv
          className="fa-layers fa-fw"
          textcolor={textColor}
          size={iconRemSize}
        >
          <FontAwesomeIcon icon={faTag} color={color} />
          <span className="FlagNumber">{flagNumber}</span>
        </StyledDiv>
      )}
      {figure === "bookmark" && (
        <StyledDiv
          className="fa-layers fa-fw"
          textcolor={textColor}
          size={iconRemSize}
        >
          <FontAwesomeIcon icon={faBookmark} color={color} />
          <span className="FlagNumber">{flagNumber}</span>
        </StyledDiv>
      )}
    </>
  );
};
export default UserFlagIcon;

const StyledDiv = styled.span`
  /* font-size: 1rem; */
  width: ${(props) => (props.size > 1.5 ? props.size : 1.5)}rem;
  & > .svg-inline--fa {
    font-size: ${(props) =>
      props.size > 1.5 ? props.size : 1.5}rem !important;
  }
  & > .svg-inline--fa.fa-star {
    left: -1px;
  }
  & > .FlagNumber {
    display: inline-block;
    position: absolute;
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    transform-origin: center center;
    color: ${(props) => props.textcolor};
    font-size: ${(props) =>
      Math.round((parseFloat(props.size) * 1000) / 2) / 1000 > 0.833
        ? Math.round((parseFloat(props.size) * 1000) / 2) / 1000
        : 0.833}rem !important;
    font-weight: 700;
    font-family: "NanumGothic";
  }
`;
