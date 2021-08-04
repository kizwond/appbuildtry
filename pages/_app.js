import 'antd/dist/antd.css';
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import wrapper from '../redux/store/configureStore';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, gql } from "@apollo/client";

import { useUserAgent } from "next-useragent";

import { useWindowSize } from "react-use";
const App = ({ Component, pageProps }) => {
  const { width } = useWindowSize();
  if (width < 769 && width > 426) {
    var tablet = true;
  } else {
    tablet = false;
  }

  if (width < 1025 && width > 769) {
    var laptop = true;
  } else {
    laptop = false;
  }

  if (width > 1024) {
    var desktop = true;
  } else {
    desktop = false;
  }
  
  if(laptop === true){
    var from = "pc"
  } else if(desktop === true){
    var from = "pc"
  } else {
    var from = "mobile"
  }
  console.log(from)
  const link = createHttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: "include",
    headers: { from:from },
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


// const App = ({ Component, pageProps }) => {
//   const ua = useUserAgent();
//   console.log(ua);
//   if(ua.isWindows === true) {
//     var from = "pc"
//   } else {
//     from = "mobile"
//   } 

  // const link = createHttpLink({
  //   uri: "http://localhost:4000/graphql",
  //   credentials: "include",
  //   headers: { from: from },
  // });

  // const client = new ApolloClient({
  //   cache: new InMemoryCache(),
  //   link,
  // });

//   return (
//     <ApolloProvider client={client}>
//       <Component {...pageProps} />
//     </ApolloProvider>
//   );
// };

// export default wrapper.withRedux(App);
