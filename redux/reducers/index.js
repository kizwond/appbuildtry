import { HYDRATE } from 'next-redux-wrapper';
import loggedReducer from './isLogged';
import cart from './cart';
import { combineReducers } from 'redux';

const rootReducers = combineReducers({
  // HYDRATE - 서버사이드 랜더링 리덕스 사용을 위해 index 리듀셔가 필요
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        console.log(`HYDRATE`, action);
        return { ...state, ...action.payload };

      default:
        return state;
    }
  },
  isLogged: loggedReducer,
  cart,
});

export default rootReducers;
