import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import CardTypeSettingModal from '../../../../components/books/write/cardtype/CardTypeSettingModal'
import CardTypeSetting from './cardtype/CardTypeSetting';
import CardtypeContainer from '../../write/editpage/cardtype/CardtypeContainer'
const RightDrawer = ({book_id}) => {
    const [visible, setVisible] = useState(false);
    const [cardTypeId, setCardTypeId] = useState();
    const [cardTypeSetId, setCardTypeSetId] = useState();
    const [cardTypeDetail, setCardTypeDetail] = useState();
    const showDrawer = () => {
      setVisible(true);
    };
  
    const onClose = () => {
      setVisible(false);
    };

    function handleChange(value, cardTypeSetId, cardType) {
      console.log("cardTypeId",value);
      console.log("cardTypeSetId",cardTypeSetId);
      console.log("cardType", cardType)
      setCardTypeId(value);
      setCardTypeSetId(cardTypeSetId)
      setCardTypeDetail(cardType)
    }

    return (
      <>
        <Button type="primary" onClick={showDrawer}>
          카드설정
        </Button>
        <Drawer
          title="카드설정"
          placement="right"
          closable={true}
          onClose={onClose}
          visible={visible}
          mask={false}
          width={400}
        >
           <CardTypeSettingModal book_id={book_id}/>
           <CardTypeSetting book_id={book_id} handleChange={handleChange}/>
           <CardtypeContainer cardTypeId={cardTypeId} cardTypeSetId={cardTypeSetId} cardTypeDetail={cardTypeDetail}/>
        </Drawer>
      </>
    );
  };
  
  export default RightDrawer;