import { gql } from "@apollo/client";

export const ForAddEffect = gql`
  mutation ForAddEffect($forAddEffect: forAddEffect) {
    cardset_addEffect(forAddEffect: $forAddEffect) {
      status
      msg
    }
  }
`;
export const ForDeleteEffect = gql`
  mutation ForDeleteEffect($forDeleteEffect: forDeleteEffect) {
    cardset_deleteEffect(forDeleteEffect: $forDeleteEffect) {
      status
      msg
    }
  }
`;

export const UpdateStudyTool = gql`
  mutation UpdateStudyTool($forUpdateStudyTool: forUpdateStudyTool) {
    cardtypeset_updateStudyTool(forUpdateStudyTool: $forUpdateStudyTool) {
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
