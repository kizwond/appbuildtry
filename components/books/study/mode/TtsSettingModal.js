import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";
import { GetCardTypeSet } from "../../../../graphql/query/cardtype";
import { useMutation, useLazyQuery } from "@apollo/client";

const TtsSettingModal = ({ sessionScope }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [bookIds, setBookIds] = useState();

  const [counter, setCounter] = useState(0);
  const [isOnProcessing, setIsOnProcessing] = useState(true);
  const [cardTypeSets, setCardTypeSets] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const [cardtypeset_getbymybookid, { loading, error, data }] = useLazyQuery(GetCardTypeSet, {
    onCompleted: onCompletedGetCardSet,
  });

  function onCompletedGetCardSet() {
    console.log("onCompletedGetCardSet", data);

    if (counter == 0) {
        console.log("0000000000000000")
    //   setCardTypeSets(data.cardtypeset_getbymybookid.cardtypesets[0]);
      console.log("11111111111111111")
    } else {
        console.log("2222222222222222222222")
        // setCardTypeSets([...cardTypeSets, data.cardtypeset_getbymybookid.cardtypesets[0]]);
    }
    console.log(counter)
    console.log(bookIds.length-1)
    if (counter < bookIds.length - 1) {
      console.log("카운터설정");
      console.log(counter)
      setCounter((prev) => prev + 1);
    } else{
        console.log("after")
        setIsOnProcessing(false);
        setCounter(0);
        console.log("end")
    }
    // console.log(cardTypeSets);
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
      console.log('counter:',counter)
      console.log(value.length -1)
      if(counter == 0 && isOnProcessing === true){
        cardtypeset_getbymybookid({ variables: { mybook_id: value[counter] } });
        console.log("1")
      } else if(value.length - 1 > counter > 0 && isOnProcessing === true) {
        cardtypeset_getbymybookid({ variables: { mybook_id: value[counter] } });
        console.log("2")
      } else if(value.length - 1 == counter && isOnProcessing === true){
          console.log("here")
        cardtypeset_getbymybookid({ variables: { mybook_id: value[counter] } });
        console.log("3")
      } else if(value.length - 1 < counter){
        console.log("끝")
        return
      }
      
      setBookIds(value);
    }
  }, [sessionScope,cardtypeset_getbymybookid,counter,isOnProcessing]);



  return (
    <>
      <Button type="primary" onClick={showModal}>
        읽어주기설정
      </Button>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Some contents...</p>
        <p>Some contentsㄹㄹㄹㄹㄹㄹ...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default TtsSettingModal;
