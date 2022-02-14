import React, { useState, useEffect, Fragment } from "react";
import { useMutation } from "@apollo/client";
import { Button, Select, Divider, InputNumber } from "antd";
import { UpdateMakerFlagRowStyle } from "../../../../../graphql/mutation/flagUpdate";
import { CompactPicker } from "react-color";
const { Option } = Select;

const FlagRowSetting = ({ rowStyle, cardTypeSetId, tabValue }) => {
  const [backgroundColor, setBackgroundColor] = useState();
  const [isOpendRowBackgroundColorPicker, setIsOpendRowBackgroundColorPicker] =
    useState(false);
  const toggleRowBackgroundColorPicker = () => {
    setIsOpendRowBackgroundColorPicker(!isOpendRowBackgroundColorPicker);
  };
  const rowBackgroundHandler = (color) => {
    setBackgroundColor(color.hex);
    toggleRowBackgroundColorPicker();
  };

  const [border_top_color, set_border_top_color] = useState();
  const [isOpendBorderTopColorPicker, setIsOpendBorderTopColorPicker] =
    useState(false);
  const toggleBorderTopColorPicker = () => {
    setIsOpendBorderTopColorPicker(!isOpendBorderTopColorPicker);
  };
  const borderTopColorHandler = (color) => {
    set_border_top_color(color.hex);
    setIsOpendBorderTopColorPicker(!isOpendBorderTopColorPicker);
  };

  const [border_bottom_color, set_border_bottom_color] = useState();
  const [isOpendBorderBottomColorPicker, setIsOpendBorderBottomColorPicker] =
    useState(false);
  const toggleBorderBottomColorPicker = () => {
    setIsOpendBorderBottomColorPicker(!isOpendBorderBottomColorPicker);
  };
  const borderBottomColorHandler = (color) => {
    set_border_bottom_color(color.hex);
    toggleBorderBottomColorPicker();
  };

  const [border_left_color, set_border_left_color] = useState();
  const [isOpendBorderLeftColorPicker, setIsOpendBorderLeftColorPicker] =
    useState(false);
  const toggleBorderLeftColorPicker = () => {
    setIsOpendBorderLeftColorPicker(!isOpendBorderLeftColorPicker);
  };
  const borderLeftColorHandler = (color) => {
    set_border_left_color(color.hex);
    toggleBorderLeftColorPicker();
  };

  const [border_right_color, set_border_right_color] = useState();
  const [isOpendBorderRightColorPicker, setIsOpendBorderRightColorPicker] =
    useState(false);
  const toggleBorderRightColorPicker = () => {
    setIsOpendBorderRightColorPicker(!isOpendBorderRightColorPicker);
  };
  const borderRightColorHandler = (color) => {
    set_border_right_color(color.hex);
    toggleBorderRightColorPicker();
  };

  const [outer_margin_top, set_outer_margin_top] = useState();
  const [outer_margin_bottom, set_outer_margin_bottom] = useState();
  const [outer_margin_left, set_outer_margin_left] = useState();
  const [outer_margin_right, set_outer_margin_right] = useState();

  const [inner_padding_top, set_inner_padding_top] = useState();
  const [inner_padding_bottom, set_inner_padding_bottom] = useState();
  const [inner_padding_left, set_inner_padding_left] = useState();
  const [inner_padding_right, set_inner_padding_right] = useState();

  const [border_top_type, set_border_top_type] = useState();
  const [border_bottom_type, set_border_bottom_type] = useState();
  const [border_left_type, set_border_left_type] = useState();
  const [border_right_type, set_border_right_type] = useState();

  const [border_top_thickness, set_border_top_thickness] = useState();
  const [border_bottom_thickness, set_border_bottom_thickness] = useState();
  const [border_left_thickness, set_border_left_thickness] = useState();
  const [border_right_thickness, set_border_right_thickness] = useState();

  useEffect(() => {
    if (rowStyle) {
      const {
        background: { color: bgColor },
        outer_margin: {
          top: marginTop,
          bottom: marginBottom,
          left: marginLeft,
          right: marginRight,
        },
        inner_padding: {
          top: paddingTop,
          bottom: paddingBottom,
          left: paddingLeft,
          right: paddingRight,
        },
        border: {
          top: {
            bordertype: borderTopType,
            thickness: borderTopThickness,
            color: borderTopColor,
          },
          bottom: {
            bordertype: borderBottomType,
            thickness: borderBottomThickness,
            color: borderBottomColor,
          },
          left: {
            bordertype: borderLeftType,
            thickness: borderLeftThickness,
            color: borderLeftColor,
          },
          right: {
            bordertype: borderRightType,
            thickness: borderRightThickness,
            color: borderRightColor,
          },
        },
      } = rowStyle;

      setBackgroundColor(bgColor);

      set_outer_margin_top(marginTop);
      set_outer_margin_bottom(marginBottom);
      set_outer_margin_left(marginLeft);
      set_outer_margin_right(marginRight);

      set_inner_padding_top(paddingTop);
      set_inner_padding_bottom(paddingBottom);
      set_inner_padding_left(paddingLeft);
      set_inner_padding_right(paddingRight);

      set_border_top_type(borderTopType);
      set_border_top_thickness(borderTopThickness);
      set_border_top_color(borderTopColor);

      set_border_bottom_type(borderBottomType);
      set_border_bottom_thickness(borderBottomThickness);
      set_border_bottom_color(borderBottomColor);

      set_border_left_type(borderLeftType);
      set_border_left_thickness(borderLeftThickness);
      set_border_left_color(borderLeftColor);

      set_border_right_type(borderRightType);
      set_border_right_thickness(borderRightThickness);
      set_border_right_color(borderRightColor);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowStyle, tabValue, cardTypeSetId]);

  const [cardtypeset_updateMakerFlagRowStyle] = useMutation(
    UpdateMakerFlagRowStyle,
    { onCompleted: afterupdatemutation }
  );

  function afterupdatemutation(data) {
    console.log("data", data);
  }

  async function updaterowstyle() {
    try {
      await cardtypeset_updateMakerFlagRowStyle({
        variables: {
          forUpdateMakerFlagRowStyle: {
            cardtypeset_id: cardTypeSetId,
            row_style: {
              background: { color: backgroundColor, opacity: 100 },
              outer_margin: {
                top: outer_margin_top,
                bottom: outer_margin_bottom,
                left: outer_margin_left,
                right: outer_margin_right,
              },
              inner_padding: {
                top: inner_padding_top,
                bottom: inner_padding_bottom,
                left: inner_padding_left,
                right: inner_padding_right,
              },
              border: {
                top: {
                  bordertype: border_top_type,
                  thickness: border_top_thickness,
                  color: border_top_color,
                },
                bottom: {
                  bordertype: border_bottom_type,
                  thickness: border_bottom_thickness,
                  color: border_bottom_color,
                },
                left: {
                  bordertype: border_left_type,
                  thickness: border_left_thickness,
                  color: border_left_color,
                },
                right: {
                  bordertype: border_right_type,
                  thickness: border_right_thickness,
                  color: border_right_color,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const outerMarginTopHandler = (e) => set_outer_margin_top(e);
  const outerMarginBottomHandler = (e) => set_outer_margin_bottom(e);
  const outerMarginLeftHandler = (e) => set_outer_margin_left(e);
  const outerMarginRightHandler = (e) => set_outer_margin_right(e);

  const innerPaddingTopHandler = (e) => set_inner_padding_top(e);
  const innerPaddingBottomHandler = (e) => set_inner_padding_bottom(e);
  const innerPaddingLeftHandler = (e) => set_inner_padding_left(e);
  const innerPaddingRightHandler = (e) => set_inner_padding_right(e);

  const borderTopTypeHandler = (e) => set_border_top_type(e);
  const borderBottomTypeHandler = (e) => set_border_bottom_type(e);
  const borderLeftTypeHandler = (e) => set_border_left_type(e);
  const borderRightTypeHandler = (e) => set_border_right_type(e);

  const borderTopThicknessHandler = (e) => set_border_top_thickness(e);
  const borderBottomThicknessHandler = (e) => set_border_bottom_thickness(e);
  const borderLeftThicknessHandler = (e) => set_border_left_thickness(e);
  const borderRightThicknessHandler = (e) => set_border_right_thickness(e);

  const handleSubmit = () => updaterowstyle();

  return (
    <div>
      <ul style={{ listStyle: "none", padding: "10px 0px 0px 0px" }}>
        <li
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "0.8rem" }}>행배경색</div>
          <Button
            size="small"
            onClick={toggleRowBackgroundColorPicker}
            style={{
              width: "80px",
              fontSize: "0.8rem",
              background: backgroundColor,
            }}
          >
            Color
          </Button>
          {isOpendRowBackgroundColorPicker && (
            <div style={popover}>
              <div style={cover} />
              <CompactPicker
                color={backgroundColor}
                onChange={rowBackgroundHandler}
              />
            </div>
          )}
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ fontSize: "0.8rem" }}>
          <div>행테두리바깥쪽여백</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>상</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={outer_margin_top}
              onChange={outerMarginTopHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>하</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={outer_margin_bottom}
              onChange={outerMarginBottomHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>좌</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={outer_margin_left}
              onChange={outerMarginLeftHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>우</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={outer_margin_right}
              onChange={outerMarginRightHandler}
            />
          </div>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ fontSize: "0.8rem" }}>
          <div>행테두리안쪽여백</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>상</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={inner_padding_top}
              onChange={innerPaddingTopHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>하</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={inner_padding_bottom}
              onChange={innerPaddingBottomHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>좌</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={inner_padding_left}
              onChange={innerPaddingLeftHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>우</span>
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem" }}
              value={inner_padding_right}
              onChange={innerPaddingRightHandler}
            />
          </div>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ fontSize: "0.8rem" }}>
          <div>행테두리</div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>상</span>
            <Select
              size="small"
              value={border_top_type}
              style={{ width: 75, fontSize: "0.8rem" }}
              onChange={borderTopTypeHandler}
            >
              <Option value="none" style={{ fontSize: "0.8rem" }}>
                none
              </Option>
              <Option value="solid" style={{ fontSize: "0.8rem" }}>
                solid
              </Option>
              <Option value="dashed" style={{ fontSize: "0.8rem" }}>
                dashed
              </Option>
              <Option value="dotted" style={{ fontSize: "0.8rem" }}>
                dotted
              </Option>
            </Select>
            <Button
              size="small"
              onClick={toggleBorderTopColorPicker}
              style={{
                width: "50px",
                fontSize: "0.8rem",
                background: border_top_color,
              }}
            >
              Color
            </Button>
            {isOpendBorderTopColorPicker && (
              <div style={popover}>
                <div style={cover} />
                <CompactPicker
                  color={border_top_color}
                  onChange={borderTopColorHandler}
                />
              </div>
            )}
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem", width: 60 }}
              value={border_top_thickness}
              onChange={borderTopThicknessHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>하</span>
            <Select
              size="small"
              value={border_bottom_type}
              style={{ width: 75, fontSize: "0.8rem" }}
              onChange={borderBottomTypeHandler}
            >
              <Option value="none" style={{ fontSize: "0.8rem" }}>
                none
              </Option>
              <Option value="solid" style={{ fontSize: "0.8rem" }}>
                solid
              </Option>
              <Option value="dashed" style={{ fontSize: "0.8rem" }}>
                dashed
              </Option>
              <Option value="dotted" style={{ fontSize: "0.8rem" }}>
                dotted
              </Option>
            </Select>
            <Button
              size="small"
              onClick={toggleBorderBottomColorPicker}
              style={{
                width: "50px",
                fontSize: "0.8rem",
                background: border_bottom_color,
              }}
            >
              Color
            </Button>
            {isOpendBorderBottomColorPicker && (
              <div style={popover}>
                <div style={cover} />
                <CompactPicker
                  color={border_bottom_color}
                  onChange={borderBottomColorHandler}
                />
              </div>
            )}
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem", width: 60 }}
              value={border_bottom_thickness}
              onChange={borderBottomThicknessHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>좌</span>
            <Select
              size="small"
              value={border_left_type}
              style={{ width: 75, fontSize: "0.8rem" }}
              onChange={borderLeftTypeHandler}
            >
              <Option value="none" style={{ fontSize: "0.8rem" }}>
                none
              </Option>
              <Option value="solid" style={{ fontSize: "0.8rem" }}>
                solid
              </Option>
              <Option value="dashed" style={{ fontSize: "0.8rem" }}>
                dashed
              </Option>
              <Option value="dotted" style={{ fontSize: "0.8rem" }}>
                dotted
              </Option>
            </Select>
            <Button
              size="small"
              onClick={toggleBorderLeftColorPicker}
              style={{
                width: "50px",
                fontSize: "0.8rem",
                background: border_left_color,
              }}
            >
              Color
            </Button>
            {isOpendBorderLeftColorPicker && (
              <div style={popover}>
                <div style={cover} />
                <CompactPicker
                  color={border_left_color}
                  onChange={borderLeftColorHandler}
                />
              </div>
            )}
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem", width: 60 }}
              value={border_left_thickness}
              onChange={borderLeftThicknessHandler}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>우</span>
            <Select
              size="small"
              value={border_right_type}
              style={{ width: 75, fontSize: "0.8rem" }}
              onChange={borderRightTypeHandler}
            >
              <Option value="none" style={{ fontSize: "0.8rem" }}>
                none
              </Option>
              <Option value="solid" style={{ fontSize: "0.8rem" }}>
                solid
              </Option>
              <Option value="dashed" style={{ fontSize: "0.8rem" }}>
                dashed
              </Option>
              <Option value="dotted" style={{ fontSize: "0.8rem" }}>
                dotted
              </Option>
            </Select>
            <Button
              size="small"
              onClick={toggleBorderRightColorPicker}
              style={{
                width: "50px",
                fontSize: "0.8rem",
                background: border_right_color,
              }}
            >
              Color
            </Button>
            {isOpendBorderRightColorPicker && (
              <div style={popover}>
                <div style={cover} />
                <CompactPicker
                  color={border_right_color}
                  onChange={borderRightColorHandler}
                />
              </div>
            )}
            <InputNumber
              size="small"
              style={{ fontSize: "0.8rem", width: 60 }}
              value={border_right_thickness}
              onChange={borderRightThicknessHandler}
            />
          </div>
        </li>
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

export default FlagRowSetting;

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
