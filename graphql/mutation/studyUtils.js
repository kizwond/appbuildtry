import { gql } from "@apollo/client";

export const ForAddEffect = gql`
  mutation ForAddEffect($forAddEffect: forAddEffect) {
    cardset_addEffect(forAddEffect: $forAddEffect) {
      status
      msg
    }
  }
`;
export const ForDeleteEffect = gql`
  mutation ForDeleteEffect($forDeleteEffect: forDeleteEffect) {
    cardset_deleteEffect(forDeleteEffect: $forDeleteEffect) {
      status
      msg
    }
  }
`;
