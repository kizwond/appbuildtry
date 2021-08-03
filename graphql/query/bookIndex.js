import { gql } from "@apollo/client";

export const GetIndex = gql`
  query Index($mybook_id:String){
    index_get(mybook_id:$mybook_id) {
      status
      msg
      indexes {
        _id
        index_info {
          mybook_id 
          name  
          seq 
          level 
          type 
        }
      }
    }
  }
`;

export const IndexCreateMutation = gql`
  mutation IndexCreateMutation($mybook_id: String, $name : String, $current_index_id: String, $current_seq: Int, $current_level: Int ) {
    index_create(mybook_id: $mybook_id, name : $name, current_index_id: $current_index_id, current_seq: $current_seq, current_level: $current_level) {
      status
      msg
      indexes {
        _id
        index_info {
          mybook_id 
          name  
          seq 
          level 
          type 
        }
      }
    }
  }
`;

export const IndexRenameMutation = gql`
  mutation IndexRenameMutation($mybook_id: String, $name : String, $index_id: String) {
    index_update(mybook_id: $mybook_id, name : $name, index_id: $index_id) {
      status
      msg
      indexes {
        _id
        index_info {
          mybook_id 
          name  
          seq 
          level 
          type 
        }
      }
    }
  }
`;
