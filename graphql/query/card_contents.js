import { gql } from "@apollo/client";

export const AddCard = gql`
  mutation AddCard($forAddcardAtSameIndex: forAddcardAtSameIndex) {
    cardset_addcardAtSameIndex(forAddcardAtSameIndex: $forAddcardAtSameIndex) {
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
            location
            mycontent_id
            buycontent_id
          }
        }
      }
    }
  }
`;

export const GET_CARD_CONTENT = gql`
  query GET_CARD_CONTENT($mycontent_ids: [ID]) {
    mycontent_getMycontentByMycontentIDs(mycontent_ids: $mycontent_ids) {
      status
      msg
      mycontents{
        _id
        user_id
        face1
        selection
        face2
        annotation
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
