import { gql } from "@apollo/client";
import { FRAGMENT_MYBOOK } from "../fragment/book";
import { FRAGMENT_CATEGORYSET } from "../fragment/categorySet";
import { FRAGMENT_MENTORING } from "../fragment/mentoring";

// 책정보 및 카테고리 정보 불러오기
export const GET_USER_ALL_CATEGORY_AND_BOOKS = gql`
  ${FRAGMENT_MYBOOK}
  ${FRAGMENT_CATEGORYSET}
  query {
    mybookcateset_getMybookcatesetByUserID {
      status
      msg
      mybookcatesets {
        ...MyCategorySetFragment
      }
    }
    mybook_getMybookByUserID {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;

export const GET_USER_ALL_MY_BOOKS = gql`
  ${FRAGMENT_MYBOOK}
  query {
    mybook_getMybookByUserID {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;

// 책 정보 불러오기
export const GET_MY_BOOKS_BY_BOOK_IDS = gql`
  ${FRAGMENT_MYBOOK}
  query GetMyBooksByBooksIds($mybook_ids: [ID]) {
    mybook_getMybookByMybookIDs(mybook_ids: $mybook_ids) {
      status
      msg
      mybooks {
        ...MyBookFragment
      }
    }
  }
`;

export const GetIndex = gql`
  query Index($mybook_ids: [ID]) {
    indexset_getByMybookids(mybook_ids: $mybook_ids) {
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
  }
`;

// 멘토링
export const GET_MENTORING = gql`
  ${FRAGMENT_MENTORING}
  query {
    mentoring_getMentoring {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const GetCardRelated = gql`
  query GetCardRelated($mybook_ids: [ID], $index_ids: [ID]) {
    cardset_getByIndexIDs(index_ids: $index_ids) {
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

    indexset_getByMybookids(mybook_ids: $mybook_ids) {
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
    }
  }
`;
