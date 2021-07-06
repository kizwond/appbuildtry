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
