import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, Divider, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateFlagRowFont } from "../../../../../graphql/mutation/flagUpdate";
import { CompactPicker } from "react-color";

const { Option } = Select;

const FlagFontSetting = ({ cardTypeSets, cardTypeSetId }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [bold, set_bold] = useState();
  const [color, set_color] = useState();
  const [font, set_font] = useState();
  const [italic, set_italic] = useState();
  const [size, set_size] = useState();
  const [underline, set_underline] = useState();

  useEffect(() => {
    if (cardTypeSets) {
      console.log("cardTypeSets", cardTypeSets);
      set_bold(cardTypeSets[0].makerFlag_style.comment_font.bold);
      set_color(cardTypeSets[0].makerFlag_style.comment_font.color);
      set_font(cardTypeSets[0].makerFlag_style.comment_font.font);
      set_italic(cardTypeSets[0].makerFlag_style.comment_font.italic);
      set_size(cardTypeSets[0].makerFlag_style.comment_font.size);
      set_underline(cardTypeSets[0].makerFlag_style.comment_font.underline);
    }
  }, [cardTypeSets]);

  const [cardtypeset_updateMakerFlagRowFont] = useMutation(UpdateFlagRowFont, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
  }

  async function updateflagfontstyle() {
    try {
      await cardtypeset_updateMakerFlagRowFont({
        variables: {
          forUpdateMakerFlagRowFont: {
            cardtypeset_id: cardTypeSetId,
            comment_font: {
              font: font,
              size: size,
              color: color,
              align: "left",
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

  const boldHandler = (e) => set_bold(e);
  const fontHandler = (e) => set_font(e);
  const italicHandler = (e) => set_italic(e);
  const sizeHandler = (e) => set_size(e);
  const underlineHandler = (e) => set_underline(e);

  const handleSubmit = () => updateflagfontstyle();

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
        <li>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>폰트</span>
            <Select size="small" value={font} style={{ width: 120, fontSize: "0.8rem" }} onChange={fontHandler}>
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>bold</span>
            <Select size="small" value={bold} style={{ width: 120, fontSize: "0.8rem" }} onChange={boldHandler}>
              <Option value="on">on</Option>
              <Option value="off">off</Option>
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>italic</span>
            <Select size="small" value={italic} style={{ width: 120, fontSize: "0.8rem" }} onChange={italicHandler}>
              <Option value="on">on</Option>
              <Option value="off">off</Option>
            </Select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.8rem" }}>underline</span>
            <Select size="small" value={underline} style={{ width: 120, fontSize: "0.8rem" }} onChange={underlineHandler}>
              <Option value="on">on</Option>
              <Option value="off">off</Option>
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

export default FlagFontSetting;

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

