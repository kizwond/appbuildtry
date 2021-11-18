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
      cardsets {
        _id
        cardset_info {
          user_id
          mybook_id
          indexset_id
          index_id
        }
        cards {
          _id
          card_info {
            mybook_id
            indexset_id
            index_id
            cardset_id
            cardtypeset_id
            cardtype_id
            cardtype
            time_created
            hasParent
            parent_card_id
          }
          content {
            userFlag
            makerFlag {
              value
              comment
            }
            location
            mycontent_id
            buycontent_id
          }
        }
      }
      mycontents {
        _id
        user_id
        face1
        selection
        face2
        annotation
      }
      failureList {
        cardtypeErr {
          row
          value
        }
        hasParentErr {
          row
          value
        }
        faceNameErr {
          row
          value
        }
        rowNameErr {
          row
          value
        }
      }
      numCreatedCards {
        try
        read
        flip
        subject
        general
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
