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

export const MUTATION_CHANGE_BOOK_ORDER = gql`
  ${FRAGMENT_MYBOOK}
  mutation changeBookOrder($forModifySeq: [forModifySeq]) {
    mybook_modifySeq(forModifySeq: $forModifySeq) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;
