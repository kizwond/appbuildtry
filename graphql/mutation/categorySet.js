// mybookcateset_createMybookcate(forCreateMybookcate:forCreateMybookcate): _Mybookcateset

import { gql } from "@apollo/client";
import { FRAGMENT_CATEGORYSET } from "../fragment/categorySet";

export const MUTATION_CREATE_MY_BOOK_CATEGORY = gql`
  ${FRAGMENT_CATEGORYSET}
  mutation createMyBookCategory($forCreateMybookcate: forCreateMybookcate) {
    mybookcateset_createMybookcate(forCreateMybookcate: $forCreateMybookcate) {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
  }
`;

export const MUTATION_UPDATE_MY_BOOK_CATEGORY_NAME = gql`
  ${FRAGMENT_CATEGORYSET}
  mutation UpdateMyBookCategoryName($forUpdateMybookcateInfo: forUpdateMybookcateInfo) {
    mybookcateset_updateMybookcateInfo(forUpdateMybookcateInfo: $forUpdateMybookcateInfo) {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
  }
`;

export const MUTATION_UPDATE_MY_BOOK_CATEGORY_ORDER = gql`
  ${FRAGMENT_CATEGORYSET}
  mutation UpdateMyBookCategoryOrder($forUpdateMybookcateOrder: forUpdateMybookcateOrder) {
    mybookcateset_updateMybookcateOrder(forUpdateMybookcateOrder: $forUpdateMybookcateOrder) {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
  }
`;

export const MUTATION_DELETE_MY_BOOK_CATEGORY = gql`
  ${FRAGMENT_CATEGORYSET}
  mutation DeleteMyBookCategory($forDeleteMybookcate: forDeleteMybookcate) {
    mybookcateset_deleteMybookcate(forDeleteMybookcate: $forDeleteMybookcate) {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
  }
`;
