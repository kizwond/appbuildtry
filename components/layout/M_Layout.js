import M_Nav from "../nav/M_Nav";
import { useWindowSize } from "react-use";
import Head from "next/head";
const Layout = ({ children }) => {
  // const {width, height} = useWindowSize();
  return (
    <>
      {/* <div>
      <div>width: {width}</div>
      <div>height: {height}</div>
    </div> */}
      <Head>
        {/* <title>콕북</title> */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, user-scalable=no"
        />
      </Head>
      <M_Nav />
      <div className="w-full max-w-[1024px] mx-auto min-w-[360px] relative">
        {children}
      </div>
    </>
  );
};

export default Layout;
