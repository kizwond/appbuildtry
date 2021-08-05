import { gql } from "@apollo/client";

export const GET_USER = gql`
  query {
    me {
      status
      msg
      users {
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


export const SignInMutation = gql`
  mutation SignInMutation($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      status
      msg
      users {
        _id
         user_info {
          username
          name
          email        
        }
      }
      token{
        accessToken
        refreshToken
      }
    }
  }
`;

export const SignUpMutation = gql`
mutation SignUpMutation($username: String!, $password: String!, $name: String!, $email: String!) {
  signup(username: $username, password: $password, name: $name, email: $email) {
    status
    msg
    users {
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

export const LOGOUT = gql`
mutation {
    logout {
      status
      msg
    }
  }
`;
