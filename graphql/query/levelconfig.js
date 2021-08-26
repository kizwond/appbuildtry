import { gql } from '@apollo/client';

export const GET_LEVEL_CONFIG = gql`
  query GetLevelConfig($mybook_id: ID) {
    levelconfig_get(mybook_id: $mybook_id) {
      status
      msg
      levelconfigs {
        _id
        restudy {
          restudyRatio
          levelchangeSensitivity
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

export const UPDATE_LEVEL_CONFIG = gql`
  mutation user_level_config_update(
    $forUpdateLevelconfig: forUpdateLevelconfig
  ) {
    levelconfig_update(forUpdateLevelconfig: $forUpdateLevelconfig) {
      status
      msg
      levelconfigs {
        _id
        restudy {
          restudyRatio
          levelchangeSensitivity
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
