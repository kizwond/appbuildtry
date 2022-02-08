import { gql } from "@apollo/client";
import { FRAGMENT_MYBOOK } from "../fragment/book";
import { FRAGMENT_CATEGORYSET } from "../fragment/categorySet";
import { FRAGMENT_MENTORING } from "../fragment/mentoring";
import { FRAGMENT_MY_CARD_TYPE_SET } from "../fragment/cardTypeSet";
import {
  FRAGMENT_CARD_SET,
  FRAGMENT_CARD_SET_WITHOUT_STUDY_STATUS,
} from "../fragment/cardSet";
import { FRAGMENT_BUY_BOOK } from "../fragment/buyBook";
import { FRAGMENT_USER_FLAG_CONFIG } from "../fragment/flagConfig";
import { FRAGMENT_SESSION_CONFIG } from "../fragment/sessionConfig";
import {
  FRAGMENT_INDEX_SET,
  FRAGMENT_INDEX_SET_WITHOUT_CARD_NUMBER,
} from "../fragment/indexSet";
import { FRAGMENT_BOOK_STUDY_LEVEL_CONFIG } from "../fragment/bookStudyLevelConfig";
import {
  FRAGMENT_SESSION_FOR_RESULT,
  FRAGMENT_EXAM_FOR_RESULT,
  FRAGMENT_SESSION_FOR_RESTARTING_SESSION,
} from "../fragment/session";
import { FRAGMENT_CANDIDATE_BOOK } from "../fragment/candidateBook";

// 유저 정보 불러오기
export const QUERY_USER_MINIMUM_INFORMATION_BY_USER_NAME = gql`
  query GetUserMinimumInfomationByUserName($username: String) {
    user_getUserMinInfo(username: $username) {
      status
      msg
      _id
      username
      name
      organization
    }
  }
`;

// 책정보 및 카테고리 정보 불러오기
export const QUERY_USER_CATEGORIES_AND_USER_BOOKS = gql`
  ${FRAGMENT_MYBOOK}
  ${FRAGMENT_CATEGORYSET}
  query {
    mybookcateset_getMybookcatesetByUserID {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
    mybook_getMybookByUserID {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;
export const QUERY_USER_CATEGORIES = gql`
  ${FRAGMENT_CATEGORYSET}
  query {
    mybookcateset_getMybookcatesetByUserID {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
  }
`;

export const QUERY_USER_BOOKS = gql`
  ${FRAGMENT_MYBOOK}
  query {
    mybook_getMybookByUserID {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;

// 책 정보 불러오기
export const QUERY_USER_BOOKS_BY_BOOK_IDS = gql`
  ${FRAGMENT_MYBOOK}
  query GetMyBooksByBooksIds($mybook_ids: [ID]) {
    mybook_getMybookByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;
export const QUERY_USER_BOOKS_BY_BOOK_IDS__WITH_USER_CATEGORIES = gql`
  ${FRAGMENT_MYBOOK}
  ${FRAGMENT_CATEGORYSET}
  query GetMyBooksByBooksIds($mybook_ids: [ID]) {
    mybook_getMybookByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
    mybookcateset_getMybookcatesetByUserID {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
  }
`;

export const GetIndex = gql`
  query Index($mybook_ids: [ID]) {
    indexset_getByMybookids(mybook_ids: $mybook_ids) {
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
        }
      }
    }
  }
`;
export const GetCardTypeSet = gql`
  ${FRAGMENT_MY_CARD_TYPE_SET}
  query GetCardTypeSet($mybook_ids: [ID]) {
    cardtypeset_getbymybookids(mybook_ids: $mybook_ids) {
      status
      msg
      cardtypesets {
        ...MyCardTypeSetFragment
      }
    }
  }
`;

export const GetCardRelated = gql`
  ${FRAGMENT_CARD_SET}
  ${FRAGMENT_MY_CARD_TYPE_SET}
  query GetCardRelated($mybook_ids: [ID], $index_ids: [ID]) {
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
    cardset_getByIndexIDs(index_ids: $index_ids) {
      status
      msg
      cardsets {
        ...MyCardSetFragment
      }
    }

    indexset_getByMybookids(mybook_ids: $mybook_ids) {
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
        }
      }
    }

    cardtypeset_getbymybookids(mybook_ids: $mybook_ids) {
      status
      msg
      cardtypesets {
        ...MyCardTypeSetFragment
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
  }
`;
export const GetFlagStyle = gql`
  query GetFlagStyle($mybook_ids: [ID]) {
    cardtypeset_getbymybookids(mybook_ids: $mybook_ids) {
      status
      msg
      cardtypeset_info {
        user_id
        mybook_id
      }
      cardtypesets {
        _id
        makerFlag_style {
          row_style {
            background {
              color
              opacity
            }
            outer_margin {
              top
              bottom
              left
              right
            }
            inner_padding {
              top
              bottom
              left
              right
            }
            border {
              top {
                bordertype
                thickness
                color
              }
              bottom {
                bordertype
                thickness
                color
              }
              left {
                bordertype
                thickness
                color
              }
              right {
                bordertype
                thickness
                color
              }
            }
          }
          figure_style {
            shape
            size
            color
          }
          comment_font {
            font
            size
            color
            align
            bold
            italic
            underline
          }
        }
      }
    }
  }
`;

// 멘토링
export const QUERY_MENTORING = gql`
  ${FRAGMENT_MENTORING}
  query {
    mentoring_getMentoring {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

// 도전출판
export const QUERY_BUY_BOOKS = gql`
  ${FRAGMENT_BUY_BOOK}
  query {
    buybook_getAllBuybook {
      status
      msg
      buybooks {
        ...BuyBookFragment
      }
    }
    me {
      status
      msg
      users {
        _id
        user_info {
          role
        }
      }
    }
  }
`;
export const QUERY_BUY_BOOKS_BY_BUY_BOOK_ID = gql`
  ${FRAGMENT_BUY_BOOK}
  query getBuyBookByBuyBookId($buybook_ids: [ID]) {
    buybook_getBuybookByBuybookIDs(buybook_ids: $buybook_ids) {
      status
      msg
      buybooks {
        ...BuyBookFragment
      }
    }
  }
`;

// 유저 플래그
export const QUERY_USER_FLAG_CONFIG = gql`
  ${FRAGMENT_USER_FLAG_CONFIG}
  query {
    userflagconfig_get {
      status
      msg
      userflagconfigs {
        ...UserFlagConfigFragment
      }
    }
  }
`;

// 세션 설정
export const QUERY_SESSION_CONFIG = gql`
  ${FRAGMENT_SESSION_CONFIG}
  query getSessionCardsDataByBooksId($mybook_ids: [ID]) {
    session_getSessionConfig(mybook_ids: $mybook_ids) {
      status
      msg
      sessionConfigs {
        ...SessionConfigFragment
      }
    }
  }
`;
export const QUERY_SESSION_CONFIG_AND_INDEXSET_AND_CARDSET_BY_BOOK_IDS = gql`
  ${FRAGMENT_SESSION_CONFIG}
  ${FRAGMENT_INDEX_SET}
  ${FRAGMENT_CARD_SET}
  query getSessionConfigAndIndexSetAndCardSet($mybook_ids: [ID]) {
    session_getSessionConfig(mybook_ids: $mybook_ids) {
      status
      msg
      sessionConfigs {
        ...SessionConfigFragment
      }
    }
    indexset_getByMybookids(mybook_ids: $mybook_ids) {
      status
      msg
      indexsets {
        ...IndexSetFragment
      }
    }
    cardset_getByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      cardsets {
        ...MyCardSetFragment
      }
    }
  }
`;
export const QUERY_SESSION_INDEXSET_AND_CARDSET_BY_BOOK_IDS = gql`
  ${FRAGMENT_INDEX_SET}
  ${FRAGMENT_CARD_SET}
  query getSessionConfigAndIndexSetAndCardSet($mybook_ids: [ID]) {
    indexset_getByMybookids(mybook_ids: $mybook_ids) {
      status
      msg
      indexsets {
        ...IndexSetFragment
      }
    }
    cardset_getByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      cardsets {
        ...MyCardSetFragment
      }
    }
  }
`;

// 책 목차 정보
export const QUERY_INDEX_SET_BY_BOOK_ID_AND_ADVANCED_FILTER = gql`
  ${FRAGMENT_INDEX_SET}
  query getSessionCardsDataByBooksId(
    $forGetNumCardsbyIndex: forGetNumCardsbyIndex
  ) {
    session_getNumCardsbyIndex(forGetNumCardsbyIndex: $forGetNumCardsbyIndex) {
      status
      msg
      indexsets {
        ...IndexSetFragment
      }
    }
  }
`;
export const QUERY_INDEX_SET_AND_CARD_SET_BY_BOOK_IDS = gql`
  ${FRAGMENT_INDEX_SET_WITHOUT_CARD_NUMBER}
  ${FRAGMENT_CARD_SET_WITHOUT_STUDY_STATUS}
  query getIndexSetByBooksIds($mybook_ids: [ID]) {
    indexset_getByMybookids(mybook_ids: $mybook_ids) {
      status
      msg
      indexsets {
        ...IndexSetWithoutCardNumberFragment
      }
    }
    cardset_getByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      cardsets {
        ...MyCardSetFragmentWithoutStudyStatus
      }
    }
  }
`;

export const QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS = gql`
  ${FRAGMENT_BOOK_STUDY_LEVEL_CONFIG}
  query QUERY_BOOK_STUDY_LEVEL_CONFIG_BY_BOOK_IDS($mybook_ids: [ID]) {
    levelconfig_getLevelconfigs(mybook_ids: $mybook_ids) {
      status
      msg
      levelconfigs {
        ...BookStudyLeveConfig
      }
    }
  }
`;

// 카드 컨텐츠 정보
export const QUERY_MY_CARD_CONTENTS = gql`
  query getMyCardContents($mycontent_ids: [ID], $buycontent_ids: [ID]) {
    mycontent_getMycontentByMycontentIDs(mycontent_ids: $mycontent_ids) {
      status
      msg
      mycontents {
        _id
        user_id
        face1
        selection
        face2
        annotation
      }
    }
    buycontent_getBuycontentByBuycontentIDs(buycontent_ids: $buycontent_ids) {
      status
      msg
      buycontents {
        _id
        user_id
        face1
        selection
        face2
        annotation
      }
    }
  }
`;
// export const QUERY_BUY_CARD_CONTENTS = gql`
//   query getMyCardContents($buycontent_ids: [ID]) {
//     buycontent_getBuycontentByBuycontentIDs(buycontent_ids: $buycontent_ids) {
//       status
//       msg
//       buycontents {
//         _id
//         user_id
//         face1
//         selection
//         face2
//         annotation
//       }
//     }
//   }
// `;

// 세션 정보
export const QUERY_SESSION_BY_USER = gql`
  query getSession {
    session_getSessionByUserid {
      status
      msg
      sessions {
        _id
        sessionScope {
          title
        }
        session_info {
          timeStarted
        }
        sessionConfig {
          studyMode
        }
      }
    }
  }
`;
export const QUERY_SESSION_FOR_RESULT_BY_SESSION_ID = gql`
  ${FRAGMENT_SESSION_FOR_RESULT}
  query getSessionForResult($session_id: ID) {
    session_getSession(session_id: $session_id) {
      status
      msg
      sessions {
        ...SessionForResultFragment
      }
    }
  }
`;
export const QUERY_EXAM_FOR_RESULT_BY_SESSION_ID = gql`
  ${FRAGMENT_EXAM_FOR_RESULT}
  query getSessionForResult($session_id: ID) {
    session_getSession(session_id: $session_id) {
      status
      msg
      sessions {
        ...ExamForResultFragment
      }
    }
  }
`;

export const QUERY_SESSION_FOR_RESTARTING_SESSION_BY_SESSION_ID = gql`
  ${FRAGMENT_SESSION_FOR_RESTARTING_SESSION}
  query getSessionForResult($session_id: ID) {
    session_getSession(session_id: $session_id) {
      status
      msg
      sessions {
        ...SessionForRestartingSessionFragment
      }
    }
  }
`;

export const QUERY_SESSION_FOR_MENTORING_BY_BOOK_ID = gql`
  query getSession($mybook_id: ID, $mybook_ids: [ID]) {
    session_getSessionByMybookid(mybook_id: $mybook_id) {
      status
      msg
      sessions {
        _id
        sessionScope {
          mybook_id
          title
        }
        session_info {
          timeStarted
          timeFinished
        }
        sessionConfig {
          studyMode
        }
      }
    }

    mybook_getMybookByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      mybooks {
        _id
        stats {
          studyHistory {
            _id
            date
            level {
              completed
              nonCompleted
            }
            numCardsByStatus {
              yet
              ing
              hold
              completed
            }
            totalStudyHour
            totalClicks
          }
        }
      }
    }

    cardset_getByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      cardsets {
        _id
        cards {
          _id
          content {
            userFlag
            makerFlag {
              value
              comment
            }
            location
            mycontent_id
            buycontent_id
            memo
          }
          studyStatus {
            totalStudyTimes
            totalStudyHour
          }
        }
      }
    }
  }
`;

export const QUERY_ALL_CANIDIDATE_BOOKS = gql`
  ${FRAGMENT_CANDIDATE_BOOK}
  query getAllCandidateBooks {
    candibook_getAllCandibook {
      status
      msg
      candibooks {
        ...CandidateBookFragment
      }
    }
  }
`;
