import React, { useState, useEffect, Fragment } from "react";
import { useMutation } from "@apollo/client";
import { Button, Select, Divider, InputNumber } from "antd";
import { UpdateFlagRowFont } from "../../../../../graphql/mutation/flagUpdate";
import { CompactPicker } from "react-color";

const { Option } = Select;

const FlagFontSetting = ({ fontStyle, cardTypeSetId, tabValue }) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [bold, setBold] = useState();

  const [fontColor, setFontColor] = useState();
  const [isOpendFontColorPicker, setIsOpendFontColorPicker] = useState(false);
  const toggleFontColorPicker = () => {
    setIsOpendFontColorPicker(!isOpendFontColorPicker);
  };
  const fontColorHandler = (color) => {
    setFontColor(color.hex);
    toggleFontColorPicker();
  };

  const [font, setFont] = useState();
  const [italic, setItalic] = useState();
  const [size, setSize] = useState();
  const [underline, setUnderline] = useState();

  useEffect(() => {
    if (fontStyle) {
      setBold(fontStyle.bold);
      setFontColor(fontStyle.color);
      setFont(fontStyle.font);
      setItalic(fontStyle.italic);
      setSize(fontStyle.size);
      setUnderline(fontStyle.underline);
    }
  }, [fontStyle, tabValue, cardTypeSetId]);

  const [cardtypeset_updateMakerFlagRowFont] = useMutation(UpdateFlagRowFont, {
    onCompleted: afterupdatemutation,
  });

  function afterupdatemutation(data) {
    console.log("data", data);
  }

  async function updateflagfontstyle() {
    try {
      await cardtypeset_updateMakerFlagRowFont({
        variables: {
          forUpdateMakerFlagCommentFont: {
            cardtypeset_id: cardTypeSetId,
            comment_font: {
              font: font,
              size: size,
              color: fontColor,
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

  const boldHandler = (e) => setBold(e);
  const fontHandler = (e) => setFont(e);
  const italicHandler = (e) => setItalic(e);
  const sizeHandler = (e) => setSize(e);
  const underlineHandler = (e) => setUnderline(e);

  const handleSubmit = () => updateflagfontstyle();

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
            <div style={{ fontSize: "0.8rem" }}>색</div>
            <Button
              size="small"
              onClick={toggleFontColorPicker}
              style={{
                width: "80px",
                fontSize: "0.8rem",
                background: fontColor,
              }}
            >
              Color
            </Button>
            {isOpendFontColorPicker ? (
              <div style={popover}>
                <div style={cover} />
                <CompactPicker color={fontColor} onChange={fontColorHandler} />
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
            <span style={{ fontSize: "0.8rem" }}>bold</span>
            <Select
              size="small"
              value={bold}
              style={{ width: 120, fontSize: "0.8rem" }}
              onChange={boldHandler}
            >
              <Option value="on">on</Option>
              <Option value="off">off</Option>
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
              <Option value="on">on</Option>
              <Option value="off">off</Option>
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
              <Option value="on">on</Option>
              <Option value="off">off</Option>
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
