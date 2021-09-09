import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
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
import SwichComponent from './SwichComponent';
import { Space, Tag } from '../../../../node_modules/antd/lib/index';
import moment from '../../../../node_modules/moment/moment';
import GetFilteredIndexButton from './GetFilteredIndexButton';

const menuTitleColSize = 3;
const menuColSize = 21;
const menuColDivider = 6;

const SessionConfig = ({
  submitCreateSessionConfigToServer,
  book_ids,
  firstFetch,
  onToggleIsAFilter,
  onChangeAFCardList,
  AFCardList,
  advancedFilteredCheckedIndexes,
  onChangeIndexesOfAFCardList,
}) => {
  const [counterForButtonClick, setCounterForButtonClick] = useState(0);

  const [mode, setMode] = useState('exam');
  const [sessionConfig, setSessionConfig] = useState({});
  const { loading, error, data, variables } = useQuery(GET_SESSTION_CONFIG, {
    variables: {
      mybook_ids: book_ids,
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

  const onChangeValue = useCallback(
    (...args) => {
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
    },
    [sessionConfig, mode]
  );
  // 아래 손봐야함 => 그냥 args[1]을 sessionConfig로 지정해야겠음 어차피 sessionConfig쓰는데
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
      setSessionConfig(args[0]);
    } else if (length == 1) {
      setSessionConfig(args[0]);
    }
  };

  const onChangeArrayValueForAdvancedFilter = (checked, name, value) => {
    if (checked) {
      const newData = produce(sessionConfig, (draft) => {
        draft.advancedFilter[name].value.push(value);
      });
      console.log(
        `현재 ${value} 스위치 ${!checked} 상태에서 다음 데이터로 변경`,
        newData.advancedFilter[name].value
      );
      setSessionConfig(newData);
    } else if (!checked) {
      const newData = produce(sessionConfig, (draft) => {
        draft.advancedFilter[name].value = draft.advancedFilter[
          name
        ].value.filter((item) => item != value);
      });
      console.log(
        `현재 ${value} 스위치 ${!checked} 상태에서 다음 데이터로 변경`,
        newData.advancedFilter[name].value
      );
      setSessionConfig(newData);
    }
  };

  const onChangeAFButtonClick = () => {
    setCounterForButtonClick((prev) => prev + 1);
  };
  const isOnNumStartCards = sessionConfig[mode]?.numStartCards?.onOff == 'on';
  const isOnAdvancedFilter = sessionConfig?.advancedFilter?.onOff == 'on';
  const isOnUserFlag = sessionConfig?.advancedFilter?.userFlag.onOff == 'on';
  const isOnMakerFlag = sessionConfig?.advancedFilter?.makerFlag.onOff == 'on';
  const isOnRecentStudyTime =
    sessionConfig?.advancedFilter?.recentStudyTime.onOff == 'on';
  const isOnLevelFilter = sessionConfig?.advancedFilter?.level.onOff == 'on';
  const isOnStudyTimesFilter =
    sessionConfig?.advancedFilter?.studyTimes.onOff == 'on';
  const isOnRecentDifficultyFilter =
    sessionConfig?.advancedFilter?.recentDifficulty.onOff == 'on';
  const isOnExamResultFilter =
    sessionConfig?.advancedFilter?.examResult.onOff == 'on';
  const selectedStudyStatus = sessionConfig[mode]?.useStatus;
  if (!error && !loading) {
    return (
      <Card>
        <Row>
          <Col span={12}>
            <Typography.Title level={4}>세션 설정</Typography.Title>
          </Col>
          <Col span={12}>
            <Button
              block
              style={{
                background: 'green',
                minWidth: '100px',
                color: 'white',
                fontSize: '13px',
                fontWeight: '700',
              }}
              onClick={() =>
                submitCreateSessionConfigToServer(sessionConfig, mode)
              }
            >
              세션 시작
            </Button>
          </Col>
        </Row>
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
            <Col
              xs={8}
              sm={menuTitleColSize}
              md={menuTitleColSize}
              lg={24}
              xl={24}
              xxl={24}
            >
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
                  <SwichComponent
                    funct={onChangeValueAnother}
                    switchArrayValue="read"
                    bigGrandParent={sessionConfig}
                    grandParent={mode}
                    parent="useCardtype"
                    target={sessionConfig[mode]?.useCardtype}
                  />
                </ColFormItem>
                <ColFormItem menuColDivider={menuColDivider} title="뒤집기카드">
                  <SwichComponent
                    funct={onChangeValueAnother}
                    switchArrayValue="flip"
                    bigGrandParent={sessionConfig}
                    grandParent={mode}
                    parent="useCardtype"
                    target={sessionConfig[mode]?.useCardtype}
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
                  <SwichComponent
                    funct={onChangeValueAnother}
                    switchArrayValue="ing"
                    bigGrandParent={sessionConfig}
                    grandParent={mode}
                    parent="useStatus"
                    target={sessionConfig[mode]?.useStatus}
                  />
                </ColFormItem>
                <ColFormItem menuColDivider={menuColDivider} title="미학습">
                  <SwichComponent
                    funct={onChangeValueAnother}
                    switchArrayValue="yet"
                    bigGrandParent={sessionConfig}
                    grandParent={mode}
                    parent="useStatus"
                    target={sessionConfig[mode]?.useStatus}
                  />
                </ColFormItem>
                <ColFormItem menuColDivider={menuColDivider} title="학습완료">
                  <SwichComponent
                    funct={onChangeValueAnother}
                    switchArrayValue="completed"
                    bigGrandParent={sessionConfig}
                    grandParent={mode}
                    parent="useStatus"
                    target={sessionConfig[mode]?.useStatus}
                  />
                </ColFormItem>
                <ColFormItem menuColDivider={menuColDivider} title="학습보류">
                  <SwichComponent
                    funct={onChangeValueAnother}
                    switchArrayValue="hold"
                    bigGrandParent={sessionConfig}
                    grandParent={mode}
                    parent="useStatus"
                    target={sessionConfig[mode]?.useStatus}
                  />
                </ColFormItem>
              </Row>
            </Col>
          </Row>
          {selectedStudyStatus?.includes('ing') && (
            <>
              <Row align="top" justify="center" gutter={8}>
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
                    onChange={(e) =>
                      onChangeValue(e.target.value, e.target.name)
                    }
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
                            format="MM-DD"
                            placeholder={['시작', '종료']}
                            onChange={(date, dateString) => {
                              const now = new Date();
                              const year = now.getFullYear();
                              const month = now.getMonth() + 1;
                              const day = now.getDate();
                              const today = moment(
                                `${year}-${month}-${day}`,
                                'YYYY-MM-DD'
                              );
                              // console.log(today);
                              const startYear = date[0]._d.getFullYear();
                              const startDate = moment(
                                `${startYear}-${dateString[0]}`,
                                'YYYY-MM-DD'
                              );
                              const endYear = date[0]._d.getFullYear();
                              const endDate = moment(
                                `${endYear}-${dateString[1]}`,
                                'YYYY-MM-DD'
                              );
                              const dif_from_startDate = moment
                                .duration(startDate.diff(today))
                                .asDays();
                              const dif_from_endDate = moment
                                .duration(endDate.diff(today))
                                .asDays();
                              console.log(dif_from_endDate);
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
            backgroundColor: isOnAdvancedFilter ? '#FFE4D3' : '#FFF',
            borderRadius: '5px',
            padding: '5px',
          }}
        >
          <Row align="top" gutter={8} style={{ marginBottom: '4px' }}>
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
            <Col span={3}>
              <Switch
                size="small"
                checked={isOnAdvancedFilter}
                onChange={(checked) => {
                  if (checked) {
                    onChangeValueAnother(
                      'on',
                      sessionConfig,
                      'advancedFilter',
                      'onOff'
                    );
                    if (counterForButtonClick > 0) {
                      onToggleIsAFilter(true);
                    }
                  } else {
                    onChangeValueAnother(
                      'off',
                      sessionConfig,
                      'advancedFilter',
                      'onOff'
                    );
                    onToggleIsAFilter(false);
                  }
                }}
              />
            </Col>
            {isOnAdvancedFilter && (
              <Col>
                <GetFilteredIndexButton
                  book_ids={book_ids}
                  advancedFilter={sessionConfig.advancedFilter}
                  onChangeAFCardList={onChangeAFCardList}
                  AFCardList={AFCardList}
                  onToggleIsAFilter={onToggleIsAFilter}
                  advancedFilteredCheckedIndexes={
                    advancedFilteredCheckedIndexes
                  }
                  onChangeIndexesOfAFCardList={onChangeIndexesOfAFCardList}
                  onChangeAFButtonClick={onChangeAFButtonClick}
                />
              </Col>
            )}
          </Row>
          {isOnAdvancedFilter && (
            <>
              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      사용자 플래그 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnUserFlag}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother(
                                'on',
                                sessionConfig,
                                'advancedFilter',
                                'userFlag',
                                'onOff'
                              );
                            } else {
                              onChangeValueAnother(
                                'off',
                                sessionConfig,
                                'advancedFilter',
                                'userFlag',
                                'onOff'
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnUserFlag ? (
                            <>
                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(
                                  0
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'userFlag',
                                    0
                                  );
                                }}
                              >
                                플래그 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(
                                  1
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'userFlag',
                                    1
                                  );
                                }}
                              >
                                플래그1
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(
                                  2
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'userFlag',
                                    2
                                  );
                                }}
                              >
                                플래그2
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(
                                  3
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'userFlag',
                                    3
                                  );
                                }}
                              >
                                플래그3
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(
                                  4
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'userFlag',
                                    4
                                  );
                                }}
                              >
                                플래그4
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.userFlag.value.includes(
                                  5
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'userFlag',
                                    5
                                  );
                                }}
                              >
                                플래그5
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.userFlag.value.includes(
                                    0
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그 없음
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.userFlag.value.includes(
                                    1
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그1
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.userFlag.value.includes(
                                    2
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그2
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.userFlag.value.includes(
                                    3
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그3
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.userFlag.value.includes(
                                    4
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그4
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.userFlag.value.includes(
                                    5
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그5
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      제작자 플래그 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnMakerFlag}
                          onChange={(checked) => {
                            if (checked) {
                              // const newData = produce(sessionConfig, (draft) => {
                              //   draft.advancedFilter.userFlag.onOff = 'on';
                              // });
                              // onChangeValue(newData);
                              onChangeValueAnother(
                                'on',
                                sessionConfig,
                                'advancedFilter',
                                'makerFlag',
                                'onOff'
                              );
                            } else {
                              onChangeValueAnother(
                                'off',
                                sessionConfig,
                                'advancedFilter',
                                'makerFlag',
                                'onOff'
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnMakerFlag ? (
                            <>
                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(
                                  0
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'makerFlag',
                                    0
                                  );
                                }}
                              >
                                플래그 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(
                                  1
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'makerFlag',
                                    1
                                  );
                                }}
                              >
                                플래그1
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(
                                  2
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'makerFlag',
                                    2
                                  );
                                }}
                              >
                                플래그2
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(
                                  3
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'makerFlag',
                                    3
                                  );
                                }}
                              >
                                플래그3
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(
                                  4
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'makerFlag',
                                    4
                                  );
                                }}
                              >
                                플래그4
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.makerFlag.value.includes(
                                  5
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'makerFlag',
                                    5
                                  );
                                }}
                              >
                                플래그5
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.makerFlag.value.includes(
                                    0
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그 없음
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.makerFlag.value.includes(
                                    1
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그1
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.makerFlag.value.includes(
                                    2
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그2
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.makerFlag.value.includes(
                                    3
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그3
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.makerFlag.value.includes(
                                    4
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그4
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.makerFlag.value.includes(
                                    5
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                플래그5
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      최근 학습 시점 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnRecentStudyTime}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother(
                                'on',
                                sessionConfig,
                                'advancedFilter',
                                'recentStudyTime',
                                'onOff'
                              );
                            } else {
                              onChangeValueAnother(
                                'off',
                                sessionConfig,
                                'advancedFilter',
                                'recentStudyTime',
                                'onOff'
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          <DatePicker.RangePicker
                            disabled={!isOnRecentStudyTime}
                            format="MM-DD"
                            placeholder={['시작', '종료']}
                            value={
                              sessionConfig?.advancedFilter?.recentStudyTime
                                ?.value == null
                                ? null
                                : [
                                    sessionConfig?.advancedFilter
                                      ?.recentStudyTime?.value[0] == 0
                                      ? moment()
                                      : moment().add(
                                          sessionConfig?.advancedFilter
                                            ?.recentStudyTime?.value[0],
                                          'days'
                                        ),

                                    sessionConfig?.advancedFilter
                                      ?.recentStudyTime?.value[1] == 0
                                      ? moment()
                                      : moment().add(
                                          sessionConfig?.advancedFilter
                                            ?.recentStudyTime?.value[1],
                                          'days'
                                        ),
                                  ]
                            }
                            onChange={(date, dateString) => {
                              console.log(date);
                              if (date != null) {
                                const now = new Date();
                                const year = now.getFullYear();
                                const month = now.getMonth() + 1;
                                const day = now.getDate();
                                const today = moment(
                                  `${year}-${month}-${day}`,
                                  'YYYY-MM-DD'
                                );
                                // console.log(today);
                                const startYear = date[0]._d.getFullYear();
                                const startDate = moment(
                                  `${startYear}-${dateString[0]}`,
                                  'YYYY-MM-DD'
                                );
                                const endYear = date[0]._d.getFullYear();
                                const endDate = moment(
                                  `${endYear}-${dateString[1]}`,
                                  'YYYY-MM-DD'
                                );
                                const dif_from_startDate = moment
                                  .duration(startDate.diff(today))
                                  .asDays();
                                const dif_from_endDate = moment
                                  .duration(endDate.diff(today))
                                  .asDays();

                                onChangeValueAnother(
                                  [dif_from_startDate, dif_from_endDate],
                                  sessionConfig,
                                  'advancedFilter',
                                  'recentStudyTime',
                                  'value'
                                );
                              }
                              if (date == null) {
                                onChangeValueAnother(
                                  null,
                                  sessionConfig,
                                  'advancedFilter',
                                  'recentStudyTime',
                                  'value'
                                );
                              }
                            }}
                            size="small"
                          />
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      카드 레벨 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnLevelFilter}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother(
                                'on',
                                sessionConfig,
                                'advancedFilter',
                                'level',
                                'onOff'
                              );
                            } else {
                              onChangeValueAnother(
                                'off',
                                sessionConfig,
                                'advancedFilter',
                                'level',
                                'onOff'
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          <Space>
                            <InputNumber
                              disabled={!isOnLevelFilter}
                              size="small"
                              min={1}
                              max={
                                sessionConfig.advancedFilter.level.value[1] ==
                                null
                                  ? null
                                  : sessionConfig.advancedFilter.level
                                      .value[1] - 1
                              }
                              value={
                                sessionConfig.advancedFilter.level.value[0]
                              }
                              formatter={(value) => `${value} level`}
                              parser={(value) => value.replace(' level', '')}
                              onChange={(value) => {
                                const newRange = [
                                  value,
                                  sessionConfig.advancedFilter.level.value[1],
                                ];
                                onChangeValueAnother(
                                  newRange,
                                  sessionConfig,
                                  'advancedFilter',
                                  'level',
                                  'value'
                                );
                              }}
                            />
                            ~
                            <InputNumber
                              disabled={!isOnLevelFilter}
                              size="small"
                              min={
                                sessionConfig.advancedFilter.level.value[0] ==
                                null
                                  ? null
                                  : sessionConfig.advancedFilter.level
                                      .value[0] + 1
                              }
                              max={10}
                              value={
                                sessionConfig.advancedFilter.level.value[1]
                              }
                              formatter={(value) => `${value} level`}
                              parser={(value) => value.replace(' level', '')}
                              onChange={(value) => {
                                const newRange = [
                                  sessionConfig.advancedFilter.level.value[0],
                                  value,
                                ];
                                onChangeValueAnother(
                                  newRange,
                                  sessionConfig,
                                  'advancedFilter',
                                  'level',
                                  'value'
                                );
                              }}
                            />
                          </Space>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      학습 횟수 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnStudyTimesFilter}
                          onChange={(checked) => {
                            if (checked) {
                              onChangeValueAnother(
                                'on',
                                sessionConfig,
                                'advancedFilter',
                                'studyTimes',
                                'onOff'
                              );
                            } else {
                              onChangeValueAnother(
                                'off',
                                sessionConfig,
                                'advancedFilter',
                                'studyTimes',
                                'onOff'
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          <Space>
                            <InputNumber
                              disabled={!isOnStudyTimesFilter}
                              size="small"
                              min={0}
                              max={
                                sessionConfig.advancedFilter.studyTimes
                                  .value[1] == null
                                  ? 99
                                  : sessionConfig.advancedFilter.studyTimes
                                      .value[1] - 1
                              }
                              value={
                                sessionConfig.advancedFilter.studyTimes.value[0]
                              }
                              formatter={(value) => `${value} 회`}
                              parser={(value) => value.replace(' 회', '')}
                              onChange={(value) => {
                                const newRange = [
                                  value,
                                  sessionConfig.advancedFilter.studyTimes
                                    .value[1],
                                ];
                                onChangeValueAnother(
                                  newRange,
                                  sessionConfig,
                                  'advancedFilter',
                                  'studyTimes',
                                  'value'
                                );
                              }}
                            />
                            ~
                            <InputNumber
                              disabled={!isOnStudyTimesFilter}
                              size="small"
                              min={
                                sessionConfig.advancedFilter.studyTimes
                                  .value[1] == null
                                  ? 2
                                  : sessionConfig.advancedFilter.studyTimes
                                      .value[0] + 1
                              }
                              max={100}
                              value={
                                sessionConfig.advancedFilter.studyTimes.value[1]
                              }
                              formatter={(value) => `${value} 회`}
                              parser={(value) => value.replace(' 회', '')}
                              onChange={(value) => {
                                const newRange = [
                                  sessionConfig.advancedFilter.studyTimes
                                    .value[0],
                                  value,
                                ];
                                onChangeValueAnother(
                                  newRange,
                                  sessionConfig,
                                  'advancedFilter',
                                  'studyTimes',
                                  'value'
                                );
                              }}
                            />
                          </Space>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      최근 선택한 난이도 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnRecentDifficultyFilter}
                          onChange={(checked) => {
                            if (checked) {
                              // const newData = produce(sessionConfig, (draft) => {
                              //   draft.advancedFilter.userFlag.onOff = 'on';
                              // });
                              // onChangeValue(newData);
                              onChangeValueAnother(
                                'on',
                                sessionConfig,
                                'advancedFilter',
                                'recentDifficulty',
                                'onOff'
                              );
                            } else {
                              onChangeValueAnother(
                                'off',
                                sessionConfig,
                                'advancedFilter',
                                'recentDifficulty',
                                'onOff'
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnRecentDifficultyFilter ? (
                            <>
                              <Tag.CheckableTag
                                color={
                                  isOnRecentDifficultyFilter
                                    ? '#f5f5f5'
                                    : '#1890ff'
                                }
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                  'none'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'recentDifficulty',
                                    'none'
                                  );
                                }}
                              >
                                결과 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={
                                  isOnRecentDifficultyFilter
                                    ? '#f5f5f5'
                                    : '#1890ff'
                                }
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                  'diffi1'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'recentDifficulty',
                                    'diffi1'
                                  );
                                }}
                              >
                                모름
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={
                                  isOnRecentDifficultyFilter
                                    ? '#f5f5f5'
                                    : '#1890ff'
                                }
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                  'diffi2'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'recentDifficulty',
                                    'diffi2'
                                  );
                                }}
                              >
                                어려움
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={
                                  isOnRecentDifficultyFilter
                                    ? '#f5f5f5'
                                    : '#1890ff'
                                }
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                  'diffi3'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'recentDifficulty',
                                    'diffi3'
                                  );
                                }}
                              >
                                애매함
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={
                                  !isOnRecentDifficultyFilter
                                    ? '#f5f5f5'
                                    : '#1890ff'
                                }
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                  'diffi4'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'recentDifficulty',
                                    'diffi4'
                                  );
                                }}
                              >
                                쉬움
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                color={
                                  isOnRecentDifficultyFilter
                                    ? '#f5f5f5'
                                    : '#1890ff'
                                }
                                checked={sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                  'diffi5'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'recentDifficulty',
                                    'diffi5'
                                  );
                                }}
                              >
                                알고있음
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                    'none'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                결과 없음
                              </Tag>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                    'diffi1'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                모름
                              </Tag>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                    'diffi2'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                어려움
                              </Tag>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                    'diffi3'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                애매함
                              </Tag>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                    'diffi4'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                쉬움
                              </Tag>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.recentDifficulty.value.includes(
                                    'diffi5'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                알고있음
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>

              <Card size="small">
                <Row>
                  <Col span={4}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      최근 시험 결과 필터
                    </span>
                  </Col>
                  <Col span={20}>
                    <Row>
                      <Col span={2}>
                        <Switch
                          size="small"
                          checked={isOnExamResultFilter}
                          onChange={(checked) => {
                            if (checked) {
                              // const newData = produce(sessionConfig, (draft) => {
                              //   draft.advancedFilter.userFlag.onOff = 'on';
                              // });
                              // onChangeValue(newData);
                              onChangeValueAnother(
                                'on',
                                sessionConfig,
                                'advancedFilter',
                                'examResult',
                                'onOff'
                              );
                            } else {
                              onChangeValueAnother(
                                'off',
                                sessionConfig,
                                'advancedFilter',
                                'examResult',
                                'onOff'
                              );
                            }
                          }}
                        />
                      </Col>

                      <Col span={22}>
                        <Row gutter={[8, 10]}>
                          {isOnExamResultFilter ? (
                            <>
                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.examResult.value.includes(
                                  'none'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'examResult',
                                    'none'
                                  );
                                }}
                              >
                                결과 없음
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.examResult.value.includes(
                                  'right'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'examResult',
                                    'right'
                                  );
                                }}
                              >
                                맞춘카드
                              </Tag.CheckableTag>

                              <Tag.CheckableTag
                                checked={sessionConfig.advancedFilter.examResult.value.includes(
                                  'wrong'
                                )}
                                onChange={(checked) => {
                                  onChangeArrayValueForAdvancedFilter(
                                    checked,
                                    'examResult',
                                    'wrong'
                                  );
                                }}
                              >
                                틀린카드
                              </Tag.CheckableTag>
                            </>
                          ) : (
                            <>
                              <Tag
                                color={
                                  sessionConfig.advancedFilter.examResult.value.includes(
                                    'none'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                결과 없음
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.examResult.value.includes(
                                    'right'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                맞춘카드
                              </Tag>

                              <Tag
                                color={
                                  sessionConfig.advancedFilter.examResult.value.includes(
                                    'wrong'
                                  )
                                    ? '#f5f5f5'
                                    : '#FFF'
                                }
                                style={{
                                  color: 'rgba(0, 0, 0, 0.447)',
                                  border: '1px solid #d9d9d9',
                                }}
                              >
                                틀린카드
                              </Tag>
                            </>
                          )}
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card>
            </>
          )}
        </div>
      </Card>
    );
  }
  return <></>;
};

export default SessionConfig;
