import { gql } from "@apollo/client";

export const GetLevelConfig = gql`
  query GetLevelConfig($mybook_ids: [ID]) {
    levelconfig_getLevelconfigs(mybook_ids: $mybook_ids) {
      status
      msg
      levelconfigs {
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
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi2 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi3 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi4 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi5 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
          }
        }
      }
    }
  }
`;
export const GetSession = gql`
  query GetSession($session_id: ID) {
    session_getSession(session_id: $session_id) {
      status
      msg
      sessions {
        _id
        session_info {
          user_id
          isFinished
        }
        sessionScope {
          mybook_id
          index_ids
        }
        cardlistStudying {
          seqInCardlist
          card_info {
            mybook_id
            cardset_id
            cardtypeset_id
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
