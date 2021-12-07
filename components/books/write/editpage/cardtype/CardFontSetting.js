import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, Divider, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateCardType, GetCardTypeSet, UpdateRowStyle, UpdateRowFont } from "../../../../../graphql/query/cardtype";
import { CompactPicker } from "react-color";
const { Option } = Select;

const CardFaceSetting = ({ cardTypeId, cardTypeSetId, cardTypeDetail, getUpdatedCardTypeList }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [cardType, setCardType] = useState([]);
  const [current_cardTypeId, set_current_CardTypeId] = useState();
  const [current_cardTypeSetId, set_current_CardTypeSetId] = useState();

  const [faceSelected, setFaceSelected] = useState("default");
  const [rowSelected, setRowSelected] = useState("default");
  const [rowOptions, setRowOptions] = useState();

  const [align, set_align] = useState();
  const [bold, set_bold] = useState();
  const [color, set_color] = useState();
  const [font, set_font] = useState();
  const [italic, set_italic] = useState();
  const [size, set_size] = useState();
  const [underline, set_underline] = useState();

  useEffect(() => {
    console.log("카드 디테일 세팅 화면 온");
    if (cardTypeId) {
      console.log("cardTypeId", cardTypeId);
      setCardType(cardTypeDetail[0].cardtype_info.cardtype);
    }
  }, [cardTypeId, cardTypeDetail]);

  const [cardtypeset_updaterowfont] = useMutation(UpdateRowFont, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
    getUpdatedCardTypeList(data.cardtypeset_updaterowfont.cardtypesets[0].cardtypes);
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

  const resetValue = () => {
    set_align();
    set_bold();
    set_color();
    set_font();
    set_italic();
    set_size();
    set_underline();
  };
  const selectFaceHandler = (e) => {
    console.log(e);
    setFaceSelected(e);
    if (e === "face1") {
      setRowSelected("default");
      resetValue();
      console.log("face1selected");
      console.log("cardTypeDetail : ", cardTypeDetail[0].cardtype_info.num_of_row.face1);
      const num_of_row = cardTypeDetail[0].cardtype_info.num_of_row.face1;
      let nums = [];
      for (var i = 1; i < num_of_row + 1; i++) {
        nums.push(i);
      }
      console.log(nums);
      const rows = nums.map((item) => (
        <>
          <React.Fragment key={item - 1}>
            <Select.Option value={item - 1} style={{ fontSize: "0.8rem" }}>{item}</Select.Option>
          </React.Fragment>
        </>
      ));
      setRowOptions(rows);
    } else if (e === "face2") {
      setRowSelected("default");
      resetValue();
      console.log("face2selected");
      const num_of_row = cardTypeDetail[0].cardtype_info.num_of_row.face2;
      let nums = [];
      for (var i = 1; i < num_of_row + 1; i++) {
        nums.push(i);
      }
      console.log(nums);
      const rows = nums.map((item) => (
        <>
          <React.Fragment key={item - 1}>
            <Select.Option value={item - 1} style={{ fontSize: "0.8rem" }}>{item}</Select.Option>
          </React.Fragment>
        </>
      ));
      setRowOptions(rows);
    } else if (e === "annotation") {
      setRowSelected("default");
      resetValue();
      console.log("face3selected");
      const num_of_row = cardTypeDetail[0].cardtype_info.num_of_row.annotation;
      let nums = [];
      for (var i = 1; i < num_of_row + 1; i++) {
        nums.push(i);
      }
      console.log(nums);
      const rows = nums.map((item) => (
        <>
          <React.Fragment key={item - 1}>
            <Select.Option value={item - 1} style={{ fontSize: "0.8rem" }}>{item}</Select.Option>
          </React.Fragment>
        </>
      ));
      setRowOptions(rows);
    }
  };
  const selectRowHandler = (e) => {
    console.log(e);
    setRowSelected(e);

    set_align(cardTypeDetail[0].row_font[faceSelected][e].align);
    set_bold(cardTypeDetail[0].row_font[faceSelected][e].bold);
    set_color(cardTypeDetail[0].row_font[faceSelected][e].color);
    set_font(cardTypeDetail[0].row_font[faceSelected][e].font);
    set_italic(cardTypeDetail[0].row_font[faceSelected][e].italic);
    set_size(cardTypeDetail[0].row_font[faceSelected][e].size);
    set_underline(cardTypeDetail[0].row_font[faceSelected][e].underline);
  };

  const handleClick = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  const handleClose = () => {
    setDisplayColorPicker(false);
  };

  const handleChangeComplete = (color) => {
      console.log(color.hex)
      set_color(color.hex);
  };

  return (
    <div>
      <ul style={{ listStyle: "none", padding: "10px 0px 0px 0px" }}>
        <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.8rem" }}>면선택</div>
          <Select size="small" value={faceSelected} style={{ width: 120, fontSize: "0.8rem" }} onChange={selectFaceHandler}>
            <Option value="default" disabled>면선택</Option>
            {cardType === "read" && (
              <React.Fragment>
                <Select.Option value="face1" style={{ fontSize: "0.8rem" }}>1면</Select.Option>
                <Select.Option value="annotation" style={{ fontSize: "0.8rem" }}>주석</Select.Option>
              </React.Fragment>
            )}
            {cardType === "subject" && (
              <React.Fragment>
                <Select.Option value="face1" style={{ fontSize: "0.8rem" }}>1면</Select.Option>
                <Select.Option value="annotation" style={{ fontSize: "0.8rem" }}>주석</Select.Option>
              </React.Fragment>
            )}
            {cardType === "general" && (
              <React.Fragment>
                <Select.Option value="face1" style={{ fontSize: "0.8rem" }}>1면</Select.Option>
                <Select.Option value="annotation" style={{ fontSize: "0.8rem" }}>주석</Select.Option>
              </React.Fragment>
            )}
            {cardType === "flip" && (
              <React.Fragment>
                <Select.Option value="face1" style={{ fontSize: "0.8rem" }}>1면</Select.Option>
                <Select.Option value="face2" style={{ fontSize: "0.8rem" }}>2면</Select.Option>
                <Select.Option value="annotation" style={{ fontSize: "0.8rem" }}>주석</Select.Option>
              </React.Fragment>
            )}
          </Select>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "0.8rem" }} disabled>행선택</div>
          <Select size="small" value={rowSelected} style={{ width: 120, fontSize: "0.8rem"  }} onChange={selectRowHandler}>
            <Option value="default" style={{ fontSize: "0.8rem" }}>행선택</Option>
            {rowOptions}
          </Select>
        </li>
        <Divider style={{ width: "100%", marginTop: 10, marginBottom: 10 }} />
        <li>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>폰트</span>
            <Select size="small" value={font} style={{ width: 120, fontSize: "0.8rem" }} onChange={fontHandler}>
              <Option value="고딕" style={{ fontSize: "0.8rem" }}>고딕</Option>
              <Option value="명조" style={{ fontSize: "0.8rem" }}>명조</Option>
              <Option value="바탕" style={{ fontSize: "0.8rem" }}>바탕</Option>
              <Option value="돋움" style={{ fontSize: "0.8rem" }}>돋움</Option>
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>size</span>
            <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={size} onChange={sizeHandler} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>색</span>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>align</span>
            <Select size="small" value={align} style={{ width: 120, fontSize: "0.8rem"  }} onChange={alignHandler}>
              <Option value="left" style={{ fontSize: "0.8rem" }}>left</Option>
              <Option value="right" style={{ fontSize: "0.8rem" }}>right</Option>
              <Option value="center" style={{ fontSize: "0.8rem" }}>center</Option>
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>bold</span>
            <Select size="small" value={bold} style={{ width: 120, fontSize: "0.8rem"  }} onChange={boldHandler}>
              <Option value="on" style={{ fontSize: "0.8rem" }}>on</Option>
              <Option value="off" style={{ fontSize: "0.8rem" }}>off</Option>
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>italic</span>
            <Select size="small" value={italic} style={{ width: 120, fontSize: "0.8rem"  }} onChange={italicHandler}>
              <Option value="on" style={{ fontSize: "0.8rem" }}>on</Option>
              <Option value="off" style={{ fontSize: "0.8rem" }}>off</Option>
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>underline</span>
            <Select size="small" value={underline} style={{ width: 120, fontSize: "0.8rem"  }} onChange={underlineHandler}>
              <Option value="on" style={{ fontSize: "0.8rem" }}>on</Option>
              <Option value="off" style={{ fontSize: "0.8rem" }}>off</Option>
            </Select>
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

export default CardFaceSetting;

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


