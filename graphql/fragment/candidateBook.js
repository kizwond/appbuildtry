import { gql } from "@apollo/client";

export const FRAGMENT_CANDIDATE_BOOK = gql`
  fragment CandidateBookFragment on Candibook {
    _id
    originalMybook_id
    applicant_id
    title
    authorName
    authorCompany
    status
    hashtag
    timeCreated
    timeApproved
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
