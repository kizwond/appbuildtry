import StudyNav from "../nav/StudyNav";
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
        <title>콕북</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </Head>
      <StudyNav />
      {children}
    </>
  );
};

export default Layout;
