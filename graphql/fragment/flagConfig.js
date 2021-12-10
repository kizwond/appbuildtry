import { gql } from "@apollo/client";

export const FRAGMENT_USER_FLAG_CONFIG = gql`
  fragment UserFlagConfigFragment on Userflagconfig {
    _id
    userflagconfig_info {
      user_id
    }
    details {
      flag1 {
        figure
        figureColor
        textColor
      }
      flag2 {
        figure
        figureColor
        textColor
      }
      flag3 {
        figure
        figureColor
        textColor
      }
      flag4 {
        figure
        figureColor
        textColor
      }
      flag5 {
        figure
        figureColor
        textColor
      }
    }
  }
`;
