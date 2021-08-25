import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateCardType, GetCardTypeSet, UpdateRowStyle, UpdateRowFont } from "../../../../../graphql/query/cardtype";
const { Option } = Select;

const CardFaceSetting = ({ cardTypeId, cardTypeSetId, cardTypeDetail, getUpdatedCardTypeList }) => {
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
      console.log(font)
      console.log(size)
      console.log(color)
      console.log(align, bold, italic, underline)
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
  const colorHandler = (e) => set_color(e.target.value);
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
            <Select.Option value={item - 1}>{item}</Select.Option>
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
            <Select.Option value={item - 1}>{item}</Select.Option>
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
            <Select.Option value={item - 1}>{item}</Select.Option>
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

  return (
    <div>
      <div>행설정</div>
      <ul>
        <li>
          <div>면선택</div>
          <Select value={faceSelected} style={{ width: 120 }} onChange={selectFaceHandler}>
            <Option value="default">면선택</Option>
            {cardType === "read" && (
              <React.Fragment>
                <Select.Option value="face1">1면</Select.Option>
                <Select.Option value="annotation">주석</Select.Option>
              </React.Fragment>
            )}

            {cardType === "flip" && (
              <React.Fragment>
                <Select.Option value="face1">1면</Select.Option>
                <Select.Option value="face2">2면</Select.Option>
                <Select.Option value="annotation">주석</Select.Option>
              </React.Fragment>
            )}
          </Select>
        </li>
        <li>
          <div>행선택</div>
          <Select value={rowSelected} style={{ width: 120 }} onChange={selectRowHandler}>
            <Option value="default">행선택</Option>
            {rowOptions}
          </Select>
        </li>
        <li>
          <div>
            <span>폰트</span>
            <Select value={font} style={{ width: 120 }} onChange={fontHandler}>
              <Option value="맑은고딕">맑은고딕</Option>
              <Option value="고딕">고딕</Option>
              <Option value="돋움">돋움</Option>
            </Select>
          </div>
          <div>
            <span>size</span>
            <InputNumber value={size} onChange={sizeHandler} />
          </div>
          <div>
            <span>색</span>
            <input type="color" id="head" name="background_color" value={color} onChange={colorHandler}></input>
          </div>
          <div>
            <span>align</span>
            <Select value={align} style={{ width: 120 }} onChange={alignHandler}>
              <Option value="left">left</Option>
              <Option value="right">right</Option>
              <Option value="center">center</Option>
            </Select>
          </div>
          <div>
            <span>bold</span>
            <Select value={bold} style={{ width: 120 }} onChange={boldHandler}>
              <Option value="on">on</Option>
              <Option value="off">off</Option>
            </Select>
          </div>
          <div>
            <span>italic</span>
            <Select value={italic} style={{ width: 120 }} onChange={italicHandler}>
              <Option value="on">on</Option>
              <Option value="off">off</Option>
            </Select>
          </div>
          <div>
            <span>underline</span>
            <Select value={underline} style={{ width: 120 }} onChange={underlineHandler}>
              <Option value="on">on</Option>
              <Option value="off">off</Option>
            </Select>
          </div>
        </li>
        <li>
          <button onClick={handleSubmit}>적용하기</button>
        </li>
      </ul>
    </div>
  );
};

export default CardFaceSetting;
