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

export const GetCardRelated = gql`
  ${FRAGMENT_CARD_SET_WITHOUT_STUDY_STATUS}
  ${FRAGMENT_MY_CARD_TYPE_SET}
  query GetCardRelated($mybook_ids: [ID], $index_ids: [ID]) {
    cardset_getByIndexIDs(index_ids: $index_ids) {
      status
      msg
      cardsets {
        ...MyCardSetFragmentWithoutStudyStatus
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
