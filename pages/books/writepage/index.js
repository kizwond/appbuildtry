import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORY_AND_BOOKS_INFO } from '../../../graphql/query/writePage';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import { Row, Space, Col, Divider } from '../../../node_modules/antd/lib/index';
import Layout from '../../../components/layout/Layout';
import CreateBookButton from '../../../components/books/writepage/createBook/CreateBookButton';
import CategorySettingButton from '../../../components/books/writepage/categorySetting/CategorySettingButton';
import BooksTable from '../../../components/books/writepage/booksTable/BooksTable';
import BooksTablePagination from '../../../components/books/writepage/booksTable/BooksTablePagination';

const Writeanother = () => {
  const router = useRouter();

  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);

  const [isPopupSomething, setisPopupSomething] = useState(false);

  const { loading, error, data } = useQuery(GET_CATEGORY_AND_BOOKS_INFO, {
    onCompleted: (received_data) => {
      console.log('received_data', received_data);
      if (received_data.mybookcate_get.status === '200') {
        setMyBook(received_data.mybook_getAllMybook.mybooks);
        setCategory(received_data.mybookcate_get.mybookcates);
        setIsReceivedData(true);
      } else if (received_data.mybookcate_get.status === '401') {
        router.push('/account/login');
      } else {
        console.log('어떤 문제가 발생함');
      }
    },
  });

  const handleToGetMyBook = useCallback((books) => {
    setMyBook(books);
  }, []);

  const chagePopup = useCallback((_boolean) => {
    setisPopupSomething(_boolean);
  }, []);

  if (!isReceivedData) {
    return null;
  }
  if (loading) {
    return <div>loading..</div>;
  }
  if (error) {
    return <div>Error..</div>;
  }
  return (
    <>
      <Head>
        <title>Write - CogBook</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Layout>
        {category.length >= 1 && (
          <StyledSpace>
            <CreateBookButton category={category} handleToGetMyBook={handleToGetMyBook} />
            <CategorySettingButton category={category} />
          </StyledSpace>
        )}

        <Row>
          <StyledCol>
            <BooksTable category={category} myBook={myBook} handleToGetMyBook={handleToGetMyBook} isPopupSomething={isPopupSomething} chagePopup={chagePopup} />
          </StyledCol>
        </Row>
      </Layout>
    </>
  );
};

export default Writeanother;

const StyledSpace = styled(Space)`
  & * {
    font-size: 0.8rem;
  }
`;

const StyledCol = styled(Col)`
  & .ant-drawer-content {
    overflow: hidden;
    background-color: #6c757d;
    background-clip: padding-box;
    border: 0;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }
  & .customCircleButton:hover {
    background-color: #495057;
  }
  & .PushCustomCircleButton:hover {
    background-color: #fff;
  }
  & .PullCustomCircleButton:hover {
    background-color: #fff;
  }
  & * {
    font-size: 0.8rem;
  }

  & .ant-table-row-indent + .ant-table-row-expand-icon {
    margin-right: 2px;
  }

  & .anticon-double-right > svg {
    font-size: 18px;
    color: #dee2e6;
  }
  & .anticon-double-left > svg {
    font-size: 18px;
    color: #495057;
  }
  & .anticon-arrow-down > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-arrow-down > svg {
    color: #fff;
  }

  & .anticon-arrow-up > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-arrow-up > svg {
    color: #fff;
  }

  & .anticon-star > svg {
    font-size: 16px;
  }
  & .customCircleButton:hover > .anticon-star.writeUnliked > svg {
    color: #fff;
  }
  & .customCircleButton:hover > .anticon-star.writeLiked > svg {
    color: #fcc725;
  }

  & .anticon-eye > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-eye > svg {
    color: #fff;
  }

  & .anticon-eye-invisible > svg {
    font-size: 16px;
    color: #dee2e6;
  }
  & .customCircleButton:hover > .anticon-eye-invisible > svg {
    color: #fff;
  }

  & .anticon-setting > svg {
    font-size: 16px;
    color: #a3a3a3;
  }

  & .ant-table.ant-table-small .ant-table-tbody > tr > td {
    padding: 0;
  }

  & .ant-table table {
    border-collapse: collapse;
    background-color: white;
    overflow: hidden;
  }

  & .categoryCol {
    border-bottom: none;
  }

  & .Row-Last-One {
    position: relative;
    z-index: 3;
    background-color: white;
  }

  & .foldedCategory > .Row-First-Left > div {
    background: #e0e2f4;
    border-radius: 8px;
    margin: 3px 0px;

    padding-left: 15px;
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 0.7rem;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .MiddleHiddenBar > .Row-First-Left > div,
  & .LastHiddenBar > .Row-First-Left > div {
    background: #e0e2f4;
    border-radius: 8px;
    margin: 3px 0px;

    padding-left: 15px;
    height: 30px;
    font-size: 0.7rem;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .HandleOnOffShow > span {
    font-size: 0.7rem;
  }

  & .NoBooksCategory > .Row-First-Left > div {
    background: rgb(228, 224, 224);
    border-radius: 8px;
    margin: 3px 0px;

    padding-left: 15px;
    height: 30px;
    display: flex;
    align-items: center;
    font-size: 0.7rem;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .foldedCategory > .categoryCol,
  & .NoBooksCategory > .categoryCol,
  & .LastHiddenBar > .categoryCol,
  & .lastEvenBook > .categoryCol,
  & .lastOddBook > .categoryCol {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .LastHiddenBar > .Row-First-Left,
  & .NoBooksCategory > .Row-First-Left,
  & .foldedCategory > .Row-First-Left {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .lastEvenBook > .Row-First-Left,
  & .lastEvenBook > .normal,
  & .lastEvenBook > .Row-Last-One {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .lastEvenBook > .normal > div,
  & .lastEvenBook > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastEvenBook > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .lastEvenBook > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .lastEvenBook > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .lastOddBook > .Row-First-Left,
  & .lastOddBook > .normal,
  & .lastOddBook > .Row-Last-One {
    border-bottom: 0.5px solid #b3b2b2;
  }

  & .lastOddBook > .normal > div,
  & .lastOddBook > .Row-Last-One > div {
    background-color: #fff;
    height: 34px;
    margin-bottom: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .lastOddBook > .Row-First-Left > div {
    background-color: #fff;
    height: 34px;

    margin-bottom: 3px;
    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }

  & .lastOddBook > .normal > div.BookOrder {
    color: #fff;
  }

  & .lastOddBook > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .EvenNumberRow > .normal > div,
  & .EvenNumberRow > .Row-Last-One > div {
    background-color: #f5f5f5;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .EvenNumberRow > .Row-First-Left > div {
    background-color: #f5f5f5;
    height: 34px;

    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .EvenNumberRow > .normal > div.BookOrder {
    color: #f5f5f5;
  }

  & .EvenNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  & .OddNumberRow > .normal > div,
  & .OddNumberRow > .Row-Last-One > div {
    background-color: #fff;
    height: 34px;

    display: flex;
    align-items: center;
    justify-content: center;
  }
  & .OddNumberRow > .Row-First-Left > div {
    background-color: #fff;
    height: 34px;

    display: flex;
    align-items: center;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    padding-left: 15px;
    @media screen and (min-width: 577px) and (max-width: 768px) {
      padding-left: 8px;
    }
    @media screen and (min-width: 100px) and (max-width: 576px) {
      padding-left: 4px;
    }
  }
  & .OddNumberRow > .normal > div.BookOrder {
    color: #fff;
  }

  & .OddNumberRow > .Row-Last-One > div {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  /* & .ant-table-thead .categoryCol::before {
    display: none;
  } */
  & .ant-table-thead .categoryCol {
    border-bottom: 1px solid #f0f0f0;
  }

  & .ant-table-tbody > tr > td {
    border-bottom: none;
  }

  & .singleBar {
    width: 18px;
    margin-left: 3px;
    margin-right: 3px;
  }
  & .graphBar {
    position: relative;
    height: 20px;
    background: rgba(237, 238, 233, 0);
  }

  & .AchivedCard {
    position: absolute;
    bottom: 0;
    width: 18px;
    background: #c5c6c7;
    display: flex;
    justify-content: center;
  }

  & .CardCounter {
    position: absolute;
    font-size: 0.6rem;
    bottom: 3px;
    display: block;
  }
`;