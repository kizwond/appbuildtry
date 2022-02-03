import { gql } from "@apollo/client";

export const FRAGMENT_BUY_BOOK = gql`
  fragment BuyBookFragment on Buybook {
    _id
    buybook_info {
      title
      authorName
      authorCompany
      status
      hashtag
      timeCreated
      coverImage
      introductionOfBook
      introductionOfAuthor
      listOfIndex
      price
      numCards {
        total
        read
        flip
        general
        common
        subject
      }
    }
  }
`;
