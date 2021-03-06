import { gql } from "@apollo/client";
import { FRAGMENT_CANDIDATE_BOOK } from "../fragment/candidateBook";

export const MUTATION_CREATE_CANDIDATE_BOOK_FROM_MY_BOOK = gql`
  ${FRAGMENT_CANDIDATE_BOOK}
  mutation createCandidateBookFromMyBook(
    $forCreateCandibook: forCreateCandibook
  ) {
    candibook_createCandibook(forCreateCandibook: $forCreateCandibook) {
      status
      msg
      candibooks {
        ...CandidateBookFragment
      }
    }
  }
`;

export const MUTATION_UPLOAD_BOOKCOVER = gql`
  mutation uploadBookcover($forUploadBookCover: forUploadBookCover) {
    candibook_uploadBookCover(forUploadBookCover: $forUploadBookCover) {
      status
      msg
      data1
    }
  }
`;

export const MUTATION_UPDATE_CANDIDATE_BOOK_STATUS = gql`
  ${FRAGMENT_CANDIDATE_BOOK}
  mutation updateCandidateBookStatus($forUpdateStatus: forUpdateStatus) {
    candibook_updateStatus(forUpdateStatus: $forUpdateStatus) {
      status
      msg
      candibooks {
        ...CandidateBookFragment
      }
    }
  }
`;
