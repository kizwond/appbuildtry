import { gql } from "@apollo/client";
import { FRAGMENT_USER_FLAG_CONFIG } from "../fragment/flagConfig";

export const MUTATION_UPDATE_USER_FLAG = gql`
  mutation MUTATION_UPDATE_USER_FLAG($forUpdateUserFlag: forUpdateUserFlag) {
    cardset_updateUserFlag(forUpdateUserFlag: $forUpdateUserFlag) {
      status
      msg
    }
  }
`;

export const MUTATION_UPDATE_STUDY_STATUS = gql`
  mutation MUTATION_UPDATE_STUDY_STATUS($forUpdateStatus: forUpdateStatus) {
    cardset_updateStatus(forUpdateStatus: $forUpdateStatus) {
      status
      msg
    }
  }
`;
