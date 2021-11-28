import { gql } from "@apollo/client";
import { FRAGMENT_MENTORING } from "../fragment/mentoring";

export const MUTATION_REQUEST_MENTORING = gql`
  ${FRAGMENT_MENTORING}
  mutation RequestMentoring($forCreateMentoringReq: forCreateMentoringReq) {
    mentoring_createMentoringReq(forCreateMentoringReq: $forCreateMentoringReq) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_ACCEPT_MENTOR_REQUEST = gql`
  ${FRAGMENT_MENTORING}
  mutation AcceptMentorRequest($forAcceptMentoringReq: forAcceptMentoringReq) {
    mentoring_acceptMentoringReq(forAcceptMentoringReq: $forAcceptMentoringReq) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_CANCEL_MENTORING_REQUEST = gql`
  ${FRAGMENT_MENTORING}
  mutation CancelMentoringRequest($forCancelMentoringReq: forCancelMentoringReq) {
    mentoring_cancelMentoringReq(forCancelMentoringReq: $forCancelMentoringReq) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_UPDATE_MENTORING_REQUEST = gql`
  ${FRAGMENT_MENTORING}
  mutation UpdateMentoringRequest($forUpdateMentoringReq: forUpdateMentoringReq) {
    mentoring_updateMentoringReq(forUpdateMentoringReq: $forUpdateMentoringReq) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_UPDATE_MENTORING_GROUP = gql`
  ${FRAGMENT_MENTORING}
  mutation UpdateMentoringGroup($groupType: MentoringGroupType, $mentoringGroup_id: ID, $newMentoringGroupName: String) {
    mentoring_updateMentoringGroup(groupType: $groupType, mentoringGroup_id: $mentoringGroup_id, newMentoringGroupName: $newMentoringGroupName) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_CREATE_MENTORING_GROUP = gql`
  ${FRAGMENT_MENTORING}
  mutation CreateMentoringGroup($groupType: MentoringGroupType, $newGroupName: String) {
    mentoring_createMentoringGroup(groupType: $groupType, newGroupName: $newGroupName) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_CHANGE_MENTORING_GROUP_ORDER = gql`
  ${FRAGMENT_MENTORING}
  mutation ChangeMentoringGroupOrder($groupType: MentoringGroupType, $mentoringGroup_id: ID, $direction: String) {
    mentoring_changeMentoringGroupOrder(groupType: $groupType, mentoringGroup_id: $mentoringGroup_id, direction: $direction) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_DELETE_MENTORING_GROUP = gql`
  ${FRAGMENT_MENTORING}
  mutation DeleteMentoringGroup($groupType: MentoringGroupType, $currentMentoringGroup_id: ID, $moveToMentoringGroup_id: ID) {
    mentoring_deleteMentoringGroup(groupType: $groupType, currentMentoringGroup_id: $currentMentoringGroup_id, moveToMentoringGroup_id: $moveToMentoringGroup_id) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_TERMINATE_MENTORING = gql`
  ${FRAGMENT_MENTORING}
  mutation TerminateMentoring($forTerminateMentoring: forTerminateMentoring) {
    mentoring_terminateMentoring(forTerminateMentoring: $forTerminateMentoring) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;

export const MUTATION_RE_ASSIGN_MENTORING_GROUP_MEMBER = gql`
  ${FRAGMENT_MENTORING}
  mutation ReassignMentoringGroupMember($groupType: MentoringGroupType, $target_id: ID, $newMentoringGroup_id: ID) {
    mentoring_moveToOtherMentoringGroup(groupType: $groupType, target_id: $target_id, newMentoringGroup_id: $newMentoringGroup_id) {
      status
      msg
      mentorings {
        ...mentoringFragment
      }
    }
  }
`;
