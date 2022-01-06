import { gql } from "@apollo/client";

export const FRAGMENT_MYBOOK = gql`
  fragment MyBookFragment on Mybook {
    _id
    recentStudyIndexes
    mybook_info {
      title
      type
      user_id
      author_id
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
        numCompleted
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
        subject
        general
        common
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
