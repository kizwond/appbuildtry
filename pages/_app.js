import 'antd/dist/antd.css';
import '../styles/globals.css';
import wrapper from '../redux/store/configureStore';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, gql } from "@apollo/client";

import { useUserAgent } from "next-useragent";


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
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default wrapper.withRedux(App);
