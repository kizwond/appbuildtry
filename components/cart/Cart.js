import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { Checkbox, Col, Row, Button } from '../../node_modules/antd/lib/index';

const Cart = () => {
  const { booksInCart } = useSelector((state) => state.cart);
  const [checkedBooks, setCheckedBooks] = useState(booksInCart);
  return (
    <CartWrapper>
      <CartArea>
        <CartTitleWrapper>카트</CartTitleWrapper>
        <CartTableWarpper>
          <CartHeaderWarpper>
            <Checkbox />
            {booksInCart.length > checkedBooks.length
              ? ' 전체 해제'
              : '전체 선택'}
            {checkedBooks.length > 0 ? (
              <Button loading={true} style={{ marginLeft: '30px' }}>
                선택된 책 카트에서 삭제
              </Button>
            ) : null}
          </CartHeaderWarpper>
        </CartTableWarpper>
      </CartArea>
    </CartWrapper>
  );
};

export default Cart;

const CartWrapper = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 15px 0 20px;
`;

const CartArea = styled.div`
  margin-top: 25;
`;

const CartTitleWrapper = styled.div`
  padding-bottom: 20;
  font-size: 20px;
  font-weight: bold;
`;

const CartTableWarpper = styled.div`
  border: 1px solid #d1d5d9;
  padding: 15px;
`;

const CartHeaderWarpper = styled.div`
  font-size: 20px;
  font-weight: bold;
  padding-bottom: 8px;
  border-bottom: 1px solid #d1d5d9;
`;
