import M_Nav from "../nav/M_Nav";
import { useWindowSize } from "react-use";

const Layout = ({ children }) => {
  // const {width, height} = useWindowSize();
  return (
    <>
      {/* <div>
      <div>width: {width}</div>
      <div>height: {height}</div>
    </div> */}
      <M_Nav />
      {children}
    </>
  );
};

export default Layout;
