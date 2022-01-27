import React, { memo } from "react";
import { Slider } from "antd";

const RateSlider = ({
  configured,
  selected,
  onChange,
  min,
  max,
  step,
  format,
}) => {
  function formatter(value) {
    return `${value}${format}`;
  }
  const marks = {
    [min]: configured - min < 10 ? "" : `${min}${format}`,
    [max]: max - configured < 10 ? "" : `${max}${format}`,
    [configured]: {
      style: {
        color: "#f50",
      },

      label: (
        <strong>
          현재 : {configured}
          {format}
        </strong>
      ),
    },
  };

  return (
    <div>
      <Slider
        marks={marks}
        tipFormatter={formatter}
        tooltipVisible={true}
        max={max}
        min={min}
        value={typeof selected === "number" ? selected : 10}
        onChange={(value) => {
          if (value > max) {
            onChange(max);
          } else if (value < min) {
            onChange(min);
          } else {
            onChange(value);
          }
        }}
        step={step}
      />
    </div>
  );
};

export default memo(RateSlider);
