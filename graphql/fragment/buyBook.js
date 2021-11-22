import { gql } from "@apollo/client";

export const FRAGMENT_BUY_BOOK = gql`
  fragment BuyBookFragment on Buybook {
    _id
    buybook_info {
      title
      status
      author_id
      authorName
      buybookcateName
      hashtag
      timeCreated
    }
  }
`;
