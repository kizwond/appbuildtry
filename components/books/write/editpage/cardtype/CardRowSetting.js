import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateCardType, GetCardTypeSet } from "../../../../../graphql/query/cardtype";
const { Option } = Select;

const CardFaceSetting = ({ cardTypeId, cardTypeSetId, cardTypeDetail }) => {
  const [cardType, setCardType] = useState([]);
  const [current_cardTypeId, set_current_CardTypeId] = useState();
  const [current_cardTypeSetId, set_current_CardTypeSetId] = useState();

  const [faceSelected, setFaceSelected] = useState("default");
  const [rowSelected, setRowSelected] = useState("default");

  const [background_color, set_background_color] = useState();

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

  const [border_top_color, set_border_top_color] = useState();
  const [border_bottom_color, set_border_bottom_color] = useState();
  const [border_left_color, set_border_left_color] = useState();
  const [border_right_color, set_border_right_color] = useState();

  useEffect(() => {
    console.log("카드 디테일 세팅 화면 온");
    if (cardTypeId) {
      console.log("cardTypeId", cardTypeId);
      setCardType(cardTypeDetail[0].cardtype_info.cardtype);
    }
  }, [cardTypeId, cardTypeDetail]);

  const [cardtypeset_updateDetail] = useMutation(UpdateCardType, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
  }

  async function updatecardtype() {
    try {
      await cardtypeset_updateDetail({
        variables: {
          forUpdateCardtypeDetail: {
            cardtype_id: cardTypeId,
            face_style: {
              details: {
                background_color: background_color,
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
                    type: border_top_type,
                    thickness: border_top_thickness,
                    color: border_top_color,
                  },
                  bottom: {
                    type: border_bottom_type,
                    thickness: border_bottom_thickness,
                    color: border_bottom_color,
                  },
                  left: {
                    type: border_left_type,
                    thickness: border_left_thickness,
                    color: border_left_color,
                  },
                  right: {
                    type: border_right_type,
                    thickness: border_right_thickness,
                    color: border_right_color,
                  },
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

  const backgroundColorHandler = (e) => set_background_color(e.target.value);

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

  const borderTopColorHandler = (e) => set_border_top_color(e);
  const borderBottomColorHandler = (e) => set_border_bottom_color(e);
  const borderLeftColorHandler = (e) => set_border_left_color(e);
  const borderRightColorHandler = (e) => set_border_right_color(e);

  const handleSubmit = () => updatecardtype();

  const selectFaceHandler = (e) => {
    console.log(e);
    setFaceSelected(e);
    if(e === "face1"){
        console.log("face1selected")
        console.log("cardTypeDetail : ",cardTypeDetail)
    } else if(e === "face2"){
        console.log("face2selected")
    }else if(e === "annotation"){
        console.log("face3selected")
    }
  };
  const selectRowHandler = (e) => {
    console.log(e);
    setRowSelected(e);
    if(e === "face1"){
        set_background_color(cardTypeDetail[0].face_style[0].background_color);

        set_outer_margin_top(cardTypeDetail[0].face_style[0].outer_margin.top);
        set_outer_margin_bottom(cardTypeDetail[0].face_style[0].outer_margin.bottom);
        set_outer_margin_left(cardTypeDetail[0].face_style[0].outer_margin.left);
        set_outer_margin_right(cardTypeDetail[0].face_style[0].outer_margin.right);
    
        set_inner_padding_top(cardTypeDetail[0].face_style[0].inner_padding.top);
        set_inner_padding_bottom(cardTypeDetail[0].face_style[0].inner_padding.bottom);
        set_inner_padding_left(cardTypeDetail[0].face_style[0].inner_padding.left);
        set_inner_padding_right(cardTypeDetail[0].face_style[0].inner_padding.right);
    
        set_border_top_type(cardTypeDetail[0].face_style[0].border.top.type);
        set_border_bottom_type(cardTypeDetail[0].face_style[0].border.bottom.type);
        set_border_left_type(cardTypeDetail[0].face_style[0].border.left.type);
        set_border_right_type(cardTypeDetail[0].face_style[0].border.right.type);
    
        set_border_top_thickness(cardTypeDetail[0].face_style[0].border.top.thickness);
        set_border_bottom_thickness(cardTypeDetail[0].face_style[0].border.bottom.thickness);
        set_border_left_thickness(cardTypeDetail[0].face_style[0].border.left.thickness);
        set_border_right_thickness(cardTypeDetail[0].face_style[0].border.right.thickness);
    
        set_border_top_color(cardTypeDetail[0].face_style[0].border.top.color);
        set_border_bottom_color(cardTypeDetail[0].face_style[0].border.bottom.color);
        set_border_left_color(cardTypeDetail[0].face_style[0].border.left.color);
        set_border_right_color(cardTypeDetail[0].face_style[0].border.right.color);
    } else if(e === "face2"){
        set_background_color(cardTypeDetail[0].face_style[1].background_color);

        set_outer_margin_top(cardTypeDetail[0].face_style[1].outer_margin.top);
        set_outer_margin_bottom(cardTypeDetail[0].face_style[1].outer_margin.bottom);
        set_outer_margin_left(cardTypeDetail[0].face_style[1].outer_margin.left);
        set_outer_margin_right(cardTypeDetail[0].face_style[1].outer_margin.right);
    
        set_inner_padding_top(cardTypeDetail[0].face_style[1].inner_padding.top);
        set_inner_padding_bottom(cardTypeDetail[0].face_style[1].inner_padding.bottom);
        set_inner_padding_left(cardTypeDetail[0].face_style[1].inner_padding.left);
        set_inner_padding_right(cardTypeDetail[0].face_style[1].inner_padding.right);
    
        set_border_top_type(cardTypeDetail[0].face_style[1].border.top.type);
        set_border_bottom_type(cardTypeDetail[0].face_style[1].border.bottom.type);
        set_border_left_type(cardTypeDetail[0].face_style[1].border.left.type);
        set_border_right_type(cardTypeDetail[0].face_style[1].border.right.type);
    
        set_border_top_thickness(cardTypeDetail[0].face_style[1].border.top.thickness);
        set_border_bottom_thickness(cardTypeDetail[0].face_style[1].border.bottom.thickness);
        set_border_left_thickness(cardTypeDetail[0].face_style[1].border.left.thickness);
        set_border_right_thickness(cardTypeDetail[0].face_style[1].border.right.thickness);
    
        set_border_top_color(cardTypeDetail[0].face_style[1].border.top.color);
        set_border_bottom_color(cardTypeDetail[0].face_style[1].border.bottom.color);
        set_border_left_color(cardTypeDetail[0].face_style[1].border.left.color);
        set_border_right_color(cardTypeDetail[0].face_style[1].border.right.color);
    }else if(e === "annotation"){
        set_background_color(cardTypeDetail[0].face_style[2].background_color);

        set_outer_margin_top(cardTypeDetail[0].face_style[2].outer_margin.top);
        set_outer_margin_bottom(cardTypeDetail[0].face_style[2].outer_margin.bottom);
        set_outer_margin_left(cardTypeDetail[0].face_style[2].outer_margin.left);
        set_outer_margin_right(cardTypeDetail[0].face_style[2].outer_margin.right);
    
        set_inner_padding_top(cardTypeDetail[0].face_style[2].inner_padding.top);
        set_inner_padding_bottom(cardTypeDetail[0].face_style[2].inner_padding.bottom);
        set_inner_padding_left(cardTypeDetail[0].face_style[2].inner_padding.left);
        set_inner_padding_right(cardTypeDetail[0].face_style[2].inner_padding.right);
    
        set_border_top_type(cardTypeDetail[0].face_style[2].border.top.type);
        set_border_bottom_type(cardTypeDetail[0].face_style[2].border.bottom.type);
        set_border_left_type(cardTypeDetail[0].face_style[2].border.left.type);
        set_border_right_type(cardTypeDetail[0].face_style[2].border.right.type);
    
        set_border_top_thickness(cardTypeDetail[0].face_style[2].border.top.thickness);
        set_border_bottom_thickness(cardTypeDetail[0].face_style[2].border.bottom.thickness);
        set_border_left_thickness(cardTypeDetail[0].face_style[2].border.left.thickness);
        set_border_right_thickness(cardTypeDetail[0].face_style[2].border.right.thickness);
    
        set_border_top_color(cardTypeDetail[0].face_style[2].border.top.color);
        set_border_bottom_color(cardTypeDetail[0].face_style[2].border.bottom.color);
        set_border_left_color(cardTypeDetail[0].face_style[2].border.left.color);
        set_border_right_color(cardTypeDetail[0].face_style[2].border.right.color);
    }
  };
  return (
    <div>
      <div>카드설정</div>
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
          <Select value={faceSelected} style={{ width: 120 }} onChange={selectRowHandler}>
            <Option value="default">행선택</Option>
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
          <div>행배경색</div>
          <input type="color" id="head" name="background_color" value={background_color} onChange={backgroundColorHandler}></input>
        </li>
        <li>
          <div>행테두리바깥쪽여백</div>
          <div>
            <span>상</span>
            <InputNumber value={outer_margin_top} onChange={outerMarginTopHandler} />
          </div>
          <div>
            <span>하</span>
            <InputNumber value={outer_margin_bottom} onChange={outerMarginBottomHandler} />
          </div>
          <div>
            <span>좌</span>
            <InputNumber value={outer_margin_left} onChange={outerMarginLeftHandler} />
          </div>
          <div>
            <span>우</span>
            <InputNumber value={outer_margin_right} onChange={outerMarginRightHandler} />
          </div>
        </li>
        <li>
          <div>행테두리안쪽여백</div>
          <div>
            <span>상</span>
            <InputNumber value={inner_padding_top} onChange={innerPaddingTopHandler} />
          </div>
          <div>
            <span>하</span>
            <InputNumber value={inner_padding_bottom} onChange={innerPaddingBottomHandler} />
          </div>
          <div>
            <span>좌</span>
            <InputNumber value={inner_padding_left} onChange={innerPaddingLeftHandler} />
          </div>
          <div>
            <span>우</span>
            <InputNumber value={inner_padding_right} onChange={innerPaddingRightHandler} />
          </div>
        </li>
        <li>
          <div>행테두리</div>
          <div>
            <span>상</span>
            <Select value={border_top_type} style={{ width: 120 }} onChange={borderTopTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            <input type="color" id="head" name="background_color" value={border_top_color} onChange={borderTopColorHandler}></input>
            <InputNumber value={border_top_thickness} onChange={borderTopThicknessHandler} />
          </div>
          <div>
            <span>하</span>
            <Select value={border_bottom_type} style={{ width: 120 }} onChange={borderBottomTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            <input type="color" id="head" name="background_color" value={border_bottom_color} onChange={borderBottomColorHandler}></input>
            <InputNumber value={border_bottom_thickness} onChange={borderBottomThicknessHandler} />
          </div>
          <div>
            <span>좌</span>
            <Select value={border_left_type} style={{ width: 120 }} onChange={borderLeftTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            <input type="color" id="head" name="background_color" value={border_left_color} onChange={borderLeftColorHandler}></input>
            <InputNumber value={border_left_thickness} onChange={borderLeftThicknessHandler} />
          </div>
          <div>
            <span>우</span>
            <Select value={border_right_type} style={{ width: 120 }} onChange={borderRightTypeHandler}>
              <Option value="solid">solid</Option>
              <Option value="dashed">dashed</Option>
              <Option value="dotted">dotted</Option>
            </Select>
            <input type="color" id="head" name="background_color" value={border_right_color} onChange={borderRightColorHandler}></input>
            <InputNumber value={border_right_thickness} onChange={borderRightThicknessHandler} />
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
