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
        _id
        date
        level {
          completed
          nonCompleted
        }
        numCardsByStatus {
          yet
          ing
          hold
          completed
        }
        numFinishedSession
        totalStudyHour
        totalClicks
      }
    }
  }
`;
