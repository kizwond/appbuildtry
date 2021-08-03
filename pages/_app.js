import "antd/dist/antd.css";
import "../styles/globals.css";
import { createStore, applyMiddleware } from "redux";
import allReducers from "../redux/reducers";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, gql } from "@apollo/client";

import { useUserAgent } from "next-useragent";

const store = createStore(allReducers, composeWithDevTools());

const App = ({ Component, pageProps }) => {
  const ua = useUserAgent();
  console.log(ua);
  if(ua.isDesktop === true) {
    var from = "pc"
  } else {
    from = "mobile"
  } 

  const link = createHttpLink({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
    headers: { from: from },
  });

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
  });

  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ApolloProvider>
  );
};

export default App;
