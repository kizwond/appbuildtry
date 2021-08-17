import { gql } from "@apollo/client";

export const CardTypeCreate = gql`
  mutation CardTypeCreate($forCreateCardtype: forCreateCardtype) {
    cardtype_create(forCreateCardtype: $forCreateCardtype) {
      status
      msg
    }
  }
`;

export const GetCardType = gql`
  query GetCardType($mybook_id: String) {
    cardtype_get(mybook_id: $mybook_id) {
      status
      msg
      cardtypes {
        _id
        cardtype_info {
          mybook_id
          cardtype
          hasSelection
          name
          seq_in_mybook
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
                type
                thickness
                color
              }
              bottom {
                type
                thickness
                color
              }
              left {
                type
                thickness
                color
              }
              right {
                type
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
              type
              thickness
              color
            }
            bottom {
              type
              thickness
              color
            }
            left {
              type
              thickness
              color
            }
            right {
              type
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
              top{
                type
                thickness
                color
              }
              bottom{
                type
                thickness
                color
              }
              left{
                type
                thickness
                color
              }
              right{
                type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
`;

export const UpdateCardType = gql`
  mutation UpdateCardType($forUpdateCardtypeDetail: forUpdateCardtypeDetail) {
    cardtype_updateDetail(forUpdateCardtypeDetail: $forUpdateCardtypeDetail) {
      status
      msg
      cardtypes {
        _id
        cardtype_info {
          mybook_id
          cardtype
          hasSelection
          name
          seq_in_mybook
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
                type
                thickness
                color
              }
              bottom {
                type
                thickness
                color
              }
              left {
                type
                thickness
                color
              }
              right {
                type
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
              type
              thickness
              color
            }
            bottom {
              type
              thickness
              color
            }
            left {
              type
              thickness
              color
            }
            right {
              type
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
              top{
                type
                thickness
                color
              }
              bottom{
                type
                thickness
                color
              }
              left{
                type
                thickness
                color
              }
              right{
                type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
                top{
                  type
                  thickness
                  color
                }
                bottom{
                  type
                  thickness
                  color
                }
                left{
                  type
                  thickness
                  color
                }
                right{
                  type
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
`;
