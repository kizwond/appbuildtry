import { gql } from "@apollo/client";

export const FRAGMENT_BOOK_STUDY_LEVEL_CONFIG = gql`
  fragment BookStudyLeveConfig on Levelconfig {
    _id
    levelconfig_info {
      user_id
      mybook_id
    }
    restudy {
      restudyRatio
      levelchangeSensitivity
      option {
        diffi1 {
          name
          on_off
          nick
          period
          shortcutkey
          gesture
        }
        diffi2 {
          name
          on_off
          nick
          period
          shortcutkey
          gesture
        }
        diffi3 {
          name
          on_off
          nick
          period
          shortcutkey
          gesture
        }
        diffi4 {
          name
          on_off
          nick
          period
          shortcutkey
          gesture
        }
        diffi5 {
          name
          on_off
          nick
          period
          shortcutkey
          gesture
        }
      }
    }
  }
`;
