import React, { useState } from 'react';
import { Button, Checkbox } from 'antd';
import { useDispatch } from 'react-redux';
import { deleteBookInCart } from '../../redux/reducers/cart';

const CartItem = ({
  checkedBooks,
  handleChangeCheckedBooks,
  deleteBookInCartLoading,
  book,
  index,
  updateCheckedBooks,
}) => {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState('');

  return (
    <li
      key={book._id}
      style={{
        display: 'flex',
        padding: '15px 0 15px 0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Checkbox
          checked={checkedBooks.map((_book) => _book._id).includes(book._id)}
          style={{ marginRight: '10px' }}
          onChange={(e) => {
            handleChangeCheckedBooks(e, book, index);
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
          // width: '400px',
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
            loading={book._id === deletingId && deleteBookInCartLoading}
            onClick={() => {
              // this.props.onDeleteBookFromCart(book._id);
              dispatch(deleteBookInCart(book._id));
              setDeletingId(book._id);
              updateCheckedBooks(
                checkedBooks.filter((_book) => _book._id !== book._id)
              );
            }}
          >
            삭제
          </Button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          // width: '200px',
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
  );
};

export default React.memo(CartItem);
