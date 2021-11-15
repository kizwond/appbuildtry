import { gql } from "@apollo/client";

export const CHANGE_STUDY_LIKE = gql`
  mutation BookUpdateMutation($mybook_id: String!, $studylike: Boolean) {
    mybook_changestudylike(mybook_id: $mybook_id, studylike: $studylike) {
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

export const CHANGE_POSITION_OF_STUDY_LIKED_BOOK = gql`
  mutation PositioningFavoriteBookMutation($direction: String, $mybook_id: String!) {
    mybook_changestudylikeorder(direction: $direction, mybook_id: $mybook_id) {
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

export const GET_CATEGORY_AND_BOOKS_INFO_STUDY = gql`
  query {
    mybookcate_get {
      status
      msg
      mybookcates {
        _id
        mybookcate_info {
          user_id
          name
          seq
          isFixed
        }
      }
    }
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
