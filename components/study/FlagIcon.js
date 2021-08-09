import React from 'react';
import {
  HeartFilled,
  HomeFilled,
  FireFilled,
  FlagFilled,
  TagsFilled,
} from '@ant-design/icons';

const FlagIcon = ({ icon, color }) => {
  const flagShape = (icon) => {
    switch (icon) {
      case 'HeartFilled':
        return <HeartFilled style={{ color: color }} />;
        break;
      case 'HomeFilled':
        return <HomeFilled style={{ color: color }} />;
        break;
      case 'FireFilled':
        return <FireFilled style={{ color: color }} />;
        break;
      case 'FlagFilled':
        return <FlagFilled style={{ color: color }} />;
        break;
      case 'TagsFilled':
        return <TagsFilled style={{ color: color }} />;
        break;
      default:
        return <div>No Icons</div>;
    }
  };

  return <>{flagShape(icon)}</>;
};

export default FlagIcon;
