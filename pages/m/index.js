import React, { useEffect, useState, useCallback } from "react";
import M_Layout from "../../components/layout/M_Layout";
import M_RecentStudyList from "../../components/index/M_RecentStudyList";
import Hero from "../../components/index/Hero";
import NewBooks from "../../components/index/NewBooks";
import M_Footer from "../../components/index/M_Footer";
import { useSelector, useDispatch } from "react-redux";
import { logIn } from "../../redux/actions";
import { useQuery, useMutation } from "@apollo/client";
import { GET_USER, ResetToekn } from "../../graphql/query/account";
import { reset } from "../../hooks/reset";

const Home = () => {
  const [resetToken] = useMutation(ResetToekn, { onCompleted: showdata });

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  const [loginState, setLoginState] = useState(false);
  const { loading, error, data } = useQuery(GET_USER);

  useEffect(() => {
    console.log("컴포넌트가 화면에 나타남");
    sessionStorage.removeItem("firstFetchData");
    sessionStorage.removeItem("examLog");
    sessionStorage.removeItem("cardListStudying")
    if (data) {
      console.log(data);
      if (data.me.status === "401") {
        console.log("로그아웃상태입니다.");
        localStorage.removeItem("username");
        setLoginState(false);
        dispatch(logIn(false));
        reset(resetToken);
      } else {
        console.log("로그인상태입니다.");
        if (data.me.users[0] !== null) {
          localStorage.setItem("username", data.me.users[0].user_info.username);
        }

        setLoginState(true);
        dispatch(logIn(true));
      }
    }
  }, [data, dispatch, resetToken]);

  function showdata(data) {
    console.log("data", data);
    if (data.resetToken.status === "200") {
      console.log("로그인상태입니다.");
      setLoginState(true);
      dispatch(logIn(true));
      // Router.push("/");
      if (data.resetToken.token !== null) {
        localStorage.setItem("accessToken", data.resetToken.token.accessToken);
        localStorage.setItem(
          "refreshToken",
          data.resetToken.token.refreshToken
        );
      }
      console.log("done");
    } else {
      console.log("로그아웃상태입니다.");
    }
  }
  return (
    <M_Layout>

      <Hero />

      {data && data.me && data.me.users && <M_RecentStudyList />}
      <NewBooks />
      <M_Footer />
    </M_Layout>
  );
};

export default Home;
