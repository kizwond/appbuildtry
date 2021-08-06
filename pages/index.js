import React, { useEffect, useState, useCallback } from "react";
import Layout from "../components/layout/Layout";
import RecentStudyList from "../components/index/RecentStudyList";
import Hero from "../components/index/Hero";
import NewBooks from "../components/index/NewBooks";
import Footer from "../components/index/Footer";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../redux/actions";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER, ResetToekn } from "../graphql/query/account";

const Home = () => {
  const [resetToken] = useMutation(ResetToekn, { onCompleted: showdata });

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  const [loginState, setLoginState] = useState(false);
  const { loading, error, data } = useQuery(GET_USER);

  const ISSERVER = typeof window === "undefined";
  if (!ISSERVER) {
    var refreshToken = localStorage.getItem("refreshToken");
    console.log(refreshToken);
  }

  const reset = useCallback(async() => {
    console.log("reset ing");
    try {
      await resetToken({
        variables: {
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }, [resetToken, refreshToken]);

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");

    if (data) {
      console.log(data);
      if (data.me.status === "401") {
        console.log("로그아웃상태입니다.");
        setLoginState(false);
        dispatch(logIn(false));
        reset(refreshToken);
      } else {
        console.log("로그인상태입니다.");
        setLoginState(true);
        dispatch(logIn(true));
      }
    }
  }, [data, dispatch, refreshToken, reset]);

  function showdata(data) {
    console.log("data", data);
    if (data.resetToken.status === "200") {
      console.log("로그인상태입니다.");
      setLoginState(true);
      dispatch(logIn(true));
      // Router.push("/");
      if (data.resetToken.token !== null) {
        localStorage.setItem("accessToken", data.resetToken.token.accessToken);
        localStorage.setItem("refreshToken", data.resetToken.token.refreshToken);
      }
      console.log("done");
    } else {
      alert("뭔가 잘못되었네요. 다시 해봐요.");
    }
  }

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
