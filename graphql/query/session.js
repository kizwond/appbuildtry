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
    }
  }
`;
export const  GetSession = gql`
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
          _id
          seqInCardlist
          card_info {
            mybook_id
            indexset_id
            index_id
            cardset_id
            cardtypeset_id
            cardtype_id
            cardtype
            time_created
            hasParent
            parentCard_id
            card_id
          }
          content {
            userFlag
            makerFlag {
              value
              comment
            }
            hidden
            underline
            highlight
            location
            mycontent_id
            buycontent_id
          }
          studyStatus {
            statusOriginal
            levelOriginal
            userFlagOriginal
            userFlagPrev
            statusPrev
            studyTimesInSession
            needStudyTimeTmp
            statusCurrent
            recentSelection
            recentSelectTime
            totalStayHour
            recentStudyResult
            recentStudyTime
            recentStudyHour
            totalStudyTimes
            recentKnowTime
            needStudyTime
            levelCurrent
            recentExamResult
            recentExamTime
            totalExamTimes
            currentLevStudyTimes
            currentLevStudyHour
            currentLevElapsedTime
          }
        }
      }
    }
  }
`;

export const UpdateResults = gql`
  mutation UpdateResults($forUpdateResults: forUpdateResults) {
    session_updateResults(forUpdateResults: $forUpdateResults) {
      status
      msg
    }
  }
`;
