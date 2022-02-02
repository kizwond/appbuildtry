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
