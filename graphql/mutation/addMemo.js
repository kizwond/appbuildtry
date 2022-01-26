import { gql } from "@apollo/client";
import {
    FRAGMENT_CARD_SET,
  } from "../fragment/cardSet";
export const SAVEMEMO = gql`
${FRAGMENT_CARD_SET}
  mutation SAVEMEMO($forUpdateMemo: forUpdateMemo) {
    cardset_updateMemo(forUpdateMemo: $forUpdateMemo) {
      status
      msg
      cardsets {
        ...MyCardSetFragment
      }
    }
  }
`;
