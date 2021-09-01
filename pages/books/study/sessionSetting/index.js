import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
  SESSION_CREATE_SESSION,
} from '../../../../graphql/query/studySessionSetting';
import Layout from '../../../../components/layout/Layout';
import Footer from '../../../../components/index/Footer';
import IndexTree from '../../../../components/books/study/sessionnSetting/IndexTree';
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
} from 'antd';
import styled from 'styled-components';
import { useRouter } from "next/router";

const SessionSetting = () => {
  const router = useRouter();
  const [cardsList, setCardsList] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const counter = useRef(0);
  const [bookList, setBookList] = useState([]);
  const [responsiveUI, setResponsiveUI] = useState(false);

  useEffect(() => {
    const booklist = JSON.parse(sessionStorage.getItem('books_selected'));
    console.log('북아이디리스트 설정 - 유즈 이펙트');

    const book_list = booklist.map((book, index) => ({
      book_id: book.book_id,
      book_title: book.book_title,
      seq: index,
    }));
    setBookList(book_list);
  }, []);

  const [session_createSession] = useMutation(SESSION_CREATE_SESSION, {
    onCompleted: (data) => {
      sessionStorage.setItem(
        'session_Id',
        JSON.stringify(data.session_createSession.sessions[0]._id)
      );
      router.push(`/books/study/mode/flip/${data.session_createSession.sessions[0]._id}`);
    },
  });

  const submitCreateSessionConfigToServer = async () => {
    const keysArray = Object.keys(checkedKeys);
    const sessionScope = keysArray.map((item) => ({
      mybook_id: item,
      index_ids: checkedKeys[item],
    }));

    try {
      await session_createSession({
        variables: {
          forCreateSession: {
            sessionScope: sessionScope,
            sessionConfig: {
              studyMode: 'flip',
              detailedOption: {
                sortOption: 'standard',
                useCardtype: ['read', 'flip'],
                useStatus: ['yet', 'ing', 'hold', 'completed'],
                needStudyTimeCondition: 'all',
                needStudyTimeRange: [0, 1],
                numStartCards: {
                  onOff: 'off',
                  yet: 50,
                  ing: 50,
                  hold: 0,
                  completed: 0,
                },
              },
              advancedFilter: {
                onOff: 'off',
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const { loading, error, data, variables } = useQuery(
    GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
    {
      variables: {
        forGetNumCardsbyIndex: {
          mybook_id: bookList[counter.current]?.book_id,
          advancedFilter: null,
        },
      },
      onCompleted: (received_data) => {
        console.log('통신완료 후 onCompleted 코드 시작');
        if (counter.current < bookList.length - 1) {
          console.log('카운터설정');
          counter.current += 1;
        }

        // const bookIndexIdsList =
        //   received_data.session_getNumCardsbyIndex.indexsets[0].indexes.map(
        //     (item) => item._id
        //   );
        // setCheckedKeys({
        //   ...checkedKeys,
        //   [received_data.session_getNumCardsbyIndex.indexsets[0].indexset_info
        //     .mybook_id]: bookIndexIdsList,
        // });

        console.log('카테고리설정');
        setCardsList([...cardsList, received_data]);
        console.log(received_data);
        console.log('통신완료 후 onCopleted 코드 종료');
      },
    }
  );

  useEffect(() => {
    if (data?.session_getNumCardsbyIndex?.indexsets[0]) {
      const bookIndexIdsList =
        data.session_getNumCardsbyIndex.indexsets[0].indexes.map(
          (item) => item._id
        );
      setCheckedKeys({
        ...checkedKeys,
        [data.session_getNumCardsbyIndex.indexsets[0].indexset_info.mybook_id]:
          bookIndexIdsList,
      });
    }
  }, [data]);

  if (error) {
    console.log('에러', error);
    console.log(variables);
    return <div>에러발생</div>;
  }

  console.log(cardsList);

  const onCheckIndexesCheckedKeys = (
    checkedKeysValueOfBook,
    selectedBookId
  ) => {
    setCheckedKeys({
      ...checkedKeys,
      [selectedBookId]: checkedKeysValueOfBook,
    });
  };

  return (
    <Layout>
      <Row>
        <Col xs={18} sm={18} md={18} lg={18} xl={18} xxl={18}>
          <Card>
            <Tabs type="card" tabPosition={responsiveUI ? 'top' : 'left'}>
              {bookList.map((book, index) => (
                <Tabs.TabPane tab={book.book_title} key={book.book_id}>
                  {cardsList[0] && (
                    <IndexTree
                      bookIndexInfo={
                        cardsList[index]?.session_getNumCardsbyIndex
                          ?.indexsets[0]?.indexes
                      }
                      checkedKeys={checkedKeys[book.book_id]}
                      selectedbookId={book.book_id}
                      onCheckIndexesCheckedKeys={onCheckIndexesCheckedKeys}
                    />
                  )}
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Card>
        </Col>
        <StyledCol xs={6} sm={6} md={6} lg={6} xl={6} xxl={6}>
          <Tabs
            type="card"
            size="large"
            tabPosition="left"
            tabBarStyle={{ height: '85vh' }}
          >
            <Tabs.TabPane
              tab={
                <>
                  <div>책</div>
                  <div>모</div>
                  <div>드</div>
                </>
              }
              key="read"
              style={{ textAlign: 'left', padding: '10px' }}
            >
              <Form
                name="settings"
                initialValues={{}}
                size="small"
                className="read_setting"
              >
                <div
                  style={{
                    border: '1px solid lightgrey',
                    marginBottom: '10px',
                    background: 'white',
                    borderRadius: '5px',
                    padding: '5px',
                    textAlign: 'left',
                    display: 'column',
                    justifyContent: 'start',
                  }}
                >
                  <Form.Item name="sort_option" noStyle>
                    <Radio.Group
                      style={{ display: 'flex', flexDirection: 'column' }}
                    >
                      <Radio value="standard" style={{ fontSize: '11px' }}>
                        원본 그대로
                      </Radio>
                      <Radio value="time" style={{ fontSize: '11px' }}>
                        복습시점 빠른 순으로 정렬
                      </Radio>
                      <Radio value="random" style={{ fontSize: '11px' }}>
                        랜덤하게 섞기
                      </Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>
                  카드타입설정
                </div>
                <div
                  style={{
                    border: '1px solid lightgrey',
                    background: 'white',
                    borderRadius: '5px',
                    padding: '5 5 0 5',
                    // textAlign: 'left',
                    marginBottom: '10px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        marginLeft: '20px',
                        marginRight: '15px',
                      }}
                    >
                      읽기카드
                    </span>
                    <Form.Item name="read_card" valuePropName="checked">
                      <Switch size="small" />
                    </Form.Item>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        marginLeft: '20px',
                        marginRight: '5px',
                      }}
                    >
                      뒤집기카드
                    </span>
                    <Form.Item name="flip_card" valuePropName="checked">
                      <Switch size="small" />
                    </Form.Item>
                  </div>
                </div>
                <div style={{ fontSize: '13px', fontWeight: '700' }}>
                  필터 설정
                </div>
                <div
                  style={{
                    border: '1px solid lightgrey',
                    background: 'white',
                    borderRadius: '5px',
                    padding: '5px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: '700' }}>
                    학습상태
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        marginLeft: '20px',
                        marginRight: '5px',
                      }}
                    >
                      미학습카드
                    </span>
                    <Form.Item name="yet" valuePropName="checked">
                      <Switch size="small" />
                    </Form.Item>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        marginLeft: '20px',
                        marginRight: '5px',
                      }}
                    >
                      학습중카드
                    </span>
                    <Form.Item name="ing" valuePropName="checked">
                      <Switch size="small" />
                    </Form.Item>
                  </div>

                  <div style={{ background: 'white', padding: '5px' }}>
                    <Form.Item name="collect_criteria">
                      <Radio.Group
                        style={{
                          marginLeft: '30px',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Radio value="all" style={{ fontSize: '11px' }}>
                          전체카드
                        </Radio>
                        <Radio value="by_now" style={{ fontSize: '11px' }}>
                          금일자정이전 복습필요 카드만
                        </Radio>
                        <Radio value="by_today" style={{ fontSize: '11px' }}>
                          현재시간이전 복습필요 카드만
                        </Radio>
                        <Radio
                          value="custom"
                          style={{ fontSize: '11px', marginBottom: '5px' }}
                        >
                          복습시점 직접설정
                        </Radio>
                      </Radio.Group>
                    </Form.Item>
                    <Form.Item
                      name="ing_card_self_setting"
                      style={{ marginLeft: '50px' }}
                    >
                      <DatePicker.RangePicker />
                    </Form.Item>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        marginLeft: '20px',
                        marginRight: '5px',
                      }}
                    >
                      학습완료카드{' '}
                    </span>
                    <Form.Item name="completed" valuePropName="checked">
                      <Switch size="small" />
                    </Form.Item>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        marginLeft: '20px',
                        marginRight: '5px',
                      }}
                    >
                      학습보류카드
                    </span>
                    <Form.Item name="hold" valuePropName="checked">
                      <Switch size="small" />
                    </Form.Item>
                  </div>
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'baseline',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        marginRight: '5px',
                      }}
                    >
                      학습량 설정
                    </span>
                    <Form.Item
                      name="study_quantity_use_switch"
                      valuePropName="checked"
                    >
                      <Switch size="small" />
                    </Form.Item>
                  </div>

                  {true && (
                    // this.state.study_quantity_change === 'on'
                    <div style={{ fontSize: '11px', marginLeft: '20px' }}>
                      <div
                        style={{
                          width: '180px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>미학습카드</span>
                        <Form.Item name="yet_card_num">
                          <InputNumber></InputNumber>
                        </Form.Item>
                      </div>
                      <div
                        style={{
                          width: '180px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>학습중카드</span>
                        <Form.Item name="ing_card_num">
                          <InputNumber></InputNumber>
                        </Form.Item>
                      </div>
                      <div
                        style={{
                          width: '180px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>학습완료카드</span>
                        <Form.Item name="completed_card_num">
                          <InputNumber></InputNumber>
                        </Form.Item>
                      </div>
                      <div
                        style={{
                          width: '180px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span>학습보류카드</span>
                        <Form.Item name="hold_card_num">
                          <InputNumber></InputNumber>
                        </Form.Item>
                      </div>
                    </div>
                  )}

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
                    <Form.Item
                      name="advanced_filter_mode"
                      valuePropName="checked"
                    >
                      <Switch size="small" />
                    </Form.Item>
                  </div>
                </div>
                <Form.Item>
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
                </Form.Item>
              </Form>
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <div>카</div>
                  <div>드</div>
                  <div>모</div>
                  <div>드</div>
                </>
              }
              key="flip"
              style={{ textAlign: 'left', padding: '10px' }}
            ></Tabs.TabPane>
            <Tabs.TabPane
              tab={
                <>
                  <div>시</div>
                  <div>험</div>
                  <div>모</div>
                  <div>드</div>
                </>
              }
              key="exam"
              style={{ textAlign: 'left', padding: '10px' }}
            ></Tabs.TabPane>
          </Tabs>
        </StyledCol>
      </Row>
      <button onClick={() => console.log(checkedKeys)}>
        체크된 아이디 확인
      </button>
      <button onClick={() => setResponsiveUI(!responsiveUI)}>반응형</button>
    </Layout>
  );
};
export default SessionSetting;

const StyledCol = styled(Col)`
  & .ant-form-item {
    margin-bottom: 0;
  }
`;
