import React, { useState, useEffect, Fragment } from "react";
import { CompactPicker } from "react-color";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Space, Button, Radio, Select, Divider, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateStudyTool } from "../../../../graphql/mutation/studyUtils";

const HighlightSetting = ({ cardTypeSets, updateStudyToolApply }) => {
  const [displayColorPicker1, setDisplayColorPicker1] = useState(false);
  const [displayColorPicker2, setDisplayColorPicker2] = useState(false);
  const [displayColorPicker3, setDisplayColorPicker3] = useState(false);

  const [color1, setColor1] = useState();
  const [color2, setColor2] = useState();
  const [color3, setColor3] = useState();

  const [toolType1, setToolType1] = useState();
  const [toolType2, setToolType2] = useState();
  const [toolType3, setToolType3] = useState();

  const [cardTypeSetId, setCardTypeSetId] = useState();

  const handleClick1 = () => {
    console.log("clicked handleclick 1");
    setDisplayColorPicker1(!displayColorPicker1);
  };

  const handleClose1 = () => {
    setDisplayColorPicker1(false);
  };

  const type1ColorHandler = (color) => {
    setColor1(color.hex);
  };

  const handleClick2 = () => {
    setDisplayColorPicker2(!displayColorPicker2);
  };

  const handleClose2 = () => {
    setDisplayColorPicker2(false);
  };

  const type2ColorHandler = (color) => {
    setColor2(color.hex);
  };

  const handleClick3 = () => {
    setDisplayColorPicker3(!displayColorPicker3);
  };

  const handleClose3 = () => {
    setDisplayColorPicker3(false);
  };

  const type3ColorHandler = (color) => {
    setColor3(color.hex);
  };

  const handleSubmit = () => {
    var sendValue = [
      { toolType: toolType1, color: color1 },
      { toolType: toolType2, color: color2 },
      { toolType: toolType3, color: color3 },
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
      setToolType1(hightlightSetting[0].toolType);
      setToolType2(hightlightSetting[1].toolType);
      setToolType3(hightlightSetting[2].toolType);
    }
  }, [cardTypeSets]);

  const [cardtypeset_updateStudyTool] = useMutation(UpdateStudyTool, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
    updateStudyToolApply(data.cardtypeset_updateStudyTool.cardtypesets)
  }

  async function updatestudytool(data) {
    try {
      await cardtypeset_updateStudyTool({
        variables: {
          forUpdateStudyTool: {
            cardtypeset_id: cardTypeSetId,
            studyToolType: "highlight",
            studyToolDetailConfig: data,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <svg xmlns="//www.w3.org/2000/svg" version="1.1" className="svg-filters" style={{display:"none"}}>
        <defs>
          <filter id="marker-shape">
            <feTurbulence type="fractalNoise" baseFrequency="0 0.15" numOctaves="1" result="warp" />
            <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warp" />
          </filter>
        </defs>
      </svg>
      <Space direction="vertical">
        <Button size="small" onClick={handleClick1} style={{ width: "80px", fontSize: "0.8rem", background: color1 }}>
          Color
        </Button>
        <div className={toolType1} style={{ display: "inline-block", "--bubble-color": color1 }}>
          형광펜 예시 입니다~~
        </div>
        {displayColorPicker1 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose1} />
            <CompactPicker color={color1} onChange={type1ColorHandler} />
          </div>
        ) : null}
        <Button size="small" onClick={handleClick2} style={{ width: "80px", fontSize: "0.8rem", background: color2 }}>
          Color
        </Button>
        <div className={toolType2} style={{ display: "inline-block", backgroundColor: color2 }}>
          형광펜 예시 입니다~~
        </div>
        {displayColorPicker2 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose2} />
            <CompactPicker color={color2} onChange={type2ColorHandler} />
          </div>
        ) : null}
        <Button size="small" onClick={handleClick3} style={{ width: "80px", fontSize: "0.8rem", background: color3 }}>
          Color
        </Button>
        <div className={toolType3} style={{ display: "inline-block", "--bubble-color": color3 }}>형광펜 예시 입니다~~</div>
        {displayColorPicker3 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose3} />
            <CompactPicker color={color3} onChange={type3ColorHandler} />
          </div>
        ) : null}
      </Space>
      <Button size="small" style={{ fontSize: "0.8rem" }} onClick={handleSubmit}>
        적용하기
      </Button>
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
