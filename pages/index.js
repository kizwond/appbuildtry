import Layout from "../components/layout/Layout";
import RecentStudyList from "../components/index/RecentStudyList";
import Hero from "../components/index/Hero";
import NewBooks from "../components/index/NewBooks";
import Footer from "../components/index/Footer";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "../redux/actions";


const Home = () => {
  const isLogged = useSelector(state => state.isLogged)
  const dispatch = useDispatch()
  console.log(isLogged)
  return (
    <Layout>
      {isLogged && <div>로그인상태</div>}
      {!isLogged && <div>로그아웃상태</div>}
      
      {!isLogged && <button onClick={()=>dispatch(logIn(true))}>로그인테스트</button>}
      {isLogged && <button onClick={()=>dispatch(logOut(false))}>로그아웃테스트</button>}
      <Hero />
      <RecentStudyList />
      <NewBooks />
      <Footer />
    </Layout>
  );
};

export default Home;
