import "../styles/globals.css";
import "antd/dist/antd.css";
import { createStore, applyMiddleware  } from "redux";
import allReducers from "../redux/reducers";
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from "react-redux";

const store = createStore(allReducers, composeWithDevTools());

const App = ({ Component, pageProps }) => {
  return (
  <Provider store={store}>
    <Component {...pageProps} />
  </Provider>
  )
}

export default App;
