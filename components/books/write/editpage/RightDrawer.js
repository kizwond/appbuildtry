import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import CardTypeSettingModal from '../../../../components/books/write/cardtype/CardTypeSettingModal'

const RightDrawer = () => {
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
           <CardTypeSettingModal/>
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Drawer>
      </>
    );
  };
  
  export default RightDrawer;