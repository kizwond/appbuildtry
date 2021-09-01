import { gql } from "@apollo/client";

export const GetSession = gql`
  query GetSession($session_id: ID) {
    session_getSession(session_id: $session_id) {
      status
      msg
      sessions {
        _id
        session_info {
          mybook_ids
          index_ids
          session_config
        }
        sessionScope {
          mybook_id
          index_ids
        }
        sessionConfig {
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
        }
        cardlistStudying {
          seqInCardlist
          card_info {
            cardtype_id
            cardtype
            time_created
            hasParent
            parent_card_id
          }
          contents {
            user_flag
            maker_flag
            location
            mycontents_id
            buycontents_id
          }
          studyStatus {
            statusOriginal
            statusPrev
            levelOriginal
            studyTimesInSession
            userFlagOriginal
            userFlagPrev
            statusCurrent
            recentKnowTime
            recentStudyResult
            recentExamResult
            recentExamTime
            recentStudyTime
            recentSelection
            recentSelectTime
            needStudyTime
            currentLevStudyTimes
            currentLevAccuStudyTime
            totalStudyTimes
            totalExamTimes
            recentStayHour
            totalStayHour
            levelCurrent
          }
        }
      }
    }
  }
`;
