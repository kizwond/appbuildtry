import React, { useCallback, useEffect, useState } from 'react';
import { Button, Checkbox } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { addBookIdInCart } from '../../redux/reducers/cart';

const CartComponent = () => {
  const dispatch = useDispatch();
  const booksInCart = useSelector((state) => state.cart.booksInCart);

  const checkedItem = booksInCart.map((item) => item._id);
  const [checkItem, setCheckItem] = useState(checkedItem);

  useEffect(() => {
    dispatch(addBookIdInCart(checkItem));
  }, [checkedItem]);

  const onChangeCheckbox = useCallback(
    (e, bookId, i) => {
      if (e.target.checked) {
        let newCheckItem = [...checkItem, bookId];
        setCheckItem(newCheckItem);
        // this.props.onAddBookFromCheckedList(bookId);
        console.log(bookId, '등록');
      } else {
        console.log(bookId, '해제');
        setCheckItem(checkItem.filter((item) => item !== bookId));
      }
    },
    [checkItem]
  );

  return (
    <>
      {booksInCart.map((book, i) => (
        <li
          key={book._id}
          style={{ display: 'flex', padding: '15px 0 15px 0' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={checkItem.includes(book._id)}
              style={{ margin: '10px' }}
              onChange={(e) => {
                onChangeCheckbox(e, book._id, i);
              }}
            />
          </div>
          <div>
            <img
              className="ThumbnailImage"
              src={book.book_info.bookcover.url_small}
              alt=""
              sizes="80px"
              style={{
                width: '80px',
                maxHeight: '114px',
              }}
            />
          </div>
          <div
            style={{
              width: '400px',
              marginLeft: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                fontSize: '22px',
                lineHeight: '22px',
                fontWeight: 'bold',
              }}
            >
              {book.book_info.title}
            </div>
            <div style={{ fontSize: '15px', color: 'darkgray' }}>
              {book.book_info.author}
            </div>
            <div style={{ marginBottom: '3px' }}>
              <Button
                onClick={() => {
                  // this.props.onDeleteBookFromCart(book._id);
                  deleteItem(book._id);
                }}
              >
                삭제
              </Button>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '200px',
            }}
          >
            <div
              style={{
                fontSize: '18px',
                color: 'royalblue',
                fontWeight: 'bold',
              }}
            >
              {isNaN(book.book_info.promotion.gap)
                ? '-'
                : book.book_info.promotion.gap}
            </div>
            <div
              style={{
                fontSize: '18px',
                color: 'royalblue',
                fontWeight: 'bold',
              }}
            >
              {Number(book.book_info.price).toLocaleString()} 원
            </div>
          </div>
        </li>
      ))}
    </>
  );
};

export default CartComponent;
