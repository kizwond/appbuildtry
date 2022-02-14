import React, { useState, useEffect, Fragment } from "react";
import { useMutation } from "@apollo/client";
import { Button, Select, Divider, InputNumber } from "antd";
import { UpdateRowStyle } from "../../../../../graphql/query/cardtype";
import { CompactPicker } from "react-color";
const { Option } = Select;

const CardRowSetting = ({
  cardTypeId,
  cardTypeSetId,
  cardTypeDetail,
  getUpdatedCardTypeList,
  tabValue,
}) => {
  const cardType = cardTypeDetail[0].cardtype_info.cardtype;

  const [faceSelected, setFaceSelected] = useState("face1");
  const [rowSelected, setRowSelected] = useState(0);
  const [rowOptions, setRowOptions] = useState([]);

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

  const [opacity, setOpacity] = useState();

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

  const resetToPreservedSetting = (faceSelected, e) => {
    setBackgroundColor(
      cardTypeDetail[0].row_style[faceSelected][e].background.color
    );
    setOpacity(cardTypeDetail[0].face_style[e].background.opacity);

    set_outer_margin_top(
      cardTypeDetail[0].row_style[faceSelected][e].outer_margin.top
    );
    set_outer_margin_bottom(
      cardTypeDetail[0].row_style[faceSelected][e].outer_margin.bottom
    );
    set_outer_margin_left(
      cardTypeDetail[0].row_style[faceSelected][e].outer_margin.left
    );
    set_outer_margin_right(
      cardTypeDetail[0].row_style[faceSelected][e].outer_margin.right
    );

    set_inner_padding_top(
      cardTypeDetail[0].row_style[faceSelected][e].inner_padding.top
    );
    set_inner_padding_bottom(
      cardTypeDetail[0].row_style[faceSelected][e].inner_padding.bottom
    );
    set_inner_padding_left(
      cardTypeDetail[0].row_style[faceSelected][e].inner_padding.left
    );
    set_inner_padding_right(
      cardTypeDetail[0].row_style[faceSelected][e].inner_padding.right
    );

    set_border_top_type(
      cardTypeDetail[0].row_style[faceSelected][e].border.top.bordertype
    );
    set_border_bottom_type(
      cardTypeDetail[0].row_style[faceSelected][e].border.bottom.bordertype
    );
    set_border_left_type(
      cardTypeDetail[0].row_style[faceSelected][e].border.left.bordertype
    );
    set_border_right_type(
      cardTypeDetail[0].row_style[faceSelected][e].border.right.bordertype
    );

    set_border_top_thickness(
      cardTypeDetail[0].row_style[faceSelected][e].border.top.thickness
    );
    set_border_bottom_thickness(
      cardTypeDetail[0].row_style[faceSelected][e].border.bottom.thickness
    );
    set_border_left_thickness(
      cardTypeDetail[0].row_style[faceSelected][e].border.left.thickness
    );
    set_border_right_thickness(
      cardTypeDetail[0].row_style[faceSelected][e].border.right.thickness
    );

    set_border_top_color(
      cardTypeDetail[0].row_style[faceSelected][e].border.top.color
    );
    set_border_bottom_color(
      cardTypeDetail[0].row_style[faceSelected][e].border.bottom.color
    );
    set_border_left_color(
      cardTypeDetail[0].row_style[faceSelected][e].border.left.color
    );
    set_border_right_color(
      cardTypeDetail[0].row_style[faceSelected][e].border.right.color
    );
  };
  const selectRowHandler = (_row) => {
    setRowSelected(_row);
    resetToPreservedSetting(faceSelected, _row);
  };

  useEffect(() => {
    if (cardTypeId) {
      const num_of_row = cardTypeDetail[0].cardtype_info.num_of_row.face1;
      let nums = [];
      for (var i = 0; i < num_of_row; i++) {
        nums.push(i);
      }
      const rows = nums.map((item) => (
        <Select.Option key={item} value={item} style={{ fontSize: "0.8rem" }}>
          {item + 1}
        </Select.Option>
      ));
      setRowOptions(rows);
      setFaceSelected("face1");
      setRowSelected(0);
      resetToPreservedSetting("face1", 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardTypeId, tabValue]);

  const [cardtypeset_updaterowstyle] = useMutation(UpdateRowStyle, {
    onCompleted: afterupdatemutation,
  });

  function afterupdatemutation(data) {
    console.log("data", data);
    getUpdatedCardTypeList(
      data.cardtypeset_updaterowstyle.cardtypesets[0].cardtypes
    );
  }

  async function updaterowstyle() {
    try {
      await cardtypeset_updaterowstyle({
        variables: {
          forUpdateRowStyle: {
            cardtype_id: cardTypeId,
            cardtypeset_id: cardTypeSetId,
            target_face: faceSelected,
            // 아래부분만 잘 연구
            target_row: rowSelected,
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

  const backgroundColorHandler = (e) => setBackgroundColor(e.target.value);

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

  // const borderTopColorHandler = (e) => set_border_top_color(e.target.value);
  // const borderBottomColorHandler = (e) => set_border_bottom_color(e.target.value);
  // const borderLeftColorHandler = (e) => set_border_left_color(e.target.value);
  // const borderRightColorHandler = (e) => set_border_right_color(e.target.value);

  const handleSubmit = () => updaterowstyle();

  const selectFaceHandler = (_face) => {
    resetToPreservedSetting(_face, rowSelected);
    setFaceSelected(_face);
    if (_face === "face1") {
      const num_of_row = cardTypeDetail[0].cardtype_info.num_of_row.face1;
      let nums = [];
      for (var i = 0; i < num_of_row; i++) {
        nums.push(i);
      }
      const rows = nums.map((item) => (
        <Select.Option key={item} value={item} style={{ fontSize: "0.8rem" }}>
          {item + 1}
        </Select.Option>
      ));
      setRowOptions(rows);
    } else if (_face === "face2") {
      const num_of_row = cardTypeDetail[0].cardtype_info.num_of_row.face2;
      let nums = [];
      for (var i = 0; i < num_of_row; i++) {
        nums.push(i);
      }
      const rows = nums.map((item) => (
        <Select.Option key={item} value={item} style={{ fontSize: "0.8rem" }}>
          {item + 1}
        </Select.Option>
      ));
      setRowOptions(rows);
    } else if (_face === "annotation") {
      const num_of_row = cardTypeDetail[0].cardtype_info.num_of_row.annotation;
      let nums = [];
      for (var i = 0; i < num_of_row; i++) {
        nums.push(i);
      }
      const rows = nums.map((item) => (
        <Select.Option key={item} value={item} style={{ fontSize: "0.8rem" }}>
          {item + 1}
        </Select.Option>
      ));
      setRowOptions(rows);
    }
  };

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
          <div style={{ fontSize: "0.8rem" }}>면선택</div>
          <Select
            size="small"
            value={faceSelected}
            style={{ width: 120, fontSize: "0.8rem" }}
            onChange={selectFaceHandler}
          >
            {cardType !== "flip" && (
              <>
                <Select.Option value="face1" style={{ fontSize: "0.8rem" }}>
                  1면
                </Select.Option>
                <Select.Option
                  value="annotation"
                  style={{ fontSize: "0.8rem" }}
                >
                  주석
                </Select.Option>
              </>
            )}

            {cardType === "flip" && (
              <>
                <Select.Option value="face1" style={{ fontSize: "0.8rem" }}>
                  1면
                </Select.Option>
                <Select.Option value="face2" style={{ fontSize: "0.8rem" }}>
                  2면
                </Select.Option>
                <Select.Option
                  value="annotation"
                  style={{ fontSize: "0.8rem" }}
                >
                  주석
                </Select.Option>
              </>
            )}
          </Select>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: "0.8rem" }}>행선택</div>
          <Select
            size="small"
            value={rowSelected}
            style={{ width: 120, fontSize: "0.8rem" }}
            onChange={selectRowHandler}
          >
            {rowOptions}
            {cardType === "flip" && faceSelected === "face1" && (
              <Select.Option value={rowOptions.length}>보기</Select.Option>
            )}
          </Select>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
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
          {isOpendRowBackgroundColorPicker ? (
            <div style={popover}>
              <div style={cover} />
              <CompactPicker
                color={backgroundColor}
                onChange={rowBackgroundHandler}
              />
            </div>
          ) : null}
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

export default CardRowSetting;

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
