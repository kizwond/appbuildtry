/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/layout/Layout';
import { Row, Col, Menu, Card, PageHeader, Select, Table } from 'antd';
import styled from 'styled-components';
import ColorPicker from '../../../components/study/ColorPicker';
import FlagIcon from '../../../components/study/FlagIcon';
import produce from 'immer';
import { GET_USER_FLAG_CONFIG } from '../../../graphql/query/book_flag';
import { useQuery } from '@apollo/client';

const MainWrapper = styled.div`
  padding: 40px 0 0;
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
  height: 100%;
  display: flex;
  /* justify-content: center; */
  /* align-items: center; */
  background-color: #ececec;
`;

const BookSetting = () => {
  const [flag, setFlag] = useState([
    { key: 1, flag_number: 'flag1', shape: 'HeartFilled', color: '#FCCB00' },
    { key: 2, flag_number: 'flag2', shape: 'HomeFilled', color: '#C4DEF6' },
    { key: 3, flag_number: 'flag3', shape: 'FireFilled', color: '#D4C4FB' },
    { key: 4, flag_number: 'flag4', shape: 'FlagFilled', color: '#B80000' },
    { key: 5, flag_number: 'flag5', shape: 'TagsFilled', color: '#BED3F3' },
  ]);
  const { loading, error, data } = useQuery(GET_USER_FLAG_CONFIG);

  useEffect(() => {
    // setData(data)
    console.log(data.userflagconfig_get.msg);
  });

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

  const { query } = useRouter();
  console.log(query);

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
                  <Menu mode="inline" className="aside-container">
                    <Menu.Item>1</Menu.Item>
                    <Menu.Item>2</Menu.Item>
                    <Menu.Divider />
                  </Menu>
                </StyledSection>
              </div>
            </div>
          </StyledCol>
          <Col xs={18} sm={18} md={18} lg={18} xl={19} xxl={20}>
            <StyledContentWrapper>
              <div style={{ marginTop: '50px' }}>
                <Card title="플래그 설정" />
                <Table columns={columns} dataSource={flag} />
              </div>
            </StyledContentWrapper>
          </Col>
        </Row>
      </MainWrapper>
    </Layout>
  );
};
export default BookSetting;
