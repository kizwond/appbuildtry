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

export const MUTATION_SET_MY_BOOK_LIKE = gql`
  ${FRAGMENT_MYBOOK}
  mutation setMyBookLike($forSetLike: forSetLike) {
    mybook_setLike(forSetLike: $forSetLike) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;

export const MUTATION_SET_MY_BOOK_HIDE_OR_SHOW = gql`
  ${FRAGMENT_MYBOOK}
  mutation setMyBookHideOrShow($mybook_id: String!, $hideOrShow: String) {
    mybook_setHideOrShow(mybook_id: $mybook_id, hideOrShow: $hideOrShow) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;
export const MUTATION_DELETE_MY_BOOK = gql`
  ${FRAGMENT_MYBOOK}
  mutation DeleteMyBook($mybook_id: String!) {
    mybook_deleteMybook(mybook_id: $mybook_id) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;
