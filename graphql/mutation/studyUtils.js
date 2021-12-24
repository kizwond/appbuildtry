import { gql } from "@apollo/client";

export const ForAddEffect = gql`
  mutation ForAddEffect($forAddEffect: forAddEffect) {
    cardset_addEffect(forAddEffect: $forAddEffect) {
      status
      msg
      cardsets {
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
            hidden
            underline
            highlight
            location
            mycontent_id
            buycontent_id
          }
        }
      }
    }
  }
`;
