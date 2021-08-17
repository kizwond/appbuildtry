import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { UpdateCardType } from "../../../../../graphql/query/cardtype";

const CardSetting = ({ book_id }) => {
  const [cardTypes, setCardTypes] = useState([]);
  const [cardTypeId, setCardTypeId] = useState();
  const [card_direction, setCard_direction] = useState();
  const [initialValues, setInitialValues] = useState({ "left_face_ratio": 0 });
  const { loading, error, data } = useQuery(GetCardType, {
    variables: { mybook_id: book_id },
  });

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");

    if (data) {
      console.log(data.cardtype_get.cardtypes);
      setCardTypes(data.cardtype_get.cardtypes);
    }
  }, [data]);

  const [cardtype_updateDetail] = useMutation(UpdateCardType, { onCompleted: afterupdatemutation });

  function afterupdatemutation(data) {
    console.log("data", data);
    setCategory(data.mybookcate_changeorder.mybookcates);
  }

  async function updatecardtype(values) {
    try {
      await cardtype_updateDetail({
        variables: {
          forUpdateCardtypeDetail: {
            cardtype_id: cardtype_id,
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
                    type: values.type_top,
                    thickness: values.thickness_top,
                    color: values.color_top,
                  },
                  bottom: {
                    type: values.type_bottom,
                    thickness: values.thickness_bottom,
                    color: values.color_bottom,
                  },
                  left: {
                    type: values.type_left,
                    thickness: values.thickness_left,
                    color: values.color_left,
                  },
                  right: {
                    type: values.type_right,
                    thickness: values.thickness_right,
                    color: values.color_right,
                  },
                },
              },
            },
            face_style: {
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
                  type: border_type,
                  thickness: border_thickness,
                  color: border_color,
                },
                bottom: {
                  type: border_type,
                  thickness: border_thickness,
                  color: border_color,
                },
                left: {
                  type: border_type,
                  thickness: border_thickness,
                  color: border_color,
                },
                right: {
                  type: border_type,
                  thickness: border_thickness,
                  color: border_color,
                },
              },
            },
            row_style: {
              maker_flag: {
                background_color: background_color,
                outer_margin: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                inner_padding: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                border: {
                  top: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  bottom: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  left: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  right: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                },
              },
              face1: {
                background_color: background_color,
                outer_margin: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                inner_padding: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                border: {
                  top: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  bottom: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  left: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  right: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                },
              },
              selection: {
                background_color: background_color,
                outer_margin: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                inner_padding: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                border: {
                  top: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  bottom: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  left: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  right: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                },
              },
              face2: {
                background_color: background_color,
                outer_margin: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                inner_padding: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                border: {
                  top: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  bottom: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  left: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  right: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                },
              },
              annotation: {
                background_color: background_color,
                outer_margin: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                inner_padding: {
                  top: outer_margin_top,
                  bottom: outer_margin_bottom,
                  left: outer_margin_left,
                  right: outer_margin_right,
                },
                border: {
                  top: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  bottom: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  left: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                  right: {
                    type: border_type,
                    thickness: border_thickness,
                    color: border_color,
                  },
                },
              },
            },
            row_font: {
              maker_flag: {
                font: maker_flag_font,
                size: maker_flag_size,
                color: maker_flag_color,
                align: maker_flag_align,
                bold: maker_flag_bold,
                italic: maker_flag_italic,
                underline: maker_flag_underline,
              },
              face1: {
                font: face1_font,
                size: face1_size,
                color: face1_color,
                align: face1_align,
                bold: face1_bold,
                italic: face1_italic,
                underline: face1_underline,
              },
              selection: {
                font: selection_font,
                size: selection_size,
                color: selection_color,
                align: selection_align,
                bold: selection_bold,
                italic: selection_italic,
                underline: selection_underline,
              },
              face2: {
                font: face2_font,
                size: face2_size,
                color: face2_color,
                align: face2_align,
                bold: face2_bold,
                italic: face2_italic,
                underline: face2_underline,
              },
              annotation: {
                font: annotation_font,
                size: annotation_size,
                color: annotation_color,
                align: annotation_align,
                bold: annotation_bold,
                italic: annotation_italic,
                underline: annotation_underline,
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

  if (cardTypes.length > 0) {
    console.log("뭔가있음");
    var cardTypesOption = cardTypes.map((cardType) => {
      return (
        <React.Fragment key={cardType._id}>
          <Select.Option value={cardType._id}>{cardType.cardtype_info.name}</Select.Option>
        </React.Fragment>
      );
    });
  }
  function handleChange(value) {
    console.log(`selected ${value}`);
    setCardTypeId(value);
    const initialValues = {
      "left_face_ratio": 10,
    };
    setCard_direction("left-right");
  }
  useEffect(() => {
    console.log("card_direction");

    if (card_direction) {
      console.log(card_direction);
    }
  }, [card_direction]);

  return (
    <div>
      <div>카드타입선택</div>

      <Select defaultValue="default" style={{ width: 120 }} onChange={handleChange}>
        <Select.Option value="default">카드타입선택</Select.Option>
        {cardTypesOption}
      </Select>
      <div>카드설정</div>
      
        
    </div>
  );
};

export default CardSetting;
