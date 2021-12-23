import { gql } from "@apollo/client";

export const FRAGMENT_INDEX_SET = gql`
  fragment IndexSetFragment on Indexset {
    _id
    indexset_info {
      mybook_id
      user_id
    }
    indexes {
      _id
      name
      level
      indextype
      numCards {
        total {
          averageLevel
          total
          yet
          ingTotal
          ingUntilNow
          ingUntilToday
          ingAfterTomorrow
          hold
          completed
        }
        read {
          averageLevel
          total
          yet
          ingTotal
          ingUntilNow
          ingUntilToday
          ingAfterTomorrow
          hold
          completed
        }
        flip {
          averageLevel
          total
          yet
          ingTotal
          ingUntilNow
          ingUntilToday
          ingAfterTomorrow
          hold
          completed
        }
      }
    }
  }
`;
export const FRAGMENT_INDEX_SET_WITHOUT_CARD_NUMBER = gql`
  fragment IndexSetWithoutCardNumberFragment on Indexset {
    _id
    indexset_info {
      mybook_id
      user_id
    }
    indexes {
      _id
      name
      level
      indextype
    }
  }
`;
