import { gql } from "@apollo/client";

export const GET_Feedback = gql`
  query {
    revisePost_getAllPost {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
        username
      }
    }
  }
`;

export const CreateFeedBack = gql`
  mutation CreateFeedBack($content: String) {
    revisePost_createPost(content: $content) {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
        username
      }
    }
  }
`;

export const UpdateFeedBack = gql`
  mutation UpdateFeedBack($revisePost_id:ID, $content: String) {
    revisePost_updatePost(revisePost_id: $revisePost_id,content: $content) {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
        username
      }
    }
  }
`;

export const DeleteFeedBack = gql`
  mutation DeleteFeedBack($revisePost_id:ID) {
    revisePost_deletePost(revisePost_id: $revisePost_id) {
      status
      msg
      simplePosts {
        _id
        user_id
        content
        timeCreated
        username
      }
    }
  }
`;

