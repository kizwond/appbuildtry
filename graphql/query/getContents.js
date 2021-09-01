import { gql } from "@apollo/client";

export const GetContents = gql`
  query GetContents($forGetContents: [forGetContents]) {
    session_getContents(forGetContents: $forGetContents) {
      status
      msg
      contents {
        _id
        face1
        selection
        face2
        annotation
      }
    }
  }
`;
