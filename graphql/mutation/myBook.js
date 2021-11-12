import { gql } from "@apollo/client";
import { FRAGMENT_MYBOOK } from "../fragment/book";

export const MUTATION_CREATE_MY_BOOK = gql`
  ${FRAGMENT_MYBOOK}
  mutation createMyBookCategory($forCreateMybook: forCreateMybook) {
    mybook_createMybook(forCreateMybook: $forCreateMybook) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;
