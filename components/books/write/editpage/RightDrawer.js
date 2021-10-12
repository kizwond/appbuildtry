import React, { useState, useEffect, Fragment } from "react";
import { Drawer, Button } from "antd";
import CardTypeSettingModal from "../../../../components/books/write/cardtype/CardTypeSettingModal";
import CardTypeSetting from "./cardtype/CardTypeSetting";
import CardtypeContainer from "../../write/editpage/cardtype/CardtypeContainer";
import { GetCardTypeSet } from "../../../../graphql/query/cardtype";
import { useQuery, useMutation } from "@apollo/client";
import { SettingOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};
const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};

const RightDrawer = () => {
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
  const { loading, error, data } = useQuery(GetCardTypeSet, {
    variables: { mybook_id: book_id },
  });

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남??");
    if (data) {
      console.log("cardtypesetting page", data);
      if (data.cardtypeset_getbymybookid.cardtypesets[0] !== null) {
        setCardTypeSetId(data.cardtypeset_getbymybookid.cardtypesets[0]._id);
        setCardTypes(data.cardtypeset_getbymybookid.cardtypesets[0].cardtypes);
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
      <Desktop>
        <Button type="primary" onClick={showDrawer}>
          카드설정
        </Button>
      </Desktop>
      <Tablet>
        <SettingOutlined onClick={showDrawer}/>
      </Tablet>
      <Mobile>
        <SettingOutlined onClick={showDrawer}/>
      </Mobile>
      <Drawer title="카드설정" placement="right" closable={true} onClose={onClose} visible={visible} mask={false} width={400}>
        <CardTypeSettingModal book_id={book_id} getUpdatedCardTypeList={getUpdatedCardTypeList} />
        <CardTypeSetting cardTypes={cardTypes} book_id={book_id} handleChange={handleChange} />
        <CardtypeContainer cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail} getUpdatedCardTypeList={getUpdatedCardTypeList} />
      </Drawer>
    </>
  );
};

export default RightDrawer;
