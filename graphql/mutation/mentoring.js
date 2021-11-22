import { gql } from "@apollo/client";
import { FRAGMENT_MENTORING } from "../fragment/mentoring";

export const MUTATION_REQUEST_MENTORING = gql`
  ${FRAGMENT_MENTORING}
  mutation RequestMentoring($forCreateMentoringReq: forCreateMentoringReq) {
    mentoring_createMentoringReq(forCreateMentoringReq: $forCreateMentoringReq) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_ACCEPT_MENTOR_REQUEST = gql`
  ${FRAGMENT_MENTORING}
  mutation RequestMentoring($forAcceptMentoringReq: forAcceptMentoringReq) {
    mentoring_acceptMentoringReq(forAcceptMentoringReq: $forAcceptMentoringReq) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;
