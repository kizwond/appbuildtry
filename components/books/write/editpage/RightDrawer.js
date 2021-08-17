import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import CardTypeSettingModal from '../../../../components/books/write/cardtype/CardTypeSettingModal'
import CardSetting from './cardtype/CardTypeSetting';
import CardtypeContainer from '../../write/editpage/cardtype/CardtypeContainer'
const RightDrawer = ({book_id}) => {
    const [visible, setVisible] = useState(false);
  
    const showDrawer = () => {
      setVisible(true);
    };
  
    const onClose = () => {
      setVisible(false);
    };
  
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
        >
           <CardTypeSettingModal book_id={book_id}/>
           <CardSetting book_id={book_id}/>
           <CardtypeContainer />
        </Drawer>
      </>
    );
  };
  
  export default RightDrawer;