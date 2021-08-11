/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout/Layout';
import { Row, Col, Menu, Card, PageHeader, Select, Table, Button } from 'antd';
import styled from 'styled-components';
import ColorPicker from '../../../../components/study/ColorPicker';
import FlagIcon from '../../../../components/study/FlagIcon';
import produce from 'immer';
import {
  GET_USER_FLAG_CONFIG,
  UPDATE_USER_FLAG_CONFIG,
} from '../../../../graphql/query/book_flag';
import { useQuery, useMutation } from '@apollo/client';

const MainWrapper = styled.div`
  padding: 10px 0 0;
  position: relative;

  .main-menu > div,
  .main-menu > div > div {
    height: 100%;
  }

  .aside-container {
    min-height: 100%;
    padding-bottom: 48px;
  }

  .main-menu:hover .main-menu-inner {
    overflow-y: auto;
  }
`;
const StyledCol = styled(Col)`
  z-index: 1;
`;
const StyledSection = styled.section`
  height: 100%;
  max-height: 100vh;
  overflow: hidden;
`;

const StyledContentWrapper = styled.div`
  width: 100%;
  height: 90vh;
  /* display: flex; */
  /* justify-content: center;
  align-items: center; */
  background-color: #ececec;
  /* padding-bottom: 40px; */
`;

const BookSetting = () => {
  const router = useRouter();
  const [flag, setFlag] = useState([]);
  const showDataFromServer = (data) => {
    console.log('그래프큐엘에서 데이터 받음, 플래그', data);
  };
  const { loading, error, data } = useQuery(GET_USER_FLAG_CONFIG);
  const [userflagconfig_update] = useMutation(UPDATE_USER_FLAG_CONFIG, {
    onCompleted: showDataFromServer,
  });

  useEffect(() => {
    if (!loading) {
      const flags_array = ['flag1', 'flag2', 'flag3', 'flag4', 'flag5'];
      const server_flags = data.userflagconfig_get.userflagconfigs[0].details;
      const for_flags_data = flags_array.map((flag, index) => ({
        key: index + 1,
        flag_number: flag,
        shape: server_flags[flag].shape,
        color: server_flags[flag].color,
      }));

      setFlag(for_flags_data);
    }
  }, [data, loading]);

  const submitFlag = async () => {
    try {
      await userflagconfig_update({
        variables: {
          forUpdateUserflagconfig: {
            detail: {
              flag1: {
                shape: flag[0].shape,
                color: flag[0].color,
              },
              flag2: {
                shape: flag[1].shape,
                color: flag[1].color,
              },
              flag3: {
                shape: flag[2].shape,
                color: flag[2].color,
              },
              flag4: {
                shape: flag[3].shape,
                color: flag[3].color,
              },
              flag5: {
                shape: flag[4].shape,
                color: flag[4].color,
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeColor = (_color, index) => {
    const newData = produce(flag, (draft) => {
      draft[index].color = _color;
    });
    setFlag(newData);
  };
  const onChangeShape = (_shape, index) => {
    const newData = produce(flag, (draft) => {
      draft[index].shape = _shape;
    });
    setFlag(newData);
  };

  // const { query } = useRouter();
  // console.log(query);

  const shape_Option = [
    'HeartFilled',
    'HomeFilled',
    'FireFilled',
    'FlagFilled',
    'TagsFilled',
  ];

  const columns = [
    {
      title: '플래그 이름',
      dataIndex: 'flag_number',
      key: 'flag_number',
    },
    {
      title: '아이콘',
      dataIndex: 'shape',
      key: 'shape',
      // eslint-disable-next-line react/display-name
      render: (shape, record) => (
        <Select
          defaultValue={shape}
          onChange={(value) => {
            onChangeShape(value, record.key - 1);
          }}
        >
          {shape_Option.map((item) => {
            return (
              <Select.Option value={item} key={item}>
                <FlagIcon icon={item} color={flag[record.key - 1].color} />
              </Select.Option>
            );
          })}
        </Select>
      ),
    },
    {
      title: '색상',
      dataIndex: 'color',
      key: 'color',
      render: (color, record) => (
        <ColorPicker
          color={color}
          onChangeColor={onChangeColor}
          index={record.key - 1}
        />
      ),
    },
  ];

  return (
    <Layout>
      <MainWrapper>
        <Row>
          <StyledCol
            xs={6}
            sm={6}
            md={6}
            lg={6}
            xl={5}
            xxl={4}
            className="main-menu"
          >
            <div>
              <div>
                <StyledSection className="main-menu-inner">
                  <PageHeader title="학습 설정" />
                  <Menu
                    mode="inline"
                    className="aside-container"
                    onClick={(e) => console.log('key는 ', e.key)}
                  >
                    <Menu.Item key="1번메뉴">1</Menu.Item>
                    <Menu.Item key="2번메뉴">2</Menu.Item>
                    <Menu.Divider />
                  </Menu>
                </StyledSection>
              </div>
            </div>
          </StyledCol>
          <Col xs={18} sm={18} md={18} lg={18} xl={19} xxl={20}>
            <StyledContentWrapper>
              <Row>
                <Col xs={1} sm={1} md={2} lg={2} xl={2} xxl={2}></Col>
                <Col xs={22} sm={22} md={18} lg={18} xl={18} xxl={18}>
                  <div style={{ marginTop: '10px', minWidth: '270px' }}>
                    <Card title="플래그 설정" loading={loading}>
                      <Table
                        columns={columns}
                        dataSource={flag}
                        pagination={false}
                        loading={loading}
                      />
                      <Button onClick={submitFlag} loading={loading}>
                        변경
                      </Button>
                    </Card>
                  </div>
                </Col>
                <Col xs={1} sm={1} md={4} lg={4} xl={4} xxl={4}></Col>
              </Row>
            </StyledContentWrapper>
          </Col>
        </Row>
      </MainWrapper>
    </Layout>
  );
};
export default BookSetting;
