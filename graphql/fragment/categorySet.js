import { gql } from "@apollo/client";

export const FRAGMENT_CATEGORYSET = gql`
  fragment MyCategorySetFragment on Mybookcateset {
    _id
    mybookcateset_info {
      user_id
    }
    mybookcates {
      _id
      name
      isFixed
    }
  }
`;
