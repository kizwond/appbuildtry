import { gql } from "@apollo/client";
import { FRAGMENT_USER_FLAG_CONFIG } from "../fragment/flagConfig";

export const MUTATION_UPDATE_USER_FLAG_CONFIG = gql`
  ${FRAGMENT_USER_FLAG_CONFIG}
  mutation user_flag_config_update(
    $forUpdateUserflagconfig: forUpdateUserflagconfig
  ) {
    userflagconfig_update(forUpdateUserflagconfig: $forUpdateUserflagconfig) {
      status
      msg
      userflagconfigs {
        ...UserFlagConfigFragment
      }
    }
  }
`;
