import { gql } from "@apollo/client";

export const FRAGMENT_MENTORING = gql`
  fragment mentoringFragment on Mentoring {
    _id
    mentoring_info {
      user_id
      menteeGroup {
        _id
        name
      }
      mentorGroup {
        _id
        name
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
      reqStatus
      reqDate
      processedDate
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
      reqStatus
      reqDate
      processedDate
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
      mentorGroup_id
      mentoringStatus
      startDate
      finishDate
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
      menteeGroup_id
      mentoringStatus
      startDate
      finishDate
    }
  }
`;
