import { all, fork } from 'redux-saga/effects';

import CartSaga from './cart';

export default function* rootSaga() {
  yield all([fork(CartSaga)]);
}
