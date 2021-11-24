import { gql } from "@apollo/client";

export const GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID = gql`
  query getSessionCardsDataByBooksId($forGetNumCardsbyIndex: forGetNumCardsbyIndex) {
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
    }
  }
`;

export const GET_SESSTION_CONFIG = gql`
  query getSessionCardsDataByBooksId($mybook_ids: [ID]) {
    session_getSessionConfig(mybook_ids: $mybook_ids) {
      status
      msg
      sessionConfigs {
        studyMode
        read {
          sortOption
          useCardtype
          useStatus
          needStudyTimeCondition
          needStudyTimeRange
          numStartCards {
            onOff
            yet
            ing
            hold
            completed
          }
        }
        flip {
          sortOption
          useCardtype
          useStatus
          needStudyTimeCondition
          needStudyTimeRange
          numStartCards {
            onOff
            yet
            ing
            hold
            completed
          }
        }
        exam {
          sortOption
          useCardtype
          useStatus
          needStudyTimeCondition
          needStudyTimeRange
          numStartCards {
            onOff
            yet
            ing
            hold
            completed
          }
        }
        advancedFilter {
          onOff
          userFlag {
            onOff
            value
          }
          makerFlag {
            onOff
            value
          }
          recentStudyTime {
            onOff
            value
          }
          level {
            onOff
            value
          }
          studyTimes {
            onOff
            value
          }
          recentDifficulty {
            onOff
            value
          }
          examResult {
            onOff
            value
          }
          cardMaker {
            onOff
            value
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
      sessions {
        _id
      }
    }
  }
`;
