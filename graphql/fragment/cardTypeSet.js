import { gql } from "@apollo/client";

export const FRAGMENT_MY_CARD_TYPE_SET = gql`
  fragment MyCardTypeSetFragment on Cardtypeset {
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
    }
  }
`;

export const FRAGMENT_MY_CARD_TYPE_SET_ONLY_CARDTYPE_NAME = gql`
  fragment MyCardTypenNameFragment on Cardtypeset {
    _id
    cardtypes {
      _id
      cardtype_info {
        name
      }
    }
  }
`;
