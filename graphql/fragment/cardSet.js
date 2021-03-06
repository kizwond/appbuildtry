import { gql } from "@apollo/client";

export const FRAGMENT_CARD_SET = gql`
  fragment MyCardSetFragment on Cardset {
    _id
    cardset_info {
      user_id
      mybook_id
      buybook_id
      indexset_id
      index_id
    }
    cards {
      _id
      card_info {
        mybook_id
        buybook_id
        indexset_id
        index_id
        cardset_id
        cardtypeset_id
        cardtype_id
        cardtype
        time_created
        hasParent
        parentCard_id
      }
      content {
        userFlag
        makerFlag {
          value
          comment
        }
        hidden {
          _id
          targetWord
          toolType
        }
        underline {
          _id
          targetWord
          toolType
        }
        highlight {
          _id
          targetWord
          toolType
        }
        location
        mycontent_id
        buycontent_id
        memo
      }
      studyStatus {
        statusCurrent        
        recentStudyRatio
        recentExamResult
        recentExamTime
        recentStudyTime
        recentSelection
        recentSelectTime
        needStudyTime        
        totalStudyTimes
        totalStudyHour
        totalExamTimes
        recentStayHour
        recentStudyHour
        totalStayHour
        levelCurrent
      }
    }
  }
`;

export const FRAGMENT_CARD_SET_WITHOUT_STUDY_STATUS = gql`
  fragment MyCardSetFragmentWithoutStudyStatus on Cardset {
    _id
    cardset_info {
      user_id
      mybook_id
      indexset_id
      index_id
    }
    cards {
      _id
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
      }
      content {
        userFlag
        makerFlag {
          value
          comment
        }
        location
        mycontent_id
        buycontent_id
      }
    }
  }
`;
