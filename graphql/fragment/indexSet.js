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
          progress
          total
          yet
          ing {
            total
            notStudying
            untilNow
            untilToday
            afterTomorrow
          }
          hold
          completed
        }
        read {
          progress
          total
          yet
          ing {
            total
            notStudying
            untilNow
            untilToday
            afterTomorrow
          }
          hold
          completed
        }
        flip {
          progress
          total
          yet
          ing {
            total
            notStudying
            untilNow
            untilToday
            afterTomorrow
          }
          hold
          completed
        }
      }
    }
  }
`;
