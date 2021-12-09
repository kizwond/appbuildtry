import { gql } from "@apollo/client";

export const FRAGMENT_USER_FLAG_CONFIG = gql`
  fragment UserFlagConfigFragment on Userflagconfig {
    _id
    userflagconfig_info {
      user_id
    }
    figure
    color {
      flag1
      flag2
      flag3
      flag4
      flag5
    }
  }
`;
