import React from 'react';
import { Slider } from 'antd';

const SliderCompoent = ({ configured, maxRatio, onChange, min, max }) => {
  function formatter(value) {
    return `${value}%`;
  }
  const marks = {
    0: '0',
    [configured]: {
      style: {
        color: '#f50',
      },
      label: <strong>현재</strong>,
    },
    [min]: `${min}%`,
    [max]: `${max}%`,
    100: '100%',
  };

  return (
    <div>
      <Slider
        marks={marks}
        tipFormatter={formatter}
        tooltipVisible={true}
        value={typeof maxRatio === 'number' ? maxRatio : 10}
        onChange={(value) => {
          if (value > 90) {
            return;
          }
          if (value < 10) {
            return;
          }
          onChange(value);
        }}
      />
    </div>
  );
};

export default SliderCompoent;
