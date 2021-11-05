import { gql } from "@apollo/client";

export const GetCardTypeSetByMybookIds = gql`
  query GetCardTypeSetByMybookIds($mybook_ids: [ID]) {
    cardtypeset_getbymybookids(mybook_ids: $mybook_ids) {
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
            flip_option{
              card_direction
              left_face_ratio
            }
          }
          face_style {
            background{
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
              background{
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
              background{
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
              background{
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
        }


      }
    }
  }
`;
export const GetCardTypeSet = gql`
  query GetCardTypeSet($mybook_id: ID, $index_id: ID) {
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

    indexset_getbymybookid(mybook_id: $mybook_id){
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
            flip_option{
              card_direction
              left_face_ratio
            }
          }
          face_style {
            background{
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
              background{
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
              background{
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
              background{
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
        }


      }
    }
  }
`;

export const GetCardTypeSets = gql`
  query GetCardTypeSets($mybook_ids: [ID]) {
    cardtypeset_getbymybookids(mybook_ids: $mybook_ids) {
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
            flip_option{
              card_direction
              left_face_ratio
            }
          }
          face_style {
            background{
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
              background{
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
              background{
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
              background{
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
            flip_option{
              card_direction
              left_face_ratio
            }
          }
          face_style {
            background{
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
              background{
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
              background{
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
              background{
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
            flip_option{
              card_direction
              left_face_ratio
            }
          }
          face_style {
            background{
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
              background{
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
              background{
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
              background{
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
        }


      }
    }
  }
`;




