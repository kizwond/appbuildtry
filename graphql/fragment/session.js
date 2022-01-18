import { gql } from "@apollo/client";

export const FRAGMENT_SESSION_FOR_RESULT = gql`
  fragment SessionForResultFragment on Session {
    _id
    session_info {
      user_id
      isFinished
      timeStarted
      timeFinished
    }
    sessionScope {
      mybook_id
      title
      index_ids
    }
    sessionConfig {
      studyMode
      detailedOption {
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
    createdCards {
      mycontent_id
    }
    cardlistUpdated {
      card_info {
        mybook_id
        buybook_id
        hasParent
        parentCard_id
      }
      content {
        makerFlag {
          value
          comment
        }
        userFlag
        memo
        location
        mycontent_id
        buycontent_id
      }
      studyStatus {
        originalStudyRatio
        recentStudyRatio

        levelCurrent
        levelOriginal

        clickTimesInSession
        studyTimesInSession
        studyHourInSession
        elapsedHourFromLastSession
      }
    }
    clickHistory {
      card_info {
        mybook_id
        buybook_id
        hasParent
        parentCard_id
      }
      content {
        makerFlag {
          value
          comment
        }
        userFlag
        memo
        location
        mycontent_id
        buycontent_id
      }
      studyStatus {
        recentSelection
        recentStudyRatio
        recentStudyHour
        needStudyTime
        levelCurrent
        levelOriginal
      }
    }
    resultOfSession {
      studyHour
      numCards {
        yet {
          selected
          inserted
          started
          finished
        }
        ing {
          selected
          inserted
          started
          finished
        }
        hold {
          selected
          inserted
          started
          finished
        }
        completed {
          selected
          inserted
          started
          finished
        }
      }
      clicks {
        total
        diffi1
        diffi2
        diffi3
        diffi4
        diffi5
        etc
      }
      statusChange {
        yet {
          yet
          ing
          hold
          completed
        }
        ing {
          yet
          ing
          hold
          completed
        }
        hold {
          yet
          ing
          hold
          completed
        }
        completed {
          yet
          ing
          hold
          completed
        }
      }
      levelChange {
        total {
          count
          gap
        }
        up {
          count
          gap
        }
        down {
          count
          gap
        }
      }
      userFlagChange {
        flag0 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag1 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag2 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag3 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag4 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag5 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
      }
    }
    resultByBook {
      mybook_id
      studyHour
      numCards {
        yet {
          selected
          inserted
          started
          finished
        }
        ing {
          selected
          inserted
          started
          finished
        }
        hold {
          selected
          inserted
          started
          finished
        }
        completed {
          selected
          inserted
          started
          finished
        }
      }
      clicks {
        total
        diffi1
        diffi2
        diffi3
        diffi4
        diffi5
        etc
      }
      statusChange {
        yet {
          yet
          ing
          hold
          completed
        }
        ing {
          yet
          ing
          hold
          completed
        }
        hold {
          yet
          ing
          hold
          completed
        }
        completed {
          yet
          ing
          hold
          completed
        }
      }
      levelChange {
        total {
          count
          gap
        }
        up {
          count
          gap
        }
        down {
          count
          gap
        }
      }
      userFlagChange {
        flag0 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag1 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag2 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag3 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag4 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
        flag5 {
          flag0
          flag1
          flag2
          flag3
          flag4
          flag5
        }
      }
    }
  }
`;
