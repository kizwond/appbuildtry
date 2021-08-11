import { gql } from '@apollo/client';

export const GET_LEVEL_CONFIG = gql`
  query GetLevelConfig($mybook_id: String) {
    levelconfig_get(mybook_id: $mybook_id) {
      status
      msg
      levelconfigs {
        restudy {
          option {
            diffi1 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi2 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi3 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi4 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
            diffi5 {
              on_off
              nick
              period
              shortcutkey
              gesture
            }
          }
        }
      }
    }
  }
`;
