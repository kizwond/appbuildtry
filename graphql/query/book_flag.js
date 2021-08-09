import { gql } from '@apollo/client';

export const GET_USER_FLAG_CONFIG = gql`
  query {
    userflagconfig_get {
      status
      msg
      userflagconfigs {
        userflagconfig_info {
          user_id
        }
        details {
          flag1 {
            shape
            color
          }
          flag2 {
            shape
            color
          }
          flag3 {
            shape
            color
          }
          flag4 {
            shape
            color
          }
          flag5 {
            shape
            color
          }
        }
      }
    }
  }
`;

export const UpdateUserFlagConfig = gql`
  mutation userflagconfig_update($username: String!, $password: String!) {
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
      token {
        accessToken
        refreshToken
      }
    }
  }
`;

export const SignUpMutation = gql`
  mutation SignUpMutation(
    $username: String!
    $password: String!
    $name: String!
    $email: String!
  ) {
    signup(
      username: $username
      password: $password
      name: $name
      email: $email
    ) {
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
