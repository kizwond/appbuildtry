import { gql } from "@apollo/client";
import { FRAGMENT_MYBOOK } from "../fragment/book";
import { FRAGMENT_CATEGORYSET } from "../fragment/categorySet";

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