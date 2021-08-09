import { gql } from "@apollo/client";

export const CardTypeCreate = gql`
  mutation CardTypeCreate($forCreateCardtype:forCreateCardtype) {
    cardtype_create(forCreateCardtype:$forCreateCardtype) {
      status
      msg
    }
  }
`;

