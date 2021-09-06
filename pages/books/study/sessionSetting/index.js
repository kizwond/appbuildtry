import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SESSTION_CARDS_DATA_IN_INDEXES_BY_SELECTED_BOOKS_ID,
  SESSION_CREATE_SESSION,
} from '../../../../graphql/query/studySessionSetting';
import Layout from '../../../../components/layout/Layout';
import Footer from '../../../../components/index/Footer';
import IndexTree from '../../../../components/books/study/sessionnSetting/IndexTree';
import { Card, Col, Row, Tabs } from 'antd';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import SessionConfig from '../../../../components/books/study/sessionnSetting/SessionConfig';

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
      router.push(
        `/books/study/mode/flip/${data.session_createSession.sessions[0]._id}`
      );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <StyledCol xs={24} sm={24} md={24} lg={7} xl={6} xxl={5}>
          <SessionConfig
            submitCreateSessionConfigToServer={
              submitCreateSessionConfigToServer
            }
            book_ids={bookList.map((book) => book.book_id)}
          />
        </StyledCol>
        <Col xs={24} sm={24} md={24} lg={17} xl={18} xxl={19}>
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
  & * {
    font-size: 11px;
  }
  & span.ant-radio + * {
    font-size: 11px;
  }
  & .ant-radio-group {
    display: block;
  }
  & .ant-input-number-sm {
    width: 55px;
    font-size: 11px;
  }
`;
