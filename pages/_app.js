import "antd/dist/antd.css";
import "../styles/globals.css";
import wrapper from "../redux/store/configureStore";
import { ApolloProvider } from "@apollo/client";

import { useApollo } from "../lib/apollo";

const App = ({ Component, pageProps }) => {
  const apolloClient = useApollo(pageProps);

  return (
    <ApolloProvider client={apolloClient}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

export default wrapper.withRedux(App);
