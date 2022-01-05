import React, { useState, useEffect, Fragment } from "react";
import { CompactPicker } from "react-color";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Space, Button, Radio, Select, Divider, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateStudyTool } from "../../../../graphql/mutation/studyUtils";

const HighlightSetting = ({ cardTypeSets, updateStudyToolApply }) => {
  const [displayColorPicker1, setDisplayColorPicker1] = useState(false);
  const [displayColorPicker2, setDisplayColorPicker2] = useState(false);
  const [displayColorPicker3, setDisplayColorPicker3] = useState(false);
  const [displayColorPicker4, setDisplayColorPicker4] = useState(false);
  const [displayColorPicker5, setDisplayColorPicker5] = useState(false);

  const [color1, setColor1] = useState();
  const [color2, setColor2] = useState();
  const [color3, setColor3] = useState();
  const [color4, setColor4] = useState();
  const [color5, setColor5] = useState();

  const [toolType1, setToolType1] = useState();
  const [toolType2, setToolType2] = useState();
  const [toolType3, setToolType3] = useState();
  const [toolType4, setToolType4] = useState();
  const [toolType5, setToolType5] = useState();

  const [cardTypeSetId, setCardTypeSetId] = useState();

  const handleClick1 = () => {
    setDisplayColorPicker1(!displayColorPicker1);
  };
  const handleClose1 = () => {
    setDisplayColorPicker1(false);
  };
  const type1ColorHandler = (color) => {
    setColor1(color.hex);
    setDisplayColorPicker1(false);
  };

  const handleClick2 = () => {
    setDisplayColorPicker2(!displayColorPicker2);
  };
  const handleClose2 = () => {
    setDisplayColorPicker2(false);
  };
  const type2ColorHandler = (color) => {
    setColor2(color.hex);
    setDisplayColorPicker2(false);
  };

  const handleClick3 = () => {
    setDisplayColorPicker3(!displayColorPicker3);
  };
  const handleClose3 = () => {
    setDisplayColorPicker3(false);
  };
  const type3ColorHandler = (color) => {
    setColor3(color.hex);
    setDisplayColorPicker3(false);
  };

  const handleClick4 = () => {
    setDisplayColorPicker4(!displayColorPicker4);
  };
  const handleClose4 = () => {
    setDisplayColorPicker4(false);
  };
  const type4ColorHandler = (color) => {
    setColor4(color.hex);
    setDisplayColorPicker4(false);
  };

  const handleClick5 = () => {
    setDisplayColorPicker5(!displayColorPicker5);
  };
  const handleClose5 = () => {
    setDisplayColorPicker5(false);
  };
  const type5ColorHandler = (color) => {
    setColor5(color.hex);
    setDisplayColorPicker5(false);
  };

  const handleSubmit = () => {
    var sendValue = [
      { attr1: toolType1, attr2: null, color: color1 },
      { attr1: toolType2, attr2: null, color: color2 },
      { attr1: toolType3, attr2: null, color: color3 },
      { attr1: toolType4, attr2: null, color: color4 },
      { attr1: toolType5, attr2: null, color: color5 },
    ];
    updatestudytool(sendValue);
  };

  useEffect(() => {
    if (cardTypeSets) {
      const hightlightSetting = cardTypeSets[0].studyTool.highlight;
      setCardTypeSetId(cardTypeSets[0]._id);
      setColor1(hightlightSetting[0].color);
      setColor2(hightlightSetting[1].color);
      setColor3(hightlightSetting[2].color);
      setColor4(hightlightSetting[3].color);
      setColor5(hightlightSetting[4].color);
      setToolType1(hightlightSetting[0].attr1);
      setToolType2(hightlightSetting[1].attr1);
      setToolType3(hightlightSetting[2].attr1);
      setToolType4(hightlightSetting[3].attr1);
      setToolType5(hightlightSetting[4].attr1);
    }
  }, [cardTypeSets]);

  const [cardtypeset_updateStudyTool] = useMutation(UpdateStudyTool, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
    updateStudyToolApply(data.cardtypeset_updateStudyTool.cardtypesets);
  }

  async function updatestudytool(data) {
    try {
      await cardtypeset_updateStudyTool({
        variables: {
          forUpdateStudyTool: {
            cardtypeset_id: cardTypeSetId,
            effectType: "highlight",
            detailsByEffect: data,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <svg xmlns="//www.w3.org/2000/svg" version="1.1" className="svg-filters" style={{ display: "none" }}>
        <defs>
          <filter id="marker-shape">
            <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
          </filter>
        </defs>
      </svg>

      <Space direction="vertical">
        <div style={{ width: "200px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button size="small" onClick={handleClick1} style={{ width: "80px", fontSize: "0.8rem", background: color1, borderRadius: "10px" }}>
            Color
          </Button>
          <div className={toolType1} style={{ fontSize: "0.8rem", display: "inline-block", "--bubble-color": color1, "--z-index": -1 }}>
            ex. 형광펜 예시 입니다~~
          </div>
        </div>
        {displayColorPicker1 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose1} />
            <CompactPicker color={color1} onChange={type1ColorHandler} />
          </div>
        ) : null}

        <div style={{ width: "200px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button size="small" onClick={handleClick2} style={{ width: "80px", fontSize: "0.8rem", background: color2, borderRadius: "10px" }}>
            Color
          </Button>
          <div className={toolType2} style={{ fontSize: "0.8rem", display: "inline-block", "--bubble-color": color2, "--z-index": -1 }}>
            ex. 형광펜 예시 입니다~~
          </div>
        </div>
        {displayColorPicker2 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose2} />
            <CompactPicker color={color2} onChange={type2ColorHandler} />
          </div>
        ) : null}

        <div style={{ width: "200px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button size="small" onClick={handleClick3} style={{ width: "80px", fontSize: "0.8rem", background: color3, borderRadius: "10px" }}>
            Color
          </Button>
          <div className={toolType3} style={{ fontSize: "0.8rem", display: "inline-block", backgroundColor: color3 }}>
            ex. 형광펜 예시 입니다~~
          </div>
        </div>
        {displayColorPicker3 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose3} />
            <CompactPicker color={color3} onChange={type3ColorHandler} />
          </div>
        ) : null}

        <div style={{ width: "200px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button size="small" onClick={handleClick4} style={{ width: "80px", fontSize: "0.8rem", background: color4, borderRadius: "10px" }}>
            Color
          </Button>
          <div className={toolType4} style={{ fontSize: "0.8rem", display: "inline-block", backgroundColor: color4 }}>
            ex. 형광펜 예시 입니다~~
          </div>
        </div>
        {displayColorPicker4 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose4} />
            <CompactPicker color={color4} onChange={type4ColorHandler} />
          </div>
        ) : null}

        <div style={{ width: "200px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Button size="small" onClick={handleClick5} style={{ width: "80px", fontSize: "0.8rem", background: color5, borderRadius: "10px" }}>
            Color
          </Button>
          <div className={toolType5} style={{ fontSize: "0.8rem", display: "inline-block", "--bubble-color": color5, "--z-index": -1 }}>
            ex. 형광펜 예시 입니다~~
          </div>
        </div>
        {displayColorPicker5 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose5} />
            <CompactPicker color={color5} onChange={type5ColorHandler} />
          </div>
        ) : null}
      </Space>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
        <div></div>
        <Button size="small" type="primary" style={{ fontSize: "0.8rem" }} onClick={handleSubmit}>
          적용하기
        </Button>
      </div>
    </>
  );
};

export default HighlightSetting;
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
