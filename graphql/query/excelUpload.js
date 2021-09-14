import { gql } from "@apollo/client";

export const UploadExcelFile = gql`
  mutation UploadExcelFile($forInspectExcelFile: forInspectExcelFile) {
    cardset_inspectExcelFileToImport(forInspectExcelFile: $forInspectExcelFile) {
      status
      msg
    }
  }
`;
