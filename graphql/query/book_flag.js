import { gql } from '@apollo/client';

export const GET_USER_FLAG_CONFIG = gql`
  query {
    userflagconfig_get {
      status
      msg
      userflagconfigs {
        userflagconfig_info {
          user_id
        }
        details {
          flag1 {
            shape
            color
          }
          flag2 {
            shape
            color
          }
          flag3 {
            shape
            color
          }
          flag4 {
            shape
            color
          }
          flag5 {
            shape
            color
          }
        }
      }
    }
  }
`;

export const UPDATE_USER_FLAG_CONFIG = gql`
  mutation user_flag_config_update(
    $forUpdateUserflagconfig: forUpdateUserflagconfig
  ) {
    userflagconfig_update(forUpdateUserflagconfig: $forUpdateUserflagconfig) {
      status
      msg
      userflagconfigs {
        details {
          flag1 {
            shape
            color
          }
          flag2 {
            shape
            color
          }
          flag3 {
            shape
            color
          }
          flag4 {
            shape
            color
          }
          flag5 {
            shape
            color
          }
        }
      }
    }
  }
`;
