import { gql } from "@apollo/client";

export const FRAGMENT_SESSION_CONFIG = gql`
  fragment SessionConfigFragment on SessionConfig_Prev {
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
      studyTool {
        onOff
        value
      }
      cardMaker {
        onOff
        value
      }
    }
  }
`;
