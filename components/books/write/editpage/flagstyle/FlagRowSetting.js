import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Divider, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateMakerFlagRowStyle } from "../../../../../graphql/mutation/flagUpdate";
import { CompactPicker } from "react-color";
const { Option } = Select;

const FlagRowSetting = ({ cardTypeSets, cardTypeSetId }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const [displayColorPicker1, setDisplayColorPicker1] = useState(false);
  const [displayColorPicker2, setDisplayColorPicker2] = useState(false);
  const [displayColorPicker3, setDisplayColorPicker3] = useState(false);
  const [displayColorPicker4, setDisplayColorPicker4] = useState(false);

  const [backgroundColor, setBackgroundColor] = useState();

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

  const [border_top_color, set_border_top_color] = useState();
  const [border_bottom_color, set_border_bottom_color] = useState();
  const [border_left_color, set_border_left_color] = useState();
  const [border_right_color, set_border_right_color] = useState();

  useEffect(() => {
    console.log("플래그 디테일 세팅 화면 온");
    if (cardTypeSets) {
      console.log(cardTypeSetId);
      console.log("cardTypeSets", cardTypeSets);
      setBackgroundColor(cardTypeSets[0].makerFlag_style.row_style.background.color);

      set_outer_margin_top(cardTypeSets[0].makerFlag_style.row_style.outer_margin.top);
      set_outer_margin_bottom(cardTypeSets[0].makerFlag_style.row_style.outer_margin.bottom);
      set_outer_margin_left(cardTypeSets[0].makerFlag_style.row_style.outer_margin.left);
      set_outer_margin_right(cardTypeSets[0].makerFlag_style.row_style.outer_margin.right);

      set_inner_padding_top(cardTypeSets[0].makerFlag_style.row_style.inner_padding.top);
      set_inner_padding_bottom(cardTypeSets[0].makerFlag_style.row_style.inner_padding.bottom);
      set_inner_padding_left(cardTypeSets[0].makerFlag_style.row_style.inner_padding.left);
      set_inner_padding_right(cardTypeSets[0].makerFlag_style.row_style.inner_padding.right);

      set_border_top_type(cardTypeSets[0].makerFlag_style.row_style.border.top.bordertype);
      set_border_bottom_type(cardTypeSets[0].makerFlag_style.row_style.border.bottom.bordertype);
      set_border_left_type(cardTypeSets[0].makerFlag_style.row_style.border.left.bordertype);
      set_border_right_type(cardTypeSets[0].makerFlag_style.row_style.border.right.bordertype);

      set_border_top_thickness(cardTypeSets[0].makerFlag_style.row_style.border.top.thickness);
      set_border_bottom_thickness(cardTypeSets[0].makerFlag_style.row_style.border.bottom.thickness);
      set_border_left_thickness(cardTypeSets[0].makerFlag_style.row_style.border.left.thickness);
      set_border_right_thickness(cardTypeSets[0].makerFlag_style.row_style.border.right.thickness);

      set_border_top_color(cardTypeSets[0].makerFlag_style.row_style.border.top.color);
      set_border_bottom_color(cardTypeSets[0].makerFlag_style.row_style.border.bottom.color);
      set_border_left_color(cardTypeSets[0].makerFlag_style.row_style.border.left.color);
      set_border_right_color(cardTypeSets[0].makerFlag_style.row_style.border.right.color);
    }
  }, [cardTypeSets, cardTypeSetId]);

  const [cardtypeset_updateMakerFlagRowStyle] = useMutation(UpdateMakerFlagRowStyle, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
  }

  async function updaterowstyle() {
      console.log(backgroundColor)
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

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChangeComplete = (color) => {
      console.log(color.hex)
    setBackgroundColor(color.hex);
  };

  const handleClick1 = () => {
    console.log("clicked handleclick 1");
    setDisplayColorPicker1(!displayColorPicker1);
  };

  const handleClose1 = () => {
    setDisplayColorPicker1(false);
  };

  const borderTopColorHandler = (color) => {
    set_border_top_color(color.hex);
  };

  const handleClick2 = () => {
    setDisplayColorPicker2(!displayColorPicker2);
  };

  const handleClose2 = () => {
    setDisplayColorPicker2(false);
  };

  const borderBottomColorHandler = (color) => {
    set_border_bottom_color(color.hex);
  };

  const handleClick3 = () => {
    setDisplayColorPicker3(!displayColorPicker3);
  };

  const handleClose3 = () => {
    setDisplayColorPicker3(false);
  };

  const borderLeftColorHandler = (color) => {
    set_border_left_color(color.hex);
  };

  const handleClick4 = () => {
    setDisplayColorPicker4(!displayColorPicker4);
  };

  const handleClose4 = () => {
    setDisplayColorPicker4(false);
  };

  const borderRightColorHandler = (color) => {
    set_border_right_color(color.hex);
  };
  return (
    <div>
      <ul style={{ listStyle: "none", padding: "10px 0px 0px 0px" }}>
        <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.8rem" }}>행배경색</div>
          <Button size="small" onClick={handleClick} style={{ width: "80px", fontSize: "0.8rem", background: backgroundColor }}>
            Color
          </Button>
          {displayColorPicker ? (
            <div style={popover}>
              <div style={cover} onClick={handleClose} />
              <CompactPicker color={backgroundColor} onChange={handleChangeComplete} />
              {/* <span>none</span> */}
            </div>
          ) : null}
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ fontSize: "0.8rem" }}>
          <div>행테두리바깥쪽여백</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>상</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={outer_margin_top} onChange={outerMarginTopHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>하</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={outer_margin_bottom} onChange={outerMarginBottomHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>좌</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={outer_margin_left} onChange={outerMarginLeftHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>우</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={outer_margin_right} onChange={outerMarginRightHandler} />
          </div>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ fontSize: "0.8rem" }}>
          <div>행테두리안쪽여백</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>상</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={inner_padding_top} onChange={innerPaddingTopHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>하</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={inner_padding_bottom} onChange={innerPaddingBottomHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>좌</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={inner_padding_left} onChange={innerPaddingLeftHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>우</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={inner_padding_right} onChange={innerPaddingRightHandler} />
          </div>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ fontSize: "0.8rem" }}>
          <div>행테두리</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>상</span>
            <Select size="small" value={border_top_type} style={{ width: 75, fontSize: "0.8rem" }} onChange={borderTopTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            {/* <input type="color" name="border_top_thickness" value={border_top_color} onChange={borderTopColorHandler}></input> */}
            <Button size="small" onClick={handleClick1} style={{ width: "50px", fontSize: "0.8rem", background: border_top_color }}>
              Color
            </Button>
            {displayColorPicker1 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose1} />
                <CompactPicker color={border_top_color} onChange={borderTopColorHandler} />
                {/* <span>none</span> */}
              </div>
            ) : null}
            <InputNumber size="small" style={{ fontSize: "0.8rem", width: 60 }} value={border_top_thickness} onChange={borderTopThicknessHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>하</span>
            <Select size="small" value={border_bottom_type} style={{ width: 75, fontSize: "0.8rem" }} onChange={borderBottomTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            {/* <input type="color" name="border_bottom_thickness" value={border_bottom_color} onChange={borderBottomColorHandler}></input> */}
            <Button size="small" onClick={handleClick2} style={{ width: "50px", fontSize: "0.8rem", background: border_bottom_color }}>
              Color
            </Button>
            {displayColorPicker2 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose2} />
                <CompactPicker color={border_bottom_color} onChange={borderBottomColorHandler} />
                {/* <span>none</span> */}
              </div>
            ) : null}
            <InputNumber size="small" style={{ fontSize: "0.8rem", width: 60 }} value={border_bottom_thickness} onChange={borderBottomThicknessHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>좌</span>
            <Select size="small" value={border_left_type} style={{ width: 75, fontSize: "0.8rem" }} onChange={borderLeftTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            {/* <input type="color" name="border_left_thickness" value={border_left_color} onChange={borderLeftColorHandler}></input> */}
            <Button size="small" onClick={handleClick3} style={{ width: "50px", fontSize: "0.8rem", background: border_left_color }}>
              Color
            </Button>
            {displayColorPicker3 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose3} />
                <CompactPicker color={border_left_color} onChange={borderLeftColorHandler} />
                {/* <span>none</span> */}
              </div>
            ) : null}
            <InputNumber size="small" style={{ fontSize: "0.8rem", width: 60 }} value={border_left_thickness} onChange={borderLeftThicknessHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>우</span>
            <Select size="small" value={border_right_type} style={{ width: 75, fontSize: "0.8rem" }} onChange={borderRightTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            {/* <input type="color" name="border_right_thickness" value={border_right_color} onChange={borderRightColorHandler}></input> */}
            <Button size="small" onClick={handleClick4} style={{ width: "50px", fontSize: "0.8rem", background: border_right_color }}>
              Color
            </Button>
            {displayColorPicker4 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose4} />
                <CompactPicker color={border_right_color} onChange={borderRightColorHandler} />
                {/* <span>none</span> */}
              </div>
            ) : null}
            <InputNumber size="small" style={{ fontSize: "0.8rem", width: 60 }} value={border_right_thickness} onChange={borderRightThicknessHandler} />
          </div>
        </li>
        <li style={{ textAlign: "right" }}>
          <Button size="small" style={{ fontSize: "0.8rem" }} onClick={handleSubmit}>
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
