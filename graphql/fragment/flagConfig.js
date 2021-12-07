import { gql } from "@apollo/client";

export const FRAGMENT_USER_FLAG_CONFIG = gql`
  fragment UserFlagConfigFragment on Userflagconfig {
    _id
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
`;
