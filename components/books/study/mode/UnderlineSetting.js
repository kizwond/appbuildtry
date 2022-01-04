import React, { useState, useEffect, Fragment } from "react";
import { CompactPicker } from "react-color";
import { useQuery, useMutation } from "@apollo/client";
import { Input, Space, Button, Radio, Select, Divider, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateStudyTool } from "../../../../graphql/mutation/studyUtils";

const UnderlineSetting = ({ cardTypeSets, updateStudyToolApply }) => {
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

  const toolTypeHandler1 = (e) => {
    setToolType1(e);
  };
  const toolTypeHandler2 = (e) => {
    setToolType2(e);
  };
  const toolTypeHandler3 = (e) => {
    setToolType3(e);
  };

  const handleSubmit = () => {
    var sendValue = [
      { toolType: String(toolType1), color: color1 },
      { toolType: String(toolType2), color: color2 },
      { toolType: String(toolType3), color: color3 },
    ];

    console.log(sendValue);
    updatestudytool(sendValue);
  };

  useEffect(() => {
    if (cardTypeSets) {
      const underlineSetting = cardTypeSets[0].studyTool.underline;
      setCardTypeSetId(cardTypeSets[0]._id);
      setColor1(underlineSetting[0].color);
      setColor2(underlineSetting[1].color);
      setColor3(underlineSetting[2].color);
      setToolType1(underlineSetting[0].toolType);
      setToolType2(underlineSetting[1].toolType);
      setToolType3(underlineSetting[2].toolType);
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
            studyToolType: "underline",
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
      <Space direction="vertical">
        <Button size="small" onClick={handleClick1} style={{ width: "80px", fontSize: "0.8rem", background: color1 }}>
          Color
        </Button>

        <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={toolType1} onChange={toolTypeHandler1} />
        <div style={{ display: "inline-block", borderBottom: `${toolType1}px solid ${color1}` }}>밑줄긋기 예시 입니다~~~</div>
        {displayColorPicker1 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose1} />
            <CompactPicker color={color1} onChange={type1ColorHandler} />
          </div>
        ) : null}
        <Button size="small" onClick={handleClick2} style={{ width: "80px", fontSize: "0.8rem", background: color2 }}>
          Color
        </Button>

        <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={toolType2} onChange={toolTypeHandler2} />
        <div style={{ display: "inline-block", borderBottom: `${toolType2}px solid ${color2}` }}>밑줄긋기 예시 입니다~~~</div>
        {displayColorPicker2 ? (
          <div style={popover}>
            <div style={cover} onClick={handleClose2} />
            <CompactPicker color={color2} onChange={type2ColorHandler} />
          </div>
        ) : null}
        <Button size="small" onClick={handleClick3} style={{ width: "80px", fontSize: "0.8rem", background: color3 }}>
          Color
        </Button>

        <InputNumber size="small" style={{ fontSize: "0.8rem" }} value={toolType3} onChange={toolTypeHandler3} />
        <div style={{ display: "inline-block", borderBottom: `${toolType3}px solid ${color3}` }}>밑줄긋기 예시 입니다~~~</div>
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

export default UnderlineSetting;
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
