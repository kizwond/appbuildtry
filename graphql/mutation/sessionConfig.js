import { gql } from "@apollo/client";

export const MUTATION_CREATE_SESSION = gql`
  mutation CreateSessionMutation($forCreateSession: forCreateSession) {
    session_createSession(forCreateSession: $forCreateSession) {
      status
      msg
      sessions {
        _id
      }
    }
  }
`;
