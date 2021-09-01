import { gql } from '@apollo/client';

export const GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID = gql`
  query getSessionCardsDataByBooksId(
    $forGetNumCardsbyIndex: forGetNumCardsbyIndex
  ) {
    session_getNumCardsbyIndex(forGetNumCardsbyIndex: $forGetNumCardsbyIndex) {
      status
      msg
      indexsets {
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
          num_cards {
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
    }
  }
`;

export const SESSION_CREATE_SESSION = gql`
  mutation sessionCreateSession($forCreateSession: forCreateSession) {
    session_createSession(forCreateSession: $forCreateSession) {
      status
      msg
    }
  }
`;
