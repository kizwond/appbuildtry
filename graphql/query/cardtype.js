import { gql } from "@apollo/client";

export const CardTypeCreate = gql`
  mutation CardTypeCreate($forAddCardtype: forAddCardtype) {
    cardtypeset_addcardtype(forAddCardtype: $forAddCardtype) {
      status
      msg
      cardtypesets {
        _id
        cardtypeset_info {
          user_id
          mybook_id
        }
        cardtypes {
          _id
          cardtype_info {
            name
            cardtype
            hasSelection
            num_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            excel_column {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            nick_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
          }
          card_style {
            card_direction
            left_face_ratio
            details {
              background_color
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
          face_style {
            background_color
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
            maker_flag {
              background_color
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
            face1 {
              background_color
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
            selection {
              background_color
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
              background_color
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
              background_color
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
            maker_flag {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            face1 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            selection {
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
        }
      
      
      }
    }
  }
`;
export const GetCardTypeSet = gql`
  query GetCardTypeSet($mybook_id: ID) {
    cardtypeset_getbymybookid(mybook_id: $mybook_id) {
      status
      msg
      cardtypesets {
        _id
        cardtypeset_info {
          user_id
          mybook_id
        }
        cardtypes {
          _id
          cardtype_info {
            name
            cardtype
            hasSelection
            num_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            excel_column {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            nick_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
          }
          card_style {
            card_direction
            left_face_ratio
            details {
              background_color
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
          face_style {
            background_color
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
            maker_flag {
              background_color
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
            face1 {
              background_color
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
            selection {
              background_color
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
              background_color
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
              background_color
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
            maker_flag {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            face1 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            selection {
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
        }


      }
    }
  }
`;

export const UpdateCardType = gql`
  mutation UpdateCardType($forUpdateCardStyle: forUpdateCardStyle) {
    cardtypeset_updatecardstyle(forUpdateCardStyle: $forUpdateCardStyle) {
      status
      msg
      cardtypesets {
        _id
        cardtypeset_info {
          user_id
          mybook_id
        }
        cardtypes {
          _id
          cardtype_info {
            name
            cardtype
            hasSelection
            num_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            excel_column {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            nick_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
          }
          card_style {
            card_direction
            left_face_ratio
            details {
              background_color
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
          face_style {
            background_color
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
            maker_flag {
              background_color
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
            face1 {
              background_color
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
            selection {
              background_color
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
              background_color
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
              background_color
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
            maker_flag {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            face1 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            selection {
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
        }


      }
    }
  }
`;

export const UpdateCardFace = gql`
  mutation UpdateCardFace($forUpdateFaceStyle: forUpdateFaceStyle) {
    cardtypeset_updatefacestyle(forUpdateFaceStyle: $forUpdateFaceStyle) {
      status
      msg
      cardtypesets {
        _id
        cardtypeset_info {
          user_id
          mybook_id
        }
        cardtypes {
          _id
          cardtype_info {
            name
            cardtype
            hasSelection
            num_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            excel_column {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            nick_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
          }
          card_style {
            card_direction
            left_face_ratio
            details {
              background_color
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
          face_style {
            background_color
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
            maker_flag {
              background_color
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
            face1 {
              background_color
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
            selection {
              background_color
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
              background_color
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
              background_color
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
            maker_flag {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            face1 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            selection {
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
        }


      }
    }
  }
`;





export const UpdateRowStyle = gql`
  mutation UpdateRowStyle($forUpdateRowStyle: forUpdateRowStyle) {
    cardtypeset_updaterowstyle(forUpdateRowStyle: $forUpdateRowStyle) {
      status
      msg
      cardtypesets {
        _id
        cardtypeset_info {
          user_id
          mybook_id
        }
        cardtypes {
          _id
          cardtype_info {
            name
            cardtype
            hasSelection
            num_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            excel_column {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            nick_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
          }
          card_style {
            card_direction
            left_face_ratio
            details {
              background_color
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
          face_style {
            background_color
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
            maker_flag {
              background_color
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
            face1 {
              background_color
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
            selection {
              background_color
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
              background_color
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
              background_color
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
            maker_flag {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            face1 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            selection {
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
        }


      }
    }
  }
`;


export const UpdateRowFont = gql`
  mutation UpdateRowFont($forUpdateRowFont: forUpdateRowFont) {
    cardtypeset_updaterowfont(forUpdateRowFont: $forUpdateRowFont) {
      status
      msg
      cardtypesets {
        _id
        cardtypeset_info {
          user_id
          mybook_id
        }
        cardtypes {
          _id
          cardtype_info {
            name
            cardtype
            hasSelection
            num_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            excel_column {
              maker_flag
              face1
              selection
              face2
              annotation
            }
            nick_of_row {
              maker_flag
              face1
              selection
              face2
              annotation
            }
          }
          card_style {
            card_direction
            left_face_ratio
            details {
              background_color
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
          face_style {
            background_color
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
            maker_flag {
              background_color
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
            face1 {
              background_color
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
            selection {
              background_color
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
              background_color
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
              background_color
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
            maker_flag {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            face1 {
              font
              size
              color
              align
              bold
              italic
              underline
            }
            selection {
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
        }


      }
    }
  }
`;




