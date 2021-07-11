import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import RecentStudyList from "../components/index/RecentStudyList";
import Hero from "../components/index/Hero";
import NewBooks from "../components/index/NewBooks";
import Footer from "../components/index/Footer";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "../redux/actions";
import { gql, useQuery } from "@apollo/client";

const GET_USER = gql`
  query {
    me {
      status
      msg
      user {
        _id
        user_info {
          username
          name
          email
        }
      }
    }
  }
`;
const Home = () => {
  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  const [loginState, setLoginState] = useState(false);
  const { loading, error, data } = useQuery(GET_USER);

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");
    if (data) {
      console.log(data);
      if (data.me.msg === "unauthorized") {
        console.log("로그아웃상태입니다.");
        setLoginState(false);
        dispatch(logIn(false));
      } else {
        console.log("로그인상태입니다.");
        setLoginState(true);
        dispatch(logIn(true));
      }
    }
  });

  return (
    <Layout>
      {isLogged && <div>로그인상태</div>}
      {!isLogged && <div>로그아웃상태</div>}

      <Hero />
      <RecentStudyList />
      <NewBooks />
      <Footer />
    </Layout>
  );
};

export default Home;
