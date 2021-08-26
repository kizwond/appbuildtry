import { gql } from '@apollo/client';

export const GetIndex = gql`
  query Index($mybook_id: ID) {
    indexset_getbymybookid(mybook_id: $mybook_id) {
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
    indexset_addindex(forAddIndex: $forAddIndex) {
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
