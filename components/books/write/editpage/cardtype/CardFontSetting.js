import React, { useState, useEffect, Fragment, useCallback } from "react";
import { useMutation } from "@apollo/client";
import { Button, Select, Divider, InputNumber } from "antd";
import { UpdateRowFont } from "../../../../../graphql/query/cardtype";
import { CompactPicker } from "react-color";
const { Option } = Select;

const CardFontSetting = ({
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

  const [isOpendFontColorPicker, setIsOpendFontColorPicker] = useState(false);
  const toggleFontColorPicker = () => {
    setIsOpendFontColorPicker(!isOpendFontColorPicker);
  };
  const fontColorHandler = (color) => {
    set_color(color.hex);
    toggleFontColorPicker();
  };

  const [align, set_align] = useState();
  const [bold, set_bold] = useState();
  const [color, set_color] = useState();
  const [font, set_font] = useState();
  const [italic, set_italic] = useState();
  const [size, set_size] = useState();
  const [underline, set_underline] = useState();

  const resetToPreservedSetting = useCallback(
    (_face, _row) => {
      set_align(cardTypeDetail[0].row_font[_face][_row].align);
      set_bold(cardTypeDetail[0].row_font[_face][_row].bold);
      set_color(cardTypeDetail[0].row_font[_face][_row].color);
      set_font(cardTypeDetail[0].row_font[_face][_row].font);
      set_italic(cardTypeDetail[0].row_font[_face][_row].italic);
      set_size(cardTypeDetail[0].row_font[_face][_row].size);
      set_underline(cardTypeDetail[0].row_font[_face][_row].underline);
    },
    [cardTypeDetail]
  );

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

  const [cardtypeset_updaterowfont] = useMutation(UpdateRowFont, {
    onCompleted: afterupdatemutation,
  });

  function afterupdatemutation(data) {
    console.log("data", data);
    getUpdatedCardTypeList(
      data.cardtypeset_updaterowfont.cardtypesets[0].cardtypes
    );
  }

  async function updaterowstyle() {
    try {
      await cardtypeset_updaterowfont({
        variables: {
          forUpdateRowFont: {
            cardtype_id: cardTypeId,
            cardtypeset_id: cardTypeSetId,
            target_face: faceSelected,
            target_row: Number(rowSelected),
            row_font: {
              font: font,
              size: size,
              color: color,
              align: align,
              bold: bold,
              italic: italic,
              underline: underline,
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const alignHandler = (e) => set_align(e);
  const boldHandler = (e) => set_bold(e);
  const fontHandler = (e) => set_font(e);
  const italicHandler = (e) => set_italic(e);
  const sizeHandler = (e) => set_size(e);
  const underlineHandler = (e) => set_underline(e);

  const handleSubmit = () => updaterowstyle();

  const selectFaceHandler = (selectedFaceStr) => {
    setFaceSelected(selectedFaceStr);
    resetToPreservedSetting(selectedFaceStr, rowSelected);
    if (selectedFaceStr === "face1") {
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
    } else if (selectedFaceStr === "face2") {
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
    } else if (selectedFaceStr === "annotation") {
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
  const selectRowHandler = (selectedRowNum) => {
    setRowSelected(selectedRowNum);
    resetToPreservedSetting(faceSelected, selectedRowNum);
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
          <div style={{ fontSize: "0.8rem" }} disabled>
            행선택
          </div>
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
        <li>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>폰트</span>
            <Select
              size="small"
              value={font}
              style={{ width: 120, fontSize: "0.8rem" }}
              onChange={fontHandler}
            >
              <Option value="고딕" style={{ fontSize: "0.8rem" }}>
                고딕
              </Option>
              <Option value="명조" style={{ fontSize: "0.8rem" }}>
                명조
              </Option>
              <Option value="바탕" style={{ fontSize: "0.8rem" }}>
                바탕
              </Option>
              <Option value="돋움" style={{ fontSize: "0.8rem" }}>
                돋움
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
            <span style={{ fontSize: "0.8rem" }}>색</span>
            <Button
              size="small"
              onClick={toggleFontColorPicker}
              style={{ width: "80px", fontSize: "0.8rem", background: color }}
            >
              Color
            </Button>
            {isOpendFontColorPicker ? (
              <div style={popover}>
                <div style={cover} />
                <CompactPicker color={color} onChange={fontColorHandler} />
                {/* <span>none</span> */}
              </div>
            ) : null}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "0.8rem" }}>align</span>
            <Select
              size="small"
              value={align}
              style={{ width: 120, fontSize: "0.8rem" }}
              onChange={alignHandler}
            >
              <Option value="left" style={{ fontSize: "0.8rem" }}>
                left
              </Option>
              <Option value="right" style={{ fontSize: "0.8rem" }}>
                right
              </Option>
              <Option value="center" style={{ fontSize: "0.8rem" }}>
                center
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
            <span style={{ fontSize: "0.8rem" }}>bold</span>
            <Select
              size="small"
              value={bold}
              style={{ width: 120, fontSize: "0.8rem" }}
              onChange={boldHandler}
            >
              <Option value="on" style={{ fontSize: "0.8rem" }}>
                on
              </Option>
              <Option value="off" style={{ fontSize: "0.8rem" }}>
                off
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
            <span style={{ fontSize: "0.8rem" }}>italic</span>
            <Select
              size="small"
              value={italic}
              style={{ width: 120, fontSize: "0.8rem" }}
              onChange={italicHandler}
            >
              <Option value="on" style={{ fontSize: "0.8rem" }}>
                on
              </Option>
              <Option value="off" style={{ fontSize: "0.8rem" }}>
                off
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
            <span style={{ fontSize: "0.8rem" }}>underline</span>
            <Select
              size="small"
              value={underline}
              style={{ width: 120, fontSize: "0.8rem" }}
              onChange={underlineHandler}
            >
              <Option value="on" style={{ fontSize: "0.8rem" }}>
                on
              </Option>
              <Option value="off" style={{ fontSize: "0.8rem" }}>
                off
              </Option>
            </Select>
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

export default CardFontSetting;

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
