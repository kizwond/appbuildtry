import React, { useState, useEffect, Fragment } from "react";
import { GetCardType } from "../../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { Form, Input, Button, Radio, Select, Cascader, DatePicker, InputNumber, TreeSelect, Switch } from "antd";
import { GetCardTypeSet } from "../../../../../graphql/query/cardtype";

const CardSetting = ({ book_id, handleChange }) => {
  const [cardTypes, setCardTypes] = useState([]);
  const [cardTypeId, setCardTypeId] = useState();
  const [mybook_id, setMybook_id] = useState(book_id);
  const [card_direction, setCard_direction] = useState();
  const [cardTypeSetId, setCardTypeSetId] = useState();
  const { loading, error, data } = useQuery(GetCardTypeSet, {
    variables: { mybook_id: mybook_id },
  });

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");
 
    if (data) {
        console.log("cardtypesetting page",data)
        if(data.cardtypeset_getbymybookid.cardtypesets[0] !== null){
          setCardTypeSetId(data.cardtypeset_getbymybookid.cardtypesets[0]._id);
          setCardTypes(data.cardtypeset_getbymybookid.cardtypesets[0].cardtypes);
        }
    }
  }, [data]);

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
  function selectTypeHandeler(value) {
    console.log(cardTypes)
    const cardType = cardTypes.filter(item=>{
      if(item._id === value){
        return item
      }
    })
    console.log(cardType)
    setCardTypeId(value);
    handleChange(value, cardTypeSetId, cardType )
  }

  return (
    <div>
      <div>카드타입선택</div>

      <Select defaultValue="default" style={{ width: 120 }} onChange={selectTypeHandeler}>
        <Select.Option value="default">카드타입선택</Select.Option>
        {cardTypesOption}
      </Select> 
    </div>
  );
};

export default CardSetting;

