import { gql } from "@apollo/client";

export const FRAGMENT_CANDIDATE_BOOK = gql`
  fragment CandidateBookFragment on Candibook {
    _id
    originalMybook_id
    applicant_id
    title
    price
    authorName
    authorCompany
    status
    hashtag
    hideOrShow
    timeCreated
    timeStatusChanged
    coverImage
    introductionOfBook
    introductionOfAuthor
    listOfIndex
    amendReq {
      from
      date
      message
    }
  }
`;
