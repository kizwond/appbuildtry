import { gql } from "@apollo/client";
import { FRAGMENT_MYBOOK } from "../fragment/book";
import { FRAGMENT_CATEGORYSET } from "../fragment/categorySet";
import { FRAGMENT_MENTORING } from "../fragment/mentoring";
import { FRAGMENT_MY_CARD_TYPE_SET } from "../fragment/cardTypeSet";
import { FRAGMENT_CARD_SET } from "../fragment/cardSet";
import { FRAGMENT_BUY_BOOK } from "../fragment/buyBook";

// 유저 정보 불러오기
export const GET_USER_MINIMUM_INFORMATION_BY_USER_NAME = gql`
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
export const GET_USER_ALL_CATEGORY_AND_BOOKS = gql`
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

export const GET_USER_ALL_MY_BOOKS = gql`
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
export const GET_MY_BOOKS_BY_BOOK_IDS = gql`
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
  ${FRAGMENT_CARD_SET}
  ${FRAGMENT_MY_CARD_TYPE_SET}
  query GetCardRelated($mybook_ids: [ID], $index_ids: [ID]) {
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
  }
`;

// 멘토링
export const GET_MENTORING = gql`
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
export const GET_ALL_BUY_BOOKS = gql`
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
