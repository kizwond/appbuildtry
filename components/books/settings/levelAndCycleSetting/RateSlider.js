import React, { memo } from "react";
import { Slider } from "antd";
import { useState } from "react";

const RateSlider = ({
  configured,
  selected,
  onChange,
  min,
  max,
  step,
  format,
}) => {
  const [visible, setVisble] = useState(false);

  function formatter(value) {
    return <span className="text-[10px]">{`${value}${format}`}</span>;
  }
  const marks = {
    [min]: configured - min < 10 ? "" : `${min}${format}`,
    [max]: max - configured < 10 ? "" : `${max}${format}`,
    [configured]: {
      label: (
        <div className="text-lime-500">
          <div className="text-[10px]">설정값:</div>
          <div className="text-[10px]">
            {configured}
            {format}
          </div>
        </div>
      ),
    },
  };

  return (
    <div>
      <Slider
        marks={marks}
        tipFormatter={formatter}
        // tooltipVisible={true}
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
