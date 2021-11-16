import { gql } from "@apollo/client";

export const UploadExcelFile = gql`
  mutation UploadExcelFile($forSaveAndExtractSheetList: forSaveAndExtractSheetList) {
    cardset_saveAndExtractSheetList(forSaveAndExtractSheetList: $forSaveAndExtractSheetList) {
      status
      msg
      filename
      sheetList {
        name
      }
    }
  }
`;

export const InspectTargetSheet = gql`
  mutation InspectTargetSheet($forInspectTargetSheet: forInspectTargetSheet) {
    cardset_inspectTargetSheet(forInspectTargetSheet: $forInspectTargetSheet) {
      status
      msg
      inspectionResult {
        successCards {
          cardtype_id
          cardtype
          hasParent
          content {
            face1
            selection
            face2
            annotation
          }
          makerFlag {
            value
            comment
          }
        }
        failureList {
          cardtype {
            row
            value
          }
          hasParent {
            row
            value
          }
          face {
            row
            value
          }
          row {
            row
            value
          }
        }
      }
    }
  }
`;


export const ImportExcelFile = gql`
  mutation ImportExcelFile($forConfirmMakeCard: forConfirmMakeCard) {
    cardset_confirmMakeCard(forConfirmMakeCard: $forConfirmMakeCard) {
      status
      msg
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
