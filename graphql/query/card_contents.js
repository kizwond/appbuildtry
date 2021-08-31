import { gql } from "@apollo/client";

export const AddCard = gql`
  mutation AddCard($forAddCard: forAddCard) {
    cardset_addcard(forAddCard: $forAddCard) {
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
            cardtype_id
            cardtype
            time_created
            hasParent
            parent_card_id
          }
          contents {
            user_flag
            maker_flag
            location
            mycontents_id {
              _id
              face1
              selection
              face2
              annotation
              memo
            }
            buycontents_id {
              _id
              face1
              selection
              face2
              annotation
              memo
            }
          }
        }
      }
    }
  }
`;

export const GetCardSet = gql`
  query GetCardSet($index_id: ID) {
    cardset_getbyindexid(index_id: $index_id) {
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
            cardtype_id
            cardtype
            time_created
            hasParent
            parent_card_id
          }
          contents {
            user_flag
            maker_flag
            location
            mycontents_id {
              _id
              face1
              selection
              face2
              annotation
              memo
            }
            buycontents_id {
              _id
              face1
              selection
              face2
              annotation
              memo
            }
          }
        }
      }
    }
  }
`;
