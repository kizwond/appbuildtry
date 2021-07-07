import "antd/dist/antd.css";
import "../styles/globals.css";
import { createStore, applyMiddleware } from "redux";
import allReducers from "../redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from "@apollo/client";
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include"
  // headers: [
  //   { key: "Access-Control-Allow-Credentials", value: "true" },
  //   { key: "Access-Control-Allow-Origin", value: "*" },
  //   { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
  //   { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
  // ]
});

const store = createStore(allReducers, composeWithDevTools());

const App = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
};

export default App;
