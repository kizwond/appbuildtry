// mybookcateset_createMybookcate(forCreateMybookcate:forCreateMybookcate): _Mybookcateset

import { gql } from "@apollo/client";
import { FRAGMENT_CATEGORYSET } from "../fragment/categorySet";

export const UpdateMakerFlagRowStyle = gql`
  mutation UpdateMakerFlagRowStyle(
    $forUpdateMakerFlagRowStyle: forUpdateMakerFlagRowStyle
  ) {
    cardtypeset_updateMakerFlagRowStyle(
      forUpdateMakerFlagRowStyle: $forUpdateMakerFlagRowStyle
    ) {
      status
      msg
      cardtypesets {
        _id
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
      }
    }
  }
`;

export const UpdateFlagRowFont = gql`
  mutation UpdateFlagRowFont(
    $forUpdateMakerFlagCommentFont: forUpdateMakerFlagCommentFont
  ) {
    cardtypeset_updateMakerFlagCommentFont(
      forUpdateMakerFlagCommentFont: $forUpdateMakerFlagCommentFont
    ) {
      status
      msg
      cardtypesets {
        _id
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
      }
    }
  }
`;

export const UpdateFlagFigure = gql`
  mutation UpdateFlagFigure(
    $forUpdateMakerFlagFigureStyle: forUpdateMakerFlagFigureStyle
  ) {
    cardtypeset_updateMakerFlagFigureStyle(
      forUpdateMakerFlagFigureStyle: $forUpdateMakerFlagFigureStyle
    ) {
      status
      msg
      cardtypesets {
        _id
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
      }
    }
  }
`;
