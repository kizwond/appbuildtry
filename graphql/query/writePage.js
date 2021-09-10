import { gql } from '@apollo/client';

export const GET_CATEGORY_AND_BOOKS_INFO = gql`
  query {
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
    mybook_getAllMybook {
      status
      msg
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

export const GET_MY_BOOKS_INFO = gql`
  query {
    mybook_getAllMybook {
      status
      msg
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

export const CREATE_MY_BOOK = gql`
  mutation createMyBook($title: String!, $mybookcate_id: String) {
    mybook_create(title: $title, mybookcate_id: $mybookcate_id) {
      status
      msg
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

export const CHANGE_POSITION_OF_BOOK = gql`
  mutation PositioningBookMutation($direction: String, $mybook_id: String!) {
    mybook_changeorder(direction: $direction, mybook_id: $mybook_id) {
      status
      msg
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
