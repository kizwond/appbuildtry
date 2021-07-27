import { all, delay, put, fork, takeLatest } from 'redux-saga/effects';
import {
  ADD_BOOK_ID_IN_CART_REQUEST,
  ADD_BOOK_ID_IN_CART_FAILURE,
  ADD_BOOK_ID_IN_CART_SUCCESS,
  DELETE_BOOK_ID_IN_CART_REQUEST,
  DELETE_BOOK_ID_IN_CART_FAILURE,
  DELETE_BOOK_ID_IN_CART_SUCCESS,
} from '../reducers/cart';

// function addBookIdInCartAPI(data) {
//   // eslint-disable-next-line quotes
//   return axios.post("/api/post/addbookidincart", data);
// }
function* addBookIdInCart(action) {
  try {
    yield delay(1000);
    // const result = yield call(addBookIdInCartAPI, action.data);
    yield put({
      type: ADD_BOOK_ID_IN_CART_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: ADD_BOOK_ID_IN_CART_FAILURE,
      data: error.response.data,
    });
  }
}
function* watchAddBookIdInCart() {
  yield takeLatest(ADD_BOOK_ID_IN_CART_REQUEST, addBookIdInCart);
}

function* deleteBookIdInCart(action) {
  try {
    yield delay(1000);
    // const result = yield call(deleteBookIdInCartAPI, action.data);
    yield put({
      type: DELETE_BOOK_ID_IN_CART_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: DELETE_BOOK_ID_IN_CART_FAILURE,
      data: error.response.data,
    });
  }
}
function* watchDeleteBookIdInCart() {
  yield takeLatest(DELETE_BOOK_ID_IN_CART_REQUEST, deleteBookIdInCart);
}

export default function* CartSaga() {
  yield all([fork(watchAddBookIdInCart), fork(watchDeleteBookIdInCart)]);
}
