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
    }
  }
`;
