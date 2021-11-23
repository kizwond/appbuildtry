import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button, Space, Divider } from "antd";
import CardTypeSetting from "./cardtype/CardTypeSetting";
import CardtypeContainer from "../../write/editpage/cardtype/CardtypeContainer";
import { GetCardRelated } from "../../../../graphql/query/allQuery";
import { useQuery, useMutation } from "@apollo/client";
import { FlagOutlined } from "@ant-design/icons";


const M_FlagSettingDrawer = () => {
  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var book_id = localStorage.getItem("book_id");
    console.log(book_id);
    if (book_id !== null) {
      localStorage.removeItem("book_id");
      localStorage.setItem("book_id", book_id);
    } else {
      localStorage.setItem("book_id", book_id);
    }
  }
  const [visible, setVisible] = useState(false);
  const [cardTypeId, setCardTypeId] = useState();
  const [cardTypeSetId, setCardTypeSetId] = useState();
  const [cardTypeDetail, setCardTypeDetail] = useState();

  const [cardTypes, setCardTypes] = useState([]);
  const { loading, error, data } = useQuery(GetCardRelated, {
    variables: { mybook_ids: book_id },
  });

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남??");
    if (data) {
      console.log("cardtypesetting page", data);
      if (data.cardtypeset_getbymybookids.cardtypesets[0] !== null) {
        setCardTypeSetId(data.cardtypeset_getbymybookids.cardtypesets[0]._id);
        setCardTypes(data.cardtypeset_getbymybookids.cardtypesets[0].cardtypes);
      }
    }
  }, [data]);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  function handleChange(value, cardType) {
    console.log("cardTypeId", value);
    console.log("cardTypeSetId", cardTypeSetId);
    console.log("cardType", cardType);
    setCardTypeId(value);
    setCardTypeSetId(cardTypeSetId);
    setCardTypeDetail(cardType);
  }

  function getUpdatedCardTypeList(cardTypes) {
    setCardTypes(cardTypes);
    console.log("기존", cardTypeDetail);
    console.log("업데이트 할 전체", cardTypes);
    const prevCardTypeId = cardTypeDetail[0]._id;
    const cardType = cardTypes.filter((item) => {
      if (item._id === prevCardTypeId) {
        return item;
      }
    });
    setCardTypeDetail(cardType);
  }

  return (
    <>
      <FlagOutlined style={{fontSize:"1.2rem"}} onClick={showDrawer}/>
      <Drawer
        title={
          <>
            <span style={{ fontSize: "1rem", fontWeight: "700" }}>플래그 세팅</span>
          </>
        }
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
        mask={true}
        width={250}
      >
          <div>플래그 세팅</div>
      </Drawer>
    </>
  );
};

export default M_FlagSettingDrawer;
