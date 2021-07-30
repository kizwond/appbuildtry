import { all, delay, put, fork, takeLatest } from 'redux-saga/effects';
import {
  ADD_BOOK_IN_CART_REQUEST,
  ADD_BOOK_IN_CART_FAILURE,
  ADD_BOOK_IN_CART_SUCCESS,
  DELETE_BOOK_IN_CART_REQUEST,
  DELETE_BOOK_IN_CART_FAILURE,
  DELETE_BOOK_IN_CART_SUCCESS,
  UPDATE_BOOKS_IN_CART_SUCCESS,
  UPDATE_BOOKS_IN_CART_REQUEST,
  UPDATE_BOOKS_IN_CART_FAILURE,
} from '../reducers/cart';

// function updateBooksInCartAPI(data) {
//   // eslint-disable-next-line quotes
//   return axios.post("/api/post/updateBooksincart", data);
// }
function* updateBooksInCart(action) {
  try {
    yield delay(1000);
    // const result = yield call(updateBooksInCartAPI, action.data);
    yield put({
      type: UPDATE_BOOKS_IN_CART_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: UPDATE_BOOKS_IN_CART_FAILURE,
      data: error.response.data,
    });
  }
}

// function addBookInCartAPI(data) {
//   // eslint-disable-next-line quotes
//   return axios.post("/api/post/addbookincart", data);
// }
function* addBookInCart(action) {
  try {
    yield delay(1000);
    // const result = yield call(addBookInCartAPI, action.data);
    yield put({
      type: ADD_BOOK_IN_CART_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: ADD_BOOK_IN_CART_FAILURE,
      data: error.response.data,
    });
  }
}
// function deleteBookInCartAPI(data) {
//   // eslint-disable-next-line quotes
//   return axios.post("/api/post/deleteBookIncart", data);
// }
function* deleteBookInCart(action) {
  try {
    yield delay(1000);
    // const result = yield call(deleteBookInCartAPI, action.data);
    yield put({
      type: DELETE_BOOK_IN_CART_SUCCESS,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: DELETE_BOOK_IN_CART_FAILURE,
      data: error.response.data,
    });
  }
}

function* watchUpdateBooksInCart() {
  yield takeLatest(UPDATE_BOOKS_IN_CART_REQUEST, updateBooksInCart);
}

function* watchAddBookInCart() {
  yield takeLatest(ADD_BOOK_IN_CART_REQUEST, addBookInCart);
}

function* watchDeleteBookInCart() {
  yield takeLatest(DELETE_BOOK_IN_CART_REQUEST, deleteBookInCart);
}

export default function* CartSaga() {
  yield all([
    fork(watchAddBookInCart),
    fork(watchDeleteBookInCart),
    fork(watchUpdateBooksInCart),
  ]);
}
