import { gql } from '@apollo/client';

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
  }
`;

export const CreateNewCategory = gql`
  mutation CreateNewCategory($name: String!, $current_mybookcate_id: String!) {
    mybookcate_create(
      name: $name
      current_mybookcate_id: $current_mybookcate_id
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
    }
  }
`;
export const DeleteCategory = gql`
  mutation DeleteCategory($mybookcate_id: String!) {
    mybookcate_delete(mybookcate_id: $mybookcate_id) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
        }
      }
    }
  }
`;
export const UpdateCategory = gql`
  mutation UpdateCategory($name: String!, $mybookcate_id: String!) {
    mybookcate_update(name: $name, mybookcate_id: $mybookcate_id) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
        }
      }
    }
  }
`;
export const PositioningCategory = gql`
  mutation PositioningCategory($direction: String, $mybookcate_id: String!) {
    mybookcate_changeorder(
      direction: $direction
      mybookcate_id: $mybookcate_id
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
