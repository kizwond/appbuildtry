import React, { useState, useEffect, Fragment } from "react";
import { Form, Input, Button, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect, Switch } from "antd";

const CardSetting = ({ book_id, handleChange, cardTypes }) => {

  const [cardTypeId, setCardTypeId] = useState();
  const [mybook_id, setMybook_id] = useState();
  const [card_direction, setCard_direction] = useState();
  const [cardTypeSetId, setCardTypeSetId] = useState();


  if (cardTypes.length > 0) {
    console.log("뭔가있음");
    var cardTypesOption = cardTypes.map((cardType) => {
      return (
        <React.Fragment key={cardType._id}>
          <Select.Option value={cardType._id} style={{fontSize:"0.8rem"}}>{cardType.cardtype_info.name}</Select.Option>
        </React.Fragment>
      );
    });
  }
  function selectTypeHandeler(value) {
    console.log(cardTypes)
    const cardType = cardTypes.filter(item=>{
      if(item._id === value){
        return item
      }
    })
    console.log(cardType)
    handleChange(value, cardType )
  }

  return (
    <div>
      <Select defaultValue="default" size="small" style={{ width: 120,fontSize:"0.8rem" }} onChange={selectTypeHandeler}>
        <Select.Option value="default" style={{fontSize:"0.8rem"}}>카드타입선택</Select.Option>
        {cardTypesOption}
      </Select> 
    </div>
  );
};

export default CardSetting;

