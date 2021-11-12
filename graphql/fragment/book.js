import { gql } from "@apollo/client";

export const FRAGMENT_MYBOOK = gql`
  fragment MyBookFragment on Mybook {
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
`;
