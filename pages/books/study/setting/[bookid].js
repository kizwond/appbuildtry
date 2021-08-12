/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../../components/layout/Layout';
import { Row, Col, Menu, Card, PageHeader } from 'antd';
import styled from 'styled-components';
import FlagSetting from '../../../../components/books/study/FlagSetting';
import LevelAndCycleSetting from '../../../../components/books/study/LevelAndCycleSetting';

const BookSetting = () => {
  const { query } = useRouter();

  const [selectedMenu, setSelectedMenu] = useState('study_data_detail');

  const content = (menu_item) => {
    switch (menu_item) {
      case 'study_data_detail':
        return null;
        break;
      case 'set_flags':
        return <FlagSetting />;
        break;
      case 'cards_progress':
        return null;
        break;
      case 'set_level_and_cycle':
        return <LevelAndCycleSetting book_id={query.bookid} />;
        break;
      case 'select_category':
        return null;
        break;
      case 'delete_book':
        return null;
        break;

      default:
        break;
    }
  };
  const title = (menu_item) => {
    switch (menu_item) {
      case 'study_data_detail':
        return '학습 상세 정보 보기';
        break;
      case 'set_flags':
        return '플래그 설정';
        break;
      case 'cards_progress':
        return '카드 학습 상태 관리';
        break;
      case 'set_level_and_cycle':
        return '레벨 및 복습 주기 설정';
        break;
      case 'select_category':
        return '카테고리 이동';
        break;
      case 'delete_book':
        return '책 삭제';
        break;

      default:
        break;
    }
  };

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
                    onClick={(e) => setSelectedMenu(e.key)}
                  >
                    <Menu.Divider />
                    <Menu.Item key="study_data_detail">
                      학습 상세 정보 보기
                    </Menu.Item>
                    <Menu.Item key="set_flags">플래그 설정</Menu.Item>
                    <Menu.Item key="cards_progress">
                      카드 학습 상태 관리
                    </Menu.Item>
                    <Menu.Item key="set_level_and_cycle">
                      레벨 및 복습 주기 설정
                    </Menu.Item>
                    <Menu.Item key="select_category">카테고리 이동</Menu.Item>
                    <Menu.Item key="delete_book">책 삭제</Menu.Item>
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
                    <Card title={title(selectedMenu)}>
                      {content(selectedMenu)}
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
  background-color: #ececec;
`;
