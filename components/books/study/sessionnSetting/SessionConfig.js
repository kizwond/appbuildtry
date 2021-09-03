import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  Radio,
  Switch,
  Form,
  InputNumber,
  DatePicker,
  Card,
  Col,
  Row,
  Button,
  Typography,
} from 'antd';
import { GET_SESSTION_CONFIG } from '../../../../graphql/query/studySessionSetting';
import ColFormItem from './ColFormItem';
import produce from 'immer';
import { onChangeArrayValuesForSwitch } from './functionTool';

const menuTitleColSize = 3;
const menuColSize = 21;
const menuColDivider = 6;

const SessionConfig = ({ submitCreateSessionConfigToServer }) => {
  const [bookIdsList, setBookIdsList] = useState();
  const [mode, setMode] = useState('flip');
  const [sessionConfig, setSessionConfig] = useState({});
  const { loading, error, data, variables } = useQuery(GET_SESSTION_CONFIG, {
    variables: {
      mybook_ids: bookIdsList,
    },
    onCompleted: (received_data) => {
      console.log(received_data);
      setMode(
        received_data.session_getSessionConfig.sessionConfigs[0].studyMode
      );
      setSessionConfig(
        received_data.session_getSessionConfig.sessionConfigs[0]
      );
    },
  });

  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem('books_selected'));
    console.log('북아이디리스트 설정 - 유즈 이펙트');

    const book_ids_list = booklist.map((book) => book.book_id);
    setBookIdsList(book_ids_list);
  }, []);

  const onChangeValue = useCallback((...args) => {
    const length = args.length;
    console.log(args);
    if (length == 4) {
      const newData = produce(sessionConfig, (draft) => {
        draft[mode][args[1]][args[2]][args[3]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 3) {
      const newData = produce(sessionConfig, (draft) => {
        draft[mode][args[1]][args[2]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 2) {
      const newData = produce(sessionConfig, (draft) => {
        draft[mode][args[1]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 1) {
      setSessionConfig(args[0]);
    }
  });
  const onChangeValueAnother = (...args) => {
    const length = args.length;
    console.log(args);
    if (length == 5) {
      const newData = produce(args[1], (draft) => {
        draft[args[2]][args[3]][args[4]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 4) {
      const newData = produce(args[1], (draft) => {
        draft[args[2]][args[3]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 3) {
      const newData = produce(args[1], (draft) => {
        draft[args[2]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 2) {
      const newData = produce(args[1], (draft) => {
        draft[args[2]] = args[0];
      });
      setSessionConfig(newData);
    } else if (length == 1) {
      setSessionConfig(args[0]);
    }
  };

  const onChangeArrayValueForSwitch = (checked, name, value) => {
    if (checked) {
      const new_array = [...sessionConfig[mode][name], value];
      console.log(
        `현재 ${value} 스위치 ${!checked} 상태에서 다음 데이터로 변경`,
        new_array
      );
      onChangeValue(new_array, name);
    } else {
      const new_array = sessionConfig[mode][name].filter(
        (item) => item !== value
      );
      onChangeValue(new_array, name);
      console.log(
        `현재 ${value} 스위치 ${!checked} 상태에서 다음 데이터로 변경`,
        new_array
      );
    }
  };

  // const onChangeValueForSwitch = (
  //   ...args // args[0] = checked, args[1] = callback, args[2] = value, args[3] = biggrandparent, args[4] = grandparent, args[5] = parent, args[6] = son
  // ) => {
  //   const length = args.length;
  //   switch (length) {
  //     case 7:
  //       if (args[0]) {
  //         const new_array = [...args[3][args[4]][args[5]][args[6]], args[2]];
  //         console.log(
  //           `현재 ${args[6]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //         args[1](new_array, args[3], args[4], args[5], args[6]);
  //       } else {
  //         const new_array = args[3][args[4]][args[5]][args[6]].filter(
  //           (item) => item !== args[2]
  //         );
  //         args[1](new_array, args[3], args[4], args[5], args[6]);
  //         console.log(
  //           `현재 ${args[6]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //       }
  //       break;

  //     case 6:
  //       if (args[0]) {
  //         const new_array = [...args[3][args[4]][args[5]], args[2]];
  //         console.log(
  //           `현재 ${args[5]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //         args[1](new_array, args[3], args[4], args[5]);
  //       } else {
  //         const new_array = args[3][args[4]][args[5]].filter(
  //           (item) => item !== args[2]
  //         );
  //         args[1](new_array, args[3], args[4], args[5]);
  //         console.log(
  //           `현재 ${args[5]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //       }
  //       break;

  //     case 5:
  //       if (args[0]) {
  //         const new_array = [...args[3][args[4]], args[2]];
  //         console.log(
  //           `현재 ${args[4]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //         args[1](new_array, args[3], args[4]);
  //       } else {
  //         const new_array = args[3][args[4]].filter((item) => item !== args[2]);
  //         args[1](new_array, args[3], args[4]);
  //         console.log(
  //           `현재 ${args[4]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //       }
  //       break;

  //     case 4:
  //       if (args[0]) {
  //         const new_array = [...args[3], args[2]];
  //         console.log(
  //           `현재 ${args[3]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //         args[1](new_array, args[3]);
  //       } else {
  //         const new_array = args[3].filter((item) => item !== args[2]);
  //         args[1](new_array, args[3]);
  //         console.log(
  //           `현재 ${args[3]} 스위치 ${!args[0]} 상태에서 다음 데이터로 변경`,
  //           new_array
  //         );
  //       }
  //       break;

  //     default:
  //       console.log('스위치펑션 잘못되었음');
  //       break;
  //   }
  // };

  const isOnNumStartCards = sessionConfig[mode]?.numStartCards?.onOff == 'on';
  const isOnAdvancedFilter = sessionConfig?.advancedFilter?.onOff == 'on';
  const isOnUserFlag = sessionConfig?.advancedFilter?.userFlag.onOff == 'on';
  const selectedStudyStatus = sessionConfig[mode]?.useStatus;
  return (
    <Card>
      <Typography.Title level={4}>세션 설정</Typography.Title>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '1rem',
        }}
      >
        <Button
          type={mode === 'read' ? 'primary' : 'default'}
          onClick={() => setMode('read')}
        >
          읽기모드
        </Button>
        <Button
          type={mode === 'flip' ? 'primary' : 'default'}
          onClick={() => setMode('flip')}
        >
          뒤집기모드
        </Button>
        <Button
          type={mode === 'exam' ? 'primary' : 'default'}
          onClick={() => setMode('exam')}
        >
          시험모드
        </Button>
        <Button
          type={mode === 'exam' ? 'primary' : 'default'}
          onClick={() => console.log(sessionConfig)}
        >
          스테이트 확인용
        </Button>
      </div>

      <div
        style={{
          border: '1px solid lightgrey',
          marginBottom: '10px',
          background: 'white',
          borderRadius: '5px',
          padding: '5px',
        }}
      >
        <Row align="top" gutter={8}>
          <Col span={menuTitleColSize}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>
              보기 순서
            </span>
          </Col>
          <Col span={menuColSize}>
            <Radio.Group
              name="sortOption"
              onChange={(e) => onChangeValue(e.target.value, e.target.name)}
              value={sessionConfig[mode]?.sortOption}
            >
              <Row align="top" gutter={8}>
                <ColFormItem menuColDivider={menuColDivider}>
                  <Radio value="standard" size="small">
                    원본 그대로
                  </Radio>
                </ColFormItem>
                <ColFormItem menuColDivider={menuColDivider}>
                  <Radio value="time" size="small">
                    복습 시점 빠른 순
                  </Radio>
                </ColFormItem>
                <ColFormItem menuColDivider={menuColDivider}>
                  <Radio value="random" size="small">
                    랜덤
                  </Radio>
                </ColFormItem>
              </Row>
            </Radio.Group>
          </Col>
        </Row>
      </div>
      <div
        style={{
          border: '1px solid lightgrey',
          background: 'white',
          borderRadius: '5px',
          padding: '5px 5px 5px 5px',
          marginBottom: '10px',
        }}
      >
        <Row align="top" gutter={8}>
          <Col span={menuTitleColSize}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>
              카드종류
            </span>
          </Col>
          <Col span={menuColSize}>
            <Row align="top" gutter={8}>
              <ColFormItem menuColDivider={menuColDivider} title="읽기카드">
                <Switch
                  size="small"
                  checked={sessionConfig[mode]?.useCardtype.includes('read')}
                  onClick={(checked, e) => {
                    // e.target.name으로 'read'값을 입력하였으나 switch off상태에서
                    // off를 그대로 클릭하면 e 값이 undefined로 됨. 쓰면 안되겠음
                    onChangeArrayValuesForSwitch(
                      checked,
                      onChangeValueAnother,
                      'read',
                      sessionConfig,
                      mode,
                      'useCardtype'
                    );
                  }}
                />
              </ColFormItem>
              <ColFormItem menuColDivider={menuColDivider} title="뒤집기카드">
                <Switch
                  size="small"
                  checked={sessionConfig[mode]?.useCardtype.includes('flip')}
                  onClick={(checked) => {
                    onChangeArrayValueForSwitch(checked, 'useCardtype', 'flip');
                  }}
                />
              </ColFormItem>
            </Row>
          </Col>
        </Row>
      </div>

      <div
        style={{
          border: '1px solid lightgrey',
          background: 'white',
          borderRadius: '5px',
          padding: '5px',
          marginBottom: isOnAdvancedFilter ? '10px' : '0px',
        }}
      >
        <Row align="top" gutter={8}>
          <Col span={menuTitleColSize}>
            <span style={{ fontSize: '12px', fontWeight: '700' }}>
              카드상태
            </span>
          </Col>
          <Col span={menuColSize}>
            <Row align="top" gutter={8}>
              <ColFormItem
                menuColDivider={menuColDivider}
                title="학습중"
                style={{
                  background: selectedStudyStatus?.includes('ing')
                    ? '#e6f7ff'
                    : 'white',
                  borderTopLeftRadius: selectedStudyStatus?.includes('ing')
                    ? '5px'
                    : 0,
                  borderTopRightRadius: selectedStudyStatus?.includes('ing')
                    ? '5px'
                    : 0,
                  paddingBottom: '5px',
                }}
              >
                <Switch
                  size="small"
                  checked={selectedStudyStatus?.includes('ing')}
                  onClick={(checked) => {
                    onChangeArrayValueForSwitch(checked, 'useStatus', 'ing');
                  }}
                />
              </ColFormItem>
              <ColFormItem menuColDivider={menuColDivider} title="미학습">
                <Switch
                  size="small"
                  checked={selectedStudyStatus?.includes('yet')}
                  onClick={(checked) => {
                    onChangeArrayValueForSwitch(checked, 'useStatus', 'yet');
                  }}
                />
              </ColFormItem>
              <ColFormItem menuColDivider={menuColDivider} title="학습완료">
                <Switch
                  size="small"
                  checked={selectedStudyStatus?.includes('completed')}
                  onClick={(checked) => {
                    onChangeArrayValueForSwitch(
                      checked,
                      'useStatus',
                      'completed'
                    );
                  }}
                />
              </ColFormItem>
              <ColFormItem menuColDivider={menuColDivider} title="학습보류">
                <Switch
                  size="small"
                  checked={selectedStudyStatus?.includes('hold')}
                  onClick={(checked) => {
                    onChangeArrayValueForSwitch(checked, 'useStatus', 'hold');
                  }}
                />
              </ColFormItem>
            </Row>
          </Col>
        </Row>
        {selectedStudyStatus?.includes('ing') && (
          <>
            <Row align="top" gutter={8}>
              <Col span={menuTitleColSize}>
                <span style={{ fontSize: '12px', fontWeight: '700' }}></span>
              </Col>
              <Col
                span={menuColSize}
                style={{
                  background: '#e6f7ff',
                  paddingTop: '5px',
                  paddingBottom: '5px',
                  borderTopRightRadius: '5px',
                  borderBottomLeftRadius: '5px',
                  borderBottomRightRadius: '5px',
                }}
              >
                <Radio.Group
                  name="needStudyTimeCondition"
                  onChange={(e) => onChangeValue(e.target.value, e.target.name)}
                  value={sessionConfig[mode]?.needStudyTimeCondition}
                  size="small"
                >
                  <Row align="top" gutter={8}>
                    <ColFormItem menuColDivider={menuColDivider}>
                      <Radio value="all">전체</Radio>
                    </ColFormItem>
                    <ColFormItem menuColDivider={menuColDivider}>
                      <Radio value="untilNow">현재 이전</Radio>
                    </ColFormItem>
                    <ColFormItem menuColDivider={menuColDivider}>
                      <Radio value="untilToday">오늘 이전</Radio>
                    </ColFormItem>
                    <ColFormItem menuColDivider={menuColDivider}>
                      <Radio value="custom">직접입력</Radio>
                      {sessionConfig[mode]?.needStudyTimeCondition ==
                        'custom' && (
                        <DatePicker.RangePicker
                          format="M월D일"
                          placeholder={['시작', '종료']}
                          onChange={(date, dateString) => {
                            console.log('date', dateString);
                          }}
                          size="small"
                        />
                      )}
                    </ColFormItem>
                  </Row>
                </Radio.Group>
              </Col>
            </Row>
          </>
        )}

        <Row align="top" gutter={8} style={{ marginTop: '10px' }}>
          <Col span={menuTitleColSize}>
            <Row>
              <Col xs={24} sm={24} md={15} lg={14} xl={15} xxl={16}>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '700',
                    color: isOnNumStartCards ? 'black' : '#0000003f',
                  }}
                >
                  학습량
                </span>
              </Col>
              <Col xs={24} sm={24} md={9} lg={10} xl={9} xxl={8}>
                <Switch
                  size="small"
                  checked={isOnNumStartCards}
                  onChange={(checked) => {
                    if (checked) {
                      onChangeValue('on', 'numStartCards', 'onOff');
                    } else {
                      onChangeValue('off', 'numStartCards', 'onOff');
                    }
                  }}
                />
              </Col>
            </Row>
          </Col>
          <Col span={menuColSize}>
            <Row align="top" gutter={8}>
              <ColFormItem
                menuColDivider={menuColDivider}
                title={
                  <span
                    style={{
                      color: isOnNumStartCards ? 'black' : '#0000003f',
                    }}
                  >
                    미학습
                  </span>
                }
              >
                <InputNumber
                  disabled={!isOnNumStartCards}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.yet}
                  onChange={(value) => {
                    onChangeValue(value, 'numStartCards', 'yet');
                  }}
                />
              </ColFormItem>
              <ColFormItem
                menuColDivider={menuColDivider}
                title={
                  <span
                    style={{
                      color: isOnNumStartCards ? 'black' : '#0000003f',
                    }}
                  >
                    학습중
                  </span>
                }
              >
                <InputNumber
                  disabled={!isOnNumStartCards}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.ing}
                  onChange={(value) => {
                    onChangeValue(value, 'numStartCards', 'ing');
                  }}
                />
              </ColFormItem>
              <ColFormItem
                menuColDivider={menuColDivider}
                title={
                  <span
                    style={{
                      color: isOnNumStartCards ? 'black' : '#0000003f',
                    }}
                  >
                    학습완료
                  </span>
                }
              >
                <InputNumber
                  disabled={!isOnNumStartCards}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.completed}
                  onChange={(value) => {
                    onChangeValue(value, 'numStartCards', 'completed');
                  }}
                />
              </ColFormItem>
              <ColFormItem
                menuColDivider={menuColDivider}
                title={
                  <span
                    style={{
                      color: isOnNumStartCards ? 'black' : '#0000003f',
                    }}
                  >
                    학습보류
                  </span>
                }
              >
                <InputNumber
                  disabled={!isOnNumStartCards}
                  size="small"
                  value={sessionConfig[mode]?.numStartCards.hold}
                  onChange={(value) => {
                    onChangeValue(value, 'numStartCards', 'hold');
                  }}
                />
              </ColFormItem>
            </Row>
          </Col>
        </Row>
      </div>
      <div
        style={{
          border: isOnAdvancedFilter ? '1px solid lightgrey' : 'none',
          background: 'white',
          borderRadius: '5px',
          padding: '5px',
        }}
      >
        <Row align="top" gutter={8}>
          <Col span={menuTitleColSize}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: isOnAdvancedFilter ? '700' : '400',
                color: isOnAdvancedFilter ? 'black' : '#0000003f',
              }}
            >
              고급필터
            </span>
          </Col>
          <Col span={menuColSize}>
            <Switch
              size="small"
              checked={isOnAdvancedFilter}
              onChange={(checked) => {
                if (checked) {
                  const newData = produce(sessionConfig, (draft) => {
                    draft.advancedFilter.onOff = 'on';
                  });
                  onChangeValue(newData);
                } else {
                  const newData = produce(sessionConfig, (draft) => {
                    draft.advancedFilter.onOff = 'off';
                  });
                  onChangeValue(newData);
                }
              }}
            />
          </Col>
        </Row>
        {isOnAdvancedFilter && (
          <>
            <Row>
              <Col span={menuTitleColSize}>
                <Row>
                  <Col span={2}></Col>
                  <Col span={22}>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: '600',
                      }}
                    >
                      사용자 플래그 필터
                    </span>
                  </Col>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Col span={3}>
                    <Switch
                      size="small"
                      checked={isOnUserFlag}
                      onChange={(checked) => {
                        if (checked) {
                          const newData = produce(sessionConfig, (draft) => {
                            draft.advancedFilter.userFlag.onOff = 'on';
                          });
                          onChangeValue(newData);
                        } else {
                          const newData = produce(sessionConfig, (draft) => {
                            draft.advancedFilter.userFlag.onOff = 'off';
                          });
                          onChangeValue(newData);
                        }
                      }}
                    />
                  </Col>
                  <Col></Col>
                </Row>
              </Col>
            </Row>
          </>
        )}
      </div>
    </Card>
  );
};

export default SessionConfig;
