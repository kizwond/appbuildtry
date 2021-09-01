import { gql } from "@apollo/client";

export const GetSession = gql`
  query GetSession($sessionId: String) {
    getsession(sessionId: $sessionId) {
      status
      msg
    }
  }
`;
