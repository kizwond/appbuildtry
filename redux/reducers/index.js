import loggedReducer from "./isLogged";
import cartReducer from "./cart";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  isLogged: loggedReducer,
  cartReducer,
});

export default allReducers;
