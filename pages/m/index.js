import Image from "next/image";
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
import { Space } from "antd";

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
    sessionStorage.removeItem("cardListStudying");
    sessionStorage.setItem("card_seq", 0);
    sessionStorage.removeItem("isFinished")
    sessionStorage.removeItem("cardlist_to_send")
    sessionStorage.removeItem("ttsUse");
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
        localStorage.setItem("refreshToken", data.resetToken.token.refreshToken);
      }
      console.log("done");
    } else {
      console.log("로그아웃상태입니다.");
    }
  }
  return (
    <M_Layout>
      <Hero />
      <div style={{fontSize:"2rem", fontWeight:"700", textAlign:"center"}}>현재 네이버 앱을 통한 당사이트 접근시 기능상의 문제점이 발견되었습니다. 네이버앱 이외의 브라우저를 통해 사용하여 주시기 바랍니다. 불편을 끼쳐드려 죄송합니다.</div>
      {data && data.me && data.me.users && <M_RecentStudyList />}
      {/* <NewBooks /> */}
      {/* {[1, 2, 3, 4, 5, 6, 7, 8].map((photo) => (
        <div key={photo} className="flex items-center justify-center mt-4">
          <div className="w-[calc(100vw_*_0.75)] h-[calc(100vw_*_0.75)] relative">
            <Image
              src={`https://s3.ap-northeast-2.amazonaws.com/cogbook.siteimage/%EA%B7%B8%EB%A6%BC${photo}.png`}
              alt="dd"
              layout="fill"
            />
          </div>
        </div>
      ))} */}

      <div style={{ height: "20px" }}></div>
      <div style={{ fontFamily: "'Cute Font', cursive" }}>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "409px", borderRadius: "5px", backgroundColor: "#c2cfd4" }}>
          <div style={{ flexBasis: "50%", fontSize: "clamp(1.5rem, 3vw, 4rem)", lineHeight:"100%", color: "#3b3b3b", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              <span style={{ fontSize: "4vw", fontWeight: "700" }}>책</span>으로 학습하실때 많이 <span style={{ fontSize: "4vw", fontWeight: "700" }}>답답~</span>하셨죠?
            </div>
          </div>
          <div style={{ flexBasis: "50%" }}>
            <Image src="/image/study_book.jpg" width="500px" height="400px" layout="responsive" sizes="50vw" alt="hello" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "409px", borderRadius: "5px", backgroundColor: "#f7c497" }}>
          <div style={{ flexBasis: "50%" }}>
            <Image src="/image/study_support.jpg" width="500px" height="400px" layout="responsive" sizes="50vw" alt="hello" />
          </div>
          <div style={{ flexBasis: "50%", fontSize: "clamp(1.5rem, 3vw, 4rem)", lineHeight:"100%", color: "#3b3b3b", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              <span style={{ fontSize: "4vw", fontWeight: "700" }}>콕북</span>이 당신의 <span style={{ fontSize: "4vw", fontWeight: "700" }}>학습</span>을 지원하겠습니다.
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "409px", borderRadius: "5px", backgroundColor: "#e2e6e7" }}>
          <div style={{ flexBasis: "50%", fontSize: "clamp(1.5rem, 3vw, 4rem)", lineHeight:"100%", color: "#3b3b3b", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              필요한 것만 <span style={{ fontSize: "4vw", fontWeight: "700" }}>딱딱 골라서 학습</span>하고 싶으셨죠?
            </div>
          </div>
          <div style={{ flexBasis: "50%" }}>
            <Image src="/image/study_sorting.jpg" width="500px" height="400px" layout="responsive" sizes="50vw" alt="hello" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "409px", borderRadius: "5px", backgroundColor: "#e4c7d3" }}>
          <div style={{ flexBasis: "50%" }}>
            <Image src="/image/study_mixing.jpg" width="500px" height="400px" layout="responsive" sizes="50vw" alt="hello" />
          </div>
          <div style={{ flexBasis: "50%", fontSize: "clamp(1.5rem, 3vw, 4rem)", lineHeight:"100%", color: "#3b3b3b", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              좀 <span style={{ fontSize: "4vw", fontWeight: "700" }}>섞어서 공부</span>하고 싶지는 않으셨나요?
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "409px", borderRadius: "5px", backgroundColor: "#f1d7c2" }}>
          <div style={{ flexBasis: "50%", fontSize: "clamp(1.5rem, 3vw, 4rem)", lineHeight:"100%", color: "#3b3b3b", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              <span style={{ fontSize: "4vw", fontWeight: "700" }}>필터</span>된 것을 <span style={{ fontSize: "4vw", fontWeight: "700" }}>순서까지 섞어서 읽어</span>주면
              어떨까요?
            </div>
          </div>
          <div style={{ flexBasis: "50%" }}>
            <Image src="/image/study_listen.jpg" width="500px" height="400px" layout="responsive" sizes="50vw" alt="hello" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "409px", borderRadius: "5px", backgroundColor: "#f0f3fb" }}>
          <div style={{ flexBasis: "50%" }}>
            <Image src="/image/study_planning.jpg" width="500px" height="400px" layout="responsive" sizes="50vw" alt="hello" />
          </div>
          <div style={{ flexBasis: "50%", fontSize: "clamp(1.5rem, 3vw, 4rem)", lineHeight:"100%", color: "#3b3b3b", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              언제 <span style={{ fontSize: "4vw", fontWeight: "700" }}>복습</span>하면 될 지를 정해주면 더 좋겠죠?
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", maxHeight: "409px", borderRadius: "5px", backgroundColor: "#cbc3b1" }}>
          <div style={{ flexBasis: "50%", fontSize: "clamp(1.5rem, 3vw, 4rem)", lineHeight:"100%", color: "#3b3b3b", position: "relative" }}>
            <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>
              학습하면서 기억할 것을 남기시면 <span style={{ fontSize: "4vw", fontWeight: "700" }}>차곡차곡 정리</span>됩니다.
            </div>
          </div>
          <div style={{ flexBasis: "50%" }}>
            <Image src="/image/study_stack.jpg" width="500px" height="400px" layout="responsive" sizes="50vw" alt="hello" />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            maxHeight: "409px",
            borderRadius: "5px",
            backgroundColor: "white",
            marginBottom: "20px",
            position: "relative",
          }}
        >
        
            <div style={{ flexBasis: "100%", fontSize: "4vw", color: "#3b3b3b", textAlign: "center", fontWeight: "700" }}>이게 끝이 아닙니다! 지금부터 하나씩 알아가시죠!</div>
          
        </div>
      </div>
      <M_Footer />
    </M_Layout>
  );
};

export default Home;
