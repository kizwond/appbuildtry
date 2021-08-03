import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql, useMutation } from "@apollo/client";

export const GetCategory = gql`
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
    mybook_get {
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

export const BookDeleteMutation = gql`
  mutation BookDeleteMutation($mybook_id: String!) {
    mybook_delete(mybook_id: $mybook_id) {
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

export const BookUpdateMutation = gql`
  mutation BookUpdateMutation($mybook_id: String!, $title: String, $hide_or_show: String) {
    mybook_update(mybook_id: $mybook_id, title: $title, hide_or_show: $hide_or_show) {
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
export const BookLikeMutation = gql`
  mutation BookLikeMutation($mybook_id: String!, $writelike: Boolean) {
    mybook_changewritelike(mybook_id: $mybook_id, writelike: $writelike) {
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

export const PositioningBookMutation = gql`
  mutation PositioningBookMutation($direction: String, $mybook_id: String!) {
    mybook_changeorder(direction: $direction, mybook_id: $mybook_id) {
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

export const PositioningLikeBookMutation = gql`
  mutation PositioningLikeBookMutation($direction: String, $mybook_id: String!) {
    mybook_changewritelikeorder(direction: $direction, mybook_id: $mybook_id) {
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

export const BookChangeCategoryMutation = gql`
  mutation BookChangeCategoryMutation($mybook_id: String, $target_mybookcate_id : String) {
    mybook_movetoothercate(mybook_id: $mybook_id, target_mybookcate_id: $target_mybookcate_id) {
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
