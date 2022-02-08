import { gql } from "@apollo/client";
import { FRAGMENT_CARD_SET, FRAGMENT_CARD_SET_WITHOUT_STUDY_STATUS } from "../fragment/cardSet";

export const AddCard = gql`
  mutation AddCard($forAddcardAtSameIndex: forAddcardAtSameIndex) {
    cardset_addcardAtSameIndex(forAddcardAtSameIndex: $forAddcardAtSameIndex) {
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
            parentCard_id
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
    }
  }
`;
export const AddPolly = gql`
  mutation AddPolly($forMakeSoundFile: forMakeSoundFile) {
    cardset_makeSoundFile(forMakeSoundFile: $forMakeSoundFile) {
      status
      msg
      route
    }
  }
`;

export const Dictionary = gql`
  mutation Dictionary($targetWord: String) {
    cardset_inquireLanguageDictionary(targetWord: $targetWord) {
      status
      msg
      data1
    }
  }
`;
export const DeleteCard = gql`
  mutation DeleteCard($forDeleteCard: forDeleteCard) {
    cardset_deleteCard(forDeleteCard: $forDeleteCard) {
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
            parentCard_id
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
    }
  }
`;

export const UpdateMyContents = gql`
  mutation DeleteCard($forUpdateMycontent: forUpdateMycontent) {
    mycontent_updateMycontent(forUpdateMycontent: $forUpdateMycontent) {
      status
      msg
      mycontents {
        _id
        user_id
        face1
        selection
        face2
        annotation
      }
    }
  }
`;

export const UpdateMakerFlag = gql`
${FRAGMENT_CARD_SET}
  mutation UpdateMakerFlag($forUpdateMakerFlag: forUpdateMakerFlag) {
    cardset_updateMakerFlag(forUpdateMakerFlag: $forUpdateMakerFlag) {
      status
      msg
      cardsets {
        ...MyCardSetFragment
      }
    }
  }
`;

export const GET_CARD_CONTENT = gql`
  query GET_CARD_CONTENT($mycontent_ids: [ID]) {
    mycontent_getMycontentByMycontentIDs(mycontent_ids: $mycontent_ids) {
      status
      msg
      mycontents {
        _id
        user_id
        face1
        selection
        face2
        annotation
      }
    }
  }
`;

export const GET_CARDTYPESET = gql`
  query GET_CARDTYPESET($mybook_ids: [ID]) {
    cardtypeset_getbymybookids(mybook_ids: $mybook_ids) {
      status
      msg
      cardtypesets {
        _id
        cardtypeset_info {
          user_id
          mybook_id
        }
        studyTool {
          hidden {
            attr1
            attr2
            color
          }
          highlight {
            attr1
            attr2
            color
          }
          underline {
            attr1
            attr2
            color
          }
        }
        makerFlag_style {
          row_style {
            background {
              color
              opacity
            }
            outer_margin {
              top
              bottom
              left
              right
            }
            inner_padding {
              top
              bottom
              left
              right
            }
            border {
              top {
                bordertype
                thickness
                color
              }
              bottom {
                bordertype
                thickness
                color
              }
              left {
                bordertype
                thickness
                color
              }
              right {
                bordertype
                thickness
                color
              }
            }
          }
          figure_style {
            shape
            size
            color
          }
          comment_font {
            font
            size
            color
            align
            bold
            italic
            underline
          }
        }
        cardtypes {
          _id
          cardtype_info {
            name
            cardtype
            num_of_row {
              face1
              face2
              annotation
            }
            nick_of_row {
              face1
              face2
              annotation
            }
            flip_option {
              card_direction
              left_face_ratio
            }
          }
          face_style {
            background {
              color
              opacity
            }
            outer_margin {
              top
              bottom
              left
              right
            }
            inner_padding {
              top
              bottom
              left
              right
            }
            border {
              top {
                bordertype
                thickness
                color
              }
              bottom {
                bordertype
                thickness
                color
              }
              left {
                bordertype
                thickness
                color
              }
              right {
                bordertype
                thickness
                color
              }
            }
          }
          row_style {
            face1 {
              background {
                color
                opacity
              }
              outer_margin {
                top
                bottom
                left
                right
              }
              inner_padding {
                top
                bottom
                left
                right
              }
              border {
                top {
                  bordertype
                  thickness
                  color
                }
                bottom {
                  bordertype
                  thickness
                  color
                }
                left {
                  bordertype
                  thickness
                  color
                }
                right {
                  bordertype
                  thickness
                  color
                }
              }
            }
            face2 {
              background {
                color
                opacity
              }
              outer_margin {
                top
                bottom
                left
                right
              }
              inner_padding {
                top
                bottom
                left
                right
              }
              border {
                top {
                  bordertype
                  thickness
                  color
                }
                bottom {
                  bordertype
                  thickness
                  color
                }
                left {
                  bordertype
                  thickness
                  color
                }
                right {
                  bordertype
                  thickness
                  color
                }
              }
            }
            annotation {
              background {
                color
                opacity
              }
              outer_margin {
                top
                bottom
                left
                right
              }
              inner_padding {
                top
                bottom
                left
                right
              }
              border {
                top {
                  bordertype
                  thickness
                  color
                }
                bottom {
                  bordertype
                  thickness
                  color
                }
                left {
                  bordertype
                  thickness
                  color
                }
                right {
                  bordertype
                  thickness
                  color
                }
              }
            }
          }
          row_font {
            face1 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            face2 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            annotation {
              font
              size
              color
              align
              bold
              italic
              underline
            }
          }
          flipAlignOption {
            alignHorizontal
            alignVertical
            fontSizeAdjustment
          }
        }
      }
    }
  }
`;
export const GET_BUY_CARD_CONTENT = gql`
  query GET_CARD_CONTENT($buycontent_ids: [ID]) {
    buycontent_getBuycontentByBuycontentIDs(buycontent_ids: $buycontent_ids) {
      status
      msg
      buycontents {
        _id
        user_id
        face1
        selection
        face2
        annotation
      }
    }
  }
`;

export const GetCardSet = gql`
  query GetCardSet($index_id: ID) {
    cardset_getbyindexid(index_id: $index_id) {
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
            cardtype_id
            cardtype
            time_created
            hasParent
            parent_card_id
          }
          contents {
            user_flag
            maker_flag
            location
            mycontents_id {
              _id
              face1
              selection
              face2
              annotation
              memo
            }
            buycontents_id {
              _id
              face1
              selection
              face2
              annotation
              memo
            }
          }
        }
      }
    }
  }
`;
