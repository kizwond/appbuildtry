import { gql } from "@apollo/client";
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
