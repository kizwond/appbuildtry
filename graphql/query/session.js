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
export const GetSession = gql`
  query GetSession($session_id: ID) {
    mybook_getMybookByUserID {
      status
      msg
      user_id
      mybooks {
        _id
        mybook_info {
          mybookcateset_id
          mybookcate_id
          title
          type
          buybook_id
          user_id
          author_id
          hideOrShow
          isStudyLike
          isWriteLike
          seqInCategory
          seqInStudyLike
          seqInWriteLike
          timeCreated
        }
      }
    }
    
    userflagconfig_get {
      userflagconfigs {
        _id
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
    }

    session_getSession(session_id: $session_id) {
      status
      msg
      sessions {
        _id
        session_info {
          user_id
          isFinished
          timeStarted
          timeFinished
        }
        sessionScope {
          mybook_id
          index_ids
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
