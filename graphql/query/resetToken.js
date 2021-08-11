import { gql } from "@apollo/client";

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
