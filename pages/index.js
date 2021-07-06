import Layout from "../components/layout/Layout";
import RecentStudyList from "../components/index/RecentStudyList";
import Hero from "../components/index/Hero";
import NewBooks from "../components/index/NewBooks";
import Footer from "../components/index/Footer";
import { useSelector, useDispatch } from "react-redux";
import { logIn, logOut } from "../redux/actions";

import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";

const SignUpMutation  = gql`
  mutation SignUpMutation($username: String!, $password: String!, $name: String!, $email: String!) {
    signup(username: $username, password: $password, name: $name, email: $email) {
      _id
      user_info {
        username
        password
      }
      msg
    }
  }
`;

const Home = () => {
  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
  // console.log(isLogged);

  const [signup] = useMutation(SignUpMutation, {onCompleted : showdata });

  function showdata(data){
    if (data) {
      console.log("efefef", data);
    }
  }
  
  async function postuser() {
    try {
      await signup({
        variables: {
          username: "cavok23",
          password: "1234",
          name: "yoon",
          email: "test@test.com",
        }
      })
     alert("success!!!!!!!")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Layout>
      {isLogged && <div>로그인상태</div>}
      {!isLogged && <div>로그아웃상태</div>}

      {!isLogged && <button onClick={() => dispatch(logIn(true))}>로그인테스트</button>}
      {isLogged && <button onClick={() => dispatch(logOut(false))}>로그아웃테스트</button>}
      <button
        onClick={postuser}
      >
        뮤테이션
      </button>
      <Hero />
      <RecentStudyList />
      <NewBooks />
      <Footer />
    </Layout>
  );
};

export default Home;
// mutation Signup($username: String!, $password: String!, $name: String!, $email: String!) {
//     signup(username:$username, password: $password, name: $name, email:$email){
//       username
//       password
//       name
//       email
//     }
//   }
