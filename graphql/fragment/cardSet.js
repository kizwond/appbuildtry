import { gql } from "@apollo/client";

export const FRAGMENT_CARD_SET = gql`
  fragment MyCardSetFragment on Cardset {
    _id
    cardset_info {
      user_id
      mybook_id
      indexset_id
      index_id
    }
    cards {
      _id
      card_info {
        mybook_id
        indexset_id
        index_id
        cardset_id
        cardtypeset_id
        cardtype_id
        cardtype
        time_created
        hasParent
        parentCard_id
      }
      content {
        userFlag
        makerFlag {
          value
          comment
        }
        location
        mycontent_id
        buycontent_id
      }
    }
  }
`;
