import { gql } from "@apollo/client";

export const ForAddEffect = gql`
  mutation ForAddEffect($forAddEffect: forAddEffect) {
    cardset_addEffect(forAddEffect: $forAddEffect) {
      status
      msg
    }
  }
`;
