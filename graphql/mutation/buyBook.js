import { gql } from "@apollo/client";
import { FRAGMENT_MYBOOK } from "../fragment/book";
import { FRAGMENT_BUY_BOOK } from "../fragment/buyBook";

export const MUTATION_CREATE_BUY_BOOK_FROM_MY_BOOK = gql`
  ${FRAGMENT_BUY_BOOK}
  mutation createMyBookCategory($forCreateBuybook: forCreateBuybook) {
    buybook_createBuybook(forCreateBuybook: $forCreateBuybook) {
      status
      msg
      buybooks {
        ...BuyBookFragment
      }
    }
  }
`;

export const MUTATION_CREATE_MY_BOOK_FROM_BUY_BOOK = gql`
  ${FRAGMENT_MYBOOK}
  mutation CreateMyBookFromBuyBook($buybook_id: ID) {
    buybook_createMybookFromBuybook(buybook_id: $buybook_id) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;
