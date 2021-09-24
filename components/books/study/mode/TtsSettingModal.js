import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { GetCardTypeSets } from "../../../../graphql/query/cardtype";
import { useQuery, useLazyQuery } from "@apollo/client";
import { Checkbox } from 'antd';

const TtsSettingModal = ({ sessionScope, onChangeTTS }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookIds, setBookIds] = useState();

  const [counter, setCounter] = useState(0);
  const [isOnProcessing, setIsOnProcessing] = useState(true);
  const [cardTypeSets, setCardTypeSets] = useState();
  const [rows, setRows] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { loading, error, data } = useQuery(GetCardTypeSets, {
    variables: { mybook_ids: bookIds },
    onCompleted: onCompletedGetCardSet,
  });

  function onCompletedGetCardSet() {
    console.log("onCompletedGetCardSet", data.cardtypeset_getbymybookids.cardtypesets);
    let cardtypes = []
    data.cardtypeset_getbymybookids.cardtypesets.map(item=>{
      item.cardtypes.map(type=>{
        cardtypes.push(type.cardtype_info.num_of_row)
      })
    })
    console.log(cardtypes)
    let array = [{face1: 0, face2:0}]
    cardtypes.map(item=>{
      if(item.face1 === array[0].face1){
        console.log("1")
      } else if(item.face1 > array[0].face1){
        console.log("2")
        array[0].face1 = item.face1
      }
      if(item.face2 === array[0].face2){
        console.log("3")
      } else if(item.face2 > array[0].face2){
        console.log("4")
        array[0].face2 = item.face2
      }
    })
    console.log(array)
    setRows(array)
  }
  useEffect(() => {
    console.log("===================ttsModal Page=====================");
    if (sessionScope) {
      console.log(sessionScope);

      var value = sessionScope.map((item) => {
        console.log(item.mybook_id);
        return item.mybook_id;
      });
      console.log(value);

      setBookIds(value);
    }
  }, [sessionScope]);
  if(rows){
    var face1_rows = []
    for (var i = 0; i < rows[0].face1 ; i++) {
      console.log(i)
      const face1_row = (<Checkbox onChange={onChangeTTS} value={`face1_row${i+1}`}>face1 row{i+1}</Checkbox> )
      face1_rows.push(face1_row)
    }
    var rows1 = face1_rows.map(item=>item)

    var face2_rows = []
    for (var i = 0; i < rows[0].face2 ; i++) {
      console.log(i)
      const face2_row = (<Checkbox onChange={onChangeTTS} value={`face2_row${i+1}`}>face2 row{i+1}</Checkbox> )
      face2_rows.push(face2_row)
    }
    var rows2 = face2_rows.map(item=>item)

  }
  
  return (
    <>
      <Button type="primary" onClick={showModal}>
        읽어주기설정
      </Button>
      <Modal title="읽어주기 설정" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        {rows1}
        {rows2}
        <button>적용하기</button>
      </Modal>
    </>
  );
};

export default TtsSettingModal;
