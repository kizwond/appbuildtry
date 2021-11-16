import { gql } from '@apollo/client';

export const IndexCreateMutation = gql`
  mutation IndexCreateMutation($forAddIndex: forAddIndex) {
    indexset_addIndex(forAddIndex: $forAddIndex) {
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

export const IndexRenameMutation = gql`
  mutation IndexRenameMutation($forUpdateIndexName: forUpdateIndexName) {
    indexset_updateIndexName(forUpdateIndexName: $forUpdateIndexName) {
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

export const IndexLevelMutation = gql`
  mutation IndexLevelMutation($forUpdateIndexLevel: forUpdateIndexLevel) {
    indexset_updateIndexLevel(forUpdateIndexLevel: $forUpdateIndexLevel) {
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

export const IndexDeleteMutation = gql`
  mutation IndexDeleteMutation($forDeleteIndex: forDeleteIndex) {
    indexset_deleteIndex(forDeleteIndex: $forDeleteIndex) {
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
