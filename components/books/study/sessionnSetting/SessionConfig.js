import React, { useState, useEffect } from 'react';
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
  Tabs,
  Button,
  Typography,
} from 'antd';
import { GET_SESSTION_CONFIG } from '../../../../graphql/query/studySessionSetting';
import { Divider, Space } from '../../../../node_modules/antd/lib/index';

const SessionConfig = ({ submitCreateSessionConfigToServer }) => {
  const [bookIdsList, setBookIdsList] = useState();
  const [mode, setMode] = useState('flip');
  const [formStates, setFormStates] = useState({});
  const { loading, error, data, variables } = useQuery(GET_SESSTION_CONFIG, {
    variables: {
      mybook_ids: bookIdsList,
    },
    onCompleted: (received_data) => {
      console.log(received_data);
    },
  });

  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem('books_selected'));
    console.log('북아이디리스트 설정 - 유즈 이펙트');

    const book_ids_list = booklist.map((book) => book.book_id);
    setBookIdsList(book_ids_list);
  }, []);

  const menuTitleColSize = 3;
  const menuColSize = 21;
  const menuColDivider = 6;
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
      </div>

      <Form
        name="settings"
        initialValues={{}}
        size="small"
        className="read_setting"
        onValuesChange={(changedValues, allValues) => {
          console.log(changedValues);
          console.log(allValues);
          setFormStates(allValues);
        }}
        colon={false}
      >
        <div
          style={{
            border: '1px solid lightgrey',
            marginBottom: '10px',
            background: 'white',
            borderRadius: '5px',
            padding: '5px',
          }}
        >
          <Row align="middle" gutter={8}>
            <Col span={menuTitleColSize}>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>
                보기 순서
              </span>
            </Col>
            <Col span={menuColSize}>
              <Form.Item name="sort_option">
                <Radio.Group>
                  <Row align="middle" gutter={8}>
                    <Col span={menuColDivider}>
                      <div>
                        <Radio value="standard">원본 그대로</Radio>
                      </div>
                    </Col>
                    <Col span={menuColDivider}>
                      <div>
                        <Radio value="time">복습 시점 빠른 순</Radio>
                      </div>
                    </Col>
                    <Col span={menuColDivider}>
                      <Radio value="random">랜덤</Radio>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
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
          <Row align="middle" gutter={8}>
            <Col span={menuTitleColSize}>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>
                카드종류
              </span>
            </Col>
            <Col span={menuColSize}>
              <Row align="middle" gutter={8}>
                <Col span={menuColDivider}>
                  <Form.Item
                    name="read_card"
                    label="읽기카드"
                    valuePropName="checked"
                  >
                    <Switch size="small" />
                  </Form.Item>
                </Col>
                <Col span={menuColDivider}>
                  <Form.Item
                    name="flip_card"
                    label="뒤집기카드"
                    valuePropName="checked"
                  >
                    <Switch size="small" />
                  </Form.Item>
                </Col>
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
          }}
        >
          <Row align="middle" gutter={8}>
            <Col span={menuTitleColSize}>
              <span style={{ fontSize: '12px', fontWeight: '700' }}>
                카드상태
              </span>
            </Col>
            <Col span={menuColSize}>
              <Row align="middle" gutter={8}>
                <Col
                  span={menuColDivider}
                  style={{
                    background: formStates.ing ? '#e6f7ff' : 'white',
                    borderTopLeftRadius: formStates.ing ? '5px' : 0,
                    borderTopRightRadius: formStates.ing ? '5px' : 0,
                  }}
                >
                  <Form.Item
                    name="ing"
                    label="학습중카드"
                    valuePropName="checked"
                  >
                    <Switch size="small" />
                  </Form.Item>
                </Col>
                <Col span={menuColDivider}>
                  <Form.Item
                    name="yet"
                    label="미학습카드"
                    valuePropName="checked"
                  >
                    <Switch size="small" />
                  </Form.Item>
                </Col>
                <Col span={menuColDivider}>
                  <Form.Item
                    name="completed"
                    label="학습완료카드"
                    valuePropName="checked"
                  >
                    <Switch size="small" />
                  </Form.Item>
                </Col>
                <Col span={menuColDivider}>
                  <Form.Item
                    name="hold"
                    label="학습보류카드"
                    valuePropName="checked"
                  >
                    <Switch size="small" />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          {formStates.ing && (
            <>
              <Row gutter={8}>
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
                  <Form.Item name="collect_criteria">
                    <Radio.Group>
                      <Row gutter={8}>
                        <Col span={menuColDivider}>
                          <Radio value="all">전체</Radio>
                        </Col>
                        <Col span={menuColDivider}>
                          <Radio value="by_now">
                            <div>금일자정 이전</div>
                          </Radio>
                        </Col>
                        <Col span={menuColDivider}>
                          <Radio value="by_today">
                            <div>현재 이전</div>
                          </Radio>
                        </Col>
                        <Col span={menuColDivider}>
                          <Radio value="custom">
                            직접설정
                            <Form.Item name="ing_card_self_setting">
                              <DatePicker.RangePicker
                                format="M월D일"
                                placeholder={['시작', '종료']}
                                onChange={(date, dateString) =>
                                  console.log('date', dateString)
                                }
                              />
                            </Form.Item>
                          </Radio>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}

          <Row gutter={8} style={{ marginTop: '10px' }}>
            <Col span={menuTitleColSize}>
              <Form.Item
                name="study_quantity_use_switch"
                // label={
                //   <span style={{ fontSize: '12px', fontWeight: '700' }}>
                //     학습량
                //   </span>
                // }
                valuePropName="checked"
              >
                <Switch
                  checkedChildren={
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>
                      학습량
                    </span>
                  }
                  unCheckedChildren={
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>
                      학습량
                    </span>
                  }
                  size="default"
                />
              </Form.Item>
            </Col>
            <Col span={menuColSize}>
              <Form.Item name="collect_criteria">
                <Radio.Group>
                  <Row align="middle" gutter={8}>
                    <Col span={menuColDivider}>
                      <Form.Item
                        name="yet_card_num"
                        label={
                          <span
                            style={{
                              color: formStates.study_quantity_use_switch
                                ? 'black'
                                : 'gray',
                            }}
                          >
                            미학습카드
                          </span>
                        }
                      >
                        <InputNumber
                          disabled={
                            formStates.study_quantity_use_switch ? false : true
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={menuColDivider}>
                      <Form.Item
                        name="ing_card_num"
                        label={
                          <span
                            style={{
                              color: formStates.study_quantity_use_switch
                                ? 'black'
                                : 'gray',
                            }}
                          >
                            학습중카드
                          </span>
                        }
                      >
                        <InputNumber
                          disabled={
                            formStates.study_quantity_use_switch ? false : true
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={menuColDivider}>
                      <Form.Item
                        name="completed_card_num"
                        label={
                          <span
                            style={{
                              color: formStates.study_quantity_use_switch
                                ? 'black'
                                : 'gray',
                            }}
                          >
                            학습완료카드
                          </span>
                        }
                      >
                        <InputNumber
                          disabled={
                            formStates.study_quantity_use_switch ? false : true
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={menuColDivider}>
                      <Form.Item
                        name="hold_card_num"
                        label={
                          <span
                            style={{
                              color: formStates.study_quantity_use_switch
                                ? 'black'
                                : 'gray',
                            }}
                          >
                            학습보류카드
                          </span>
                        }
                      >
                        <InputNumber
                          disabled={
                            formStates.study_quantity_use_switch ? false : true
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8} style={{ marginTop: '10px' }}>
            <Col span={menuTitleColSize}>
              <Form.Item
                name="study_quantity_use_switch"
                label={
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>
                    고급필터
                  </span>
                }
                valuePropName="checked"
              >
                <Switch size="small" />
              </Form.Item>
            </Col>
            <Col span={menuColSize}>
              {formStates.study_quantity_use_switch && (
                <Form.Item name="collect_criteria">
                  <Radio.Group>
                    <Row align="middle" gutter={8}>
                      <Col span={menuColDivider}>
                        <Form.Item name="yet_card_num" label="미학습카드">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={menuColDivider}>
                        <Form.Item name="ing_card_num" label="학습중카드">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={menuColDivider}>
                        <Form.Item
                          name="completed_card_num"
                          label="학습완료카드"
                        >
                          <InputNumber />
                        </Form.Item>
                      </Col>
                      <Col span={menuColDivider}>
                        <Form.Item name="hold_card_num" label="학습보류카드">
                          <InputNumber />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>
              )}
            </Col>
          </Row>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <span style={{ marginRight: '5px' }}>
              <Button size="small">고급필터</Button>
            </span>
            <Form.Item name="advanced_filter_mode" valuePropName="checked">
              <Switch size="small" />
            </Form.Item>
          </div>
        </div>
        {/* <Form.Item>
          <div
            style={{
              height: '100px',
              lineHeight: '100px',
              marginTop: '10px',
              textAlign: 'center',
              width: '253px',
            }}
          >
            <Button
              htmlType="submit"
              width="100%"
              fontSize="13px"
              style={{
                color: 'white',
                background: '#69d316',
                height: '50px',
              }}
              onClick={submitCreateSessionConfigToServer}
            >
              세션 시작하기
            </Button>
          </div>
        </Form.Item> */}
      </Form>
    </Card>
  );
};

export default SessionConfig;
