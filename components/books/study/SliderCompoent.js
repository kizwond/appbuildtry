import React from 'react';
import { Slider } from 'antd';

const SliderCompoent = ({ configured, selected, onChange, min, max }) => {
  function formatter(value) {
    return `${value}%`;
  }
  const marks = {
    0: '0',
    [min]: configured - min < 10 ? '' : `${min}%`,
    [max]: max - configured < 10 ? '' : `${max}%`,
    [configured]:
      max - configured < 10
        ? {
            style: {
              color: '#f50',
            },
            label: <strong>현재 : {configured}%</strong>,
          }
        : configured - min < 10
        ? {
            style: {
              color: '#f50',
            },
            label: <strong>현재 : {configured}%</strong>,
          }
        : {
            style: {
              color: '#f50',
            },
            label: <strong>현재</strong>,
          },
    100: '100%',
  };

  return (
    <div>
      <Slider
        marks={marks}
        tipFormatter={formatter}
        tooltipVisible={true}
        value={typeof selected === 'number' ? selected : 10}
        onChange={(value) => {
          if (value > max) {
            return;
          }
          if (value < min) {
            return;
          }
          onChange(value);
        }}
      />
    </div>
  );
};

export default SliderCompoent;
