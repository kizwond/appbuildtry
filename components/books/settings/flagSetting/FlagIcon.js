import React, { memo } from "react";
import {
  HeartFilled,
  HomeFilled,
  FireFilled,
  FlagFilled,
  TagsFilled,
} from "@ant-design/icons";

function flagShape(icon, color) {
  switch (icon) {
    case "heart":
      return <HeartFilled style={{ color: color }} />;
      break;
    case "HomeFilled":
      return <HomeFilled style={{ color: color }} />;
      break;
    case "FireFilled":
      return <FireFilled style={{ color: color }} />;
      break;
    case "FlagFilled":
      return <FlagFilled style={{ color: color }} />;
      break;
    case "TagsFilled":
      return <TagsFilled style={{ color: color }} />;
      break;
    default:
      return <div>No {icon} Icon</div>;
  }
}

// eslint-disable-next-line react/display-name
const FlagIcon = memo(({ icon, color }) => <>{flagShape(icon, color)}</>);

export default FlagIcon;
