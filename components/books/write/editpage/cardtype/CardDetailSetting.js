import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateCardType, GetCardTypeSet } from "../../../../../graphql/query/cardtype";
const { Option } = Select;
const CardDetailSetting = ({ cardTypeId, cardTypeSetId, cardTypeDetail }) => {
  const [cardType, setCardType] = useState([]);
  const [current_cardTypeId, set_current_CardTypeId] = useState();
  const [current_cardTypeSetId, set_current_CardTypeSetId] = useState();
  const [card_direction, set_card_direction] = useState();
  const [left_face_ratio, set_left_face_ratio] = useState();
  const [background_color, set_background_color] = useState();

  useEffect(() => {
    console.log("카드 디테일 세팅 화면 온");
    if (cardTypeId) {
      console.log("cardTypeId", cardTypeId);
      setCardType(cardTypeDetail[0].card_style)
      set_card_direction(cardTypeDetail[0].card_style.card_direction)
      set_left_face_ratio(cardTypeDetail[0].card_style.left_face_ratio)
      set_background_color(cardTypeDetail[0].card_style.details[0].background_color)
    }
  }, [cardTypeId,cardTypeDetail]);

  const [cardtypeset_updateDetail] = useMutation(UpdateCardType, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
  }

  async function updatecardtype(values) {
    try {
      await cardtypeset_updateDetail({
        variables: {
          forUpdateCardtypeDetail: {
            cardtype_id: cardTypeId,
            card_style: {
              card_direction: values.card_direction,
              left_face_ratio: values.left_face_ratio,
              details: {
                background_color: values.background_color,
                outer_margin: {
                  top: values.outer_margin_top,
                  bottom: values.outer_margin_bottom,
                  left: values.outer_margin_left,
                  right: values.outer_margin_right,
                },
                inner_padding: {
                  top: values.inner_padding_top,
                  bottom: values.inner_padding_bottom,
                  left: values.inner_padding_left,
                  right: values.inner_padding_right,
                },
                border: {
                  top: {
                    type: values.border_type,
                    thickness: values.border_thickness,
                    color: values.border_color,
                  },
                  bottom: {
                    type: values.border_type,
                    thickness: values.border_thickness,
                    color: values.border_color,
                  },
                  left: {
                    type: values.border_type,
                    thickness: values.border_thickness,
                    color: values.border_color,
                  },
                  right: {
                    type: values.border_type,
                    thickness: values.border_thickness,
                    color: values.border_color,
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
  const onFinish = (values) => {
    console.log("Success:", values);
    // updatecardtype(values);
  };

  const directionHandler = (e) => {
      console.log(e)
      set_card_direction(e)
  }
  const leftFaceRatioHandler = (e) => {
      console.log(e)
      set_left_face_ratio(e)
  }
  const backgroundColorHandler = (e) => {
      console.log(e.target.value)
      set_background_color(e.target.value)
  }
  return (
    <div>
      <div>카드설정</div>
      <ul>
        <li>
          <div>레이아웃</div>
          <div>방향</div>
          <Select value={card_direction} style={{ width: 120 }} onChange={directionHandler}>
            <Option value="left-right">좌우</Option>
            <Option value="top-bottom">위아래</Option>
          </Select>
          <div>1면 비율</div>
          <InputNumber value={left_face_ratio} onChange={leftFaceRatioHandler}/>
        </li>
        <li>
          <div>카드배경색</div>
          <input type="color" id="head" name="background_color" value={background_color} onChange={backgroundColorHandler}></input>
        </li>
        <li>
          <div>카드테두리바깥쪽여백</div>
          <div>
            <span>상</span>
            <InputNumber defaultValue="0" />
          </div>
          <div>
            <span>하</span>
            <InputNumber defaultValue="0" />
          </div>
          <div>
            <span>좌</span>
            <InputNumber defaultValue="0" />
          </div>
          <div>
            <span>우</span>
            <InputNumber defaultValue="0" />
          </div>
        </li>
        <li>
          <div>카드테두리안쪽여백</div>
          <div>
            <span>상</span>
            <InputNumber defaultValue="0" />
          </div>
          <div>
            <span>하</span>
            <InputNumber defaultValue="0" />
          </div>
          <div>
            <span>좌</span>
            <InputNumber defaultValue="0" />
          </div>
          <div>
            <span>우</span>
            <InputNumber defaultValue="0" />
          </div>
        </li>
        <li>
          <div>카드테두리</div>
          <div>
          <span>상</span><Select defaultValue="선택" style={{ width: 120 }}>
            <Option value="solid">solid</Option>
            <Option value="dashed">dashed</Option>
            <Option value="dotted">dotted</Option>
          </Select>
          <input type="color" id="head" name="background_color" value="#e66465"></input>
          <InputNumber defaultValue="0" />
          </div>
          <div>
          <span>하</span><Select defaultValue="선택" style={{ width: 120 }}>
            <Option value="solid">solid</Option>
            <Option value="dashed">dashed</Option>
            <Option value="dotted">dotted</Option>
          </Select>
          <input type="color" id="head" name="background_color" value="#e66465"></input>
          <InputNumber defaultValue="0" />
          </div>
          <div>
          <span>좌</span><Select defaultValue="선택" style={{ width: 120 }}>
            <Option value="solid">solid</Option>
            <Option value="dashed">dashed</Option>
            <Option value="dotted">dotted</Option>
          </Select>
          <input type="color" id="head" name="background_color" value="#e66465"></input>
          <InputNumber defaultValue="0" />
          </div>
          <div>
          <span>우</span><Select defaultValue="선택" style={{ width: 120 }}>
            <Option value="solid">solid</Option>
            <Option value="dashed">dashed</Option>
            <Option value="dotted">dotted</Option>
          </Select>
          <input type="color" id="head" name="background_color" value="#e66465"></input>
          <InputNumber defaultValue="0" />
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CardDetailSetting;
