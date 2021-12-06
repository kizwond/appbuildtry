import { gql } from '@apollo/client';

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
    indexset_updateindexname(forUpdateIndexName: $forUpdateIndexName) {
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
    indexset_updateindexlevel(forUpdateIndexLevel: $forUpdateIndexLevel) {
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
    indexset_deleteindex(forDeleteIndex: $forDeleteIndex) {
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
