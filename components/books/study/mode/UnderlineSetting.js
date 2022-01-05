import React, { useState, useEffect, Fragment } from "react";
import { CompactPicker } from "react-color";
import { useQuery, useMutation } from "@apollo/client";
import { Input, Space, Button, Radio, Select, Divider, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateStudyTool } from "../../../../graphql/mutation/studyUtils";
const { Option } = Select;

const UnderlineSetting = ({ cardTypeSets, updateStudyToolApply }) => {
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

  const [thickness1, setThickness1] = useState();
  const [thickness2, setThickness2] = useState();
  const [thickness3, setThickness3] = useState();
  const [thickness4, setThickness4] = useState();
  const [thickness5, setThickness5] = useState();

  const [lineType1, setLineType1] = useState();
  const [lineType2, setLineType2] = useState();
  const [lineType3, setLineType3] = useState();
  const [lineType4, setLineType4] = useState();
  const [lineType5, setLineType5] = useState();

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

  const thicknessHandler1 = (e) => {
    setThickness1(e);
  };
  const thicknessHandler2 = (e) => {
    setThickness2(e);
  };
  const thicknessHandler3 = (e) => {
    setThickness3(e);
  };
  const thicknessHandler4 = (e) => {
    setThickness4(e);
  };
  const thicknessHandler5 = (e) => {
    setThickness5(e);
  };

  const lineTypeHandler1 = (e) => {
    setLineType1(e);
  };
  const lineTypeHandler2 = (e) => {
    setLineType2(e);
  };
  const lineTypeHandler3 = (e) => {
    setLineType3(e);
  };
  const lineTypeHandler4 = (e) => {
    setLineType4(e);
  };
  const lineTypeHandler5 = (e) => {
    setLineType5(e);
  };

  const handleSubmit = () => {
    var sendValue = [
      { attr1: thickness1, attr2: lineType1, color: color1 },
      { attr1: thickness2, attr2: lineType2, color: color2 },
      { attr1: thickness3, attr2: lineType3, color: color3 },
      { attr1: thickness4, attr2: lineType4, color: color4 },
      { attr1: thickness5, attr2: lineType5, color: color5 },
    ];

    console.log(sendValue);
    updatestudytool(sendValue);
  };

  useEffect(() => {
    if (cardTypeSets) {
      console.log(cardTypeSets);
      const underlineSetting = cardTypeSets[0].studyTool.underline;
      setCardTypeSetId(cardTypeSets[0]._id);
      setColor1(underlineSetting[0].color);
      setColor2(underlineSetting[1].color);
      setColor3(underlineSetting[2].color);
      setColor4(underlineSetting[3].color);
      setColor5(underlineSetting[4].color);
      setThickness1(underlineSetting[0].attr1);
      setThickness2(underlineSetting[1].attr1);
      setThickness3(underlineSetting[2].attr1);
      setThickness4(underlineSetting[3].attr1);
      setThickness5(underlineSetting[4].attr1);
      setLineType1(underlineSetting[0].attr2);
      setLineType2(underlineSetting[1].attr2);
      setLineType3(underlineSetting[2].attr2);
      setLineType4(underlineSetting[3].attr2);
      setLineType5(underlineSetting[4].attr2);
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
            effectType: "underline",
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
      <Space direction="vertical">
        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "220px", alignItems: "center" }}>
            <Button size="small" onClick={handleClick1} style={{ width: "80px", fontSize: "0.8rem", background: color1 }}>
              Color
            </Button>
            {displayColorPicker1 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose1} />
                <CompactPicker color={color1} onChange={type1ColorHandler} />
              </div>
            ) : null}
            <InputNumber size="small" style={{ width: "50px", fontSize: "0.8rem" }} value={thickness1} onChange={thicknessHandler1} />
            <Select size="small" value={lineType1} style={{ width: 75, fontSize: "0.8rem" }} onChange={lineTypeHandler1}>
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
          </div>
          <div style={{ fontSize: "0.8rem", display: "inline-block", borderBottom: `${thickness1}px ${lineType1} ${color1}` }}>ex. 밑줄긋기 예시 입니다~~~</div>
        </div>

        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "220px", alignItems: "center" }}>
            <Button size="small" onClick={handleClick2} style={{ width: "80px", fontSize: "0.8rem", background: color2 }}>
              Color
            </Button>
            {displayColorPicker2 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose2} />
                <CompactPicker color={color2} onChange={type2ColorHandler} />
              </div>
            ) : null}
            <InputNumber size="small" style={{ width: "50px", fontSize: "0.8rem" }} value={thickness2} onChange={thicknessHandler2} />
            <Select size="small" value={lineType2} style={{ width: 75, fontSize: "0.8rem" }} onChange={lineTypeHandler2}>
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
          </div>
          <div style={{ fontSize: "0.8rem", display: "inline-block", borderBottom: `${thickness2}px ${lineType2} ${color2}` }}>ex. 밑줄긋기 예시 입니다~~~</div>
        </div>

        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "220px", alignItems: "center" }}>
            <Button size="small" onClick={handleClick3} style={{ width: "80px", fontSize: "0.8rem", background: color3 }}>
              Color
            </Button>
            {displayColorPicker3 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose3} />
                <CompactPicker color={color3} onChange={type3ColorHandler} />
              </div>
            ) : null}
            <InputNumber size="small" style={{ width: "50px", fontSize: "0.8rem" }} value={thickness3} onChange={thicknessHandler3} />
            <Select size="small" value={lineType3} style={{ width: 75, fontSize: "0.8rem" }} onChange={lineTypeHandler3}>
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
          </div>
          <div style={{ fontSize: "0.8rem", display: "inline-block", borderBottom: `${thickness3}px ${lineType3} ${color3}` }}>ex. 밑줄긋기 예시 입니다~~~</div>
        </div>

        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "220px", alignItems: "center" }}>
            <Button size="small" onClick={handleClick4} style={{ width: "80px", fontSize: "0.8rem", background: color4 }}>
              Color
            </Button>
            {displayColorPicker4 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose4} />
                <CompactPicker color={color4} onChange={type4ColorHandler} />
              </div>
            ) : null}
            <InputNumber size="small" style={{ width: "50px", fontSize: "0.8rem" }} value={thickness4} onChange={thicknessHandler4} />
            <Select size="small" value={lineType4} style={{ width: 75, fontSize: "0.8rem" }} onChange={lineTypeHandler4}>
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
          </div>
          <div style={{ fontSize: "0.8rem", display: "inline-block", borderBottom: `${thickness4}px ${lineType4} ${color4}` }}>ex. 밑줄긋기 예시 입니다~~~</div>
        </div>

        <div style={{ marginBottom: "5px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", width: "220px", alignItems: "center" }}>
            <Button size="small" onClick={handleClick5} style={{ width: "80px", fontSize: "0.8rem", background: color5 }}>
              Color
            </Button>
            {displayColorPicker5 ? (
              <div style={popover}>
                <div style={cover} onClick={handleClose5} />
                <CompactPicker color={color5} onChange={type5ColorHandler} />
              </div>
            ) : null}
            <InputNumber size="small" style={{ width: "50px", fontSize: "0.8rem" }} value={thickness5} onChange={thicknessHandler5} />
            <Select size="small" value={lineType5} style={{ width: 75, fontSize: "0.8rem" }} onChange={lineTypeHandler5}>
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
          </div>
          <div style={{ fontSize: "0.8rem", display: "inline-block", borderBottom: `${thickness5}px ${lineType5} ${color5}` }}>ex. 밑줄긋기 예시 입니다~~~</div>
        </div>
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
