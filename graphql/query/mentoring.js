import { gql } from "@apollo/client";
import { MENTORING_FRAGMENT } from "../../src/fragments";

export const GET_MENTORING = gql`
  ${MENTORING_FRAGMENT}
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

export const GET_BOOKS_INFO = gql`
  query GetBooksInfo($mybook_ids: [ID]) {
    mybook_getManyMybookInfo(mybook_ids: $mybook_ids) {
      status
      msg
      mybooks {
        _id
        mybook_info {
          title
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

export const SEARCH_USER_INFO = gql`
  query SearchUserInfo($username: String) {
    user_getUserMinInfo(username: $username) {
      status
      msg
      _id
      username
      name
      organization
    }
  }
`;

export const REQUEST_MENTORING = gql`
  mutation RequestMentoring($forCreateMentoringReq: forCreateMentoringReq) {
    mentoring_createMentoringReq(forCreateMentoringReq: $forCreateMentoringReq) {
      status
      msg
      mentorings {
        mentoring_info {
          user_id
          menteeGroup {
            _id
            name
            isFixed
          }
          mentorGroup {
            _id
            name
            isFixed
          }
        }
        sentReqs {
          menteeUser_id
          mentorUser_id
          menteeUsername
          mentorUsername
          menteeName
          mentorName
          menteeOrganization
          mentorOrganization
          mybook_id
          mybookTitle
          comment
          reqStatus
          reqDate
          processedDate
        }
        receivedReqs {
          menteeUser_id
          mentorUser_id
          menteeUsername
          mentorUsername
          menteeName
          mentorName
          menteeOrganization
          mentorOrganization
          mybook_id
          mybookTitle
          comment
          reqStatus
          reqDate
          processedDate
        }
        myMentors {
          menteeUser_id
          mentorUser_id
          menteeUsername
          mentorUsername
          menteeName
          mentorName
          menteeOrganization
          mentorOrganization
          mybook_id
          mybookTitle
          comment
          mentoringStatus
          startDate
          finishDate
        }
        myMentees {
          menteeUser_id
          mentorUser_id
          menteeUsername
          mentorUsername
          menteeName
          mentorName
          menteeOrganization
          mentorOrganization
          mybook_id
          mybookTitle
          comment
          mentoringStatus
          startDate
          finishDate
        }
      }
    }
  }
`;
