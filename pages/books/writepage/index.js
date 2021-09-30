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
import FavoriteBooksTable from '../../../components/books/writepage/booksTable/FavoriteBooksTable';

const Writeanother = () => {
  const router = useRouter();

  const [isReceivedData, setIsReceivedData] = useState(false);
  const [category, setCategory] = useState([]);
  const [myBook, setMyBook] = useState([]);

  const [activedTable, setActivedTable] = useState();

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
  const changeActivedTable = useCallback((_table) => {
    setActivedTable(_table);
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
          <StyledRow>
            <StyledSpace>
              <CreateBookButton category={category} handleToGetMyBook={handleToGetMyBook} />
              <CategorySettingButton category={category} />
            </StyledSpace>
          </StyledRow>
        )}

        <StyledRow>
          <Col span={24}>
            <FavoriteBooksTable
              category={category}
              myBook={myBook}
              handleToGetMyBook={handleToGetMyBook}
              isPopupSomething={isPopupSomething}
              chagePopup={chagePopup}
              activedTable={activedTable}
              changeActivedTable={changeActivedTable}
            />
          </Col>
          <Col span={24}>
            <BooksTable
              category={category}
              myBook={myBook}
              handleToGetMyBook={handleToGetMyBook}
              isPopupSomething={isPopupSomething}
              chagePopup={chagePopup}
              activedTable={activedTable}
              changeActivedTable={changeActivedTable}
            />
          </Col>
        </StyledRow>
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

const StyledRow = styled(Row)`
  max-width: 1440px;
  margin: 0 auto;
`;
