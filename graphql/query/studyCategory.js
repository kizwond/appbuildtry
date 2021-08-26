import { gql } from '@apollo/client';

export const GET_My_BOOK_CATEGORY_AND_MY_BOOK_CATEGORIES = gql`
  query GetMyBookCategories($mybook_id: ID) {
    mybook_getbyid(mybook_id: $mybook_id) {
      status
      msg
      mybooks {
        _id
        mybook_info {
          title
          mybookcate_id
        }
      }
    }
    mybookcate_get {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          user_id
          name
          seq
        }
      }
    }
  }
`;

export const BOOK_CHANGE_CATEGORY_MUTATION = gql`
  mutation BookChangeCategoryMutation(
    $mybook_id: String
    $target_mybookcate_id: String
  ) {
    mybook_movetoothercate(
      mybook_id: $mybook_id
      target_mybookcate_id: $target_mybookcate_id
    ) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
        }
      }
      mybooks {
        _id
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;
