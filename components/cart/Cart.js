import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import produce from 'immer';
import { Checkbox, Col, Row, Button } from '../../node_modules/antd/lib/index';
import CartItem from './CartItem';
import { updateBooksInCart } from '../../redux/reducers/cart';
import ExampleCheckbox from './ExampleCheckbox';

const Cart = () => {
  const dispatch = useDispatch();
  const { booksInCart, deleteBookInCartLoading } = useSelector(
    (state) => state.cart
  );
  const [checkedBooks, setCheckedBooks] = useState([]);

  useEffect(() => {
    setCheckedBooks(booksInCart);
    console.log('카트랜더링');
  }, [booksInCart]);

  const BooksChecked = checkedBooks.filter((book) => book !== '');

  const handleChangeCheckedBooks = useCallback(
    (e, book, _index) => {
      if (e.target.checked) {
        setCheckedBooks(
          produce(checkedBooks, (draft) => {
            draft.splice(_index, 1, book);
          })
        );
      } else {
        setCheckedBooks(
          produce(checkedBooks, (draft) => {
            draft.splice(_index, 1, '');
          })
        );
      }
    },
    [checkedBooks]
  );
  const updateCheckedBooks = useCallback((books_in_cart) => {
    setCheckedBooks(books_in_cart);
  }, []);

  const handleChangeAllCheckedBooks = useCallback(() => {
    if (!checkedBooks.includes('')) {
      updateCheckedBooks((checkedBooks) => checkedBooks.map(() => ''));
    } else {
      updateCheckedBooks(booksInCart);
    }
  }, [booksInCart,checkedBooks,updateCheckedBooks]);

  const handleDeleteAllCheckedBooks = useCallback(() => {
    let willBeUpdatedBooksInCart = checkedBooks.map((book, index) => {
      if (book == '') {
        return booksInCart[index];
      } else {
        return '';
      }
    });
    let NewCheckedBooks = willBeUpdatedBooksInCart.map((book) => '');
    dispatch(
      updateBooksInCart(willBeUpdatedBooksInCart.filter((book) => book !== ''))
    );
    setCheckedBooks(NewCheckedBooks);
  }, [booksInCart,checkedBooks,dispatch]);

  return (
    <CartWrapper>
      <CartArea>
        <CartTitleWrapper>카트</CartTitleWrapper>
        <button onClick={() => console.log(checkedBooks)}>체크박스확인</button>
        <CartTableWarpper>
          <CartHeaderWarpper>
            <Checkbox
              checked={BooksChecked.length == booksInCart.length}
              indeterminate={
                BooksChecked.length > 0 &&
                BooksChecked.length !== booksInCart.length
              }
              onChange={handleChangeAllCheckedBooks}
              style={{ marginRight: '10px' }}
            />
            {checkedBooks.includes('') ? '전체 선택' : '전체 해제'}
            {BooksChecked.length > 0 ? (
              <Button
                onClick={handleDeleteAllCheckedBooks}
                style={{ marginLeft: '30px' }}
              >
                선택된 책 카트에서 삭제
              </Button>
            ) : null}
          </CartHeaderWarpper>
          <ul style={{ listStyle: 'none', paddingInlineStart: '0px' }}>
            {booksInCart.map((book, index) => (
              <CartItem
                key={book._id}
                handleChangeCheckedBooks={handleChangeCheckedBooks}
                updateCheckedBooks={updateCheckedBooks}
                checkedBooks={checkedBooks}
                deleteBookInCartLoading={deleteBookInCartLoading}
                book={book}
                index={index}
              />
            ))}
          </ul>
        </CartTableWarpper>
      </CartArea>
      <ExampleCheckbox />
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
