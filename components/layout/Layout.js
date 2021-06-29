import Nav from "../nav/Nav";
import {useWindowSize} from 'react-use';

const Layout = ({ children }) => {
    const {width, height} = useWindowSize();
    return (
      <>
      <div>
      <div>width: {width}</div>
      <div>height: {height}</div>
    </div>
       <Nav />
        {children}
      </>
    );
  };

  export default Layout;
