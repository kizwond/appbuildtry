import { gql } from "@apollo/client";

export const GET_MENTORING = gql`
  query {
    mentoring_getMentoring {
      status
      msg
      mentorings {
        _id
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
          _id
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
          reqDate
        }
        receivedReqs {
          _id
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
          reqDate
        }
        myMentors {
          _id
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
          reqDate
        }
        myMentees {
          _id
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
          reqDate
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
        _id
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
          _id
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
          reqDate
        }
        receivedReqs {
          _id
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
          reqDate
        }
        myMentors {
          _id
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
          reqDate
        }
        myMentees {
          _id
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
          reqDate
        }
      }
    }
  }
`;
