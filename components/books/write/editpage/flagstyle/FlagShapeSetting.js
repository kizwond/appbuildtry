import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, Divider, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateFlagFigure } from "../../../../../graphql/mutation/flagUpdate";
import { CompactPicker } from "react-color";

const { Option } = Select;

const FlagShapeSetting = ({ cardTypeSets, cardTypeSetId }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [shape, set_shape] = useState();
  const [size, set_size] = useState();
  const [color, set_color] = useState();

  useEffect(() => {
    if (cardTypeSets) {
      console.log("cardTypeSets", cardTypeSets);
      set_shape(cardTypeSets[0].makerFlag_style.figure_style.shape);
      set_size(cardTypeSets[0].makerFlag_style.figure_style.size);
      set_color(cardTypeSets[0].makerFlag_style.figure_style.color);
    }
  }, [cardTypeSets]);

  const [cardtypeset_updateMakerFlagFigureStyle] = useMutation(UpdateFlagFigure, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
  }

  async function updateflagfiguretyle() {
    try {
      await cardtypeset_updateMakerFlagFigureStyle({
        variables: {
          forUpdateMakerFlagFigureStyle: {
            cardtypeset_id: cardTypeSetId,
            shape: shape,
            color: color,
            size: size,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const shapeHandler = (e) => set_shape(e);
  const sizeHandler = (e) => set_size(e);

  const handleSubmit = () => updateflagfiguretyle();

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChangeComplete = (color) => {
    console.log(color.hex);
    set_color(color.hex);
  };

  return (
    <div>
      <ul style={{ listStyle: "none", padding: "10px 0px 0px 0px" }}>
        <li>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>모양</span>
            <Select size="small" value={shape} style={{ width: 120, fontSize: "0.8rem" }} onChange={shapeHandler}>
              <Option value="star" style={{ fontSize: "0.8rem" }}>
                별
              </Option>
              <Option value="heart" style={{ fontSize: "0.8rem" }}>
                하트
              </Option>
              <Option value="circle" style={{ fontSize: "0.8rem" }}>
                원
              </Option>
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>size</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={size} onChange={sizeHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "0.8rem" }}>색</div>
            <Button size="small" onClick={handleClick} style={{ width: "80px", fontSize: "0.8rem", background: color }}>
              Color
            </Button>
            {displayColorPicker ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose} />
                <CompactPicker color={color} onChange={handleChangeComplete} />
                {/* <span>none</span> */}
              </div>
            ) : null}
          </div>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ textAlign: "right" }}>
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={handleSubmit}>
            적용하기
          </Button>
        </li>
      </ul>
    </div>
  );
};

export default FlagShapeSetting;

const popover = {
  position: "absolute",
  zIndex: "2",
};
const cover = {
  position: "fixed",
  top: "0px",
  right: "0px",
  bottom: "0px",
  left: "100px",
};
