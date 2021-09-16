import { gql } from "@apollo/client";

export const UploadExcelFile = gql`
  mutation UploadExcelFile($forInspectExcelFile: forInspectExcelFile) {
    cardset_inspectExcelFileToImport(forInspectExcelFile: $forInspectExcelFile) {
      status
      msg
      filename
      inspectionResult {
        normal {
          row
          cardtype
          maker_flag
          face1
          face2
          annotation
        }
        cardtypeErr {
          row
          cardtype
          maker_flag
          face1
          face2
          annotation
        }
        makerflagErr {
          row
          cardtype
          maker_flag
          face1
          face2
          annotation
        }
      }
    }
  }
`;

export const ImportExcelFile = gql`
  mutation ImportExcelFile($forImportExcelFile: forImportExcelFile) {
    cardset_importExcelFile(forImportExcelFile: $forImportExcelFile) {
      status
      msg
      cardsets{
        _id
      }
    }
  }
`;

export const CancelImport = gql`
  mutation CancelImport($filename: String) {
    cardset_cancelImportExcelFile(filename: $filename) {
      status
      msg
    }
  }
`;


// cardsets {
//   _id
//   cardset_info {
//     user_id
//     mybook_id
//     indexset_id
//     index_id
//   }
//   cards {
//     _id
//     card_info {
//       cardtype_id
//       cardtype
//       time_created
//       hasParent
//       parent_card_id
//     }
//     constents {
//       user_flag
//       maker_flag
//       location
//       mycontents_id {
//         _id
//         face1
//         selection
//         face2
//         annotation
//         memo
//       }
//       buycontents_id {
//         _id
//         face1
//         selection
//         face2
//         annotation
//         memo
//       }
//     }
//   }
// }