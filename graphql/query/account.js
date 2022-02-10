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
          role
        }
      }
    }
    notice_getAllNotice {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
      }
    }
  }
`;

export const GET_Notice = gql`
  query {
    notice_getAllNotice {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
      }
    }
  }
`;

export const UpdateNews = gql`
  mutation UpdateNews($content: String) {
    notice_createNotice(content: $content) {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
      }
    }
  }
`;

export const DeleteNews = gql`
  mutation DeleteNews($notice_id: ID) {
    notice_deleteNotice(notice_id: $notice_id) {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
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
      token {
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

export const ResetToekn = gql`
  mutation ResetToken($refreshToken: String) {
    resetToken(refreshToken: $refreshToken) {
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
