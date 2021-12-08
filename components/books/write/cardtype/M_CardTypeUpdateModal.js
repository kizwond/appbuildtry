import React, { useState, useEffect, useCallback } from "react";
import { Button, Modal, Input, Radio, InputNumber, Space, Divider } from "antd";
import axios from "axios";
import { QuestionCircleOutlined, PlusCircleOutlined, SettingOutlined } from "@ant-design/icons";
import { CardTypeCreate, CardTypeDelete } from "../../../../graphql/query/cardtype";
import { GetCardRelated } from "../../../../graphql/query/allQuery";
import { useMutation, useQuery } from "@apollo/client";

const NewCardTemplete = ({ book_id }) => {
  const [visible, setVisible] = useState(false);

  const [cardTypeSetId, setCardTypeSetId] = useState();

  const [cardTypes, setCardTypes] = useState();
  const { loading, error, data } = useQuery(GetCardRelated, {
    variables: { mybook_ids: book_id },
  });
  useEffect(() => {
    console.log("카드타입셋을 불러옴");
    if (data) {
      console.log("--->", data);
      setCardTypeSetId(data.cardtypeset_getbymybookids.cardtypesets[0]._id);
      setCardTypes(data.cardtypeset_getbymybookids.cardtypesets[0].cardtypes);
    } else {
      console.log("why here?");
    }
  }, [data]);

  const [cardtypeset_deletecardtype] = useMutation(CardTypeDelete, { onCompleted: showdatadelete });

  function showdatadelete(data) {
    console.log("data", data);
  }

  async function cardtypedelete(cardtype_id) {
    try {
      await cardtypeset_deletecardtype({
        variables: {
            cardtypeset_id:cardTypeSetId,
            cardtype_id: cardtype_id
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = (e) => {
    setVisible(false);
  };
  const handleCancel = (e) => {
    setVisible(false);
  };

  const deleteCardType = (cardtype_id) => {
    console.log(cardtype_id)
    cardtypedelete(cardtype_id)
  };

  if (cardTypes) {
    const cardTypesName = cardTypes.map((item) => {
        return (
            {name: item.cardtype_info.name, id : item._id}
        )
    });
    var cardTypeList = cardTypesName.map((item) => {
      return (
        <>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>{item.name}</div>
            {/* <Button size="small" style={{fontSize:"1rem"}}>이름변경</Button> */}
            <Button size="small" onClick={()=>deleteCardType(item.id)} style={{fontSize:"1rem"}}>삭제</Button>
          </div>
        </>
      );
    });
  }
  return (
    <>
      <SettingOutlined onClick={showModal} style={{ marginLeft: "7px", fontSize: "1.4rem", color: "grey" }} />
      <Modal title="카드템플릿 관리" footer={null} visible={visible} onOk={handleOk} onCancel={handleCancel} maskClosable={true} width={350}>
        <div>{cardTypeList}</div>
      </Modal>
    </>
  );
};

export default NewCardTemplete;
