import 'antd/dist/antd.css';
import '../styles/globals.css';
import { useState, useEffect } from 'react';
import wrapper from '../redux/store/configureStore';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, gql } from "@apollo/client";
import { createUploadLink } from 'apollo-upload-client'
import { useUserAgent } from "next-useragent";

import { useWindowSize } from "react-use";
import MobileDetect from '../node_modules/mobile-detect/mobile-detect';

const App = ({ Component, pageProps }) => {  
  const ISSERVER = typeof window === "undefined";
  if(!ISSERVER) {
    var accessToken = localStorage.getItem('accessToken')
    console.log(accessToken)
    var md = new MobileDetect(window.navigator.userAgent);
    if(md.mobile()) {
     console.log("mobile")
     var from = "mobile"
    }
    else {
     console.log("pc")
     var from = "pc"
    }
   }
  console.log(from)
 
  
  const link = createUploadLink({
    uri: process.env.NEXT_PUBLIC_ACCESS_URI,
    credentials: true,
    headers: { from:from,
      Authorization: accessToken 
  },
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
