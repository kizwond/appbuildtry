import { gql } from "@apollo/client";

export const UPDATE_LEVEL_CONFIG = gql`
  mutation user_level_config_update(
    $forUpdateLevelconfig: forUpdateLevelconfig
  ) {
    levelconfig_update(forUpdateLevelconfig: $forUpdateLevelconfig) {
      status
      msg
      levelconfigs {
        _id
        restudy {
          restudyRatio
          levelchangeSensitivity
          maxRestudyMinuteInsideSession
        }
      }
    }
  }
`;
