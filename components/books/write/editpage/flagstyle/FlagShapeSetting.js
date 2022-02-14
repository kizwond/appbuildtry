import React, { useState, useEffect, Fragment } from "react";
import { useMutation } from "@apollo/client";
import { Button, Select, Divider, InputNumber } from "antd";
import { UpdateFlagFigure } from "../../../../../graphql/mutation/flagUpdate";
import { CompactPicker } from "react-color";

const { Option } = Select;

const FlagShapeSetting = ({ figureStyle, cardTypeSetId, tabValue }) => {
  const [shape, setShape] = useState();
  const [size, setSize] = useState();

  const [color, setColor] = useState();
  const [isOpendColorPicker, setIsOpendColorPicker] = useState(false);
  const toggleColorPicker = () => {
    setIsOpendColorPicker(!isOpendColorPicker);
  };
  const colorHandler = (color) => {
    setColor(color.hex);
    toggleColorPicker();
  };

  useEffect(() => {
    if (figureStyle) {
      setShape(figureStyle.shape);
      setSize(figureStyle.size);
      setColor(figureStyle.color);
    }
  }, [figureStyle, tabValue, cardTypeSetId]);

  const [cardtypeset_updateMakerFlagFigureStyle] = useMutation(
    UpdateFlagFigure,
    { onCompleted: afterupdatemutation }
  );

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

  const shapeHandler = (e) => setShape(e);
  const sizeHandler = (e) => setSize(e);
  const handleSubmit = () => updateflagfiguretyle();

  return (
    <div>
      <ul style={{ listStyle: "none", padding: "10px 0px 0px 0px" }}>
        <li>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>모양</span>
            <Select
              size="small"
              value={shape}
              style={{ width: 120, fontSize: "0.8rem" }}
              onChange={shapeHandler}
            >
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>size</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={size}
              onChange={sizeHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "0.8rem" }}>색</div>
            <Button
              size="small"
              onClick={toggleColorPicker}
              style={{ width: "80px", fontSize: "0.8rem", background: color }}
            >
              Color
            </Button>
            {isOpendColorPicker ? (
              <div style={popover}>
                <div style={cover} />
                <CompactPicker color={color} onChange={colorHandler} />
              </div>
            ) : null}
          </div>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ textAlign: "right" }}>
          <Button
            size="small"
            style={{ fontSize: "0.8rem" }}
            onClick={handleSubmit}
          >
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
