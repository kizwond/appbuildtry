import { gql } from "@apollo/client";

export const GET_CATEGORY_AND_BOOKS_INFO = gql`
  query {
    mybookcateset_getMybookcatesetByUserID {
      status
      msg
      mybookcatesets {
        _id
        mybookcateset_info {
          use_id
        }
        mybookcates {
          _id
          name
          isFixed
        }
      }
    }
    mybook_getMybookByUserID {
      status
      msg
      mybooks {
        _id
        mybook_info {
          title
          type
          user_id
          mybookcateset_id
          mybookcate_id
          seqInCategory
          hideOrShow
          isStudyLike
          isWriteLike
          seqInStudyLike
          seqInWriteLike
        }
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
      }
    }
  }
`;

export const GET_MY_BOOKS_INFO = gql`
  query {
    mybook_getAllMybook {
      status
      msg
      mybooks {
        _id
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;

export const CREATE_MY_BOOK = gql`
  mutation createMyBook($title: String!, $mybookcate_id: String) {
    mybook_create(title: $title, mybookcate_id: $mybookcate_id) {
      status
      msg
      mybooks {
        _id
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;

export const UPDATE_BOOK_TITLE_AND_HIDE = gql`
  mutation BookUpdateMutation($mybook_id: String!, $title: String, $hide_or_show: String) {
    mybook_update(mybook_id: $mybook_id, title: $title, hide_or_show: $hide_or_show) {
      status
      msg
      mybooks {
        _id
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;
export const UPDATE_BOOK_HIDE = gql`
  mutation BookUpdateMutation($mybook_id: String!, $title: String, $hide_or_show: String) {
    mybook_update(mybook_id: $mybook_id, title: $title, hide_or_show: $hide_or_show) {
      status
      msg
      mybooks {
        mybook_info {
          hide_or_show
        }
      }
    }
  }
`;

export const CHANGE_WRITE_LIKE = gql`
  mutation BookUpdateMutation($mybook_id: String!, $writelike: Boolean) {
    mybook_changewritelike(mybook_id: $mybook_id, writelike: $writelike) {
      status
      msg
      mybooks {
        _id
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;

export const DELETE_A_BOOK = gql`
  mutation BookDeleteMutation($mybook_id: String!) {
    mybook_delete(mybook_id: $mybook_id) {
      status
      msg
      mybooks {
        _id
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;

export const BOOK_CATEGORY_CHANGE_MUTATION = gql`
  mutation BookChangeCategoryMutation($mybook_id: String, $target_mybookcate_id: String) {
    mybook_movetoothercate(mybook_id: $mybook_id, target_mybookcate_id: $target_mybookcate_id) {
      status
      msg
      mybooks {
        _id
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;

export const CHANGE_POSITION_OF_WRITE_LIKED_BOOK = gql`
  mutation PositioningFavoriteBookMutation($direction: String, $mybook_id: String!) {
    mybook_changewritelikeorder(direction: $direction, mybook_id: $mybook_id) {
      status
      msg
      mybooks {
        _id
        stats {
          overall {
            accuLevel
            studyHour
            numSession
          }
          recent {
            timeStudy
            timeModify
          }
          numCards {
            total
            read
            flip
          }
          writeHistory {
            date
            numCreatedCards
          }
          studyHistory {
            date
            level
            studyHour
          }
        }
        mybook_info {
          title
          type
          user_id
          mybookcate_id
          seq_in_category
          hide_or_show
          studylike
          writelike
          seq_in_studylike
          seq_in_writelike
        }
      }
    }
  }
`;

export const CHANGE_CATEGORY_NAME_MUTATION = gql`
  mutation ChangeCategoryName($name: String!, $mybookcate_id: String!) {
    mybookcate_update(mybookcate_id: $mybookcate_id, name: $name) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
          user_id
          isFixed
        }
      }
    }
  }
`;

export const CREATE_NEW_CATEGORY = gql`
  mutation CreateNewCategory($name: String!, $current_mybookcate_id: String!) {
    mybookcate_create(name: $name, current_mybookcate_id: $current_mybookcate_id) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
          user_id
          isFixed
        }
      }
    }
  }
`;

export const CHANGE_CATEGORY_ORDER = gql`
  mutation ChangeCategoryOrder($mybookcate_id: String!, $direction: String) {
    mybookcate_changeorder(mybookcate_id: $mybookcate_id, direction: $direction) {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          name
          seq
          user_id
          isFixed
        }
      }
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($mybookcate_id: String!) {
    mybookcate_delete(mybookcate_id: $mybookcate_id) {
      status
      msg
    }
  }
`;
