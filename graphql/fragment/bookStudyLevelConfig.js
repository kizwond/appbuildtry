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
      maxRestudyMinuteInsideSession
    }
  }
`;
