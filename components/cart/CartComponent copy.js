import React, { useCallback, useState } from 'react';
import { Button, Checkbox } from 'antd';
import styled from 'styled-components'
// 체크박스는 state로
// 카트 아이템은 리덕스 미들웨어로 처리

const CartList = styled`

`

const CartComponent = ({ cart, deleteItem }) => {
  const checkedItem = cart.map((item) => item._id);
  const [checkItem, setCheckItem] = useState(checkedItem);

  const onChangeCheckbox = useCallback(
    (e, params) => {
      if (e.target.checked) {
        let newCheckItem = [...checkItem].concat(params);
        setCheckItem(() => newCheckItem.concat(params), console.log(checkItem));
        // this.props.onAddBookFromCheckedList(params);
        console.log(params, '등록');
      } else {
        console.log(params, '해제');
        setCheckItem(
          () => checkItem.filter((item) => item !== params),
          console.log(checkItem)
        );
      }
    },
    [checkItem]
  );

  return (
   
        <li
          key={book._id}
          style={{ display: 'flex', padding: '15px 0 15px 0' }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox
              checked={checkItem.includes(book._id)}
              style={{ margin: '10px' }}
              onChange={(e) => {
                onChangeCheckbox(e, book._id);
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
      )
  );
};



export default CartComponent
