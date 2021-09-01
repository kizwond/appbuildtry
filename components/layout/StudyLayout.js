import StudyNav from "../nav/StudyNav";
import {useWindowSize} from 'react-use';

const Layout = ({ children }) => {
    const {width, height} = useWindowSize();
    return (
      <>
      <div>
      <div>width: {width}</div>
      <div>height: {height}</div>
    </div>
       <StudyNav />
        {children}
      </>
    );
  };

  export default Layout;
