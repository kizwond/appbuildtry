import { Select } from "antd";
import { Fragment, useEffect, useState } from "react";

const SelectionForSettingCardType = ({ handleChange, cardTypes }) => {
  function selectTypeHandeler(value) {
    const cardType = cardTypes.filter((item) => item._id === value);
    handleChange(value, cardType);
  }

  return (
    <div>
      <Select
        size="small"
        style={{ width: 120, fontSize: "0.8rem" }}
        onChange={selectTypeHandeler}
        placeholder="카드 종류를 선택하세요"
      >
        {cardTypes &&
          cardTypes.length > 0 &&
          cardTypes.map((cardType) => (
            <Fragment key={cardType._id}>
              <Select.Option
                value={cardType._id}
                style={{ fontSize: "0.8rem" }}
              >
                {cardType.cardtype_info.name}
              </Select.Option>
            </Fragment>
          ))}
      </Select>
    </div>
  );
};

export default SelectionForSettingCardType;
